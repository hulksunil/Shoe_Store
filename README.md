# Shoe Store

This project uses node.js.
It requires express, body-parser, and multer.

### If you don't have these modules

`npm install express`<br/>
`npm install body-parser`<br/>
`npm install multer`

## How to run

`node server.js`

then go to the following url in the browser:
[http://localhost:8080](http://localhost:8080)

## How it works

All products are loaded from products.json into the table displayed on the screen.

The name,description, brand, size, location and pictures for a product are shown in a row in the table. The pictures use a carousel so they can be navigated through.

You can create new products by entering the values into the form.

### Uploading multiple pictures

Click on the file chooser button to select your images. You can choose multiple pictures to upload.

Want to switch your pictures? Click on the button again to restart the selection.

Choose cancel on the dialog to remove any photos that were chosen.

### Delete and Edit

Each product has their own designated edit and delete button.

#### Delete

The delete button will remove that product from the table (and the json file).

#### Edit

The edit will place the values into the form so that they can be modified.

After modifying the values and submitting the form, it will delete the entry and place a new one with the updated information at the end of the table.

##### Pictures when editing

The current pictures are placed in a select box. From here, you can remove pictures already in the list by individually selecting them or by grouping selections (shift+click) and clicking the button next to the box.

If you want to add more pictures to the product, you simply use the default file selector button.

All remaining files in the select + the new images chosen will be used for the product's pictures.

## Some other notes

I used node.js because I didn't know how to run a server normally. I practiced a little before
with node.js so I gave it a shot. I ended up doing a lot of research about node.js.

I believe I could've just used an apache server. But, whenever I ran my php, it kept downloading the php so I just stuck with node.js

I ended up using bootstrap and JQuery so that I could use their carousel functionality.
I didn't really use them for anything else.
