import { db } from "../services/database.mjs";
import moment from "moment";
import winston from "winston";
import {
  DEFAULT_CONFIDENCE,
  DEFAULT_DECAY,
  LOWER_CONFIDENCE_LIMIT,
} from "../constants.mjs";
import { io } from "../index.js";

const TIMEOUT = 1000;

const getOccupancyObject = (name) => {
  return {
    name,
    confidence: DEFAULT_CONFIDENCE,
    decay: DEFAULT_DECAY,
    timestamp: moment().unix(),
  };
};

export const processEvent = (connection, event, entities) => {
  //   console.log({ event });
  const entity_id = event.data.entity_id;

  // Check Edges for the device
  db.edges.findOne({ "data.entity.entity_id": entity_id }, (err, edge) => {
    if (edge) {
      winston.log("info", `Found sensor in edge: ${edge.data.name}`);

      if (edge.data.directional) {
        // Check if state is one of directional states
        processDirectionalEvent({ event, edge });
      }
    }
  });

  const entity_modified_id = entity_id.replace(".", "___");

  // console.log(entity_modified_id);

  db.rooms.find(
    { [`sensors.${entity_modified_id}`]: { $exists: true } },
    (err, rooms) => {
      if (rooms.length) {
        console.log(`Found ${rooms.length} rooms with this entity`);
        rooms.forEach((room) => {
          console.log(`Testing ${room.data?.name}`);
          const sensor = room.sensors[entity_modified_id];

          let pass = false;

          switch (sensor.operator) {
            case "equals": {
              if (event.data.new_state[sensor.key] === sensor.value)
                pass = true;
            }
          }

          console.log(`Sensor ${pass ? "passes" : "fails"} the occupancy test`);

          if (!pass) return;

          // const haRoomHelper = entities.find(
          //   (e) => e.entity_id === room.entity.entity_id
          // );
          // const currentValue = parseInt(haRoomHelper.state);

          // console.log({ haRoomHelper });

          if (room.occupancy.length) {
            console.log("Already Occupied,", room.occupancy.length);
            room.occupancy[0].confidence = DEFAULT_CONFIDENCE;

            console.log("Emitting initial");
            io.emit(room._id, room);
            // connection.sendUTF(
            //   JSON.stringify({
            //     id: getID(),
            //     type: "call_service",
            //     domain: "input_number",
            //     service: "set_value",
            //     service_data: { value: 0, entity_id: haRoomHelper.entity_id },
            //   })
            // );
            return;
            // If already occupied, increase confidence
            // connection.sendUTF(
            //   JSON.stringify({
            //     // id: 24,
            //     type: "call_service",
            //     domain: "input_number",
            //     service: "set_value",
            //     value: currentValue++,
            //     target: {
            //       "entity_id": entity.entity_id
            //     }
            //   })
            // );
          } else {
            console.log("Sending state of 1");
            // console.log(haRoomHelper.entity_id);
            // New occupant
            // connection.sendUTF(
            //   JSON.stringify({
            //     id: getID(),
            //     type: "call_service",
            //     domain: "input_number",
            //     service: "set_value",
            //     service_data: { value: 1, entity_id: haRoomHelper.entity_id },
            //   })
            // );

            // Save local room data, and if set timer to recalculate confidence

            room.occupancy.push(getOccupancyObject());

            db.rooms.update({ _id: room._id }, room);

            console.log("Emitting initial");
            io.emit(room._id, room);
          }
        });
      }
    }
  );
};

const processDirectionalEvent = ({ event, edge }) => {
  const state = event.data?.new_state?.state;

  if (!state) return;
  console.log({ state });
  if (state !== edge.data.enter && state !== edge.data.exit) return;

  const isEnter = state === edge.data.enter;

  console.log({ isEnter });
  // Get both rooms from edge
  Promise.all([
    new Promise((resolve, reject) => {
      db.rooms.findOne({ id: edge.source }, (err, room) => {
        if (err) reject(err);
        return resolve(room);
      });
    }),

    new Promise((resolve, reject) => {
      db.rooms.findOne({ id: edge.target }, (err, room) => {
        if (err) reject(err);
        return resolve(room);
      });
    }),
  ])
    .then((rooms) => {
      console.log("Rooms Length: ", rooms.length);
      const source = rooms[0];
      const target = rooms[1];

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

      db.rooms.update({ id: source._id }, source);
      db.rooms.update({ id: target._id }, target);
      // source.save();
      // target.save();
      console.log("SAVED");
    })
    .catch((err) => {
      console.log({ err });
    });
};
