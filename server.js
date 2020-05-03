const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3000;

const db = require("./database");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//app.use(cors);
app.use(
  fileUpload({
    debug: true,
  })
);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/quotes", db.getQuotes);
app.get("/quotes/random", db.getRandomQuote);

app.post("/quotes/upload", function (req, res) {
  let sampleFile;
  let uploadPath;

  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  console.log("req.files >>>", req.files); // eslint-disable-line

  sampleFile = req.files.sampleFile;

  uploadPath = __dirname + "/uploads/" + sampleFile.name;

  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send("File uploaded to " + uploadPath);
  });
});
