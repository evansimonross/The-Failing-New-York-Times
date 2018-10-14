var db = require("../models");

const LIMIT = 5;

function renderArticleList(res, data, nextPage) {
  if (!data.length) {
    return res.render("404", {
      text: "There are no articles to display."
    });
  }
  var toRender = { articles: data };
  for(var i = 0; i < data.length; i++){
    var sad = 0, fake = 0, boring = 0;
    for(var j = 0 ; j < data[i].votes.length; j++){
      if(data[i].votes[j].text === "sad"){
        sad++;
      }
      else if(data[i].votes[j].text === "fake"){
        fake++;
      }
      else if(data[i].votes[j].text === "boring"){
        boring++;
      }
    }
    data[i].sad = sad;
    data[i].fake = fake;
    data[i].boring = boring;
  }
  if (data.length === LIMIT) { toRender.nextPage = nextPage; }
  if (nextPage > 2) { toRender.prevPage = nextPage-2; }
  res.render("index", toRender);
}

module.exports = function (app) {
  app.get("/", function (req, res) {
    db.Article.find({}, null, {
      limit: LIMIT,
      sort: {
        updated: -1
      }
    })
      .populate("votes")
      .then(function(data){
        renderArticleList(res, data, 2);
      });
  });

  app.get("/articles/page/:page", function (req, res) {
    db.Article.find({}, null, {
      limit: LIMIT,
      skip: LIMIT * (parseInt(req.params.page) - 1),
      sort: {
        updated: -1
      }
    })
      .populate("votes")
      .then(function(data){
        renderArticleList(res, data, (parseInt(req.params.page) + 1));
      });
  });

  app.get("/articles/:id", function (req, res) {
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
        var sad = 0, fake = 0, boring = 0;
        for(var j = 0 ; j < data.votes.length; j++){
          if(data.votes[j].text === "sad"){
            sad++;
          }
          else if(data.votes[j].text === "fake"){
            fake++;
          }
          else if(data.votes[j].text === "boring"){
            boring++;
          }
        }
        data.sad = sad;
        data.fake = fake;
        data.boring = boring;
        res.render("article", data);
      });
  });
}