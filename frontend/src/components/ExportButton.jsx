import React from "react";
import html2canvas from "html2canvas";
import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";

const ExportButton = ({ canvasId }) => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const handleExport = async () => {
    try {
      const element = document.getElementById("export-section");
      console.log("Exporting element:", element);
      if (!element) {
        message.error("Export element not found");
        return;
      }

      const canvas = await html2canvas(element, { scale: 2 }); // higher scale for better quality
      const base64Image = canvas.toDataURL("image/png");
      if (!base64Image) {
        message.error("Failed to capture canvas");
        return;
      }
      console.log("Base64 Image:", base64Image);
      // Send base64 image to backend
      await axios.post(
        `${BACKEND_BASE_URL}/api/template/export/upload`,
        { base64Image, canvasId },
        { withCredentials: true }
      );

      // Trigger Word download
      const response = await axios.get(
        `${BACKEND_BASE_URL}/api/template/export/docx/${canvasId}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "LeanCanvas.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      message.success("Export successful!");
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Failed to export document.");
    }
  };

  return (
    <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
      Export to Word
    </Button>
  );
};

export default ExportButton;
