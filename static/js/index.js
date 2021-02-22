// Edit and delete buttons for each row
// delete will delete the row
// edit will put the info in the form and turn editMode on
// then when they click submit, we delete that row and append the new one
//
// PROBLEMS
// Multiple pictures means need multiple inputs
// Multiple sizes means multiple inputs again

const sizeToIndex = { 5: 0, 6: 1, 7: 2, 8: 3, 9: 4, 10: 5, 11: 6, 12: 7 };
const brandToIndex = { Adidas: 0, Nike: 1 };
const locationToIndex = { Montreal: 0, Quebec: 1, Sherbrooke: 2 };

function loadItems(items) {
  var table = document.querySelector(".products_section > table");
  try {
    var products = JSON.parse(items);

    // Append the rows to the table
    for (i in products) {
      var row = createRow(products[i], i);
      table.append(row);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("No Items in JSON File");

      // Display on client table
      var emptyTableRow = document.createElement("tr");
      var emptyTableData = document.createElement("td");
      emptyTableData.innerHTML = "No items in json file";
      emptyTableData.colSpan = 6;
      emptyTableData.style.textAlign = "center";
      emptyTableRow.append(emptyTableData);

      table.append(emptyTableRow);
    } else {
      throw error;
    }
    // Should display something in the table or outside it <- probably that
  }
}

/**
 * Creates a row using an object containing the info for a product
 * @param {A product object} product
 * @param {int} rowNumber
 */
function createRow(product, rowNumber) {
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
    picturesImages.width = 100; // I think I also need to set the height
    pictures.append(picturesImages);
  }

  var product_location = document.createElement("td");
  product_location.innerHTML = product.location;

  var editBtn = document.createElement("button");
  editBtn.id = "editBtn_" + rowNumber;
  editBtn.innerHTML = "Edit";
  editBtn.setAttribute("class", "editBtn");
  editBtn.addEventListener("click", () => {
    editRow(rowNumber);
  });

  var deleteBtn = document.createElement("button");
  deleteBtn.id = "deleteBtn_" + rowNumber;
  deleteBtn.innerHTML = "Delete";
  deleteBtn.setAttribute("class", "deleteBtn");
  deleteBtn.addEventListener("click", () => {
    deleteRow(rowNumber);
  });

  row.append(
    product_name,
    description,
    brand,
    size,
    pictures,
    product_location,
    editBtn,
    deleteBtn
  );
  return row;
}

function editRow(rowNumber) {
  console.log("should allow editing of row " + rowNumber);
  // place items in fields
  var nameField = document.getElementsByName("name")[0];
  var descriptionField = document.getElementsByName("description")[0];
  var brandField = document.getElementsByName("brand")[0];
  var sizeField = document.getElementsByName("size")[0];
  var pictureField = document.getElementsByName("pictures")[0];
  var locationField = document.getElementsByName("location")[0];

  var btn = event.target;
  var tdElements = btn.parentElement.querySelectorAll("td");
  nameField.value = tdElements[0].innerHTML;
  descriptionField.value = tdElements[1].innerHTML;
  brandField.selectedIndex = brandToIndex[tdElements[2].innerHTML];
  sizeField.selectedIndex = sizeToIndex[tdElements[3].innerHTML];

  // Need pictures to be set
  locationField.selectedIndex = locationToIndex[tdElements[5].innerHTML];

  var submitBtn = document.getElementById("newProductBtn");
  submitBtn.innerHTML = "Update";
}

function deleteRow(rowNumber) {
  console.log(
    "should delete the row. Just delete the json entry and reload page"
  );

  var xhr = createXMLHttpRequestObject();
  xhr.open("POST", "/delete", true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Reload the page.
      // Hopefully this isn't breaking things
      location = "/";
    }
  };

  xhr.send("row=" + rowNumber);
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
  // Load initial items using json
  backgroundReadFile("data/products.json", loadItems);
}

document.addEventListener("DOMContentLoaded", init);
