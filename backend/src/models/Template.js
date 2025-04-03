const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema({
  templateId: { type: String, required: true },
  canvasId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Canvas",
    required: true,
  }, // Links to the user's canvas
  componentName: { type: String, required: true },
  checklistStep: { type: String, required: true },
  content: { type: Object, default: {} }, // Dynamic content storage
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Template", TemplateSchema);
