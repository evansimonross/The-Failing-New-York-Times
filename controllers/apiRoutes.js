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

  app.post("/api/users", function (req, res) {
    db.User.create(req.body)
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  })

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
      .populate("comments")
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

}