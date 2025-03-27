const mongoose = require("mongoose");

const CanvasSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  researchTitle: { type: String, required: true },
  authorName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  completionStatus: {
    type: String,
    enum: ["ongoing", "completed"],
    default: "ongoing",
  },
  components: [
    {
      name: String,
      status: {
        type: String,
        enum: ["not started", "ongoing", "completed"],
        default: "not started",
      },
    },
  ],
});

module.exports = mongoose.model("Canvas", CanvasSchema);
