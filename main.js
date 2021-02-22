// var http = require("http");
const fs = require("fs");
const bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var app = express();

const jsonFilePath = "static/data/products.json";

// This is so my static files load on the server
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

// * Start server on 8080
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Express app listening at http://%s:%s", host, port);
});

// * Handle post request to root
app.post("/", (req, res) => {
  console.log(req);
  var product = {
    name: req.body.name,
    description: req.body.description,
    brand: req.body.brand,
    size: [Number(req.body.size)],
    pictures: [req.body.pictures],
    location: req.body.location,
  };
  updateJSON(product);

  // * redirect back to same file
  res.sendFile(__dirname + "/index.html");
});

/**
 * Reads the json file and returns its contents
 */
function readJSONFile() {
  // Read the json file
  encoding = "utf-8";
  var file = fs.readFileSync(jsonFilePath, encoding);
  var products = JSON.parse(file);
  return products;
}

/**
 * Updates the json file with the new product
 * @param {the new product} newProduct
 */
function updateJSON(newProduct) {
  var products = readJSONFile();
  products.push(newProduct);

  fs.writeFileSync(jsonFilePath, JSON.stringify(products, null, 2));
}
