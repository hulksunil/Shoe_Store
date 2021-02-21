possibleLocations = ["Montreal", "Quebec", "Sherbrooke"];
possibleBrands = ["Nike", "Adidas"];

function addNewItem() {
  // client side validate fields
}

function loadItems(items) {
  products = JSON.parse(items);
  for (i in products) {
    createRow(products[i]);
    console.table(products[i]);
    console.log("name: " + products[i].name);
  }
}

/**
 *
 * @param {A product object} product
 */
function createRow(product) {
  row = document.createElement("tr");

  //   console.log(row);

  //   console.log(Object.keys(product));
  //   console.log("NEW NAME: " + product["name"]);

  product_name = document.createElement("td");
  product_name.innerHTML = product.name;

  description = document.createElement("td");
  description.innerHTML = product.description;

  brand = document.createElement("td");
  brand.innerHTML = product.brand;

  size = document.createElement("td");
  size.innerHTML = product.size;

  pictures = document.createElement("td");

  for (let i = 0; i < product.pictures.length; i++) {
    picutresImages = document.createElement("img");
    picutresImages.src = product.pictures[i];
    pictures.append(picutresImages);
  }

  console.log(product.pictures);

  product_location = document.createElement("td");
  product_location.innerHTML = product.location;

  row.append(
    product_name,
    description,
    brand,
    size,
    pictures,
    product_location
  );
  console.log(row);
}

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
