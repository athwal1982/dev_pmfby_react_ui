import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getGrievenceTicketsListData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.OfflineGrievance.GetGrievenceTicketsList);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};

export const addKRPHGrievenceSupportTicketData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.OfflineGrievance.AddKRPHGrievenceSupportTicket);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
