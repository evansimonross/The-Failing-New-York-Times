require("dotenv").config();
var express = require("express");

var app = express();
var PORT = process.env.PORT || 8080;

var logger = require("morgan");
var bodyParser = require("body-parser");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

require("./controllers/apiRoutes")(app);
require("./controllers/htmlRoutes")(app);

app.listen(PORT, function() {
  console.log("Listening on PORT " + PORT);
})