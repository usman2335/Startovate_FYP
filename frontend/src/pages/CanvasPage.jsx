import React, { useState } from "react";
import "../CSS/CanvasPage.css";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import CreateNewCanvasModal from "../components/CreateNewCanvasModal";
import LeanCanvas from "../components/LeanCanvas";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import Checklist from "../components/Checklist1";

const CanvasPage = () => {
  const [view, setView] = useState("initial");
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [researchTitle, setResearchTitle] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleCreateClick = () => {
    setClicked(true);
    setShowModal(true);
    console.log("modal is", showModal);
    console.log("clicked is", showModal);
    console.log("show is", showModal);
  };

  const handleSaveCanvas = (title, author) => {
    setShowModal(false);
    setView("canvas");
    setResearchTitle(title);
    setAuthorName(author);
    // setIsBlurred(false);
  };

  const goBack = () => {
    if (selectedComponent) {
      setSelectedComponent(null);
      setView("canvas");
    } else {
      setView("initial");
    }
  };

  const handleComponentClick = (componentName) => {
    setSelectedComponent(componentName);
    console.log(selectedComponent);
    setView("checklist");
  };
  return (
    <>
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
              src="src\assets\blurred_canvas.png"
              className={`image-left ${clicked ? "hide" : ""}`}
            ></img>
            <img
              src="src\assets\blurred_canvas.png"
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
            <Checklist selectedComponent={selectedComponent} />
          </div>
        )}
      </div>
    </>
  );
};

export default CanvasPage;
