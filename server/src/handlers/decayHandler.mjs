import { db } from "../services/database.mjs";
import {
  DEFAULT_POLLING_RATE_MS,
  LOWER_CONFIDENCE_LIMIT,
} from "../constants.mjs";
import moment from "moment";
import { io } from "../index.js";
import { updateHaEntityState } from '../services/websocket.mjs'

const DecayHandler = () => {
  console.log("Decay Handler Initiated");
  setInterval(async () => {
    const rooms = await getOccupancies();

    rooms.forEach(async (room) => {
      await recalculateConfidence(room);
    });
  }, DEFAULT_POLLING_RATE_MS);
};

export default DecayHandler;

const getOccupancies = async (cb) => {
  const rooms = await db.rooms.find({});
  return rooms.filter((r) => r.occupancy && r.occupancy.length);
};

const recalculateConfidence = async (room) => {
  let recalculate = false;

  const indexesToRemove = [];

  console.log(`Calculating confidence for room: ${room._id}`)

  if (!room.occupancy) return;

  room.occupancy.forEach(async (o, index) => {
    const decay = await calculateDecay(room, index);
    console.log({ decay });
    o.confidence = o.confidence > 0 ? o.confidence - decay : 0;
    console.log({ confidence: o.confidence });
    if (o.confidence > LOWER_CONFIDENCE_LIMIT) recalculate = true;
    if (o.confidence === LOWER_CONFIDENCE_LIMIT) indexesToRemove.push(index);
    indexesToRemove.forEach((i) => {
      // TODO: check this actually works (mutated?)
      room.occupancy.splice(i, 1);
    });

    let updateNeeded = false;

    if (room.state !== room.occupancy.length) {
      room.state = room.occupancy.length
      updateNeeded = true;
    }

    const roomId = room._id;

    console.log("saving room ", room);

    await db.rooms.update({ _id: roomId }, room);

    io.emit(roomId, room);
    // if (updateNeeded) updateHaEntityState(room.entity.entity_id, room.state)
  });
};

// -------------------
// Calculate Decay
// -------------------

const calculateDecay = async (room, occupancyIndex) => {
  let decay = 0;

  // Can person leave the room without detection?
  const edges = await getEdgesForRoom(room);
  if (!edges || !edges.length) {
    // There are no exits... person cannot leave!
    return decay;
  }

  const hasUnsensoredExits = await edges.find((edge) => !edge.data?.entity);

  const adjoiningRooms = edges.map((edge) => {
    if (edge.source === room._id) return edge.target;
    if (edge.target === room._id) return edge.source;
    return null;
  });

  const unsensoredAdjoiningRooms = adjoiningRooms.find(
    (room) => !room.sensors?.length
  );

  if (hasUnsensoredExits) {
    // Can exit without detection.

    if (unsensoredAdjoiningRooms) {
      // Adjoining rooms will not detect presence
      // Decay is high
      return (decay += 1);
    } else {
      // has there been movement in adjoining rooms since this sensor last fired?
      const timeSeenInRoom = getLatestSensorFiredTimestamp(room);

      adjoiningRooms.forEach((adjoiningRoom) => {
        if (!adjoiningRoom.occupancy || !adjoiningRoom.occupancy.length) return;
        const timeSeenInAdjoiningRoom =
          getLatestSensorFiredTimestamp(adjoiningRoom);

        if (moment(timeSeenInRoom.isBefore(moment(timeSeenInAdjoiningRoom)))) {
          // Movement in adjoining room after this one
          if (isOldestOccupancy(room, occupancy)) decay += 0.5;
        }
      });
    }
  } else {
    // Cannot exit without detection
    if (unsensoredAdjoiningRooms) {
      // Adjoining rooms will not detect presence
      // Decay reflects false negative in edge sensor
      decay += 0.5;
    } else {
      // has there been movement in adjoining rooms since this sensor last fired?
      const timeSeenInRoom = getSensorFiredTimestampForIndex(
        room,
        occupancyIndex
      );

      adjoiningRooms.forEach((adjoiningRoom) => {
        if (!adjoiningRoom.occupancy || !adjoiningRoom.occupancy.length) return;
        const timeSeenInAdjoiningRoom =
          getLatestSensorFiredTimestamp(adjoiningRoom);

        if (timeSeenInRoom.isBefore(timeSeenInAdjoiningRoom)) {
          // Movement in adjoining room after this one
          if (isOldestOccupancy(room, occupancy)) decay += 0.5;
        } else {
          // Add some decay for the possibility of a false negative
          // This would be a total failure of edge and adjoining room sensor
          decay += 0.005;
        }
      });
    }
  }
  return decay;
};

// -------------------
// Helpers
// -------------------

const isOldestOccupancy = (room, occupancy) => {
  const occupancyTime = moment(occupancy.timestamp);

  let isLast = true;

  room.occupancy.forEach((o) => {
    if (moment(o.timestamp).isBefore(occupancyTime)) isLast = false;
  });

  return isLast;
};

const getSensorFiredTimestampForIndex = (room, index) => {
  return moment(room.occupancy[index].timestamp);
};

const getLatestSensorFiredTimestamp = (room) => {
  return moment(
    room.occupancy.reduce(
      acc,
      (cur) => {
        if (cur.timestamp > acc) return cur.timestamp;
        return acc;
      },
      0
    )
  );
};

const getEdgesForRoom = async (room, cb) => {
  const edges = await db.edges.find({
    $or: [{ source: room._id }, { target: room._id }],
  });
  return edges;
};
