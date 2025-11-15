import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Typography } from "@mui/material";
import Button from "../components/Button";
import axios from "axios";

const IdeaDescriptionModal = ({
  open,
  handleClose,
  onSave,
  canvasId,
  currentIdeaDescription = "",
}) => {
  const [ideaDescription, setIdeaDescription] = useState(
    currentIdeaDescription
  );
  const [isLoading, setIsLoading] = useState(false);

  // Update state when modal opens or currentIdeaDescription changes
  useEffect(() => {
    if (open) {
      setIdeaDescription(currentIdeaDescription);
    }
  }, [open, currentIdeaDescription]);

  const handleSaveClick = async () => {
    if (ideaDescription.trim()) {
      setIsLoading(true);
      try {
        const response = await axios.put(
          "http://localhost:5000/api/canvas/updateIdeaDescription",
          { ideaDescription: ideaDescription.trim() },
          { withCredentials: true }
        );

        if (response.status === 200) {
          onSave(ideaDescription.trim());
          handleClose();
          setIdeaDescription("");
        }
      } catch (error) {
        console.error("Error saving idea description:", error);
        alert("Failed to save idea description. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please enter an idea description.");
    }
  };

  const handleCloseModal = () => {
    setIdeaDescription("");
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="idea-description-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          maxHeight: "90vh",
          bgcolor: "white",
          boxShadow: 24,
          p: 2.5,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <div className="modal-content">
          <h2 className="text-xl font-semibold mb-3">
            {currentIdeaDescription
              ? "Update Your Idea Description"
              : "Enter Your Idea Description"}
          </h2>
          <p className="text-gray-600 mb-3">
            {currentIdeaDescription
              ? "Update your idea description to improve auto-filling accuracy."
              : "Please provide a detailed description of your idea to enable auto-filling of your canvas."}
          </p>
          <div className="mb-3">
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              Idea Description <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 1.5 }}
              value={ideaDescription}
              onChange={(e) => setIdeaDescription(e.target.value)}
              placeholder="Describe your innovative idea in detail..."
              disabled={isLoading}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <Button
              label="Cancel"
              onClick={handleCloseModal}
              padding="10px 16px"
              color="#6b7280"
              fontSize="14px"
              disabled={isLoading}
            />
            <Button
              label={isLoading ? "Saving..." : "Save & Auto-fill"}
              onClick={handleSaveClick}
              padding="10px 16px"
              color="#3b82f6"
              fontSize="14px"
              disabled={isLoading}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default IdeaDescriptionModal;
