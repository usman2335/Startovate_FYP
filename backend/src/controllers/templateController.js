const Template = require("../models/Template");
exports.startTemplate = async (req, res) => {
  try {
    const { canvasId, templateId, componentName, checklistStep } = req.body;

    let template = await Template.findOne({ canvasId, templateId });
    if (!template) {
      template = new Template({
        templateId,
        canvasId,
        componentName,
        checklistStep,
        content: {},
        completed: false,
      });
      await template.save();
    }
    return res.status(200).json({ success: true, template });
  } catch (error) {
    console.error("Error starting template:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.saveTemplate = async (req, res) => {
  try {
    const { canvasId, templateId, answers } = req.body;
    let template = await Template.findOne({ canvasId, templateId });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    template.content = { ...template.content, ...answers };
    await template.save();
    console.log(template.content);
    return res
      .status(200)
      .json({ success: true, message: "Answers saved successfully", template });
  } catch (error) {}
};

exports.getTemplate = async (req, res) => {
  try {
    const { canvasId, templateId } = req.params;
    const template = await Template.findOne({ canvasId, templateId });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    return res.status(200).json({ success: true, template });
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
