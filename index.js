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
app.use(cors);
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

app.post("/quotes/upload", (req, res) => {
  const image = req.files.myFile;
  const path = __dirname + "/tmp" + image.name;

  image.mv(path, (error) => {
    if (error) {
      console.error(error);
      res.writeHead(500, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ status: "error", message: error }));
      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ status: "success", path: "/tmp" + image.name }));
  });
});
