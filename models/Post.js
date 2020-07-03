const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  content: String,
  contentDisplay: String,
  _user: {type: Schema.Types.ObjectId, ref: "User"},
  datePublished: Date,
  lastEdited: Date,
  likedIds: [String],
  commentIds: [String]
});

mongoose.model("posts", postSchema);
