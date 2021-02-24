// These are to help with selectedIndex on the html selects.
const sizeToIndex = { 5: 0, 6: 1, 7: 2, 8: 3, 9: 4, 10: 5, 11: 6, 12: 7 };
const brandToIndex = { Adidas: 0, Nike: 1 };
const locationToIndex = { Montreal: 0, Quebec: 1, Sherbrooke: 2 };

/**
 * Loads the product items from the JSON file.
 * @param {string} items
 */
function loadItems(items) {
  var table = document.querySelector(".products_section > table");
  try {
    var products = JSON.parse(items);

    if (products.length === 0) {
      displayNoItemsInTable(table);
      console.log("Products list is empty");
    }

    // Append the rows to the table
    for (i in products) {
      let row = createRow(products[i], i);
      table.append(row);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("No Items in JSON File or JSON file has an error");

      // Display on client table
      displayNoItemsInTable(table);
    } else {
      throw error;
    }
  }
}

/**
 * method to run when no items are found from the json file
 * @param {table} table
 */
function displayNoItemsInTable(table) {
  // Display on client table
  var emptyTableRow = document.createElement("tr");
  var emptyTableData = document.createElement("td");
  emptyTableData.innerHTML = "No items in json file";
  emptyTableData.colSpan = 6;
  emptyTableData.style.textAlign = "center";
  emptyTableRow.append(emptyTableData);

  table.append(emptyTableRow);
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

  var picturesTd = document.createElement("td");

  insertPictures(product.pictures, picturesTd, rowNumber);

  var product_location = document.createElement("td");
  product_location.innerHTML = product.location;

  var editBtn = createRowButton("Edit");

  var deleteBtn = createRowButton("Delete");

  row.append(
    product_name,
    description,
    brand,
    size,
    picturesTd,
    product_location,
    editBtn,
    deleteBtn
  );
  return row;
}

/**
 * Creates a table row's edit or delete button
 * @param {string} type Edit or Delete
 * @param {int} rowNumber
 */
function createRowButton(type, rowNumber) {
  var btn = document.createElement("button");
  if (type == "Edit") {
    btn.innerHTML = "Edit";
    btn.setAttribute("class", "editBtn");
    btn.addEventListener("click", () => {
      editRow(rowNumber);
    });
  } else if (type == "Delete") {
    btn.innerHTML = "Delete";
    btn.setAttribute("class", "deleteBtn");
    btn.addEventListener("click", () => {
      deleteRow(rowNumber);
    });
  } else {
    throw new Error("Row buttons can only be Edit or Delete");
  }
  return btn;
}

/**
 * Insertes the pictures into the td element
 * @param {string[]} pictures The paths to the pictures to be displayed on the row
 * @param {HTMLTableDataCellElement} picturesTd The td html element where the images are placed in
 * @param {int} rowNumber
 */
function insertPictures(pictures, picturesTd, rowNumber) {
  if (pictures.length > 1) {
    picturesTd.append(createCarousel(rowNumber, pictures));
  } else if (pictures.length == 1) {
    var picturesImage = document.createElement("img");
    picturesImage.src = pictures[0];
    picturesImage.height = 150;
    picturesImage.width = 150;
    picturesTd.append(picturesImage);
  }
}

/**
 * Creates a carousel using the pictures given
 * @param {int} rowNumber The row that the carousel will be in
 * @param {string[]} pictures Array of strings indicating the path to images to put in the carousel
 */
function createCarousel(rowNumber, pictures) {
  var container = document.createElement("div");
  var carouselId = "myCarousel" + rowNumber;
  container.id = carouselId;
  container.setAttribute("data-interval", false);
  container.style.width = "150px";
  container.style.height = "150px";
  container.className = "carousel slide";

  var slidesWrapper = document.createElement("div");
  slidesWrapper.className = "carousel-inner";
  insertCarouselImages(pictures, slidesWrapper);

  var left = createCarouselControl("left", carouselId);
  var right = createCarouselControl("right", carouselId);

  container.append(slidesWrapper, left, right);
  return container;
}

/**
 * Inserts the pictures into the carousel
 * @param {string[]} pictures Array of strings indicating the path to images to put in the carousel
 * @param {Object} slidesWrapper The wrapper of the images' items
 */
function insertCarouselImages(pictures, slidesWrapper) {
  for (let i = 0; i < pictures.length; i++) {
    var item = document.createElement("div");
    item.className = "item";
    if (i == 0) {
      item.className += " active";
    }
    var image = document.createElement("img");
    image.src = pictures[i];
    image.style.height = "100%";
    image.style.width = "100%";
    item.append(image);
    slidesWrapper.append(item);
  }
}

/**
 * Creates a carousel control in the specified direction for the specified carousel
 * @param {string} direction The direction of the carousel control
 * @param {string} carouselId The id of the specified carousel
 */
function createCarouselControl(direction, carouselId) {
  var directionControl = document.createElement("a");
  directionControl.className = direction + " carousel-control";
  directionControl.href = "#" + carouselId;
  if (direction === "left") {
    directionControl.setAttribute("data-slide", "prev");
  } else {
    directionControl.setAttribute("data-slide", "next");
  }
  var icon = document.createElement("span");
  icon.className = "glyphicon glyphicon-chevron-" + direction;

  directionControl.append(icon);
  return directionControl;
}

/**
 * Places the row's info into the form
 * @param {int} rowNumber The product entry's row
 */
