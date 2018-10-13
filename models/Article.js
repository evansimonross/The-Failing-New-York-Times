var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  sad: {
    type: Number,
    default: 0
  },
  fake: {
    type: Number,
    default: 0
  },
  boring: {
    type: Number,
    default: 0
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;