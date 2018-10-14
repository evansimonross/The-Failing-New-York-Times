var db = require("../models");

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
  if (data.length === 25) { toRender.nextPage = nextPage; }
  res.render("index", toRender);
}

module.exports = function (app) {
  app.get("/", function (req, res) {
    db.Article.find({}, null, {
      limit: 25,
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
      limit: 25,
      skip: 25 * (parseInt(req.params.page) - 1),
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
      .then(function (data) {

      })
  })
}