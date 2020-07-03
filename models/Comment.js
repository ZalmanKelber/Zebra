const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  content: String,
  contentDisplay: String,
  postId: String,
  userId: String,
  likedIds: [String],
  datePublished: Date,
  lastEdited: Date
});

mongoose.model("comments", commentSchema);
