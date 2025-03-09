import React from "react";
import { Modal, Box, TextField, Typography } from "@mui/material";
import "../CSS/CreateNewCanvasModal.css";
import Button from "../components/Button";

const CreateNewCanvasModal = ({ open, handleClose }) => {
  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="create-canvas-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <div className="modal-content">
          <h2>Create New Canvas</h2>
          <p>Fill all the required fields</p>
          <div style={{ marginTop: 20 }}>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              Research Title <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField fullWidth variant="outlined" sx={{ mb: 2 }} />
          </div>
          <div style={{ marginTop: 20 }}>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              Author Name <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField fullWidth variant="outlined" sx={{ mb: 2 }} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Button
              label="Save"
              onClick={handleClose}
              padding="12px"
              color="white"
              fontSize="18px"
              width="50%"
              marginTop="10px"
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateNewCanvasModal;
