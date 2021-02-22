// Edit and delete buttons for each row
// delete will delete the row
// edit will put the info in the form and turn editMode on
// then when they click submit, we delete that row and append the new one
//
// PROBLEMS
// Multiple pictures means need multiple inputs
// Multiple sizes means multiple inputs again

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

  // create the picture images
  for (let i = 0; i < product.pictures.length; i++) {
    var picturesImages = document.createElement("img");
    // picturesImages.setAttribute("src", product.pictures[i]);
    picturesImages.src = product.pictures[i];
    picturesImages.width = 100;
    pictures.append(picturesImages);
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

function getNewProduct() {
  var productName = document.getElementsByName("name")[0].value;
  var productDescription = document.getElementsByName("description")[0].value;
  var productBrand = document.getElementsByName("brand")[0].value;
  var productSize = document.getElementsByName("size")[0].value;

  // ! Work in progress. Trying to figure out how to display the image
  var productPictureValue = document.getElementsByName("pictures")[0].files[0];
  var productPicture;
  if (productPictureValue) {
    console.log(productPictureValue);

    const fileReader = new FileReader();
    fileReader.addEventListener("load", function () {
      // convert image to base64 encoded string
      productPicture = this.result;
    });

    fileReader.readAsDataURL(productPictureValue);
    console.log(productPicture);
  }

  var productLocation = document.getElementsByName("location")[0].value;

  var product = {
    name: productName,
    description: productDescription,
    brand: productBrand,
    size: [productSize],
    pictures: [productPicture],
    location: productLocation,
  };
  return product;
}

function insertRecord() {
  var product = getNewProduct();
  var row = createRow(product);
  var table = document.querySelector(".products_section > table");
  table.append(row);

  // updateJSON(product);

  // var form = document.querySelector("form");
  // form.submit();
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
  newProductBtn.addEventListener("click", insertRecord);
}

document.addEventListener("DOMContentLoaded", init);
