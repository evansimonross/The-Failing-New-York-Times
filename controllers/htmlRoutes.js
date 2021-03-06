var db = require("../models");

const LIMIT = 6;

function renderArticleList(req, res, data, nextPage) {
  var toRender = {};
  toRender.loggedIn = false;
  try {
    if (req.session.userId) {
      toRender.loggedIn = true;
    }
  }
  catch (err) {
  }
  finally {
    if (!data.length) {
      return res.render("404", {
        text: "There are no articles to display.",
        loggedIn: toRender.loggedIn
      });
    }
    for (var i = 0; i < data.length; i++) {
      var sad = 0, fake = 0, boring = 0;
      for (var j = 0; j < data[i].votes.length; j++) {
        if (data[i].votes[j].text === "sad") {
          sad++;
        }
        else if (data[i].votes[j].text === "fake") {
          fake++;
        }
        else if (data[i].votes[j].text === "boring") {
          boring++;
        }
        if (toRender.loggedIn) {
          if (data[i].votes[j].user == req.session.userId) {
            data[i].userVote = data[i].votes[j].text;
          }
        }
      }
      data[i].sad = { count: sad, highlighted: false };
      data[i].fake = { count: fake, highlighted: false };
      data[i].boring = { count: boring, highlighted: false };
      switch (data[i].userVote) {
        case "sad": data[i].sad.highlighted = true; break;
        case "fake": data[i].fake.highlighted = true; break;
        case "boring": data[i].boring.highlighted = true; break;
      }
    }
    if (data.length === LIMIT) { toRender.nextPage = nextPage; }
    if (nextPage > 2) { toRender.prevPage = nextPage - 2; }
    toRender.articles = data;
    //console.log(toRender.articles[0].userVote);
    res.render("index", toRender);
  }
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
      .then(function (data) {
        renderArticleList(req, res, data, 2);
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
      .then(function (data) {
        renderArticleList(req, res, data, (parseInt(req.params.page) + 1));
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
        data.loggedIn = false;
        var userVote = null;
        try {
          if (req.session.userId) {
            data.loggedIn = true;
          }
        }
        catch (err) {
        }
        var sad = 0, fake = 0, boring = 0;
        for (var j = 0; j < data.votes.length; j++) {
          if (data.votes[j].text === "sad") {
            sad++;
          }
          else if (data.votes[j].text === "fake") {
            fake++;
          }
          else if (data.votes[j].text === "boring") {
            boring++;
          }
          if (data.loggedIn && !data.userVote) {
            console.log("checking votes");
            console.log(typeof data.votes[j].user);
            console.log(typeof req.session.userId);
            if (data.votes[j].user.toString() === req.session.userId) {
              data.userVote = data.votes[j].text;
              console.log("YOU VOTED " + data.userVote);
            }
          }
        }

        data.sad = { count: sad, highlighted: false };
        data.fake = { count: fake, highlighted: false };
        data.boring = { count: boring, highlighted: false };
        switch (data.userVote) {
          case "sad": data.sad.highlighted = true; break;
          case "fake": data.fake.highlighted = true; break;
          case "boring": data.boring.highlighted = true; break;
        }
        res.render("article", data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get("/login", function (req, res) {
    try {
      if (req.session.userId) { return res.render("404", { text: "You're already logged in.", loggedIn: true }); }
    }
    catch (err) {
      console.log("Session could not be read");
    }
    return res.render("login", { signup: false });
  });

  app.get("/signup", function (req, res) {
    try {
      if (req.session.userId) { return res.render("404", { text: "You're already logged in.", loggedIn: true }); }
    }
    catch (err) {
      console.log("Session could not be read");
    }
    return res.render("login", { signup: true });
  });

  app.get('/logout', function (req, res) {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          return res.json(err);
        } else {
          return res.json({ success: true });
        }
      });
    }
  });

  app.get("/user/:id", function (req, res) {
    db.User.findOne({ _id: req.params.id })
      .populate({
        path: 'comments',
        options: {
          sort: { 'created': -1 }
        }
      })
      .then(function (data) {
        console.log(data);
        var user = {};
        user.name = data.name;
        user.comments = data.comments;
        user.self = false;
        user.loggedIn = false;
        try {
          if (req.session.userId === req.params.id) {
            user.self = true;
          }
          if (req.session.userId) {
            user.loggedIn = true;
          }
        }
        catch (err) {
        }
        res.render("user", user);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get("/user", function (req, res) {
    try {
      if (req.session.userId) {
        db.User.findOne({ _id: req.session.userId })
          .populate({
            path: 'comments',
            options: {
              sort: { 'created': -1 }
            }
          })
          .then(function (data) {
            console.log(data);
            var user = {};
            user.name = data.name;
            user.comments = data.comments;
            user.self = true;
            user.loggedIn = true;
            res.render("user", user);
          })
          .catch(function (err) {
            res.json(err);
          });
      }
    }
    catch (err) {
      return res.render("404", { text: "You aren't logged in!", loggedIn: false });
    }
  });

  app.get("/about", function (req, res) {
    try {
      if (req.session.userId) { return res.render("about", { loggedIn: true }); }
    }
    catch (err) {
    }
    return res.render("about", { loggedIn: false });
  })

  app.get("*", function (req, res){
    var loggedIn = false;
    try {
      if (req.session.userId) { loggedIn = true; }
    }
    catch (err) {
    }
    return res.render("404", { text: "The page you are looking for never even happened.", loggedIn: loggedIn });
  })
}