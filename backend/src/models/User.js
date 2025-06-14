const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //   role: { type: String, required: true },
  //   hasCanvas: { type: Boolean, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  canvasId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Canvas",
    default: null,
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
