// var http = require("http");
var fs = require("fs");
var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  fs.readFile("index.html", function (err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("404 Not Found");
    } else {
      //   Go with the normal execution
      res.writeHead(200, { "Content-Type": "text/html" });

      res.write(data);
      res.end();
    }
  });

  // res.send("Hello World!");
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Express app listening at http://%s:%s", host, port);
});
