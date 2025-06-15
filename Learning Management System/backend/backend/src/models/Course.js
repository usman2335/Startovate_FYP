const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["youtube", "drive"], required: true },
  url: { type: String, required: true },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  instructorName: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  videos: [videoSchema],
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
