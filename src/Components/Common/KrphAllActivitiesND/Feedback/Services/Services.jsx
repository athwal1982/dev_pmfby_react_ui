import axios from "axios";
import { ENDPOINTS } from "./Endpoints.jsx";
import pako from "pako";

export const fetchFeedbackQuestions = async () => {
  try {
    const response = await axios.get(ENDPOINTS.GET_FEEDBACK_QUESTIONS);
    if (response.data && response.data.responseDynamic) {
      const compressedData = response.data.responseDynamic;
      const decodedData = atob(compressedData);
      const byteArray = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        byteArray[i] = decodedData.charCodeAt(i);
      }
      const decompressedData = pako.inflate(byteArray, { to: "string" });
      response.data.responseDynamic = JSON.parse(decompressedData);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback questions:", error);
    throw error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(ENDPOINTS.SUBMIT_FEEDBACK, feedbackData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};
