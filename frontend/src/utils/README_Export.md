# Word Document Export Feature

## Overview

This feature allows users to export all templates from the Lean Canvas Invention system into a comprehensive Word document (.docx format).

## Features

- **Complete Template Export**: Captures all templates in the system
- **Dual Format Support**:
  - Image-based templates (captured as high-quality images)
  - Table-based templates (converted to structured Word tables with visible borders)
- **Professional Formatting**: Clean layout with proper headings, descriptions, and spacing
- **Table Styling**: All tables include 1px solid black borders for clear visibility
- **Metadata Inclusion**: Research title, author name, and generation date
- **Error Handling**: Graceful handling of missing templates or data

## How It Works

### 1. Template Processing

- Iterates through all templates defined in `templateMapping`
- Determines render type (image vs table) based on configuration
- Processes templates sequentially with appropriate delays for rendering

### 2. Image Capture

- Uses `html2canvas` to capture template components as images
- Scales images to fit A4 page dimensions
- Maintains high quality with 2x scale factor

### 3. Table Generation

- Fetches template data from backend API
- Converts data into structured Word tables with visible borders
- Formats field names for readability
- Handles missing data gracefully
- Ensures consistent 1px solid black borders on all table cells

### 4. Document Assembly

- Creates professional Word document structure
- Adds document title and metadata
- Includes template headings and descriptions
- Applies proper spacing and page breaks

## Usage

### In CanvasPage.jsx

```javascript
const handleCaptureAllTemplates = async () => {
  try {
    setIsCapturing(true);
    setIsExporting(true);

    const templateKeys = Object.keys(templateMapping);

    // Generate the Word document
    const doc = await generateWordDocument({
      templateKeys,
      templateMapping,
      canvasId,
      researchTitle,
      authorName,
      captureRef,
      setCurrentTemplateIndex,
    });

    // Export the document
    const fileName = `LeanCanvas_Complete_Report_${researchTitle.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}_${Date.now()}.docx`;
    await exportWordDocument(doc, fileName);

    alert(
      `Successfully exported ${templateKeys.length} templates to Word document!`
    );
  } catch (error) {
    console.error("Export failed:", error);
    alert("Export failed. Please try again.");
  } finally {
    setIsCapturing(false);
    setIsExporting(false);
  }
};
```

### Button Implementation

```jsx
<Button
  padding="1% 0%"
  color="#f1f1f1"
  fontSize={"1.1em"}
  label="📸 Capture All Templates"
  onClick={handleCaptureAllTemplates}
  className="capture-all-btn"
/>
```

## Dependencies

- `docx`: Word document generation
- `html2canvas`: Image capture from DOM elements
- `file-saver`: File download functionality
- `axios`: API communication

## Template Configuration

Templates are configured in `templateMapping.js` with the following structure:

```javascript
const templateMapping = {
  "TemplateKey-Step1": {
    component: TemplateComponent,
    renderAs: "image", // or "table"
  },
  // ... more templates
};
```

## Document Structure

1. **Document Title**: "Lean Canvas Invention - Complete Template Report"
2. **Metadata**: Research title, author, generation date
3. **Template Sections**: Each template includes:
   - Template heading (formatted name)
   - Description
   - Content (image or table)
   - Spacing

## Error Handling

- Missing templates: Shows "[Template data not available]"
- Capture errors: Shows "[Error capturing template image]"
- Empty data: Shows "[No data available for this template]"
- Network errors: Graceful fallback with user notification

## Performance Considerations

- Sequential processing to avoid memory issues
- 2-second delays between template captures for proper rendering
- Image scaling to optimize file size
- Progress indicators for user feedback

## File Naming

Generated files follow the pattern:
`LeanCanvas_Complete_Report_{ResearchTitle}_{Timestamp}.docx`

## Future Enhancements

- Batch processing optimization
- Custom export templates
- PDF export option
- Template filtering options
- Progress percentage display
