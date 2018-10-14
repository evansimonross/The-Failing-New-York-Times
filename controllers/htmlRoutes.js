var db = require("../models");

module.exports = function (app) {
  app.get("/", function(req, res){
    db.Article.find({}, null, {
      limit: 25, 
      sort: {
        updated: -1
      }
    })
      .then(function(data){
        if(!data.length){
          return res.render("404", {
            text: "There are no articles to display."
          });
        }
        var toRender = { articles: data };
        if(data.length === 25) { toRender.nextPage = 2; }
        res.render("index", toRender);
      });
  });

  app.get("/articles/:page", function(req, res){
    db.Article.find({}, null, {
      limit: 25, 
      skip: 25 * (parseInt(req.params.page)-1),
      sort: {
        updated: -1
      }
    })
    .then(function(data){
      if(!data.length){
        return res.render("404", {
          text: "There are no articles to display."
        });
      }
      var toRender = { articles: data };
      if(data.length === 25) { toRender.nextPage = (parseInt(req.params.page)+1); }
      res.render("index", toRender);
    });
  });
}