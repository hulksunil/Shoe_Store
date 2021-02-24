# Shoe Store

This project uses node.js.
It requires express, body-parser, and multer.

#### If you don't have these modules

`npm install express`<br/>
`npm install body-parser`<br/>
`npm install multer`

## How to run

`node server.js`

then go to the following url in the browser:
[http://localhost:8080](http://localhost:8080)

## How it works

All products are loaded from products.json into the table displayed on the screen.

You can create new products by entering the values into the form.

### Edit and Delete

Each product is created with an edit and delete button.

#### Delete

The delete button will remove that product from the table (and the json file).

#### Edit

The edit will place the values into the form so that they can be modified.
After modifying the values and submitting the form, it will delete the entry and place a new one with the updated information at the end of the table.

### Choosing multiple pictures to upload

You can choose multiple pictures to upload.
Click on the button again to restart the selection.
Choose cancel on the dialog to remove any photos that were chosen.

## Some other notes

I decided to put a limit on the amount of pictures that can be uploaded to 3. It just felt like a good number.

##### Actually, now I removed the limit, so remove the above phrase and this phrase.

I used node.js because I didn't know how to run a server normally. I practiced a little before
with node.js so I gave it a shot. I ended up doing a lot of research about node.js.

EDIT: I believe I could've just used an apache server

I ended up using bootstrap so that I could use their carousel functionality. It does require JQuery but I didn't really use it.
