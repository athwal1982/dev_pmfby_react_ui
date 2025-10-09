import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getSupportTicketCropLossView = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    // A const result = await ApiCalling(requestData, APIEndpoints.Reports.GetSupportTicketCropLossView);
    const result = await ApiCalling(requestData, APIEndpoints.Reports.GetCropLossIntimationReport);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
