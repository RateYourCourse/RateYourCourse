const MongoClient = require("mongodb").MongoClient;

const rp = require("request-promise");
const cheerio = require("cheerio");
const options = {
  encoding: "latin1",
  uri: `https://verdi.unisg.ch/org/st-ppp/vprgwi18.nsf/WWWfmSPKlasse_DE!OpenForm&Start=1&Count=3000&ExpandView&Seq=9`,
  transform: function(body) {
    return cheerio.load(body);
  }
};
const url = "mongodb://localhost:27017";

const dbName = "rateyourcourse";

const courses = [];

function isIdAlreadyInList(id) {
  for (var i = 0; i < courses.length; i++) {
    course = courses[i];
    if (course.id == id) {
      return true;
    }
  }
  return false;
}

rp(options)
  .then(function($) {
    $("table:nth-child(4) tr").each(function(i, elem) {
      const id = $(elem)
        .children("td:nth-child(3)")
        .children("a")
        .text()
        .trim();

      const prof = $(elem)
        .children("td:nth-child(5)")
        .text()
        .trim();
      const name = $(elem)
        .children("td:nth-child(7)")
        .text()
        .trim();

      const link =
        "https://verdi.unisg.ch/" +
        $(elem)
          .children("td:nth-child(3)")
          .children("a")
          .attr("href");
      if (id && name && prof && link) {
        if (!isIdAlreadyInList(id)) {
          courses.push({ name, prof, id, link });
        }
      }
    });

    saveData();
  })
  .catch(function(err) {
    console.log(err);
  });
function saveData() {
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, client) {
      const db = client.db(dbName);
      {
        useNewUrlParser: true;
      }
      db.collection("Courses").insertMany(courses);

      client.close();
    }
  );
}
