import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getFeedbackReportData = async (formData) => {
  
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Reports.GetFeedbackReport);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
