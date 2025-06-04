import { ClientApiCalling, ClientApiCalling2 } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const summaryTotalReportsData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.summaryTotalReports);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};

export const billingAgentDashboardData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.billingAgentDashboard);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};

export const billingObCallDetailsData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.billingObCallDetails);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
export const billingSmsCompanyDetailsData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.billingSmsCompanyDetails);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
export const billingIbCompanyShareDetailsData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };

    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.billingIbCompanyShareDetails);

    console.log("API call result:", result);

    return result;
  } catch (error) {
    console.error("Error occurred during API call:", error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error.message || error } };
  }
};

export const billingAgentWorkingDayDetailsData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.billingAgentWorkingDayDetails);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
export const billingobcompanyShareDetailsData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.billingobcompanyShareDetails);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};

export const agentOvertimeDetailsData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.agentOvertimeDetails);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};

export const whatsappdetailsDataAPI = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.whatsappdataDetails);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
export const getInsuranceCompanyListAPI = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.getInsuranceCompanyList);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
export const getfeedbackformquestionsAPI = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.getfeedbackformquestions);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
export const totalReportSummaryAPI = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.totalReportSummary);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
export const icAgentOvertimeDetailsAPI = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.icAgentOvertimeDetailsURL);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};

export const icAgentWorkingDetailsAPI = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ClientApiCalling2(requestData, APIEndpoints.Reports.icAgentWorkingDetailsURL);
    return result;
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
