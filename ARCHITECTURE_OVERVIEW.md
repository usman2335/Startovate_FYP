# Architecture Overview: Frontend & Backend Integration

## System Overview

This is a **Lean Canvas for Invention (LCI)** application that helps researchers and inventors systematically work through research proposal steps using a checklist-based interface with dynamic templates.

---

## Frontend Architecture

### 1. **Entry Point & Routing** (`App.jsx`)
- Uses React Router for navigation
- Wraps app with `AuthProvider` and `ChatbotProvider` contexts
- Main routes:
  - `/canvas` - Main canvas page (core functionality)
  - `/signup`, `/Login` - Authentication
  - `/payment` - Subscription management
  - `/chat` - Chatbot interface

### 2. **Main Canvas Page Flow** (`CanvasPage.jsx`)

The canvas page manages three main views:

#### **View States:**
1. **`initial`** - No canvas exists, shows "Create New Canvas" button
2. **`canvas`** - Shows the Lean Canvas grid with clickable components
3. **`checklist`** - Shows checklist steps for a selected component
4. **`template`** - Shows the actual template form for a selected step

#### **Navigation Flow:**
```
Lean Canvas (9 components)
    ↓ (click component)
Checklist (shows steps for that component)
    ↓ (click step)
Template (form to fill out)
```

#### **Key State Variables:**
- `selectedComponent` - Which Lean Canvas component is selected (e.g., "Problem Identification")
- `selectedChecklistPoint` - Which step within the component (e.g., Step 1, Step 2)
- `templateKey` - Generated key like "ProblemIdentification-Step1"
- `canvasId` - MongoDB ID of the current canvas

### 3. **Lean Canvas Component** (`LeanCanvas.jsx`)

- Displays a 3x3 grid of clickable cards representing 9 research components:
  - Problem Identification
  - Literature Search
  - Research Question
  - Research Methodology
  - Research Outcome
  - Existing Solutions
  - Market Landscape
  - Novelty
  - Key Resources
  - Funding
  - Team Capacities

- When clicked, calls `onComponentClick(componentName)` which sets `selectedComponent` and changes view to `checklist`

### 4. **Checklist Component** (`Checklist1.jsx`)

- Receives `selectedComponent` prop (e.g., "Problem Identification")
- Reads steps from `checklistData[selectedComponent]` array
- Displays each step with:
  - Completion status (checkmark/cross)
  - Step title and description
  - "Start" or "Edit" button
- When a step is clicked, calls `onChecklistPointClick(step.id)`

### 5. **Template Component** (`TemplateComponent.jsx`)

This is the **core template rendering engine**:

#### **How Templates Are Called:**

1. **Template Key Generation:**
   ```javascript
   // In CanvasPage.jsx, when checklist point is clicked:
   const templateKeyString = `${selectedComponent.replace(/\s+/g, "")}-Step${selectedPoint.id}`;
   // Example: "ProblemIdentification-Step1"
   ```

2. **Template Lookup:**
   ```javascript
   // In TemplateComponent.jsx:
   const mappingEntry = templateMapping[templateKey] || templateMapping["ProblemIdentification-Step1"];
   const DynamicComponent = mappingEntry?.component;
   ```

3. **Dynamic Rendering:**
   ```javascript
   <DynamicComponent answers={answers} onInputChange={handleInputChange} />
   ```

#### **Template Mapping Structure** (`templateMapping.js`)

Each template entry contains:
- `component` - The React component to render (e.g., `Template1`, `KMTemplate1`)
- `renderAs` - How to export (image, text, table, section)
- `fields` - Array of field names this template uses
- `repeatedFields` - Dynamic fields with prefixes and counts
- `fieldHints` - Descriptions for each field (used for autofill/chatbot)

Example:
```javascript
"ProblemIdentification-Step1": {
  component: Template1,
  renderAs: [{ selector: '[data-export-section="text"]', type: "text" }],
  fields: [],
  repeatedFields: [
    { prefix: "why", count: 4 },
    { prefix: "references", count: 4 }
  ],
  fieldHints: {
    why_0: "Why? Explore a root cause (1)",
    references_0: "References (1)",
    // ...
  }
}
```

#### **Template Component Features:**

1. **State Management:**
   - `answers` - Object storing all form field values
   - Keys match field names from template mapping

2. **Save Functionality:**
   - Calls `/api/template/save` endpoint
   - Saves answers to MongoDB

3. **Auto-Fill Functionality:**
   - Uses field hints to generate AI-powered answers
   - Calls `/api/chatbot/autofill` endpoint

4. **Data Loading:**
   - On mount, fetches saved template data from `/api/template/get-template/:canvasId/:templateId`
   - Populates `answers` state with saved content

### 6. **Individual Template Components**

Each template (e.g., `KMTemplate1.jsx`, `Template1.jsx`) is a React component that:
- Receives `answers` prop (object with field values)
- Receives `onInputChange` callback function
- Renders form fields (TextField, etc.)
- Updates parent via `onInputChange(e, fieldName)`

Example:
```javascript
<TextField
  value={answers?.[`tangible_0`] || ""}
  onChange={(e) => onInputChange(e, `tangible_0`)}
/>
```

---

## Backend Architecture

### 1. **Server Setup** (`app.js`, `server.js`)

- Express.js server
- MongoDB connection via `connectDB()`
- CORS enabled for frontend
- Routes mounted:
  - `/api/users` - Authentication
  - `/api/canvas` - Canvas CRUD
  - `/api/template` - Template operations
  - `/api/chatbot` - AI chatbot/autofill
  - `/api/payment` - Stripe/EasyPaisa payments

### 2. **Template Routes** (`templateRoutes.js`)

