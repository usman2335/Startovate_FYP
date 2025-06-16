import React, { useEffect, useState } from "react";
import "../CSS/CanvasPage.css";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import CreateNewCanvasModal from "../components/CreateNewCanvasModal";
import LeanCanvas from "../components/LeanCanvas";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import Checklist from "../components/Checklist1";
import TemplateComponent from "../components/Templates/TemplateComponent";
import checklistData from "../content/checklistData";
import ExportButton from "../components/ExportButton";
import axios from "axios";
import html2canvas from "html2canvas";
import templateMapping from "../content/templateMapping"; // make sure it includes all keys
import { useRef } from "react";
import { Document, Packer, Paragraph, ImageRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

const CanvasPage = () => {
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
  if (selectedChecklistPoint) {
    console.log(selectedChecklistPoint.id);
  }

  const handleCaptureAllTemplates = async () => {
    setIsExporting(true);
    const keys = Object.keys(templateMapping); // e.g. ['Problem-Step1', 'Solution-Step2', ...]
    setIsCapturing(true);

    const imageParagraphs = [];

    const MAX_WIDTH = 600; // max width in points (approx 8 inches)
    const MAX_HEIGHT = 800; // max height in points (approx 11 inches, minus margins)

    for (let i = 0; i < keys.length; i++) {
      setCurrentTemplateIndex(i);
      await new Promise((res) => setTimeout(res, 1500));

      const captureElement = captureRef.current;
      if (!captureElement) continue;

      const canvas = await html2canvas(captureElement);
      const imageDataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(imageDataUrl)).blob();
      const buffer = await blob.arrayBuffer();

      let imageWidth = canvas.width * 0.75; // convert px to pt
      let imageHeight = canvas.height * 0.75;

      // Scale down if too wide or too tall
      const widthRatio = MAX_WIDTH / imageWidth;
      const heightRatio = MAX_HEIGHT / imageHeight;
      const scaleRatio = Math.min(widthRatio, heightRatio, 1); // never upscale

      imageWidth = imageWidth * scaleRatio;
      imageHeight = imageHeight * scaleRatio;

      imageParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          pageBreakBefore: i !== 0,
          children: [
            new ImageRun({
              data: buffer,
              transformation: {
                width: imageWidth,
                height: imageHeight,
              },
            }),
          ],
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: imageParagraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `LeanCanvas_Templates_${Date.now()}.docx`);

    setIsCapturing(false);
    setIsExporting(false);
    alert("All templates captured and exported to Word!");
  };

  useEffect(() => {
    const fetchCanvas = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/canvas/getCanvas",
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
        setCanvasId(response.data._id);
        setView("canvas");
        setIsSubscribed(response.data.isSubscribed);
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
        "http://localhost:5000/api/canvas/createCanvas",
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

  const handleComponentClick = (componentName) => {
    setSelectedComponent(componentName);
    setView("checklist");
  };

  const handleChecklistPointClick = async (pointId) => {
    // Find the correct checklist category
    const checklistCategory = checklistData[selectedComponent];

    if (checklistCategory) {
      // Find the correct step using the pointId
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
        try {
          const response = await axios.post(
            "http://localhost:5000/api/template/start",
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
        //     "http://localhost:5000/api/template/start",
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
      //     "http://localhost:5000/api/template/start",
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
        {isCapturing && (
          <div id="capture-area" ref={captureRef}>
            <TemplateComponent
              templateKey={Object.keys(templateMapping)[currentTemplateIndex]}
              canvasId={canvasId}
              hideButtons={true}
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

              {/* <ExportButton canvasId={canvasId} /> */}
              {/* <Button onClick={exportCanvasAsImage}>Export to Word</Button> */}
              <a
                href={`http://localhost:5000/api/template/canvas/${canvasId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Export as Word
              </a>
            </div>
            <Button
              padding="1% 0%"
              color="#f1f1f1"
              fontSize={"1.1em"}
              label="📸 Capture All Templates"
              onClick={handleCaptureAllTemplates}
              className="capture-all-btn"
            />
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
