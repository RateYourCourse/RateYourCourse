//variables
const MongoClient = require("mongodb").MongoClient;
var express = require("express");
var app = express();

const url = "mongodb://localhost:27017";

const dbName = "rateyourcourse";
var db;

// middleware
app.use(express.static("static"));

//Implementation of a search function
app.get("/courses", function(req, res) {
  //var courseId = req.query.id ? req.query.id : {};
  //var courseName = req.query.name ? req.query.name : {};
  //var courseProf = req.query.prof ? req.query.prof : {};
  // const name = req.query.name || req.query.prof || req.query.id || "";
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
