import { init, db } from "./services/database.mjs";
import client from "./services/websocket.mjs";
import express from "express";
import cors from "cors";
// import winston from "winston";
// import { Loggly } from "winston-loggly-bulk";
import initWebsocketServer from "./services/WebsocketServer.mjs";
import DecayHandler from "./handlers/decayHandler.mjs";

console.log("Contextual Presence Starting up");

init();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/:collection/:id?", async (req, res) => {
  console.log("GET ", req.params.collection);
  if (req.params.id) {
    const thing = await db[req.params.collection].findOne({
      _id: req.params.id,
    });
    res.send(thing);
  } else {
    const things = await db[req.params.collection].find({});
    res.send(things);
  }
});

app.post("/:collection", async (req, res) => {
  const thing = await db[req.params.collection].insert(req.body);
  res.status(201).send(thing);
});

app.put("/:collection/:id", async (req, res) => {
  await db[req.params.collection].update({ _id: req.params.id }, req.body, {});
  const thing = await db[req.params.collection].find({ _id: req.params._id });
  res.send(thing);
});

app.delete("/:collection/:_id", async (req, res) => {
  await db[req.params.collection].remove({ _id: req.params._id });
  res.status(204).send();
});

// client();

const server = app.listen("3001", () => {});
export const io = initWebsocketServer(server);

DecayHandler();

// winston.add(
//   new Loggly({
//     token: process.env.LOGGLY_TOKEN,
//     subdomain: "aperturelabs",
//     tags: ["Winston-NodeJS"],
//     json: true,
//   })
// );
