const express = require("express");
const { MongoClient, Collection } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.az9qi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// console.log(uri)

async function run() {
  try {
    await client.connect();
    const dataBase = client.db("travelData");
    const servicesCollection = dataBase.collection("services");
    const singleDataCollection = dataBase.collection("placeOrder");

    //get api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    //get order api
    app.get("/placeOrders", async (req, res) => {
      const cursor = singleDataCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      //  console.log('getting specific', (id))
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    //post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      console.log("hit the post api", service);
      res.send(result);
    });

    //add post order
    app.post("/placeOrders", async (req, res) => {
      const order = req.body;
      const result = await singleDataCollection.insertOne(order);
      res.send(result);
    });

    //delete post
    app.delete("/placeOrders/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await singleDataCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    app.patch("/placeOrders/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await singleDataCollection.updateOne(
          { _id: ObjectId(id) },
          { $set: { status: "Approve" } }
        );
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running my travel server add");
});

app.listen(port, () => {
  console.log("Running my travel server on  port ", port);
});
