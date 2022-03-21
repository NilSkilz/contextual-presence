import Datastore from "nedb";

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

  console.log("Data Stores Loaded");
};

export { init, db };
