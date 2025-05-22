const { Document, Packer, Paragraph, TextRun, AlignmentType } = require("docx");
const Template = require("../models/Template"); // adjust path as needed

exports.exportToDocx = async (req, res) => {
  console.log("Exporting DOCX...");

  try {
    const { canvasId } = req.params;
    const templates = await Template.find({ canvasId }).lean();

    // Sort templates by componentName and step
    const sortedTemplates = templates.sort((a, b) => {
      if (a.componentName !== b.componentName) {
        return a.componentName.localeCompare(b.componentName);
      }
      return Number(a.checklistStep) - Number(b.checklistStep);
    });

    // Group templates by componentName
    const groupedByComponent = {};
    sortedTemplates.forEach((template) => {
      const { componentName, checklistStep, content } = template;
      if (!groupedByComponent[componentName]) {
        groupedByComponent[componentName] = [];
      }
      groupedByComponent[componentName].push({
        step: checklistStep,
        content,
      });
    });

    // Start building DOCX content
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
        spacing: { after: 300 },
      }),
    ];

    // Loop through grouped components
    for (const [componentName, steps] of Object.entries(groupedByComponent)) {
      // Main heading
      sectionChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: componentName,
              bold: true,
              size: 28,
            }),
          ],
          spacing: { after: 200 },
        })
      );

      // Sort steps within the component
      steps.sort((a, b) => Number(a.step) - Number(b.step));

      steps.forEach(({ step, content }) => {
        // Step heading
        sectionChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Step ${step}`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          })
        );

        // Parse and group content
        if (content && typeof content === "object") {
          const grouped = {};

          Object.entries(content).forEach(([key, value]) => {
            const cleanedKey = key.replace(/_\d+|\d+$/, ""); // remove trailing indexes
            const label = cleanedKey
              .replace(/_/g, " ")
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .replace(/\b\w/g, (char) => char.toUpperCase());

            if (!grouped[label]) grouped[label] = [];
            grouped[label].push(value);
          });

          // Render grouped content
          Object.entries(grouped).forEach(([label, values]) => {
            if (values.length === 1) {
              sectionChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${label}: ${values[0]}`,
                      size: 20,
                    }),
                  ],
                })
              );
            } else {
              sectionChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${label}:`,
                      bold: true,
                      size: 20,
                    }),
                  ],
                })
              );
              values.forEach((val) => {
                sectionChildren.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `- ${val}`,
                        size: 20,
                      }),
                    ],
                  })
                );
              });
            }
          });
        }

        // Space after step
        sectionChildren.push(new Paragraph({ children: [new TextRun(" ")] }));
      });

      // Extra space between components
      sectionChildren.push(new Paragraph({ children: [new TextRun(" ")] }));
    }

    // Finalize the document
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
