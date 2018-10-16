var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {

  // SCRAPING
  app.post("/api/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {
      var $ = cheerio.load(response.data);
      $("h2 span").each(function (i, element) {
        var article = {};
        article.title = $(this).text();
        article.link = $(this).closest("a").attr("href");
        db.Article.findOne({ link: article.link })
          .then(function (data) {
            if (data) {
              // The article is already in the DB
            }
            else {
              db.Article.create(article)
                .then(function (data) {
                  console.log(data);
                })
                .catch(function (err) {
                  return res.json(err);
                });
            }
          });
      });
      res.send();
    });
  });

  // USER ROUTES
  app.get("/api/users", function (req, res) {
    db.User.find({})
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get("/api/users/:id", function (req, res) {
    db.User.findOne({ _id: req.params.id })
      .populate("comments")
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
   
  app.get("/api/users/logout", function (req, res){
    if(req.session) {
      req.session.destroy(function (err){
        if(err){
          return res.json(err);
        }
        return res.redirect("/");
      });
    }
  });

  app.post("/api/users", function (req, res) {
    var user = req.body;
    if (!(user.name && user.password)) {
      return res.status("400").send();
    }
    if (user.passwordConfirm) {
      if (user.passwordConfirm != user.password){
        return res.status("400").send("The passwords do not match!");
      }
      db.User.create(user)
        .then(function (data) {
          req.session.userId = data._id;
          res.json(data);
        })
        .catch(function (err) {
          res.json(err);
        });
    }
    else {
      db.User.authenticate(user.name, user.password, function(error, data){
        if(error) {
          return res.json(error);
        }
        try {
          req.session.userId = data._id;
          return res.json({success: true});
        }
        catch(err){
          return res.json(err);
        }
      });
    }
  });

  // ARTICLE ROUTES
  app.get("/api/articles", function (req, res) {
    db.Article.find({})
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get("/api/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("votes")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User"
        }
      })
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // COMMENT ROUTES
  app.get("/api/comments", function (req, res) {
    db.Comment.find({})
      .populate("user")
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get("/api/comments/:id", function (req, res) {
    db.Comment.findOne({ _id: req.params.id })
      .populate("user")
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.post("/api/comments", function (req, res) {
    db.Comment.create({
      text: req.body.text,
      user: req.session.userId,
      article: req.body.article
    })
      .then(function (data) {
        //console.log(data);
        // Add the comment to the user document 
        db.User.updateOne({
          _id: req.session.userId
        },
          {
            $push: { comments: data._id }
          })
          .then(function (updateData) {
          })
          .catch(function (err) {
            res.json(err);
          });

        // Add the comment to the article document
        db.Article.updateOne({
          _id: req.body.article
        },
          {
            $push: { comments: data._id }
          })
          .then(function (updateData) {
          })
          .catch(function (err) {
            res.json(err);
          });

        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // VOTE ROUTES
  app.get("/api/votes", function (req, res) {
    db.Vote.find({})
      .populate("user")
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get("/api/votes/:id", function (req, res) {
    db.Vote.findOne({ _id: req.params.id })
      .populate("user")
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.post("/api/votes", function (req, res) {
    db.Vote.create({
      text: req.body.text,
      article: req.body.article,
      user: req.session.userId
    })
    .then(function (data){
      db.User.updateOne({
        _id: req.session.userId
      },
        {
          $push: { votes: data._id }
        })
        .then(function (updateData) {
        })
        .catch(function (err) {
          res.json(err);
        });

      // Add the comment to the article document
      db.Article.updateOne({
        _id: req.body.article
      },
        {
          $push: { votes: data._id }
        })
        .then(function (updateData) {
        })
        .catch(function (err) {
          res.json(err);
        });

      res.json(data);
    })
    .catch(function (err) {
      res.json(err);
    });
  });
}