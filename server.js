const fs = require("fs");
const bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
const multer = require("multer");
const app = express();

// This is so my static files load on the server
app.use(express.static(path.join(__dirname, "static")));

// This is so I can get req.body in my get and post methods
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Define the storage so pictures go in the correct location
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const JSON_FILE_PATH = "static/data/products.json";

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
// upload.array is for the form's pictures to be uploaded
app.post("/", upload.array("pictures"), (req, res) => {
  // For update, we remove the product so we can insert a new one with updated values
  if (req.body.row) {
    console.log("Updating product");
    removeProduct(req.body.row);
  } else {
    console.log("Inserting new product");
  }

  // handle uploaded files
  var uploadedPictures = getProductPictures(req.files, req.body.pictures);

  var product = {
    name: req.body.name,
    description: req.body.description,
    brand: req.body.brand,
    size: Number(req.body.size),
    pictures: uploadedPictures,
    location: req.body.location,
  };
  updateJSON(product);

  // * redirect back to same file
  res.sendFile(__dirname + "/index.html");
});

// * Handle post requests to delete
app.post("/delete", (req, res) => {
  // remove the item
  removeProduct(req.body.row);

  // * redirect back to same file
  res.sendFile(__dirname + "/index.html");
});

/**
 * Gets the pictures for the product to save
 * @param {*} files The uploaded pictures
 * @param {*} pictures The product's pictures that were kept
 */
function getProductPictures(files, pictures) {
  var productPictures = [];
  for (let i = 0; i < files.length; i++) {
    productPictures.push("images/" + files[i].originalname);
  }

  if (pictures) {
    // Check the type because if only one is selected, the form sends it as a string instead of an array
    if (typeof pictures == "string") {
      productPictures.push("images/" + pictures);
    } else {
      for (let i = 0; i < pictures.length; i++) {
        const picture = pictures[i];
        productPictures.push("images/" + picture);
      }
    }
  }
  return productPictures;
}

/**
 * Removes the product at the given index and saves to the JSON file
 * @param {int} index The index of the product to remove
 */
function removeProduct(index) {
  var products = readJSONFile();
  products.splice(index, 1);

  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(products, null, 2));
}

/**
 * Reads the json file and returns its contents
 */
function readJSONFile() {
  // Read the json file
  encoding = "utf-8";
  var file = fs.readFileSync(JSON_FILE_PATH, encoding);
  var products = JSON.parse(file);
  return products;
}

/**
 * Updates the json file with the new product
 * @param {Object} newProduct the new product
 */
function updateJSON(newProduct) {
  var products = readJSONFile();
  products.push(newProduct);

  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(products, null, 2));
}
