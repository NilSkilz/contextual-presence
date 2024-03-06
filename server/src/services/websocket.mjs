import pkg from "websocket";
const { client: WebSocketClient } = pkg;
import { processEvent, checkForNonDecayingEntities } from "../handlers/entityHandler.mjs";
import dotenv from "dotenv";
import moment from "moment";
import winston from "winston";
// import { Loggly } from "winston-loggly-bulk";

// winston.add(
//   new Loggly({
//     token: process.env.LOGGLY_TOKEN,
//     subdomain: "aperturelabs",
//     tags: ["Winston-NodeJS"],
//     json: true,
//   })
// );
dotenv.config();


var client = new WebSocketClient();

var entities;

var id = 0;

export const getID = () => {
  id++;
  console.log({ id })
  return id;
};

let thisConnection;

client.on("connectFailed", function (error) {
  console.log("info", "Connect Error: " + error.toString());
});

client.on("connect", function (connection) {
  thisConnection = connection
  console.log("WebSocket Client Connected");
  connection.on("error", function (error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on("close", function () {
    console.log("echo-protocol Connection Closed");
  });
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      // console.log(message.utf8Data);
      const data = JSON.parse(message.utf8Data);

      switch (data.type) {
        case "auth_required": {
          return sendAuth(connection);
        }
        case "auth_ok": {
          setTimeout(() => {
            getStates(connection);
          }, 1000);

          return subscribeToBus(connection);
          // return constructMap();
        }
        case "event": {
          // Keep entities up-to-date
          if (data.event.data.entity_id.includes("input_number.")) {
            getStates(connection);
          }

          return processEvent(connection, data.event, entities);
        }
        case "result": {
          if (data.result?.length) {
            console.log("Got States");
            entities = data.result;

            checkForNonDecayingEntities(entities)
          } else {
            console.log({ data });
          }
          break;
        }
        default: {
          return console.log({ data });
        }
      }
    } else {
      return console.log({ message });
    }
  });
});

console.log("Connecting to Home Assistant Websocket API");
try {
  client.connect("wss://ha.cracky.co.uk/api/websocket");
} catch (err) {
  console.log(err);
}

export default client;

const getStates = (connection) => {
  const id = getID(); // moment().valueOf();
  connection.sendUTF(
    JSON.stringify({
      id,
      type: "get_states",
    })
  );
};

const sendAuth = (connection) => {
  console.log("Sending Auth");
  console.log(process.env.HA_ACCESS_TOKEN);
  return connection.sendUTF(
    JSON.stringify({
      type: "auth",
      access_token: process.env.HA_ACCESS_TOKEN,
    })
  );
};

const subscribeToBus = (connection) => {
  const id = getID() // moment().valueOf();
  console.log(`Subscribing to bus (ID: ${id})`);
  return connection.sendUTF(
    JSON.stringify({
      id,
      type: "subscribe_events",
      // Optional
      event_type: "state_changed",
    })
  );
};


export const updateHaEntityState = (entity_id, state) => {
  const params = {
    id: getID(),
    type: "call_service",
    domain: "input_number",
    service: "set_value",
    service_data: { value: state, entity_id: entity_id },
  }

  console.log({ params })
  thisConnection.sendUTF(
    JSON.stringify(params)
  );
}