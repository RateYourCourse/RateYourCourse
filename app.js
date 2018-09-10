//variables
const MongoClient = require("mongodb").MongoClient;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = "mongodb://localhost:27017";

const dbName = "rateyourcourse";
var db;

// middleware
app.use(express.static("static"));

//Implementation of a search function
app.get("/courses", function(req, res) {
  const name = req.query.q || "";

  db.collection("Courses")
    .find(name == "" ? {} : { $text: { $search: name } })
    //.find({ name: /Marketing/i })
    .toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(JSON.stringify(result));
    });
});
app.post("/reviews", function(req, res) {
  var data = req.body.data;
  console.log(data);
});
MongoClient.connect(
  url,
  function(err, client) {
    db = client.db(dbName);
    db.collection("Courses").createIndex({ "$**": "text" });
    app.listen(3000, function() {
      console.log("Example app listening on port 3000!");
    });
  }
);
