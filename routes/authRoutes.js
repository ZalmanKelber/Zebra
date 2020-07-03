const passport = require("passport");
const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");
sgMail.setApiKey(keys.sendGridKey);
const mongoose = require("mongoose");

const User = mongoose.model("users");
const verifyEmailTemplate = require("../services/verifyEmailTemplate");
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate(
      "google", {
        scope: ["profile", "email"]
      }));

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/profile/" + req.user._id);
    }
  );

  app.get(
    "/api/current_user",
    (req, res) => {
      if (req.user) {
        res.send(req.user);
      }
      else {
        res.send("");
      }
  });

  app.post(
    "/api/login",
    passport.authenticate("local-login"),
    function(req, res) {
      res.sendStatus(200);
  });

  app.post(
    "/api/signup",
    passport.authenticate("local-signup"),
    async (req, res) => {
      const msg = {
        to: req.body.email,
        from: "AlexKelber@gmail.com",
        subject: "Verify your Zebra account",
        text: "click the following link to verify your account",
        html: verifyEmailTemplate(req.user._id)
      };
      try {
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);
        if (error.response) {
          console.error(error.response.body)
        }
      }
      console.log("email... apparently sent");
      res.sendStatus(200);
  });

  app.post(
    "/api/resend",
    requireLogin,
    async (req, res) => {
      const msg = {
        to: req.user.email,
        from: "AlexKelber@gmail.com",
        subject: "Verify your Zebra account",
        text: "click the following link to verify your account",
        html: verifyEmailTemplate(req.user._id)
      };
      try {
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);
        if (error.response) {
          console.error(error.response.body)
        }
      }
      console.log("email... apparently sent");
      res.sendStatus(200);
  });

  app.get(
    "/api/verify/:code", requireLogin,
    async (req, res) => {
      User.findByIdAndUpdate(req.params.code, { verified: true }, function(err, user) {
          if (err)
              return done(err);
          if (user) {
              res.redirect("/");
          }
      }
    )
});

  app.get(
    "/api/logout",
    (req, res) => {
      req.logOut();
      res.redirect("/");
    }
  );
}
