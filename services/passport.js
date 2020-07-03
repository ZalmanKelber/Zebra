const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .catch(err => console.log(err))
    .then(user => done(null, user));
});

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: "/auth/google/callback",
  proxy: true
}, async (accessToken, refreshToken, profile, done) => {
  const foundUser = await User.findOne({
    googleId: profile.id,
  });
  if (foundUser) {
    return done(null, foundUser);
  }
  const newUser = await new User({
    googleId: profile.id,
    verified: true,
    joined: Date.now()
  }).save();
  done(null, newUser);
}));

passport.use("local-login", new LocalStrategy({usernameField: "email"},
  function(email, password, done) {
    User.findOne({ email: email}, function (err, foundUser) {
      if (err) { return done(err); }
      if (!foundUser) { return done(null, false); }
      if (!foundUser.authenticate(password)) {
        return done(null, false);
      }
      return done(null, foundUser);
    });
  }
));

passport.use("local-signup", new LocalStrategy({
      usernameField : "email"
  },
  function(email, password, done) {
      process.nextTick(function() {
      User.findOne({ email:  email }, function(err, user) {
          if (err)
              return done(err);
          if (user) {
              return done(null, false);
          } else {
              const newUser = new User();
              newUser.email = email;
              newUser.password = newUser.generateHash(password);
              newUser.joined = Date.now();
              newUser.save(function(err) {
                  if (err)
                      throw err;
                  return done(null, newUser);
              });
          }
      });
    });
}));
