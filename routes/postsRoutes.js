const mongoose = require("mongoose");

const User = mongoose.model("users");
const Post = mongoose.model("posts");
const requireLogin = require("../middlewares/requireLogin");
const getContentDisplay = require("../services/getContentDisplay");

module.exports = app => {
  app.get(
    "/posts/:id",
    (req, res) => {
      User.findById(req.params.id, async (err, user) => {
        if (user) {
          posts = await Post.find().where("_id").in(user.postIds).exec()
          return res.send(posts.reverse());
        }
      });
    });

  app.patch(
    "/posts/update/:postId",
    requireLogin,
    (req, res) => {
      Post.findById(req.params.postId, async (err, post) => {
        if (String(post._user._id) === String(req.user._id)) {
          const rawContent = req.body.content.replace(/<\/?p>/g, "").trim();
          post.content = rawContent;
          const editedContent = await getContentDisplay(rawContent);
          post.contentDisplay = editedContent;
          post.lastEdited = new Date();
          post.save((err, savedPost) => {
            res.send(savedPost);
          });
        }
      });
    });

  app.patch(
    "/posts/toggle_like/:postId",
    requireLogin,
    (req, res) => {
      Post.findById(req.params.postId, async (err, post) => {
        if (post.likedIds.includes(String(req.user._id))) {
          post.likedIds = post.likedIds.filter(id => id !== String(req.user._id));
        }
        else {
          post.likedIds.push(String(req.user._id));
        }
        post.save((err, savedPost) => {
          res.send(savedPost);
        });
      });
    });

  app.delete(
    "/posts/delete/:postId",
    requireLogin,
    (req, res) => {
      Post.findById(req.params.postId, async (err, post) => {
        if (String(post._user._id) === String(req.user._id)) {
          User.findById(req.user._id, async (err, user) => {
            if (user.postIds.includes(req.params.postId)) {
              user.postIds = user.postIds.filter(id => id !== req.params.postId);
              user.save().then(() => {
                Post.findByIdAndDelete(req.params.postId).then(() => {
                  return res.sendStatus(200);
                });
              });
            }
          });
        }
      });
    });

  app.post(
    "/posts/create/:id",
    requireLogin,
    (req, res) => {
      User.findById(req.params.id, async (err, user) => {
        if (user && String(user._id) === String(req.user._id)) {
          const newPost = new Post();
          const rawContent = req.body.content.replace(/<\/?p>/g, "").trim();
          newPost.content = rawContent;
          const editedContent = await getContentDisplay(rawContent);
          newPost.contentDisplay = editedContent;
          newPost._user = user;
          newPost.datePublished = new Date();
          newPost.save((err, savedPost) => {
            if (err) {
              console.log(err);
              return res.send("");
            }
            user.postIds = [ ...user.postIds, savedPost._id];
            user.save(err => {
              if (err) {
                console.log(err);
                return res.send("");
              }
              return res.send(savedPost);
            });
          });
        }
        else {
          return res.send("");
        }
      });
    });
}
