const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, AlignmentType } = docx;
const Template = require("../models/Template");
const StepDescription = require("../models/StepDescriptions"); // Import your descriptions model

exports.exportToDocx = async (req, res) => {
  try {
    const { canvasId } = req.params;

    // Fetch templates and step descriptions
    const templates = await Template.find({ canvasId }).lean();
    const descriptions = await StepDescription.find({}).lean();

    // Create a map for quick lookup of descriptions by componentName-stepNumber
    const descriptionMap = {};
    descriptions.forEach((desc) => {
      const key = `${desc.componentName}-${desc.stepNumber}`;
      descriptionMap[key] = desc.description;
    });

    // Inject descriptions into templates
    templates.forEach((template) => {
      const key = `${template.componentName}-${template.checklistStep}`;
      template.description = descriptionMap[key] || "";
    });

    // Sort templates by componentName and checklistStep
    const sortedTemplates = templates.sort((a, b) => {
      if (a.componentName !== b.componentName) {
        return a.componentName.localeCompare(b.componentName);
      }
      return Number(a.checklistStep) - Number(b.checklistStep);
    });

    // Group templates by componentName
    const groupedByComponent = {};
    sortedTemplates.forEach((template) => {
      if (!groupedByComponent[template.componentName]) {
        groupedByComponent[template.componentName] = [];
      }
      groupedByComponent[template.componentName].push(template);
    });

    // Initialize DOCX sections with title
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

    // For each component, add main heading and all its steps
    for (const [componentName, templates] of Object.entries(
      groupedByComponent
    )) {
      // Add main heading for component
      sectionChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: componentName,
              bold: true,
              size: 28,
            }),
          ],
          spacing: { before: 300, after: 200 },
        })
      );

      // For each step under the component
      templates.forEach((template) => {
        // Step heading with step number
        // Combined Step heading and description
        const stepHeadingText = template.description
          ? `Step ${template.checklistStep}: ${template.description}`
          : `Step ${template.checklistStep}`;

        sectionChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: stepHeadingText,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 200, after: 150 },
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

        // Add a blank line after each step
        sectionChildren.push(new Paragraph({ children: [new TextRun(" ")] }));
      });
    }

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

    // Convert document to buffer and send response
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