function editRow(rowNumber) {
  console.log("should allow editing of row " + rowNumber);
  var btn = event.target;
  insertRowValuesIntoForm(btn.parentElement);

  var submitBtn = document.getElementById("newProductBtn");
  submitBtn.style.display = "none";

  var editBtn = document.getElementById("updateProductBtn");
  editBtn.style.display = "block";

  // Place the row's number as the button's value so the server knows that its an update
  editBtn.value = rowNumber;

  var cancelUpdateBtn = document.getElementById("cancelUpdateBtn");
  cancelUpdateBtn.style.display = "block";
}

/**
 * Inserts the table row's values into the form
 * @param {HTMLTableRowElement} tr The row containing the information to place in the form
 */
function insertRowValuesIntoForm(tr) {
  var tdElements = tr.querySelectorAll("td");

  // place items in fields
  var nameField = document.getElementsByName("name")[0];
  var descriptionField = document.getElementsByName("description")[0];
  var brandField = document.getElementsByName("brand")[0];
  var sizeField = document.getElementsByName("size")[0];
  var locationField = document.getElementsByName("location")[0];

  nameField.value = tdElements[0].innerHTML;
  descriptionField.value = tdElements[1].innerHTML;
  brandField.selectedIndex = brandToIndex[tdElements[2].innerHTML];
  sizeField.selectedIndex = sizeToIndex[tdElements[3].innerHTML];
  // get all pictures in list
  var images = tdElements[4].querySelectorAll("img");
  placePicturesIntoSelectBox(images);

  locationField.selectedIndex = locationToIndex[tdElements[5].innerHTML];
}

/**
 * Places the images (as strings) in the select box in the form
 * @param {string[]} images The images srcs to put in the select box
 */
function placePicturesIntoSelectBox(images) {
  var pictureSelectField = document.getElementsByName("pictures")[1];
  // Empty the options so we start fresh
  pictureSelectField.innerHTML = "";

  var searchWord = "/images/";
  for (let i = 0; i < images.length; i++) {
    let option = document.createElement("option");
    let src = images[i].src;
    var index = src.indexOf(searchWord);

    let valueDisplayed = src.substring(index + searchWord.length, src.length);
    option.setAttribute("value", valueDisplayed);
    option.innerHTML = valueDisplayed;
    pictureSelectField.append(option);
  }

  // Display the select if there are any images, hide it if there aren't
  if (images.length > 0) {
    pictureSelectField.parentElement.style.display = "block";
  } else {
    pictureSelectField.parentElement.style.display = "none";
  }
}

/**
 * Removes all selected pics from the form's select box
 */
function removeSelectedPics() {
  var pictureSelectField = document.getElementsByName("pictures")[1];

  // Iterate backwards so we don't need to worry about shifted indexes
  for (let i = pictureSelectField.options.length - 1; i >= 0; i--) {
    if (pictureSelectField.options[i].selected) {
      pictureSelectField.remove(i);
    }
  }
}

/**
 * Cancels the updating process
 */
function cancelUpdate() {
  var submitBtn = document.getElementById("newProductBtn");
  submitBtn.style.display = "block";

  var editBtn = document.getElementById("updateProductBtn");
  editBtn.style.display = "none";

  // Remove children from pictures and hide it
  var pictureSelectField = document.getElementsByName("pictures")[1];
  pictureSelectField.innerHTML = "";
  pictureSelectField.parentElement.style.display = "none";

  // Remove the rownumber from the btn so it won't try to update when inserting
  editBtn.value = "";

  event.target.style.display = "none";

  // reset the fields
  resetFields();
}

/**
 * Resets the form's fields to their default values
 */
function resetFields() {
  // empty name, description and pictures
  var name = document.getElementsByName("name")[0];
  name.value = "";

  var desc = document.getElementsByName("description")[0];
  desc.value = "";

  var pictures = document.getElementsByName("pictures")[0];
  pictures.value = "";

  var brand = document.getElementsByName("brand")[0];
  brand.selectedIndex = 0;

  var location = document.getElementsByName("location")[0];
  location.selectedIndex = 0;

  var size = document.getElementsByName("size")[0];
  size.selectedIndex = 0;
}

/**
 * Deletes the row corresponding to the rowNumber
 * @param {int} rowNumber
 */
function deleteRow(rowNumber) {
  var xhr = createXMLHttpRequestObject();
  xhr.open("POST", "/delete", true);

  //Send the proper header information along with the request
  sendRowToServer(xhr, rowNumber);
}

/**
 * Sends the row number to the server
 * @param {XMLHttpRequest} xhr
 * @param {int} rowNumber
 */
function sendRowToServer(xhr, rowNumber) {
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Reload the page.
      location = "/";
    }
  };

  xhr.send("row=" + rowNumber);
}

/**
 * Reads a JSON file and calls a function on it once its received.
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

/**
 * Main function
 */
function init() {
  // Load initial items using json
  backgroundReadFile("data/products.json", loadItems);

  var cancelUpdateBtn = document.getElementById("cancelUpdateBtn");
  cancelUpdateBtn.addEventListener("click", cancelUpdate);

  var removeSelectedPicBtn = document.getElementById("removeSelectedPicBtn");
  removeSelectedPicBtn.addEventListener("click", removeSelectedPics);

  // selects all the fields in the select box so those pictures are kept for  the product
  $("form").submit(() => {
    var pictureSelectField = document.getElementsByName("pictures")[1];
    if (pictureSelectField.parentElement.style.display == "block") {
      for (let i = 0; i < pictureSelectField.options.length; i++) {
        pictureSelectField.options[i].selected = true;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
