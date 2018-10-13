var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  }
});

var Article = mongoose.model("Article", CommentSchema);

module.exports = Article;