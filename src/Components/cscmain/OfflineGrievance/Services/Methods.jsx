import { ApiCalling, apiCallingFormData } from "Services/Utilities/ApiCalling/ApiCalling";
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

export const editGrievenceSupportTicketData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.OfflineGrievance.EditGrievenceSupportTicket);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
export const editKRPHGrievenceSupportTicket = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.OfflineGrievance.EditKRPHGrievenceSupportTicket);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};

export const gCPFileUploadData = async (formData) => {
  try {
    const result = await apiCallingFormData(formData, APIEndpoints.OfflineGrievance.GCPFileUpload);
    return result;
  } catch (error) {
    console.log(error);
    return {
      response: { responseCode: 0, responseData: null, responseMessage: error },
    };
  }
};

export const addKRPHGrievanceAttachmentData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.OfflineGrievance.AddKRPHGrievanceAttachment);
    return result;
  } catch (error) {
    console.log(error);
    return {
      response: { responseCode: 0, responseData: null, responseMessage: error },
    };
  }
};

export const getKRPHGrievanceAttachmentData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.OfflineGrievance.GetKRPHGrievanceAttachment);
    return result;
  } catch (error) {
    console.log(error);
    return {
      response: { responseCode: 0, responseData: null, responseMessage: error },
    };
  }
};

export const deleteKRPHGrievanceAttachmentData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.OfflineGrievance.DeleteKRPHGrievanceAttachment);
    return result;
  } catch (error) {
    console.log(error);
    return {
      response: { responseCode: 0, responseData: null, responseMessage: error },
    };
  }
};
