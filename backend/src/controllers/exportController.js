const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} = require("docx");
const Template = require("../models/Template");
const Description = require("../models/StepDescriptions");
const axios = require("axios");

exports.exportToDocx = async (req, res) => {
  try {
    const { canvasId } = req.params;

    const templates = await Template.find({ canvasId }).lean();
    const descriptions = await Description.find().lean();

    // Sort templates by componentName and checklistStep
    const sortedTemplates = templates.sort((a, b) => {
      if (a.componentName !== b.componentName) {
        return a.componentName.localeCompare(b.componentName);
      }
      return Number(a.checklistStep) - Number(b.checklistStep);
    });

    // Fixed component order
    const componentOrder = [
      "Problem Identification",
      "Literature Search",
      "Existing Solutions",
      "Unique Value Proposition",
      "Customer Segments",
      "Channels",
      "Revenue Streams",
      "Cost Structure",
      "Key Metrics",
      "Unfair Advantage",
    ];

    const groupedTemplates = {};
    sortedTemplates.forEach((template) => {
      if (!groupedTemplates[template.componentName]) {
        groupedTemplates[template.componentName] = [];
      }
      groupedTemplates[template.componentName].push(template);
    });

    // Start HTML string
    let htmlContent = `<h1 style="text-align:center;">Lean Canvas Export</h1>`;

    for (const componentName of componentOrder) {
      const templatesForComponent = groupedTemplates[componentName];
      if (!templatesForComponent) continue;

      htmlContent += `<h2 style="margin-top:30px;">${componentName}</h2>`;

      for (const template of templatesForComponent) {
        const stepDescription = descriptions.find(
          (desc) =>
            desc.componentName === template.componentName &&
            desc.stepNumber === Number(template.checklistStep)
        );

        htmlContent += `
          <p><strong>Step ${template.checklistStep}:</strong> ${
          stepDescription ? stepDescription.description : "No description"
        }</p>
        `;

        // Build HTML table
        if (template.content && typeof template.content === "object") {
          htmlContent += `
            <table border="1" cellpadding="6" cellspacing="0" style="width:100%; border-collapse: collapse; margin-bottom:20px;">
              <tr style="background:#f2f2f2;"><th>Label</th><th>Answer</th></tr>
          `;

          for (const [key, value] of Object.entries(template.content)) {
            const label = key
              .replace(/_/g, " ")
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .replace(/\b\w/g, (char) => char.toUpperCase());

            htmlContent += `<tr><td>${label}</td><td>${value}</td></tr>`;
          }

          htmlContent += `</table>`;
        }
      }
    }

    // Send to Cloudmersive
    const response = await axios.post(
      "https://api.cloudmersive.com/convert/html/to/docx",
      htmlContent,
      {
        headers: {
          "Content-Type": "text/html",
          Apikey: "5a2c3ddc-d9fd-4eb4-b73c-05a9b8529d12", // your actual API key
        },
        responseType: "arraybuffer",
      }
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=LeanCanvas.docx"
    );
    res.send(response.data);
  } catch (error) {
    console.error("DOCX Export Error:", error.message);
    res.status(500).json({ error: "Failed to export DOCX document." });
  }
};
function createStyledTable(rows) {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
    },
    rows: rows.map((row, index) => {
      return new TableRow({
        children: row.map((cellText) => {
          return new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: cellText,
                    bold: index === 0,
                    size: 20,
                  }),
                ],
              }),
            ],
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
          });
        }),
      });
    }),
  });
}
