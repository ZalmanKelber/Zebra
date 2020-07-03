const mongoose = require("mongoose");

const Comment = mongoose.model("comments");
const User = mongoose.model("users");
const Post = mongoose.model("posts");
const requireLogin = require("../middlewares/requireLogin");
const getContentDisplay = require("../services/getContentDisplay");

module.exports = app => {
  app.get(
    "/comments/:postId",
    (req, res) => {
      Post.findById(req.params.postId, async (err, post) => {
        if (post) {
          const commentObjects = await Promise.all(post.commentIds.map(async id => {
            const comment = await Comment.findById(id);
            const user = await User.findById(comment.userId);
            return ({ comment, user });
          }));
          return res.send(commentObjects.reverse());
        }
      });
    });

  app.post(
    "/comments/update/:commentId",
    requireLogin,
    (req, res) => {
      Comment.findById(req.params.commentId, async (err, comment) => {
        if (String(comment.userId) === String(req.user._id)) {
          const rawContent = req.body.content.replace(/<\/?p>/g, "").trim();
          comment.content = rawContent;
          const editedContent = await getContentDisplay(rawContent);
          comment.contentDisplay = editedContent;
          comment.lastEdited = new Date();
          comment.save((err, savedComment) => {
            res.redirect("/comments/" + savedComment.postId);
          });
        }
      });
    });

  app.post(
    "/comments/toggle_like/:commentId",
    requireLogin,
    (req, res) => {
      Comment.findById(req.params.commentId, async (err, comment) => {
        if (comment.likedIds.includes(String(req.user._id))) {
          comment.likedIds = comment.likedIds.filter(id => id !== String(req.user._id));
        }
        else {
          comment.likedIds.push(String(req.user._id));
        }
        comment.save((err, savedComment) => {
          res.redirect("/comments/" + savedComment.postId);
        });
      });
    });

  app.post(
    "/comments/delete/:commentId",
    requireLogin,
    (req, res) => {
      Comment.findById(req.params.commentId, async (err, comment) => {
        if (String(comment.userId) === String(req.user._id)) {
          Post.findById(comment.postId, async (err, post) => {
            if (post.commentIds.includes(req.params.commentId)) {
              post.commentIds = post.commentIds.filter(id => id !== req.params.commentId);
              post.save().then(() => {
                Comment.findByIdAndDelete(req.params.commentId).then(() => {
                  return res.redirect("/comments/" + comment.postId);
                });
              });
            }
          });
        }
      });
    });

  app.post(
    "/comments/create/:postId",
    requireLogin,
    (req, res) => {
      Post.findById(req.params.postId, async (err, post) => {
          const newComment = new Comment();
          const rawContent = req.body.content.replace(/<\/?p>/g, "").trim();
          newComment.content = rawContent;
          const editedContent = await getContentDisplay(rawContent);
          newComment.contentDisplay = editedContent;
          newComment.userId = req.user._id;
          newComment.postId = req.params.postId;
          newComment.datePublished = new Date();
          newComment.save((err, savedComment) => {
            if (err) {
              console.log(err);
              return res.send("");
            }
            post.commentIds = [ ...post.commentIds, savedComment._id];
            post.save(err => {
              if (err) {
                console.log(err);
                return res.send("");
              }
              console.log("about to redirect");
              return res.redirect("/comments/" + req.params.postId);
            });
          });
        });
    });
}
