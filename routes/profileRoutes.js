const mongoose = require("mongoose");

const User = mongoose.model("users");
const requireLogin = require("../middlewares/requireLogin");
const getContentDisplay = require("../services/getContentDisplay");

module.exports = app => {
  app.get(
    "/user/get/:id",
    async (req, res) => {
      console.log("get user route invoked");
      console.log("searching for user id: ", req.params.id);
      User.findById(req.params.id, (err, user) => {
            res.send(user);
      });
    });

  app.post(
    "/user/list",
    async (req, res) => {
      const { ids } = req.body;
      const userList = await Promise.all(ids.map(async id => {
        const user = await User.findById(id);
        return user;
      }));
      res.send(userList);
    });

  app.get(
    "/user/search/:query",
    async (req, res) => {
      console.log("req.params.query: ", req.params.query);
      const queries = req.params.query.split(/\s/);
      console.log("queries: ", queries);
      const foundUsers = [];
      const queryResults = await Promise.all(queries.map(async query => {
        const re = new RegExp("\\b" + query, "i");
        console.log("re: ", re);
        const users = await User.find({ "name": { $regex: re }});
        return users;
      }));
      queryResults.forEach(results => {
        results.forEach(user => {
          let included = false;
          foundUsers.forEach(foundUser => {
            if (String(foundUser._id) === String(user._id)) {
              included = true;
            }
          })
          if (!included) {
            foundUsers.push(user);
          }
        });
      });
      console.log("foundUsers.length: ", foundUsers.length);
      const matchesAll = [];
      const matchesSome = [];
      foundUsers.forEach(user => {
        let matches = true;
        queries.forEach(query => {
          if (!user.name.match(new RegExp("\\b" + query, "i"))) {
            matches = false
          }
        });
        if (matches) {
          matchesAll.push(user);
        }
        else {
          matchesSome.push(user);
        }
      });
      console.log("matchesAll.length: ", matchesAll.length);
      const sortedUsers = [...matchesAll, ...matchesSome];
      console.log("sortedUsers.length: ", sortedUsers.length);
      res.send(sortedUsers);
    }
  )

  app.post(
    "/user/update_profile/:id",
    requireLogin,
    (req, res) => {
      const { newFields } = req.body;
      User.findById(req.params.id, async (err, user) => {
        const rawContent = newFields.bioContent.replace(/<\/?p>/g, "").trim();
        user.bio = rawContent;
        const editedContent = await getContentDisplay(rawContent);
        user.bioDisplay = editedContent;
        user.photo = newFields.photo;
        user.location = newFields.location;
        user.name = newFields.name;
        await user.save();
        res.send(user);
      });
    });

    app.patch(
      "/user/toggle_follow/:followedId/:followerId",
      requireLogin,
      async (req, res) => {
        const { followerId, followedId } = req.params;
        if (String(followerId) === String(req.user._id)) {
          const follower = await User.findById(followerId);
          const followed = await User.findById(followedId);
          if (follower.following.includes(followedId)) {
            follower.following = follower.following.filter(id => id !== String(followedId));
          }
          else {
            follower.following.push(followedId);
          }
          if (followed.followers.includes(followerId)) {
            followed.followers = followed.followers.filter(id => id !== String(followerId));
          }
          else {
            followed.followers.push(followerId);
          }
          await follower.save();
          await followed.save();
          res.send({ follower, followed});
        }
      });
}
