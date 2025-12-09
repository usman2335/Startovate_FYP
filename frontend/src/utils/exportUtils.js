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
    // Hide button groups and other UI elements in the cloned DOM before capture
    onclone: (clonedDoc) => {
      // Hide the button group (Reset, Auto Fill, Save buttons)
      const buttonGroups = clonedDoc.querySelectorAll(".tem-button-group");
      buttonGroups.forEach((group) => {
        if (group && group.style) {
          group.style.display = "none";
        }
      });
      // Also hide any loading indicators or snackbars
      const loadingIndicators = clonedDoc.querySelectorAll(
        '[class*="CircularProgress"]'
      );
      loadingIndicators.forEach((indicator) => {
        if (indicator && indicator.style) {
          indicator.style.display = "none";
        }
      });
    },
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
 * Extract text content from form elements and format as paragraphs
 * Also extracts headings (h2, h3, h4, h5) in order
 */
const extractFormFieldsAsText = (
  element,
  templateData,
  templateConfig = null,
  alreadyProcessedHeadingTexts = new Set() // Headings already extracted at section level
) => {
  const paragraphs = [];
  const processedInputs = new Set(); // Track processed inputs to avoid duplicates
  const processedHeadings = new Set(); // Track processed heading DOM nodes to avoid duplicates
  const processedHeadingTexts = new Set(alreadyProcessedHeadingTexts); // Track processed heading texts to prevent reuse as labels

  // Helper function to get heading level and size
  const getHeadingStyle = (tagName) => {
    switch (tagName) {
      case "H2":
        return { size: 32, bold: true, spacing: { before: 400, after: 300 } };
      case "H3":
        return { size: 28, bold: true, spacing: { before: 300, after: 250 } };
      case "H4":
        return { size: 24, bold: true, spacing: { before: 250, after: 200 } };
      case "H5":
        return { size: 22, bold: true, spacing: { before: 200, after: 150 } };
      default:
        return { size: 20, bold: false, spacing: { before: 200, after: 150 } };
    }
  };

  // Recursive function to walk through DOM tree in order
  const walkElements = (node) => {
    if (!node) return;

    // Process headings
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName &&
      node.tagName.match(/^H[2-5]$/)
    ) {
      if (!processedHeadings.has(node)) {
        processedHeadings.add(node);
        const headingText = node.textContent?.trim() || "";
        if (headingText) {
          // Track the heading text so we don't reuse it as a label
          processedHeadingTexts.add(headingText);

          const style = getHeadingStyle(node.tagName);
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: headingText,
                  bold: style.bold,
                  size: style.size,
                  font: "Calibri",
                }),
              ],
              spacing: style.spacing,
            })
          );
        }
      }
    }

    // Process Material-UI TextField containers
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.classList &&
      node.classList.contains("MuiTextField-root")
    ) {
      const input = node.querySelector("input, textarea");
      if (input && !processedInputs.has(input)) {
        processedInputs.add(input);

        // Extract label from Material-UI TextField structure
        const labelElement = node.querySelector("label");
        let label = labelElement ? labelElement.textContent.trim() : "";

        // Get field identifier for template data lookup
        const fieldId = input.id || "";
        const fieldName = input.name || fieldId;

        // Get value from input (prioritize DOM value)
        const inputValue = input.value || "";

        // Try to get value from templateData if input is empty
        let value = inputValue;
        let matchedFieldKey = fieldName;

        if (!value && templateData?.content) {
          // First try direct match
          value =
            templateData.content[fieldName] ||
            templateData.content[fieldId] ||
            "";
          if (value) {
            matchedFieldKey = fieldName || fieldId;
          }
        }

        // If we have a value but no field name (common with Material-UI TextFields),
        // try to match the value against templateData to find the correct field key
        if (
          value &&
          (!fieldName || fieldName === fieldId) &&
          templateConfig?.fieldHints &&
          templateData?.content
        ) {
          // Try to find the matching key by comparing values
          for (const [key, contentValue] of Object.entries(
            templateData.content
          )) {
            if (
              String(contentValue).trim() === String(value).trim() &&
              templateConfig.fieldHints[key]
            ) {
              matchedFieldKey = key;
              break;
            }
          }
        }

        // If still no value, try to get from templateData using matchedFieldKey
        if (!value && matchedFieldKey && templateData?.content) {
          value = templateData.content[matchedFieldKey] || "";
        }

        // PRIORITIZE fieldHints over heading text to avoid duplication
        // If no label found, try to get from templateConfig fieldHints first
        if (!label) {
          // Use matchedFieldKey (which might be more accurate than fieldName)
          const keyToUse = matchedFieldKey || fieldName;

          if (keyToUse && templateConfig?.fieldHints) {
            // Try to get from templateConfig fieldHints first (prevents duplication)
            const fieldHint = templateConfig.fieldHints[keyToUse];
            if (fieldHint) {
              // Check if this fieldHint is contained in any processed heading text
              // If it is, don't use it to avoid duplication - use a shorter label instead
              let isContainedInHeading = false;
              for (const headingText of processedHeadingTexts) {
                // Check if fieldHint is a substring of heading (case-insensitive)
                const headingLower = headingText.toLowerCase();
                const hintLower = fieldHint.toLowerCase();
                if (headingLower.includes(hintLower)) {
                  isContainedInHeading = true;
                  break;
                }
              }

              // Only use fieldHint if it's not contained in any processed heading
              if (!isContainedInHeading) {
                label = fieldHint;
              } else {
                // If fieldHint is contained in heading, use a generic label to avoid duplication
                // This prevents repeating the heading text as a field label
                label = "Response";
              }
            }
          }
        }

        // Only use heading text as fallback if no fieldHint was found
        // AND only if the heading wasn't already processed (to avoid duplication)
        if (!label) {
          let prevSibling = node.previousElementSibling;
          while (prevSibling) {
            if (prevSibling.tagName && prevSibling.tagName.match(/^H[2-5]$/)) {
              const headingText = prevSibling.textContent?.trim() || "";

              // NEVER use a heading text that was already processed as a heading
              if (headingText && !processedHeadingTexts.has(headingText)) {
                label = headingText;
              }
              break;
            }
            prevSibling = prevSibling.previousElementSibling;
          }
        }

        // If still no label, try to find heading in parent's previous siblings
        // But still check if it was already processed
        if (!label) {
          let parent = node.parentElement;
          while (parent && parent !== element) {
            let prevSibling = parent.previousElementSibling;
            while (prevSibling) {
              if (
                prevSibling.tagName &&
                prevSibling.tagName.match(/^H[2-5]$/)
              ) {
                const headingText = prevSibling.textContent?.trim() || "";

                // NEVER use a heading text that was already processed as a heading
                if (headingText && !processedHeadingTexts.has(headingText)) {
                  label = headingText;
                }
                break;
              }
              prevSibling = prevSibling.previousElementSibling;
            }
            if (label) break;
            parent = parent.parentElement;
          }
        }

        // Final fallback: format field name
        if (!label) {
          const keyToUse = matchedFieldKey || fieldName;
          if (keyToUse) {
            label = keyToUse
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
          }
        }

        // Add paragraph if we have a value (label is optional but preferred)
        if (value) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: label ? `${label}: ` : "",
                  bold: true,
                  size: 22,
                  font: "Calibri",
                }),
                new TextRun({
                  text: value,
                  size: 20,
                  font: "Calibri",
                }),
              ],
              spacing: { after: 200 },
            })
          );
        }
      }
    }

    // Process standalone inputs/textareas (not inside MuiTextField-root)
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      ((node.tagName === "INPUT" && node.type === "text") ||
        node.tagName === "TEXTAREA") &&
      !node.closest(".MuiTextField-root")
    ) {
      if (!processedInputs.has(node)) {
        processedInputs.add(node);

        // Try to get label from various sources
        const label =
          node.getAttribute("aria-label") ||
          node.getAttribute("placeholder") ||
          node.previousElementSibling?.textContent?.trim() ||
          node.closest("label")?.textContent?.trim() ||
          "";

        const fieldName = node.name || node.id || "";
        const value = node.value || templateData?.content?.[fieldName] || "";

        // Only add if we have meaningful content
        if (value && (label || fieldName)) {
          const displayLabel =
            label ||
            fieldName
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${displayLabel}: `,
                  bold: true,
                  size: 22,
                  font: "Calibri",
                }),
                new TextRun({
                  text: value,
                  size: 20,
                  font: "Calibri",
                }),
              ],
              spacing: { after: 200 },
            })
          );
        }
      }
    }

    // Recursively process children
    if (node.childNodes) {
      node.childNodes.forEach((child) => {
        walkElements(child);
      });
    }
  };

  // Start walking from the element
  walkElements(element);

  return paragraphs;
};

/**
 * Extract table structure from DOM and convert to Word table
 * @param {HTMLElement} tableElement - The table element to extract
 * @param {Object} templateData - Optional template data to get radio/checkbox values
 */
const extractTableFromDOM = (tableElement, templateData = null) => {
  const rows = [];
  const tableRows = tableElement.querySelectorAll("tr");

  // Calculate actual number of columns by accounting for colSpan
  // Find the row with the most columns (considering colSpan)
  let maxColumns = 0;
  tableRows.forEach((row) => {
    let columnCount = 0;
    row.querySelectorAll("th, td").forEach((cell) => {
      const colSpan = parseInt(cell.getAttribute("colspan") || "1", 10);
      columnCount += colSpan;
    });
    if (columnCount > maxColumns) {
      maxColumns = columnCount;
    }
  });

  const columnCount = maxColumns || 1;
  // Standard page width is 8.5 inches with 1" margins = 6.5" usable width
  // 6.5 inches = 9360 twentieths of a point
  // Distribute width evenly, with minimum 1 inch (1440) per column to prevent vertical text
  const maxTableWidth = 9360; // 6.5 inches in twentieths
  const minColumnWidth = 1440; // 1 inch minimum to prevent vertical text
  const columnWidth =
    columnCount > 0
      ? Math.max(Math.floor(maxTableWidth / columnCount), minColumnWidth)
      : minColumnWidth;

  tableRows.forEach((row, rowIndex) => {
    const cells = [];
    const rowCells = row.querySelectorAll("th, td");
    const isHeaderRow = rowIndex === 0 && rowCells[0]?.tagName === "TH";

    rowCells.forEach((cell, cellIndex) => {
      let cellText = "";

      // Extract text content
      const textNodes = Array.from(cell.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .filter((text) => text.length > 0);

      // Check for radio buttons (Material-UI Radio or native radio)
      const radioInput = cell.querySelector('input[type="radio"]');
      const materialRadio = cell.querySelector('[role="radio"]');

      // Check for checkbox
      const checkbox = cell.querySelector('input[type="checkbox"]');

      // Check for text inputs
      const input = cell.querySelector(
        'input[type="text"], input[type="number"], textarea'
      );

      // Priority: Radio > Checkbox > Text Input > Text Content
      if (radioInput || materialRadio) {
        // Radio button cell - check if selected
        let isChecked = false;

        // First check DOM state
        if (radioInput) {
          isChecked = radioInput.checked;
        } else if (materialRadio) {
          isChecked =
            materialRadio.getAttribute("aria-checked") === "true" ||
            materialRadio.querySelector('input[type="radio"]')?.checked ===
              true ||
            materialRadio.classList.contains("Mui-checked");
        }

        // If not checked in DOM, check saved data (for cases where DOM doesn't reflect saved state)
        if (!isChecked && templateData?.content && rowIndex > 0) {
          // Skip header row (rowIndex 0), first column is criterion name (cellIndex 0)
          // For RQTemplate1: criterion_0, criterion_1, etc. store the option index (0-4)
          // Column index 1 = option 0, column index 2 = option 1, etc.
          const criterionIndex = rowIndex - 1; // Skip header row
          const optionIndex = cellIndex - 1; // Skip first column (criterion name)

          if (optionIndex >= 0) {
            const criterionKey = `criterion_${criterionIndex}`;
            const savedValue = templateData.content[criterionKey];
            // Check if saved value matches this column's option index
            if (
              savedValue !== null &&
              savedValue !== undefined &&
              String(savedValue) === String(optionIndex)
            ) {
              isChecked = true;
            }
          }
        }

        cellText = isChecked ? "✓" : "";
      } else if (checkbox) {
        cellText = checkbox.checked ? "✓" : "";
      } else if (input) {
        cellText = input.value || "";
      } else {
        // For header cells, use the text content
        if (cell.tagName === "TH") {
          cellText = cell.textContent?.trim() || "";
        } else {
          // For data cells, try to get text but exclude radio/checkbox labels
          cellText = textNodes.join(" ") || cell.textContent?.trim() || "";
        }
      }

      // Remove label text if present (but keep tick marks)
      if (cellText !== "✓") {
        const label = cell.querySelector("label");
        if (label && cellText.includes(label.textContent)) {
          cellText = cellText.replace(label.textContent, "").trim();
        }
      }

      // Determine alignment - center for headers and radio/checkbox cells, left for others
      const alignment =
        isHeaderRow || cellText === "✓"
          ? AlignmentType.CENTER
          : AlignmentType.LEFT;

      // Get colSpan attribute
      const colSpan = parseInt(cell.getAttribute("colspan") || "1", 10);
      const cellWidth = colSpan * columnWidth;

      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cellText || "",
                  size: cell.tagName === "TH" ? 22 : 20,
                  bold: cell.tagName === "TH",
                  font: "Calibri",
                }),
              ],
              alignment: alignment,
              spacing: { before: 100, after: 100 },
            }),
          ],
          columnSpan: colSpan > 1 ? colSpan : 1,
          width: { size: cellWidth, type: WidthType.DXA },
          margins: { top: 200, bottom: 200, left: 200, right: 200 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          },
          shading: isHeaderRow
            ? {
                fill: "E7E6E6",
              }
            : undefined,
        })
      );
    });

    if (cells.length > 0) {
      rows.push(new TableRow({ children: cells }));
    }
  });

  // Create column widths array for the table
  // Ensure total width doesn't exceed page width (6.5 inches = 9360 twentieths)
  const maxWidth = 9360; // 6.5 inches (page width minus 1" margins on each side)
  const totalWidth = columnWidth * columnCount;
  const adjustedColumnWidth =
    totalWidth > maxWidth ? Math.floor(maxWidth / columnCount) : columnWidth;
  const columnWidths =
    columnCount > 0 ? Array(columnCount).fill(adjustedColumnWidth) : undefined;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: columnWidths,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    },
    rows: rows,
  });
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
    const renderConfig = templateConfig.renderAs;

    // Handle array-based renderAs configuration
    if (Array.isArray(renderConfig)) {
      setCurrentTemplateIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for render

      const captureElement = captureRef.current;
      if (!captureElement) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "[Template element not found]",
                italics: true,
                color: "FF0000",
              }),
            ],
            spacing: { after: 200 },
          })
        );
        continue;
      }

      // Fetch template data for reference
      let templateData = null;
      try {
        templateData = await fetchTemplateData(canvasId, templateKey);
      } catch (error) {
        console.warn(
          `Could not fetch template data for ${templateKey}:`,
          error
        );
      }

      // Track processed headings to avoid duplicates
      const processedHeadings = new Set();

      // Helper function to get heading style
      const getHeadingStyle = (tagName) => {
        switch (tagName) {
          case "H2":
            return {
              size: 32,
              bold: true,
              spacing: { before: 400, after: 300 },
            };
          case "H3":
            return {
              size: 28,
              bold: true,
              spacing: { before: 300, after: 250 },
            };
          case "H4":
            return {
              size: 24,
              bold: true,
              spacing: { before: 250, after: 200 },
            };
          case "H5":
            return {
              size: 22,
              bold: true,
              spacing: { before: 200, after: 150 },
            };
          default:
            return {
              size: 20,
              bold: false,
              spacing: { before: 200, after: 150 },
            };
        }
      };

      // Track all heading texts extracted at template level
      const templateLevelHeadingTexts = new Set();

      // Extract the first heading (h2) if it exists at the start of the template
      const firstHeading = captureElement.querySelector("h2");
      if (firstHeading) {
        const headingKey = `${
          firstHeading.tagName
        }-${firstHeading.textContent?.trim()}`;
        if (!processedHeadings.has(headingKey)) {
          processedHeadings.add(headingKey);
          const headingText = firstHeading.textContent?.trim() || "";
          if (headingText) {
            // Track this heading text
            templateLevelHeadingTexts.add(headingText);

            const style = getHeadingStyle(firstHeading.tagName);
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: headingText,
                    bold: style.bold,
                    size: style.size,
                    font: "Calibri",
                  }),
                ],
                spacing: style.spacing,
              })
            );
          }
        }
      }

      // Process each section according to renderConfig
      for (const sectionConfig of renderConfig) {
        const { selector, type } = sectionConfig;
        const sectionElements = captureElement.querySelectorAll(selector);

        if (sectionElements.length === 0) continue;

        for (const sectionElement of sectionElements) {
          switch (type) {
            case "text":
              // Track heading texts extracted at section level to prevent reuse as labels
              const sectionLevelHeadingTexts = new Set();

              // Extract headings that are siblings (previous siblings) of this section
              const previousHeadings = [];
              let prevSibling = sectionElement.previousElementSibling;

              // Collect headings that come before this section
              while (prevSibling) {
                if (
                  prevSibling.tagName &&
                  prevSibling.tagName.match(/^H[2-5]$/)
                ) {
                  // Create unique key for heading to avoid duplicates
                  const headingKey = `${
                    prevSibling.tagName
                  }-${prevSibling.textContent?.trim()}`;

                  if (!processedHeadings.has(headingKey)) {
                    processedHeadings.add(headingKey);
                    const headingText = prevSibling.textContent?.trim() || "";
                    if (headingText) {
                      // Track this heading text so it's not reused as a label
                      sectionLevelHeadingTexts.add(headingText);

                      const style = getHeadingStyle(prevSibling.tagName);
                      previousHeadings.unshift(
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: headingText,
                              bold: style.bold,
                              size: style.size,
                              font: "Calibri",
                            }),
                          ],
                          spacing: style.spacing,
                        })
                      );
                    }
                  }
                }
                prevSibling = prevSibling.previousElementSibling;
              }

              // Add headings in order (oldest first, then newest)
              previousHeadings.forEach((heading) => docChildren.push(heading));

              // Extract form fields from the section
              // Merge template-level and section-level heading texts to prevent reuse as labels
              const allProcessedHeadingTexts = new Set([
                ...templateLevelHeadingTexts,
                ...sectionLevelHeadingTexts,
              ]);

              const textParagraphs = extractFormFieldsAsText(
                sectionElement,
                templateData,
                templateConfig,
                allProcessedHeadingTexts
              );
              textParagraphs.forEach((para) => docChildren.push(para));
              break;

            case "table":
              const table = sectionElement.querySelector("table");
              if (table) {
                docChildren.push(extractTableFromDOM(table, templateData));
                docChildren.push(
                  new Paragraph({
                    children: [new TextRun({ text: "" })],
                    spacing: { after: 300 },
                  })
                );
              }
              break;

            case "section":
              // Process a section container: extract heading, text, and table in order
              // First, extract the heading (h2-h5) if it exists
              const sectionHeading =
                sectionElement.querySelector("h2, h3, h4, h5");
              if (sectionHeading) {
                const headingKey = `${
                  sectionHeading.tagName
                }-${sectionHeading.textContent?.trim()}`;
                if (!processedHeadings.has(headingKey)) {
                  processedHeadings.add(headingKey);
                  const headingText = sectionHeading.textContent?.trim() || "";
                  if (headingText) {
                    templateLevelHeadingTexts.add(headingText);
                    const style = getHeadingStyle(sectionHeading.tagName);
                    docChildren.push(
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: headingText,
                            bold: style.bold,
                            size: style.size,
                            font: "Calibri",
                          }),
                        ],
                        spacing: style.spacing,
                      })
                    );
                  }
                }
              }

              // Then extract text sections within this container (in DOM order)
              const textSections = Array.from(
                sectionElement.querySelectorAll('[data-export-section="text"]')
              );
              // Sort by DOM position to maintain order
              textSections.sort((a, b) => {
                const position = a.compareDocumentPosition(b);
                if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
                if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
                return 0;
              });

              for (const textSection of textSections) {
                const sectionLevelHeadingTexts = new Set();
                const allProcessedHeadingTexts = new Set([
                  ...templateLevelHeadingTexts,
                  ...sectionLevelHeadingTexts,
                ]);
                const textParagraphs = extractFormFieldsAsText(
                  textSection,
                  templateData,
                  templateConfig,
                  allProcessedHeadingTexts
                );
                textParagraphs.forEach((para) => docChildren.push(para));
              }

              // Finally, extract tables within this container (in DOM order)
              const tableSections = Array.from(
                sectionElement.querySelectorAll('[data-export-section="table"]')
              );
              // Sort by DOM position to maintain order
              tableSections.sort((a, b) => {
                const position = a.compareDocumentPosition(b);
                if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
                if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
                return 0;
              });

              for (const tableSection of tableSections) {
                const table = tableSection.querySelector("table");
                if (table) {
                  docChildren.push(extractTableFromDOM(table, templateData));
                  docChildren.push(
                    new Paragraph({
                      children: [new TextRun({ text: "" })],
                      spacing: { after: 300 },
                    })
                  );
                }
              }
              break;

            case "image":
              // Capture section as image
              try {
                const { buffer, dimensions } = await captureTemplateAsImage(
                  sectionElement
                );
                docChildren.push(
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: buffer,
                        transformation: dimensions,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                  })
                );
              } catch (error) {
                console.error(`Error capturing section image:`, error);
              }
              break;
          }
        }
      }

      // Add spacing after template
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: "" })],
          spacing: { after: 400 },
        })
      );

      continue; // Skip the old rendering logic
    }

    // Keep existing backward compatibility for string-based renderAs
    if (renderConfig === "image") {
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
    } else if (renderConfig === "table") {
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
