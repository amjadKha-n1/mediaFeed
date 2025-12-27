const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, unique: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    profileImage: { type: String, default: "/uploads/profiles/default.png" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
