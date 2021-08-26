const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require("dotenv").config()

const port = process.env.PORT || 5500;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mvf4b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("vounteer").collection("events");

  app.get('/events', (req, res) => {
    eventCollection.find()
    .toArray((err, collection) => {
        res.send(collection)
    })
  })
   
  app.post('/addEvent', (req, res) => {
      const newEvent = req.body;
      eventCollection.insertOne(newEvent)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })



});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})