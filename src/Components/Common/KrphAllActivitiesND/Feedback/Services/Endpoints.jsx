import Config from "Configration/Config.json";
export const ENDPOINTS = {
  GET_FEEDBACK_QUESTIONS: `${Config.BaseUrl}/FGMS/farmer-feedback/questions`,
  SUBMIT_FEEDBACK: `${Config.BaseUrl}/FGMS/farmer-feedback`,
};

export default ENDPOINTS;
