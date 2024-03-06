import { db } from "../services/database.mjs";
import moment from "moment";
import winston from "winston";
import {
  DEFAULT_CONFIDENCE,
  DEFAULT_DECAY,
  LOWER_CONFIDENCE_LIMIT,
} from "../constants.mjs";
import { io } from "../index.js";
import { updateHaEntityState } from "../services/websocket.mjs";

const TIMEOUT = 1000;

const getOccupancyObject = (name) => {
  return {
    name,
    confidence: DEFAULT_CONFIDENCE,
    decay: DEFAULT_DECAY,
    timestamp: moment().unix(),
  };
};

export const processEvent = async (connection, event, entities) => {
  //   console.log({ event });
  const entity_id = event.data.entity_id;

  if (entity_id === 'binary_sensor.living_room_tv') {
    console.log(event)
  }

  // Check Edges for the device
  const edge = await db.edges.findOne({ "data.entity.entity_id": entity_id });
  if (edge) {
    winston.log("info", `Found sensor in edge: ${edge.data.name}`);

    if (edge.data.directional) {
      // Check if state is one of directional states
      processDirectionalEvent({ event, edge });
    }
  }

  const entity_modified_id = entity_id.replace(".", "___");

  const rooms = await db.rooms.find({
    [`sensors.${entity_modified_id}`]: { $exists: true },
  });

  if (rooms.length) {
    console.log(`Found ${rooms.length} rooms with this entity`);
    rooms.forEach(async (room) => {
      console.log(`Testing ${room.data?.name}`);
      const sensor = room.sensors[entity_modified_id];

      let pass = false;

      // If the old state = the new state, return
      if (event.data.new_state[sensor.key] === event.data.old_state[sensor.key]) return;

      switch (sensor.operator) {
        case "equals": {
          if (event.data.new_state[sensor.key] === sensor.value) pass = true;
        }
      }

      console.log(`Sensor ${pass ? "passes" : "fails"} the occupancy test`);

      if (!pass) return;

      // const haRoomHelper = entities.find(
      //   (e) => e.entity_id === room.entity.entity_id
      // );
      // const currentValue = parseInt(haRoomHelper.state);

      // console.log({ haRoomHelper });

      if (!room.occupancy) room.occupancy = [];

      if (room.occupancy?.length) {
        console.log("Already Occupied,", room.occupancy.length);
        room.occupancy[0].confidence = DEFAULT_CONFIDENCE;

        console.log("Emitting initial");
        await db.rooms.update({ _id: room._id }, room);
        io.emit(room._id, room);

        // Not bothering to update HA for now
        // updateHaEntityState(room._id, room.state)
        return;
      } else {
        console.log("Sending state of 1");

        // Save local room data, and if set timer to recalculate confidence

        room.occupancy.push(getOccupancyObject());

        await db.rooms.update({ _id: room._id }, room);

        console.log("Emitting initial");
        io.emit(room._id, room);

        // Not bothering to update HA for now
        // updateHaEntityState(room._id, 1)
      }
    });
  }
};

const processDirectionalEvent = async ({ event, edge }) => {
  const state = event.data?.new_state?.state;

  if (!state) return;
  console.log({ state });
  if (state !== edge.data.enter && state !== edge.data.exit) return;

  const isEnter = state === edge.data.enter;

  console.log({ isEnter });
  // Get both rooms from edge
  const source = await db.rooms.findOne({ id: edge.source });
  const target = await db.rooms.findOne({ id: edge.target });

  console.log("Set source and target");

  if (!source.occupancy) source.occupancy = [];
  if (!target.occupancy) target.occupancy = [];

  console.log("Occupancy array created");

  if (isEnter) {
    source.occupancy.push(getOccupancyObject());
    target.occupancy.shift();
  } else {
    source.occupancy.shift();
    target.occupancy.push(getOccupancyObject());
  }
  console.log({ source, target });

  await db.rooms.update({ id: source._id }, source);
  await db.rooms.update({ id: target._id }, target);
  console.log("SAVED");
};

export const checkForNonDecayingEntities = async (entites) => {
  // Get all rooms
  const rooms = await db.rooms.find({});

  // Loop through each room and sensor to see if any have 0 decay
  rooms.forEach(room => {
    console.log({ room })
    Object.keys(room.sensors).forEach(sensorName => {
      console.log(sensorName)
    })
  })
}