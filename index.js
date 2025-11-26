const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 4000;
require("dotenv").config();

app.use(express.json());
app.use(cors());

const uri = process.env.URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // client.connect();
    const db = client.db("byteBazaarDB");
    const productsCollection = db.collection("products");

    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const data = req.body;
      data.created_at = new Date();
      const result = await productsCollection.insertOne(data);
      res.send({ success: true, result });
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.get("/latest-products", async (req, res) => {
      const result = await productsCollection
        .find()
        .sort({ created_at: -1 })
        .limit(8)
        .toArray();
      res.send(result);
    });

    app.get("/addedProducts", async (req, res) => {
      const email = req.query.email;
      result = await productsCollection
        .find({ email: email })
        .sort({ created_at: -1 })
        .toArray();
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      result = await productsCollection.deleteOne(query);
      res.send(result);
    });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}

run();

app.listen(port, () => {
  console.log("Server running on port", port);
});
