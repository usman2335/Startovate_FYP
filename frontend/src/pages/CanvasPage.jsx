import React, { useState } from "react";
import "../CSS/CanvasPage.css";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import CreateNewCanvasModal from "../components/CreateNewCanvasModal";
import LeanCanvas from "../components/LeanCanvas";
const CanvasPage = () => {
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  const handleCreateClick = () => {
    setClicked(true);
    setShowModal(true);
    setShowCanvas(true);
    console.log("modal is", showModal);
    console.log("clicked is", showModal);
    console.log("show is", showModal);
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="canvas-page-wrapper">
        {showModal ? (
          <>
            <CreateNewCanvasModal
              open={showModal}
              handleClose={() => setShowModal(false)}
            />
            <LeanCanvas isBlurred={showModal}></LeanCanvas>
          </>
        ) : (
          <div className="canvas-page-content">
            <h1>No canvases yet? Start your first one today!</h1>
            <Button
              label="Create New Canvas ->"
              onClick={handleCreateClick}
              padding="3% 13%"
              color="#f1f1f1"
              fontSize={"1.5em"}
            />
          </div>
        )}

        <img
          src="src\assets\blurred_canvas.png"
          className={`image-left ${clicked ? "hide" : ""}`}
        ></img>
        <img
          src="src\assets\blurred_canvas.png"
          className={`image-right ${clicked ? "hide" : ""}`}
        ></img>
      </div>
    </>
  );
};

export default CanvasPage;
