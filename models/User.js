const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  verified: {
    type: Boolean,
    default: false
  },
  email: String,
  password: String,
  followers: [{
    type: String
  }],
  following: [{
    type: String
  }],
  name: {
    type: String,
    default: "[add username]"
  },
  joined: Date,
  bio: {
    type: String,
    default: "[add bio]"
  },
  bioDisplay: {
    type: String,
    default: "[add bio]"
  },
  location: {
    type: String,
    default: "[add location]"
  },
  photo: String,
  postIds: [String]
});

userSchema.methods.generateHash = function(password) {
    console.log("password used in generateHash:", password);
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.authenticate = function(password) {
    return bcrypt.compareSync(password, this.password);
};

mongoose.model("users", userSchema);
