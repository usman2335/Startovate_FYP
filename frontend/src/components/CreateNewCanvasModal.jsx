import React from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import "../CSS/CreateNewCanvasModal.css";

const CreateNewCanvasModal = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
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
        <div class="modal-content">
          <h2>Create New Canvas</h2>
          <p>Fill all the required fields</p>
          <TextField
            fullWidth
            label="Research Title"
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Author Name"
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleClose}
          >
            Next
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateNewCanvasModal;
