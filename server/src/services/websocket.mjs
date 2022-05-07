import pkg from "websocket";
const { client: WebSocketClient } = pkg;
import { processEvent } from "../handlers/entityHandler.mjs";
import winston from "winston";
import { Loggly } from "winston-loggly-bulk";

winston.add(
  new Loggly({
    token: process.env.LOGGLY_TOKEN,
    subdomain: "aperturelabs",
    tags: ["Winston-NodeJS"],
    json: true,
  })
);

var client = new WebSocketClient();
var entities;

var id = 0;

export const getID = () => {
  id++;
  return id;
};

client.on("connectFailed", function (error) {
  winston.log("info", "Connect Error: " + error.toString());
});

client.on("connect", function (connection) {
  winston.log("info", "WebSocket Client Connected");
  connection.on("error", function (error) {
    winston.log("info", "Connection Error: " + error.toString());
  });
  connection.on("close", function () {
    winston.log("info", "echo-protocol Connection Closed");
  });
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      // winston.log("info", "Received: '" + message.utf8Data + "'");
      const data = JSON.parse(message.utf8Data);

      switch (data.type) {
        case "auth_required": {
          return sendAuth(connection);
        }
        case "auth_ok": {
          getStates(connection);
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
            entities = data.result;
          } else {
            console.log({ data });
          }
          break;
        }
        default: {
          return console.log({ data });
        }
      }
    }
  });
});

console.log("Connecting to Home Assistant Websocket API");
try {
  client.connect("wss://ha.pidgeonsnest.uk/api/websocket");
} catch (err) {
  console.log(err);
}

export default client;

const getStates = (connection) => {
  console.log("Getting States");
  connection.sendUTF(
    JSON.stringify({
      id: getID(),
      type: "get_states",
    })
  );
};

const sendAuth = (connection) => {
  console.log("Sending Auth");
  return connection.sendUTF(
    JSON.stringify({
      type: "auth",
      access_token:
        process.env.HA_ACCESS_TOKEN,
    })
  );
};

const subscribeToBus = (connection) => {
  console.log("Subscribing to bus");
  return connection.sendUTF(
    JSON.stringify({
      id: getID(),
      type: "subscribe_events",
      // Optional
      event_type: "state_changed",
    })
  );
};
