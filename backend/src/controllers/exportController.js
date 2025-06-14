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

exports.exportToDocx = async (req, res) => {
  console.log("Exporting DOCX with styled tables...");

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

    // Define fixed component order
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

    const sectionChildren = [
      new Paragraph({
        children: [
          new TextRun({ text: "Lean Canvas Export", size: 32, bold: true }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ children: [new TextRun(" ")] }),
    ];

    for (const componentName of componentOrder) {
      const templatesForComponent = groupedTemplates[componentName];
      if (!templatesForComponent) continue;

      sectionChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: componentName, bold: true, size: 26 }),
          ],
        })
      );

      for (const template of templatesForComponent) {
        const stepDescription = descriptions.find(
          (desc) =>
            desc.componentName === template.componentName &&
            desc.stepNumber === Number(template.checklistStep)
        );

        sectionChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Step ${template.checklistStep}: ${
                  stepDescription ? stepDescription.description : ""
                }`,
                italics: true,
                size: 22,
              }),
            ],
          })
        );

        // Prepare table rows
        const tableRows = [["Label", "Answer"]];
        if (template.content && typeof template.content === "object") {
          Object.entries(template.content).forEach(([key, value]) => {
            const label = key
              .replace(/_/g, " ")
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .replace(/\b\w/g, (char) => char.toUpperCase());
            tableRows.push([label, value]);
          });
        }

        sectionChildren.push(createStyledTable(tableRows));
        sectionChildren.push(new Paragraph({ children: [new TextRun(" ")] }));
      }
    }

    const doc = new Document({
      creator: "Startovate App",
      title: "Lean Canvas Export",
      sections: [
        {
          properties: {},
          children: sectionChildren,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=LeanCanvasExport.docx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error exporting DOCX:", error);
    res.status(500).json({ error: "Error exporting DOCX." });
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
