import { init, db } from "./services/database.mjs";
import express from 'express';
import cors from 'cors';

init();


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get('/:collection', (req, res) => {
  db[req.params.collection].find({}, (err, things) => {
    res.send(things)
  });
});

app.post('/:collection', (req, res) => {
  db[req.params.collection].insert(req.body, (err, thing) => {
    res.status(201).send(thing)
  })
})

app.put('/:collection/:_id', (req, res) => {
  console.log(req.params);
  db[req.params.collection].update({ _id: req.params._id }, req.body, (err, result) => {
    res.send(req.body);
  })
})

app.delete('/:collection/:_id', (req, res) => {
  db[req.params.collection].remove({ _id: req.params._id }, (err) => {
    res.status(204).send()
  })
})


app.listen('3001', () => { })