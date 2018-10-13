var db = require("./models");

module.exports = function(app){

  // USER ROUTES
  app.get("/api/users", function(req, res){
    db.User.find({})
      .then(function(data){
        res.json(data);
      })
      .catch(function(err){
        res.err(err);
      });
  });

  app.get("/api/users/:id", function(req, res){
    db.User.findOne({_id:req.params.id})
      .populate("comments")
      .then(function(data){
        res.json(data);
      })
      .catch(function(err){
        res.err(err);
      })
  });

  // ARTICLE ROUTES
  app.get("/api/articles", function(req, res){
    db.Article.find({})
      .then(function(data){
        res.json(data);
      })
      .catch(function(err){
        res.err(err);
      });
  });

  app.get("/api/articles/:id", function(req, res){
    db.Article.findOne({_id:req.params.id})
      .populate("comments")
      .then(function(data){
        res.json(data);
      })
      .catch(function(err){
        res.err(err);
      });
  });

}