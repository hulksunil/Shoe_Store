// Edit and delete buttons for each row
// delete will delete the row
// edit will put the info in the form and turn editMode on
// then when they click submit, we delete that row and append the new one
//
// PROBLEMS
// PIctures need to be sent back when editing them
// When I click submit for update, how does it know to direct to the edit post instead of /

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

  if (product.pictures.length > 1) {
    pictures.append(createCarousel(rowNumber, product.pictures));
  } else if (product.pictures.length == 1) {
    var picturesImage = document.createElement("img");
    picturesImage.src = product.pictures[0];
    picturesImage.height = 150;
    picturesImage.width = 150;
    pictures.append(picturesImage);
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

/**
 * Places the row's info into the form
 * @param {int} rowNumber The product entry's row
 */
function editRow(rowNumber) {
  console.log("should allow editing of row " + rowNumber);
  // place items in fields
  var nameField = document.getElementsByName("name")[0];
  var descriptionField = document.getElementsByName("description")[0];
  var brandField = document.getElementsByName("brand")[0];
  var sizeField = document.getElementsByName("size")[0];
  var locationField = document.getElementsByName("location")[0];

  var btn = event.target;
  var tdElements = btn.parentElement.querySelectorAll("td");
  nameField.value = tdElements[0].innerHTML;
  descriptionField.value = tdElements[1].innerHTML;
  brandField.selectedIndex = brandToIndex[tdElements[2].innerHTML];
  sizeField.selectedIndex = sizeToIndex[tdElements[3].innerHTML];
  locationField.selectedIndex = locationToIndex[tdElements[5].innerHTML];

  // Need pictures to be set
  // get all pictures in list
  var pictureSelectField = document.getElementsByName("pictures")[1];
  // Empty the options so we start fresh
  pictureSelectField.innerHTML = "";

  var images = tdElements[4].querySelectorAll("img");

  for (let i = 0; i < images.length; i++) {
    let option = document.createElement("option");
    console.log(images[i]);
    let src = images[i].src;
    var searchWord = "/images/";
    console.log(src);
    var index = src.indexOf(searchWord);
    let valueDisplayed = src.substring(index + searchWord.length, src.length);

    // option.setAttribute("value", src.substring(index, src.length));
    option.setAttribute("value", valueDisplayed);
    option.setAttribute("name", "oldPictures[]");
    option.innerHTML = valueDisplayed;
    pictureSelectField.append(option);
  }

  if (images.length > 0) {
    pictureSelectField.parentElement.style.display = "block";
  } else {
    pictureSelectField.parentElement.style.display = "none";
  }

  var submitBtn = document.getElementById("newProductBtn");
  submitBtn.style.display = "none";

  var editBtn = document.getElementById("updateProductBtn");
  editBtn.style.display = "block";

  // Place the row's number as the button's value
  editBtn.value = rowNumber;

  var cancelUpdateBtn = document.getElementById("cancelUpdateBtn");
  cancelUpdateBtn.style.display = "block";
  editMode = true;
}

/**
 * Cancels the updating process
 */
function cancelUpdate() {
  editMode = false;
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
 * Resets the forms fields to the default values
 */
function resetFields() {
  // empty name, description and pictures
  var name = document.getElementsByName("name")[0];
  name.value = "";

  var desc = document.getElementsByName("description")[0];
  desc.value = "";

  var pictures = document.getElementsByName("pictures")[0];
  pictures.files = null;

  var brand = document.getElementsByName("brand")[0];
  brand.selectedIndex = 0;

  var location = document.getElementsByName("location")[0];
  location.selectedIndex = 0;

  var size = document.getElementsByName("size")[0];
  size.selectedIndex = 0;
}

function deleteRow(rowNumber) {
  var xhr = createXMLHttpRequestObject();
  xhr.open("POST", "/delete", true);

  //Send the proper header information along with the request
  sendRowToServer(xhr, rowNumber);
}

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

  var cancelUpdateBtn = document.getElementById("cancelUpdateBtn");
  cancelUpdateBtn.addEventListener("click", cancelUpdate);
}

/**
 *
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

document.addEventListener("DOMContentLoaded", init);
