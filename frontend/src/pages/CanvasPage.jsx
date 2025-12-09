// export default CanvasPage;
import React, { useEffect, useState } from "react";
import "../CSS/CanvasPage.css";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import CreateNewCanvasModal from "../components/CreateNewCanvasModal";
import IdeaDescriptionModal from "../components/IdeaDescriptionModal";
import LeanCanvas from "../components/LeanCanvas";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import Checklist from "../components/Checklist1";
import TemplateComponent from "../components/Templates/TemplateComponent";
import checklistData from "../content/checklistData";
import axios from "axios";
import html2canvas from "html2canvas";
import templateMapping from "../content/templateMapping"; // make sure it includes all keys
import { useRef } from "react";
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
} from "docx";
import { saveAs } from "file-saver";
import {
  generateWordDocument,
  exportWordDocument,
  getTemplateDescription,
  formatTemplateKey,
  fetchTemplateData,
} from "../utils/exportUtils";
import { useChatbotContext } from "../context/chatbotContext";
import ChatbotFloating from "../components/ChatbotFloating";

const CanvasPage = () => {
  const { setContext } = useChatbotContext();
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;

  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const captureRef = useRef(null);

  const [view, setView] = useState("initial");
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [researchTitle, setResearchTitle] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedChecklistPoint, setSelectedChecklistPoint] = useState(null);
  const [templateKey, setTemplateKey] = useState(null);
  const [canvasId, setCanvasId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [ideaDescription, setIdeaDescription] = useState("");
  const [showIdeaModal, setShowIdeaModal] = useState(false);

  const fetchTemplateData = async (canvasId, templateKey) => {
    const res = await axios.get(
      `${BACKEND_BASE_URL}/api/template/get-template/${canvasId}/${templateKey}`
    );
    if (res.data.success) {
      return res.data.template;
    }
    throw new Error("Template not found");
  };

  const handleCaptureAllTemplates = async () => {
    try {
      setIsCapturing(true);
      setIsExporting(true);

      const templateKeys = Object.keys(templateMapping);

      // Generate the Word document using utility functions
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

  useEffect(() => {
    const fetchCanvas = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_BASE_URL}/api/canvas/getCanvas`,
          { withCredentials: true }
        );
        console.log("user is found in canvas");
        // if (!response.data.isSubscribed) {
        //   alert(
        //     "You need to subscribe to access this feature. Please go to the payment page."
        //   );
        //   return;
        // }
        setResearchTitle(response.data.researchTitle);
        setAuthorName(response.data.authorName);
        setIdeaDescription(response.data.ideaDescription || "");
        setCanvasId(response.data._id);
        setView("canvas");
        setIsSubscribed(response.data.isSubscribed);

        // Set chatbot context with canvas information
        setContext(response.data._id, null, null);

        console.log("response is:", response);
      } catch (error) {
        console.log("No existing canvas found");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCanvas();
  }, []);

  const handleCreateClick = () => {
    setClicked(true);
    setShowModal(true);
  };

  const handleSaveCanvas = async (title, author) => {
    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/canvas/createCanvas`,
        { researchTitle: title, authorName: author },
        { withCredentials: true }
      );
      setShowModal(false);
      setView("canvas");
      setResearchTitle(title);
      setAuthorName(author);
      setCanvasId(response.data._id);
    } catch (error) {
      console.error("Error creating canvas", error);
    }
  };

  const goBack = () => {
    if (selectedComponent && !selectedChecklistPoint) {
      setSelectedComponent(null);
      setView("canvas");
    } else if (selectedChecklistPoint) {
      setSelectedChecklistPoint(null);
      setView("checklist");
    } else {
      setView("initial");
    }
  };

  const handleAutoFill = () => {
    setShowIdeaModal(true);
  };

  const handleSaveIdeaDescription = (description) => {
    setIdeaDescription(description);
    alert(
      "Idea description saved! Auto-fill functionality will be implemented soon!"
    );
  };

  const handleComponentClick = (componentName) => {
    setSelectedComponent(componentName);
    setView("checklist");
  };

  const handleChecklistPointClick = async (pointId) => {
    // Find the correct checklist category
    const checklistCategory = checklistData[selectedComponent];

    if (checklistCategory) {
      const selectedPoint = checklistCategory.find(
        (point) => point.id === pointId
      );

      if (selectedPoint) {
        setSelectedChecklistPoint(selectedPoint);
        const templateKeyString = `${selectedComponent.replace(
          /\s+/g,
          ""
        )}-Step${selectedPoint.id}`;
        setTemplateKey(templateKeyString);

        // Set chatbot context with template information
        setContext(canvasId, templateKeyString, selectedComponent);
        try {
          const response = await axios.post(
            `${BACKEND_BASE_URL}/api/template/start`,
            {
              canvasId,
              templateId: templateKeyString,
              componentName: selectedComponent,
              checklistStep: selectedPoint.id,
            },
            { withCredentials: true }
          );
          console.log("Template fetched/created:", response.data.template);
        } catch (error) {
          console.error("Error fetching/creating template:", error);
        }
        // try {
        //   const response = await axios.post(
        //     `${BACKEND_BASE_URL}/api/template/start`,
        //     {
        //       canvasId,
        //       templateId: templateKeyString,
        //       componentName: selectedComponent,
        //       checklistStep: selectedPoint.id,
        //     },
        //     { withCredentials: true }
        //   );
        //   console.log("Template fetched/created:", response.data.template);
        // } catch (error) {
        //   console.error("Error fetching/creating template:", error);
        // }

        setView("template");
      } else {
        console.error("Checklist point not found");
      }
    } else {
      console.error("Checklist category not found");
    }
  };
  useEffect(() => {
    if (selectedChecklistPoint && templateKey) {
      console.log("Selected Checklist Point Updated:", selectedChecklistPoint);

      // axios
      //   .post(
      //     `${BACKEND_BASE_URL}/api/template/start`,
      //     {
      //       canvasId,
      //       templateId: templateKey,
      //       componentName: selectedComponent,
      //       checklistStep: selectedChecklistPoint.id,
      //     },
      //     { withCredentials: true }
      //   )
      //   .then((response) => {
      //     console.log("Template fetched/created:", response.data.template);
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching/creating template:", error);
      //   });
    }
  }, [selectedChecklistPoint, templateKey, canvasId]);
  return (
    <>
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <ChatbotFloating />

        {isCapturing && (
          <div id="capture-area" ref={captureRef}>
            <TemplateComponent
              templateKey={Object.keys(templateMapping)[currentTemplateIndex]}
              canvasId={canvasId}
            />
          </div>
        )}
      </div>
      <Navbar></Navbar>
      <div className="canvas-page-wrapper">
        {/* If modal is open, show modal & blurred Lean Canvas */}
        {showModal && (
          <>
            <CreateNewCanvasModal
              open={showModal}
              handleClose={() => setShowModal(false)}
              handleSave={handleSaveCanvas}
            />
            <LeanCanvas
              isBlurred={showModal}
              onComponentClick={null}
            ></LeanCanvas>
          </>
        )}
        {/* Idea Description Modal */}
        <IdeaDescriptionModal
          open={showIdeaModal}
          handleClose={() => setShowIdeaModal(false)}
          onSave={handleSaveIdeaDescription}
          canvasId={canvasId}
          currentIdeaDescription={ideaDescription}
        />
        {/* If no modal and view == initial, show initial message */}
        {!showModal && view === "initial" && (
          <div className="canvas-page-content">
            <h1>No canvases yet? Start your first one today!</h1>
            <Button
              label="Create New Canvas ->"
              onClick={handleCreateClick}
              padding="3% 13%"
              color="#f1f1f1"
              fontSize={"1.5em"}
            />
            <img
              src="/assets/blurred_canvas.png"
              className={`image-left ${clicked ? "hide" : ""}`}
            ></img>
            <img
              src="/assets/blurred_canvas.png"
              className={`image-right ${clicked ? "hide" : ""}`}
            ></img>
          </div>
        )}
        {/* If no modal but a canvas exists, show the unblurred Lean Canvas */}
        {view === "canvas" && (
          <>
            <div className="canvas-view">
              <div className="canvas-breadcrumbs">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link underline="hover" color="inherit" href="/">
                    Canvas
                  </Link>
                  <Typography sx={{ color: "text.primary" }}>
                    Lean Canvas
                  </Typography>
                </Breadcrumbs>
              </div>
              <div className="canvas-view-row">
                <Button
                  padding="1% 0%"
                  color="#f1f1f1"
                  fontSize={"1.1em"}
                  label="<- Go Back"
                  className="go-back-btn"
                />
                <div className="canvas-heading">
                  <Typography
                    sx={{
                      marginBottom: 1,
                      fontSize: "2em",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Lean Canvas For Invention
                  </Typography>
                </div>
                <div className="canvas-title">
                  <Typography
                    sx={{
                      marginBottom: 1,
                      fontSize: "1.5em",
                      fontWeight: 600,
                      maxWidth: "500px",
                      textAlign: "right",
                    }}
                  >
                    {`${researchTitle}`}
                  </Typography>
                  <Typography
                    sx={{
                      marginBottom: 1,
                      fontSize: "1.1em",
                      fontWeight: 400,
                    }}
                  >
                    {`${authorName}`}
                  </Typography>
                </div>
              </div>
              <LeanCanvas
                isBlurred={false}
                onComponentClick={handleComponentClick}
              />
              <div className="canvas-action-buttons">
                <Button
                  label={
                    ideaDescription
                      ? "Edit Idea & Auto-fill"
                      : "Set Idea & Auto-fill"
                  }
                  onClick={handleAutoFill}
                  className="autofill-btn"
                  variant="primary"
                />
                <Button
                  label="Capture All Templates"
                  onClick={handleCaptureAllTemplates}
                  className="capture-all-btn"
                  variant="secondary"
                  disabled={isExporting}
                />
              </div>
            </div>
          </>
        )}
        {/* {!showModal && view === "checklist" && (
          <>
            <LeanCanvas
              isBlurred={true}
              onComponentClick={handleComponentClick}
            />
            <div></div>
          </>
        )} */}

        {/* If a component is selected, show the checklist */}
        {view === "checklist" && selectedComponent && (
          <div className="canvas-view">
            <div className="canvas-breadcrumbs">
              <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">
                  Canvas
                </Link>
                <Typography sx={{ color: "text.primary" }}>
                  Lean Canvas
                </Typography>
                <Typography sx={{ color: "text.primary" }}>
                  {selectedComponent}
                </Typography>
              </Breadcrumbs>
            </div>
            <div className="canvas-view-row">
              <Button
                padding="1% 0%"
                color="#f1f1f1"
                fontSize={"1.1em"}
                label="<- Go Back"
                onClick={goBack}
                className="go-back-btn"
              />
              <div className="canvas-heading">
                <Typography
                  sx={{
                    marginBottom: 1,
                    fontSize: "2em",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  LCI Checklist - I: {selectedComponent}
                </Typography>
              </div>
              <div className="canvas-title">
                <Typography
                  sx={{
                    marginBottom: 1,
                    fontSize: "1.5em",
                    fontWeight: 600,
                    maxWidth: "500px",
                    textAlign: "right",
                  }}
                >
                  {`${researchTitle}`}
                </Typography>
                <Typography
                  sx={{
                    marginBottom: 1,
                    fontSize: "1.1em",
                    fontWeight: 400,
                  }}
                >
                  {`${authorName}`}
                </Typography>
              </div>
            </div>
            <Checklist
              selectedComponent={selectedComponent}
              onChecklistPointClick={handleChecklistPointClick}
            />
          </div>
        )}
        {view === "template" && selectedComponent && selectedChecklistPoint && (
          <div className="canvas-view">
            <div className="canvas-breadcrumbs">
              <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">
                  Canvas
                </Link>
                <Typography sx={{ color: "text.primary" }}>
                  Lean Canvas
                </Typography>
                <Typography sx={{ color: "text.primary" }}>
                  {selectedComponent}
                </Typography>
              </Breadcrumbs>
            </div>
            <div className="canvas-view-row">
              <Button
                padding="1% 0%"
                color="#f1f1f1"
                fontSize={"1.1em"}
                label="<- Go Back"
                onClick={goBack}
                className="go-back-btn"
              />
              <div className="canvas-heading">
                <Typography
                  sx={{
                    marginBottom: 1,
                    fontSize: "2em",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  LCI Checklist - I: {selectedComponent}
                </Typography>
              </div>
              <div className="canvas-title">
                <Typography
                  sx={{
                    marginBottom: 1,
                    fontSize: "1.5em",
                    fontWeight: 600,
                    maxWidth: "500px",
                    textAlign: "right",
                  }}
                >
                  {`${researchTitle}`}
                </Typography>
                <Typography
                  sx={{
                    marginBottom: 1,
                    fontSize: "1.1em",
                    fontWeight: 400,
                  }}
                >
                  {`${authorName}`}
                </Typography>
              </div>
            </div>
            <TemplateComponent
              templateKey={templateKey}
              canvasId={canvasId}
              // templateId={templateKey}
            />
          </div>
        )}
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isExporting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default CanvasPage;
