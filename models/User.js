const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "user",
    },
    screenName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    loginCount: { type: Number, default: 0 },
    googleId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
