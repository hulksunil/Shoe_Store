// var http = require("http");
// const fs = require("fs");
const bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, "static")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// * Define main index file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// * Start server
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Express app listening at http://%s:%s", host, port);
});

// * Handle post request to root
app.post("/", (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + "/index.html");
});

// app.post("/updateJSON", (req, res) => {
//   // console.log(req.body.size);
//   // res.sendFile(__dirname + "/index.html");
// });

// function updateJSON(newProduct) {
//   var jsonFile;
//   fs.readFile("data/products.json", (err, data) => {
//     jsonFile = data;
//   });
//   console.log(jsonFile);
// }
