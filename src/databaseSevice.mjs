import Datastore from "nedb";

const db = {};

const init = () => {
  db.rooms = new Datastore({
    filename: "data/store/rooms.db",
    autoload: true,
  });
  db.devices = new Datastore({
    filename: "data/store/devices.db",
    autoload: true,
  });

  console.log("Data Stores Loaded");
};

export { init, db };
