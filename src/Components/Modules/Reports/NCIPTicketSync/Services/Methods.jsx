import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getNCIPTicketSyncReport = async (formData) => {
  debugger;
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Reports.GetNCIPTicketSyncReport);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
