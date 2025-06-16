const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const Canvas = require("../models/Canvas");
const Template = require("../models/Template");
const StepDescription = require("../models/StepDescriptions");

const exportCanvasAsDocx = async (req, res) => {
  try {
    const canvasId = req.params.canvasId;

    // 1. Get Canvas
    const canvas = await Canvas.findById(canvasId);
    if (!canvas) return res.status(404).json({ message: "Canvas not found" });

    // 2. Get Templates for that canvas
    const templates = await Template.find({ canvasId });

    // 3. Group templates by componentName
    const grouped = {};
    for (const template of templates) {
      const component = template.componentName;
      const step = parseInt(template.checklistStep);

      if (!grouped[component]) grouped[component] = {};
      if (!grouped[component][step]) grouped[component][step] = [];

      for (const [q, a] of Object.entries(template.content)) {
        grouped[component][step].push({ q, a });
      }
    }

    // 4. For each component, build data with step descriptions
    const components = [];

    for (const [componentName, stepsMap] of Object.entries(grouped)) {
      const stepDescriptions = await StepDescription.find({ componentName });

      // Build ordered step list
      const steps = stepDescriptions
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map((desc) => ({
          stepNumber: desc.stepNumber,
          description: desc.description,
          questions: stepsMap[desc.stepNumber] || [],
        }));

      components.push({
        name: componentName,
        steps,
      });
    }

    // 5. Final data for docxtemplater
    const data = {
      researchTitle: canvas.researchTitle,
      authorName: canvas.authorName,
      components,
    };

    // 6. Load the Word Template
    const templatePath = path.join(
      __dirname,
      "../templates/canvas_template.docx"
    );
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.setData(data);
    doc.render();

    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    // 7. Send file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=canvas_export.docx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(buffer);
  } catch (err) {
    console.error("Export error:", err);
    res
      .status(500)
      .json({ error: "Failed to export canvas as Word document." });
  }
};

module.exports = { exportCanvasAsDocx };
