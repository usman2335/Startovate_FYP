/**
 * Export utilities for generating Word documents from templates
 */

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;

import {
  Document,
  Packer,
  Paragraph,
  ImageRun,
  AlignmentType,
  TextRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
  BorderStyle,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import axios from "axios";

/**
 * Get template descriptions for Word document
 */
export const getTemplateDescription = (templateKey) => {
  const descriptions = {
    "ProblemIdentification-Step1":
      "Identify the core problem or unmet need that your invention addresses.",
    "ProblemIdentification-Step2":
      "Analyze the problem from different perspectives and stakeholders.",
    "ProblemIdentification-Step3":
      "Define the scope and boundaries of the problem.",
    "ProblemIdentification-Step5":
      "Evaluate the severity and impact of the problem.",
    "ProblemIdentification-Step6":
      "Identify root causes and contributing factors.",
    "ProblemIdentification-Step7":
      "Assess current solutions and their limitations.",
    "ProblemIdentification-Step8":
      "Validate the problem through research and evidence.",

    "LiteratureSearch-Step1":
      "Conduct comprehensive literature review on the problem domain.",
    "LiteratureSearch-Step2":
      "Identify key researchers and publications in the field.",
    "LiteratureSearch-Step3":
      "Analyze existing solutions and their effectiveness.",
    "LiteratureSearch-Step4": "Identify research gaps and opportunities.",
    "LiteratureSearch-Step5": "Document findings and insights from literature.",

    "ExistingSolutions-Step1": "Catalog existing solutions in the market.",
    "ExistingSolutions-Step2":
      "Analyze strengths and weaknesses of current solutions.",
    "ExistingSolutions-Step3": "Identify market leaders and their approaches.",
    "ExistingSolutions-Step4":
      "Evaluate user satisfaction with existing solutions.",
    "ExistingSolutions-Step5":
      "Assess technical limitations of current solutions.",
    "ExistingSolutions-Step6": "Document competitive landscape analysis.",

    "MarketLandscape-Step1": "Analyze target market size and characteristics.",
    "MarketLandscape-Step2":
      "Identify key market segments and customer personas.",
    "MarketLandscape-Step3": "Assess market trends and growth potential.",
    "MarketLandscape-Step4":
      "Evaluate market entry barriers and opportunities.",
    "MarketLandscape-Step5": "Analyze competitive positioning strategies.",
    "MarketLandscape-Step7": "Document market research findings and insights.",

    "Novelty-Step1": "Define the novel aspects of your invention.",
    "Novelty-Step2": "Compare your solution with existing alternatives.",
    "Novelty-Step3": "Identify unique value propositions and differentiators.",

    "ResearchQuestion-Step1": "Formulate primary research questions.",
    "ResearchQuestion-Step2": "Define secondary research objectives.",
    "ResearchQuestion-Step3": "Establish research hypotheses and assumptions.",
    "ResearchQuestion-Step4": "Identify key research variables and metrics.",
    "ResearchQuestion-Step5": "Develop research methodology framework.",
    "ResearchQuestion-Step6":
      "Validate research questions through expert review.",

    "ResearchOutcome-Step1":
      "Define expected research outcomes and deliverables.",
    "ResearchOutcome-Step3": "Identify potential applications and use cases.",
    "ResearchOutcome-Step4":
      "Assess commercial viability and market potential.",
    "ResearchOutcome-Step5": "Document expected impact and benefits.",

    "ResearchMethodology-Step2": "Design research methodology and approach.",
    "ResearchMethodology-Step4": "Plan data collection and analysis methods.",
    "ResearchMethodology-Step6": "Establish validation and testing protocols.",

    "KeyResources-Step2": "Identify required resources and capabilities.",
    "KeyResources-Step4": "Assess resource availability and constraints.",

    "TeamCapacities-Step1": "Evaluate team skills and expertise.",
    "TeamCapacities-Step2": "Identify skill gaps and development needs.",
    "TeamCapacities-Step5": "Assess team capacity and workload distribution.",
    "TeamCapacities-Step6": "Plan team development and training initiatives.",
  };

  return (
    descriptions[templateKey] ||
    "Template for documenting key information and insights."
  );
};

/**
 * Format template key for display
 */
export const formatTemplateKey = (templateKey) => {
  const [component, step] = templateKey.split("-");
  const formattedComponent = component
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());
  return `${formattedComponent} - ${step}`;
};

/**
 * Fetch template data from backend
 */
export const fetchTemplateData = async (canvasId, templateKey) => {
  const res = await axios.get(
    `${BACKEND_BASE_URL}/api/template/get-template/${canvasId}/${templateKey}`
  );
  if (res.data.success) {
    return res.data.template;
  }
  throw new Error("Template not found");
};

/**
 * Capture template as image using html2canvas
 */
export const captureTemplateAsImage = async (element, options = {}) => {
  const defaultOptions = {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  };

  const canvas = await html2canvas(element, { ...defaultOptions, ...options });
  const dataUrl = canvas.toDataURL("image/png");
  const blob = await (await fetch(dataUrl)).blob();
  const buffer = await blob.arrayBuffer();

  return { canvas, buffer };
};

/**
 * Create styled table for Word document with visible borders
 */
