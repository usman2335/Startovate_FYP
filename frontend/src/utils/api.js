import axios from "axios";

export const saveTemplates = async (canvasId, templateId, answers) => {
  try {
    const reponse = await axios.post(
      "http://localhost:5000/api/template/save",
      {
        canvasId,
        templateId,
        answers,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    // throw error;
  }
};
