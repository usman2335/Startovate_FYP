const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, AlignmentType } = docx;
const Template = require("../models/Template");

exports.exportToDocx = async (req, res) => {
  console.log("Exporting DOCX...");

  try {
    const { canvasId } = req.params;
    const templates = await Template.find({ canvasId }).lean();

    // Sort templates
    const sortedTemplates = templates.sort((a, b) => {
      if (a.componentName !== b.componentName) {
        return a.componentName.localeCompare(b.componentName);
      }
      return Number(a.checklistStep) - Number(b.checklistStep);
    });

    // Initialize sections with title and blank space
    const sectionChildren = [
      new Paragraph({
        children: [
          new TextRun({
            text: "Lean Canvas Export",
            size: 32,
            bold: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ children: [new TextRun({ text: " " })] }),
    ];

    // Add content for each template to the section
    sortedTemplates.forEach((template) => {
      // Heading for each step
      sectionChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${template.componentName} (Step ${template.checklistStep})`,
              bold: true,
              size: 24,
            }),
          ],
        })
      );

      // Format and display each key-value pair in template.content
      if (template.content && typeof template.content === "object") {
        Object.entries(template.content).forEach(([key, value]) => {
          const label = key
            .replace(/_/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to spaced
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize

          sectionChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${label}: ${value}`,
                  size: 20,
                }),
              ],
            })
          );
        });
      }

      // Add a blank line after each template
      sectionChildren.push(new Paragraph({ children: [new TextRun(" ")] }));
    });

    // Create the DOCX document
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
