import Datastore from "nedb-promises";
// import winston from "winston";
// import { Loggly } from "winston-loggly-bulk";

// winston.add(
//   new Loggly({
//     token: process.env.LOGGLY_TOKEN,
//     subdomain: "aperturelabs",
//     tags: ["Winston-NodeJS"],
//     json: true,
//   })
// );

const db = {};

const init = () => {
  db.rooms = Datastore.create({
    filename: "data/store/rooms.db",
    autoload: true,
  });
  db.floors = Datastore.create({
    filename: "data/store/floors.db",
    autoload: true,
  });
  db.devices = Datastore.create({
    filename: "data/store/devices.db",
    autoload: true,
  });
  db.users = Datastore.create({
    filename: "data/store/users.db",
    autoload: true,
  });
  db.edges = Datastore.create({
    filename: "data/store/edges.db",
    autoload: true,
  });

  db.rooms.setAutocompactionInterval(5000);
  db.floors.setAutocompactionInterval(5000);
  db.devices.setAutocompactionInterval(5000);
  db.users.setAutocompactionInterval(5000);
  db.edges.setAutocompactionInterval(5000);

  console.log("Data Stores Loaded");
};

export { init, db };
