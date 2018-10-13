require("dotenv").config();
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var app = express();
var PORT = process.env.PORT || 8080;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

mongoose.connect(MONGODB_URI, { userNewUrlParser: true});

require("./controllers/apiRoutes")(app);
require("./controllers/htmlRoutes")(app);

app.listen(PORT, function() {
  console.log("Listening on PORT " + PORT);
})

module.exports = app;
