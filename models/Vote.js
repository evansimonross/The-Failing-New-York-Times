var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VoteSchema = new Schema({
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
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

var Vote = mongoose.model("Vote", VoteSchema);

module.exports = Vote;