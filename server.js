const fs = require("fs");
const bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
const multer = require("multer");
var app = express();

// Define the storage so it goes in the correct location
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// This is so my static files load on the server
app.use(express.static(path.join(__dirname, "static")));

// This is so I can get req.body in my get or post methods
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const jsonFilePath = "static/data/products.json";

// * Define main index file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// * Start server on 8080
var server = app.listen(8080, "localhost", function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Express app listening at http://%s:%s", host, port);
});

// * Handle post request to root
app.post("/", upload.array("pictures", 3), (req, res) => {
  // console.log(req);
  // handle uploaded files
  if (req.files) {
    console.log(req.files);

    // const tempPath = req.file.path;
    // const targetPath = path.join(__dirname, "./uploads/image.png");
    // fs.rename(tempPath, targetPath);
    // res.send(req.files);
  }

  var uploadedPictures = [];
  for (let i = 0; i < req.files.length; i++) {
    uploadedPictures.push("images/" + req.files[i].originalname);
  }

  var product = {
    name: req.body.name,
    description: req.body.description,
    brand: req.body.brand,
    size: [Number(req.body.size)],
    pictures: uploadedPictures,
    location: req.body.location,
  };
  updateJSON(product);

  // * redirect back to same file
  res.sendFile(__dirname + "/index.html");
});

app.post("/delete", (req, res) => {
  var products = readJSONFile();

  // remove the item
  products.splice(req.body.row, 1);

  fs.writeFileSync(jsonFilePath, JSON.stringify(products, null, 2));
  // * redirect back to same file
  res.sendFile(__dirname + "/index.html");
});

app.post("/edit", (req, res) => {
  var product = readJSONFile();
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