export const createStyledTable = (data) => {
  // Define consistent border style
  const borderStyle = {
    style: BorderStyle.SINGLE,
    size: 1,
    color: "000000",
  };

  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Field",
                  bold: true,
                  size: 22,
                  font: "Calibri",
                }),
              ],
            }),
          ],
          margins: { top: 200, bottom: 200, left: 200, right: 200 },
          borders: {
            top: borderStyle,
            bottom: borderStyle,
            left: borderStyle,
            right: borderStyle,
          },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Value",
                  bold: true,
                  size: 22,
                  font: "Calibri",
                }),
              ],
            }),
          ],
          margins: { top: 200, bottom: 200, left: 200, right: 200 },
          borders: {
            top: borderStyle,
            bottom: borderStyle,
            left: borderStyle,
            right: borderStyle,
          },
        }),
      ],
    }),
  ];

  // Add data rows
  Object.entries(data).forEach(([key, value]) => {
    const formattedKey = key
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formattedKey,
                    size: 20,
                    font: "Calibri",
                  }),
                ],
              }),
            ],
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: value || "[Not filled]",
                    size: 20,
                    font: "Calibri",
                  }),
                ],
              }),
            ],
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
            },
          }),
        ],
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: borderStyle,
      bottom: borderStyle,
      left: borderStyle,
      right: borderStyle,
      insideHorizontal: borderStyle,
      insideVertical: borderStyle,
    },
    rows: tableRows,
  });
};

/**
 * Calculate image dimensions to fit A4 page
 */
export const calculateImageDimensions = (
  canvas,
  maxWidth = 500,
  maxHeight = 600
) => {
  let imageWidth = canvas.width * 0.75; // Convert px to points
  let imageHeight = canvas.height * 0.75;

  // Scale down if too large
  const widthRatio = maxWidth / imageWidth;
  const heightRatio = maxHeight / imageHeight;
  const scaleRatio = Math.min(widthRatio, heightRatio, 1);

  imageWidth *= scaleRatio;
  imageHeight *= scaleRatio;

  return {
    width: Math.floor(imageWidth),
    height: Math.floor(imageHeight),
  };
};

/**
 * Generate Word document from templates
 */
export const generateWordDocument = async ({
  templateKeys,
  templateMapping,
  canvasId,
  researchTitle,
  authorName,
  captureRef,
  setCurrentTemplateIndex,
}) => {
  const docChildren = [];

  // Add document title
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Lean Canvas Invention - Complete Template Report",
          bold: true,
          size: 32,
          font: "Calibri",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Add metadata
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Research Title: ${researchTitle}`,
          size: 24,
          font: "Calibri",
        }),
      ],
      spacing: { after: 200 },
    })
  );

  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Author: ${authorName}`,
          size: 24,
          font: "Calibri",
        }),
      ],
      spacing: { after: 200 },
    })
  );

  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated on: ${new Date().toLocaleDateString()}`,
          size: 24,
          font: "Calibri",
        }),
      ],
      spacing: { after: 400 },
    })
  );

  // Process each template
  for (let i = 0; i < templateKeys.length; i++) {
    const templateKey = templateKeys[i];
    const templateConfig = templateMapping[templateKey];

    console.log(
      `Processing template ${i + 1}/${templateKeys.length}: ${templateKey}`
    );

    // Add page break before each template (except the first)
    if (i > 0) {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: "" })],
          pageBreakBefore: true,
        })
      );
    }

    // Add template heading
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formatTemplateKey(templateKey),
            bold: true,
            size: 28,
            font: "Calibri",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      })
    );

    // Add template description
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: getTemplateDescription(templateKey),
            size: 24,
            font: "Calibri",
          }),
        ],
        spacing: { after: 300 },
      })
    );

    // Special handling for Problem Identification - Step 6: prefer table; otherwise smaller image
    const isProblemStep6 = templateKey === "ProblemIdentification-Step6";

    if (templateConfig.renderAs === "image") {
      if (isProblemStep6) {
        try {
          const templateData = await fetchTemplateData(canvasId, templateKey);
          if (
            templateData &&
            templateData.content &&
            Object.keys(templateData.content).length > 0
          ) {
            docChildren.push(createStyledTable(templateData.content));
            docChildren.push(
              new Paragraph({
                children: [new TextRun({ text: "" })],
                spacing: { after: 300 },
              })
            );
            // Skip image render for this template since table rendered
            continue;
          }
        } catch (_) {
          // fall back to image render below
        }
      }
      // Capture template as image
      setCurrentTemplateIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for render

      const captureElement = captureRef.current;
      if (captureElement) {
        try {
          const { canvas, buffer } = await captureTemplateAsImage(
            captureElement
          );
          const dimensions = isProblemStep6
            ? calculateImageDimensions(canvas, 420, 450)
            : calculateImageDimensions(canvas);

          docChildren.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: buffer,
                  transformation: dimensions,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            })
          );
        } catch (error) {
          console.error(`Error capturing template ${templateKey}:`, error);
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `[Error capturing template image]`,
                  italics: true,
                  color: "FF0000",
                }),
              ],
              spacing: { after: 200 },
            })
          );
        }
      }
    } else if (templateConfig.renderAs === "table") {
      // Generate table from template data
      try {
        const templateData = await fetchTemplateData(canvasId, templateKey);
        const { content } = templateData;

        if (content && Object.keys(content).length > 0) {
          docChildren.push(createStyledTable(content));
        } else {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "[No data available for this template]",
                  italics: true,
                  color: "666666",
                }),
              ],
              spacing: { after: 200 },
            })
          );
        }
      } catch (error) {
        console.error(
          `Error fetching template data for ${templateKey}:`,
          error
        );
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "[Template data not available]",
                italics: true,
                color: "FF0000",
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }
    }

    // Add spacing after each template
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: "" })],
        spacing: { after: 400 },
      })
    );
  }

  // Create and return the document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  return doc;
};

/**
 * Export Word document
 */
export const exportWordDocument = async (doc, fileName) => {
  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
};
