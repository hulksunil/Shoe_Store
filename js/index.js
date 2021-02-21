possibleLocations = ["Montreal", "Quebec", "Sherbrooke"];
possibleBrands = ["Nike", "Adidas"];

function addNewItem() {
  // client side validate fields
}

function loadItems(items) {
  try {
    var products = JSON.parse(items);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("No Items in JSON File");
    } else {
      throw error;
    }
    // Should display something in the table or outside it <- probably that
  }
  var table = document.querySelector(".products_section > table");
  for (i in products) {
    var row = createRow(products[i]);
    table.append(row);
    // console.table(products[i]);
    // console.log("name: " + products[i].name);
  }
}

/**
 * Creates a row using an object containing the info for a product
 * @param {A product object} product
 */
function createRow(product) {
  var row = document.createElement("tr");

  var product_name = document.createElement("td");
  product_name.innerHTML = product.name;

  var description = document.createElement("td");
  description.innerHTML = product.description;

  var brand = document.createElement("td");
  brand.innerHTML = product.brand;

  var size = document.createElement("td");
  size.innerHTML = product.size;

  var pictures = document.createElement("td");

  for (let i = 0; i < product.pictures.length; i++) {
    var picutresImages = document.createElement("img");
    picutresImages.src = product.pictures[i];
    pictures.append(picutresImages);
  }

  var product_location = document.createElement("td");
  product_location.innerHTML = product.location;

  row.append(
    product_name,
    description,
    brand,
    size,
    pictures,
    product_location
  );
  return row;
}

/**
 *
 * @param {string} url The path to the file (json) to read
 * @param {function(data)} callback The function to call using the data from the file
 */
function backgroundReadFile(url, callback) {
  var xhr = createXMLHttpRequestObject();
  xhr.open("GET", url);
  xhr.send();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(xhr.responseText);
    }
  });
}

/**
 * Backwards compatibility AJAX utility
 */
function createXMLHttpRequestObject() {
  if (XMLHttpRequest) {
    return new XMLHttpRequest();
  }
  return new ActiveXObject("Microsoft.XMLHTTP");
}

function init() {
  // Need to load initial items using json
  backgroundReadFile("data/products.json", loadItems);

  newProductBtn = document.getElementById("newProductBtn");
  newProductBtn.addEventListener("click", addNewItem);
}

document.addEventListener("DOMContentLoaded", init);
