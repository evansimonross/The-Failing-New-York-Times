var db = require("../models");

module.exports = function (app) {
  app.get("/", function(req, res){
    db.Article.find({})
      .then(function(data){
        if(!data){
          return res.render("404", {
            text: "There are no articles yet."
          });
        }
        res.render("index", {
          articles: data
        })
      })
  });
}