const Template = require("../models/Template");
const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun } = require("docx");

// Load template questions
const questionsPath = path.join(
  __dirname,
  "../data/Problem_Identification/template1_questions.json"
);
const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

exports.exportTemplateWord = async (req, res) => {
  const { canvasId, templateId } = req.params;

  try {
    const template = await Template.findOne({ canvasId, templateId });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const answers = template.content;
    const doc = new Document();
    const children = [];

    questionsData.questions.forEach((q, index) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Q${index + 1}: ${q.question}`, bold: true }),
          ],
        }),
        new Paragraph({
          text: `Answer: ${answers[`why_${index}`] || "Not answered"}`,
        }),
        new Paragraph({
          text: `${q.reference}: ${
            answers[`references_${index}`] || "Not provided"
          }`,
        }),
        new Paragraph({ text: "" }) // line break
      );
    });

    doc.addSection({ children });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader("Content-Disposition", "attachment; filename=template.docx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(buffer);
  } catch (err) {
    console.error("Export Error:", err);
    res.status(500).json({ message: "Failed to export document" });
  }
};
