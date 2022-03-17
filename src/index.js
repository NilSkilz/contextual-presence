import { init, db } from "./databaseSevice.mjs";

init();

db.rooms.insert({ name: "Living Room" }, (err, doc) => {
  console.log(err);
  console.log(doc);

  db.rooms.find({}, (err, rooms) => {
    console.log(err);
    console.log(rooms);
  });
});
