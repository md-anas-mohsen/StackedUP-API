const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { boolean } = require("joi");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [25, "Name cannot exceed 25 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be longer than 6 characters"],
    select: false,
  },
  reAuthenticate: {
    type: boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_AUTH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_AUTH_TOKEN_EXPIRES_TIME,
  });
};

userSchema.methods.getJwtRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME,
  });
};

module.exports = mongoose.model("User", userSchema);
