import Datastore from "nedb";
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

const db = {};

const init = () => {
  db.rooms = new Datastore({
    filename: "data/store/rooms.db",
    autoload: true,
  });
  db.floors = new Datastore({
    filename: "data/store/floors.db",
    autoload: true,
  });
  db.devices = new Datastore({
    filename: "data/store/devices.db",
    autoload: true,
  });
  db.users = new Datastore({
    filename: "data/store/users.db",
    autoload: true,
  });
  db.edges = new Datastore({
    filename: "data/store/edges.db",
    autoload: true,
  });

  db.rooms.persistence.setAutocompactionInterval(5000);
  db.floors.persistence.setAutocompactionInterval(5000);
  db.devices.persistence.setAutocompactionInterval(5000);
  db.users.persistence.setAutocompactionInterval(5000);
  db.edges.persistence.setAutocompactionInterval(5000);

  console.log("Data Stores Loaded");
};

export { init, db };
