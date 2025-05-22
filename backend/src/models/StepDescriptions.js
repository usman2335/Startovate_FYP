const mongoose = require("mongoose");

const stepDescriptionSchema = new mongoose.Schema({
  componentName: {
    type: String,
    required: true,
    trim: true,
  },
  stepNumber: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

stepDescriptionSchema.index(
  { componentName: 1, stepNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("StepDescription", stepDescriptionSchema);
