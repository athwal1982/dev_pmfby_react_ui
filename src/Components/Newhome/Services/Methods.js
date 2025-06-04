import axios from "axios";
import Config from "Configration/Config.json";
const OTP_MSG_API = "https://bulksmsapi.vispl.in/";

export const checkStatus = async (mobileNumber) => {
  try {
    const response = await axios.post(
      // A "https://pmfbydemo.amnex.co.in/krphapi/FGMS/GetTicketStatus",
      `${Config.BaseUrl}FGMS/GetTicketStatus`,
      {
        requestorMobileNo: mobileNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    if (response.status === 200) {
      if (response.data && response.data.responseCode === "1") {
        return { responseCode: 1, responseData: response.data, responseMessage: response.data.responseMessage };
      }
      return { responseCode: 0, responseData: null, responseMessage: response.data.responseMessage };
    }
    return { responseCode: 0, responseData: null, responseMessage: response.data.responseMessage };
  } catch (error) {
    return {
      responseCode: 0,
      responseData: null,
      responseMessage: error.message,
    };
  }
};

export const sendOtpMessage = async (mobileNumber) => {
  try {
    const response = await axios.get(OTP_MSG_API, {
      params: {
        username: "cscetrnapi3",
        password: "csce_123",
        messageType: "unicode",
        mobile: mobileNumber,
        senderId: "CSCSPV",
        ContentID: "${templateIDD}",
        EntityID: "1301157363501533886",
        message: "${customTemplateEncode}",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status === 200) {
      if (response.data) {
        return { responseCode: 1, responseData: response.data, responseMessage: response.status };
      }
      return { responseCode: 0, responseData: null, responseMessage: response.status };
    }
    return { responseCode: 0, responseData: null, responseMessage: response.status };
  } catch (error) {
    return {
      responseCode: 0,
      responseData: null,
      responseMessage: error.message,
    };
  }
};
