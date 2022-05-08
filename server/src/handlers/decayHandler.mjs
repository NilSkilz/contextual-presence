import { db } from "../services/database.mjs";
import { DEFAULT_POLLING_RATE_MS } from "../constants.mjs";
import moment from "moment";

const DecayHandler = () => {
  console.log("Decay Handler Initiated");
  setTimeout(() => {
    const rooms = getOccupancies() || [];

    rooms.forEach((room) => {
      recalculateConfidence(room);
    });
  }, DEFAULT_POLLING_RATE_MS);
};

export default DecayHandler;

const getOccupancies = () => {
  db.rooms.find({}, (err, rooms) => {
    return rooms.filter((r) => r.occupancy && r.occupancy.length);
  });
};

const recalculateConfidence = (room) => {
  let recalculate = false;

  const indexesToRemove = [];

  room.occupancy.forEach((o, index) => {
    const decay = calculateDecay(room, index);

    o.confidence = o.confidence > 0 ? o.confidence - decay : 0;
    if (o.confidence > LOWER_CONFIDENCE_LIMIT) recalculate = true;
    if (o.confidence === LOWER_CONFIDENCE_LIMIT) indexesToRemove.push(index);
    console.log(o.confidence);
  });

  indexesToRemove.forEach((i) => {
    // TODO: check this actually works (mutated?)
    room.occupancy.splice(i, 1);
  });

  console.log("Updating db");

  db.rooms.update({ _id: roomId }, room);
  // TODO: emit to FE
  console.log("Emitting recalc to ", roomId);
  io.emit(roomId, room);
  if (recalculate) recalculateConfidence(roomId);
};

// -------------------
// Calculate Decay
// -------------------

const calculateDecay = (room, occupancyIndex) => {
  let decay = 0;

  // Can person leave the room without detection?
  const edges = getEdgesForRoom(room);
  if (!edges || !edges.length) {
    // There are no exits... person cannot leave!
    return decay;
  }

  const hasUnsensoredExits = edges.find((edge) => !edge.data?.entity);

  const adjoiningRooms = edges.map((edge) => {
    if (edge.source === room._id) return edge.target;
    if (edge.target === room._id) return edge.source;
    return null;
  });

  const unsensoredAdjoiningRooms = adjoiningRooms.find(
    (room) => !room.sensors.length
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

const getEdgesForRoom = (room) => {
  db.edges.find(
    { $or: [{ source: room._id }, { target: room._id }] },
    (err, edges) => {
      return edges;
    }
  );
};