- `POST /api/template/start` - Create/initialize a template
- `POST /api/template/save` - Save template answers
- `GET /api/template/get-template/:canvasId/:templateId` - Fetch template data
- `GET /api/template/export/:canvasId` - Get all templates for export

### 3. **Template Controller** (`templateController.js`)

#### **startTemplate:**
- Creates a new Template document if it doesn't exist
- Stores: `templateId`, `canvasId`, `componentName`, `checklistStep`, `content: {}`

#### **saveTemplate:**
- Merges new answers with existing content
- Updates MongoDB document

#### **getTemplate:**
- Fetches template by `canvasId` and `templateId`
- Returns saved `content` object

### 4. **Data Models**

#### **Template Model:**
```javascript
{
  templateId: String,      // e.g., "ProblemIdentification-Step1"
  canvasId: ObjectId,      // Reference to Canvas
  componentName: String,   // e.g., "Problem Identification"
  checklistStep: Number,   // e.g., 1, 2, 3
  content: Object,         // { fieldName: value, ... }
  completed: Boolean
}
```

#### **Canvas Model:**
```javascript
{
  researchTitle: String,
  authorName: String,
  ideaDescription: String,
  isSubscribed: Boolean,
  userId: ObjectId
}
```

---

## Data Flow: How Templates Are Called

### Complete Flow Example:

1. **User clicks "Problem Identification" on Lean Canvas**
   ```javascript
   // LeanCanvas.jsx
   onClick={() => onComponentClick("Problem Identification")}
   ```

2. **CanvasPage updates state**
   ```javascript
   setSelectedComponent("Problem Identification");
   setView("checklist");
   ```

3. **Checklist component renders**
   ```javascript
   // Checklist1.jsx reads from checklistData
   const steps = checklistData["Problem Identification"];
   // Shows 8 steps (Step 1 through Step 8)
   ```

4. **User clicks "Step 1" button**
   ```javascript
   // Checklist1.jsx
   onClick={() => onChecklistPointClick(step.id)} // step.id = 1
   ```

5. **CanvasPage generates template key**
   ```javascript
   // CanvasPage.jsx - handleChecklistPointClick
   const templateKeyString = "ProblemIdentification-Step1";
   setTemplateKey(templateKeyString);
   setView("template");
   ```

6. **TemplateComponent looks up template**
   ```javascript
   // TemplateComponent.jsx
   const mappingEntry = templateMapping["ProblemIdentification-Step1"];
   const DynamicComponent = mappingEntry.component; // = Template1
   ```

7. **TemplateComponent renders the dynamic component**
   ```javascript
   <DynamicComponent 
     answers={answers} 
     onInputChange={handleInputChange} 
   />
   // This renders <Template1 answers={...} onInputChange={...} />
   ```

8. **Template1 component renders form fields**
   ```javascript
   // Template1.jsx
   <TextField
     value={answers?.why_0 || ""}
     onChange={(e) => onInputChange(e, "why_0")}
   />
   ```

9. **When user types, state updates**
   ```javascript
   // TemplateComponent.jsx - handleInputChange
   setAnswers(prev => ({ ...prev, [field]: e.target.value });
   // answers = { why_0: "user input", ... }
   ```

10. **When user clicks Save**
    ```javascript
    // TemplateComponent.jsx - handleSave
    await saveTemplates(canvasId, templateKey, answers);
    // POST /api/template/save
    // { canvasId, templateId: templateKey, answers }
    ```

11. **Backend saves to MongoDB**
    ```javascript
    // templateController.js - saveTemplate
    template.content = { ...template.content, ...answers };
    await template.save();
    ```

---

## Key Files Summary

### Frontend:
- `App.jsx` - Routing setup
- `CanvasPage.jsx` - Main orchestrator, manages views and state
- `LeanCanvas.jsx` - Component grid UI
- `Checklist1.jsx` - Checklist display
- `TemplateComponent.jsx` - Template renderer and manager
- `content/checklistData.js` - All checklist steps organized by component
- `content/templateMapping.js` - Maps template keys to React components
- `components/Templates/**/*.jsx` - Individual template components

### Backend:
- `app.js` - Express app setup
- `server.js` - Server startup
- `routes/templateRoutes.js` - Template API endpoints
- `controllers/templateController.js` - Template business logic
- `models/Template.js` - MongoDB schema
- `models/Canvas.js` - Canvas schema

---

## Template Key Naming Convention

Template keys follow this pattern:
```
{ComponentName}-Step{StepNumber}
```

Examples:
- `ProblemIdentification-Step1`
- `LiteratureSearch-Step3`
- `KeyResources-Step2`
- `ResearchQuestion-Step6`

The component name is the `selectedComponent` with spaces removed, and the step number comes from the checklist point `id`.

---

## How Components Are Called

1. **Static Import** - All template components are imported at the top of `templateMapping.js`
2. **Dynamic Lookup** - `TemplateComponent` looks up the component using the `templateKey`
3. **Dynamic Rendering** - React renders the component using JSX: `<DynamicComponent />`

This pattern allows:
- Easy addition of new templates (just add to mapping)
- Type-safe component references
- Centralized template configuration

---

## Additional Features

### Auto-Fill:
- Uses field hints from `templateMapping`
- Calls chatbot API to generate answers based on idea description
- Merges generated answers into form

### Export:
- Can export all templates as Word document
- Uses `html2canvas` for image-based templates
- Uses `docx` library for Word generation

### Chatbot Integration:
- Context-aware chatbot that knows current template
- Can help fill fields based on conversation
- Uses `chatbotContext` to share state

---

This architecture provides a flexible, scalable system for managing research proposal templates with a clear separation between UI, data, and business logic.

