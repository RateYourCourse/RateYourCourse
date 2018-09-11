//variables
const MongoClient = require("mongodb").MongoClient;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017" ||
  "mongodb://heroku_k67cjpp6:lv11adj8q0vn70n9i4sur8p108@ds151602.mlab.com:51602/heroku_k67cjpp6";
const PORT = process.env.PORT || 3000;
const dbName = "rateyourcourse";
var db;

app.use(express.static("static"));

//Implementation of a search function
app.get("/courses", function(req, res) {
  const name = req.query.q || "";

  db.collection("Courses")
    .find(name == "" ? {} : { $text: { $search: name } })
    .toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(JSON.stringify(result));
    });
});

// Implementation of Review post
app.post("/reviews", function(req, res) {
  var data = req.body.data;
  db.collection("Reviews").insert(
    { course_id: data.id },
    { review_title: data.title },
    { review_semester: data.semester },
    { review_comment: data.comment },
    { review_stars: data.stars },
    { review_mail: data.mail }
  );
  console.log(data);
});

//Implementation of a search function for reviews
app.get("/reviews", function(req, res) {
  console.log(req.query.q);
  const name = req.query.q.toString() || "";
  db.collection("Reviews")
    .find({ course_id: name })
    .toArray(function(err, review) {
      if (err) throw err;
      console.log(review);
      res.send(JSON.stringify(review));
    });
});

//Database
MongoClient.connect(
  url,
  function(err, client) {
    db = client.db(dbName);
    db.collection("Courses").createIndex({ "$**": "text" });
    app.listen(PORT, function() {
      console.log("Example app listening on port ", PORT);
    });
  }
);
