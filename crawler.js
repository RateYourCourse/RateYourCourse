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

rp(options)
  .then(function($) {
    $("table:nth-child(4) tr").each(function(i, elem) {
      const prof = $(elem)
        .children("td:nth-child(5)")
        .text();
      const name = $(elem)
        .children("td:nth-child(7)")
        .text();
      const id = $(elem)
        .children("td:nth-child(3)")
        .children("a")
        .text();
      const link =
        "https://verdi.unisg.ch/" +
        $(elem)
          .children("td:nth-child(3)")
          .children("a")
          .attr("href");
      if (id && name && prof && link) {
        courses.push({ name, prof, id, link });
      } else {
        console.log("Skipped: ", name, prof, id, link);
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
    function(err, client) {
      const db = client.db(dbName);

      db.collection("courses").insertMany(courses);
      client.close();
    }
  );
}
