const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri =
  "mongodb+srv://myUserSkil:akash91221!!!@cluster0.ugsfy.mongodb.net/ownSkillDb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const productCollection = client.db("ownSkillDb").collection("products");

  app.get("/product", (req, res) => {
    productCollection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      console.log("data added successfully");
      res.redirect("/");
    });
  });

  app.patch("/update/:id", (req, res) => {
    productCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { price: req.body.price, quantity: req.body.quantity } }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(3000);
