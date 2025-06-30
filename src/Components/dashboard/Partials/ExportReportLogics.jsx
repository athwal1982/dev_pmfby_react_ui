import React, { useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import axios from "axios";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import Config from "Configration/Config.json";
import pako from "pako";
import { formatYear_MonthName } from "Configration/Utilities/utils";
import * as XLSX from "xlsx";

const ExportReportLogics = ({ fromDate, toDate, keyvalue, activeKey, yearMonth, insuranceCompanyReport, name, value, icon, color, show }) => {
  const setAlertMessage = AlertMessage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [popUpImport, setPopUpImport] = useState(false);
  const [mailTemplatesubject, setMailTemplateSubject] = useState();
  const [mailTemplateBody, setMailTemplateBody] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [iCMail_Notification, setICMail_Notification] = useState([]);
  const [popup, setPopup] = useState(false);
  const [email, setEmail] = useState("");
  const ImportReportBtnRight = getUserRightCodeAccess("BWM9");
  const formattedYear_MonthName = formatYear_MonthName(yearMonth);
  const user = getSessionStorage("user");
  const userMenuID = getSessionStorage("UserMenuId");
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcConfirmation, setCalcConfirmation] = useState(false);

  const [error, setError] = useState(null);

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const handleDownloadFullReport = async (e) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const options = {
        method: "POST",
        url: `${Config.BaseUrl}FGMS/downloadBillingSummaryReport`,
        headers: {
          "Content-Type": "application/json",
          authorization: user.token.Token,
        },
        responseType: "arraybuffer",
        data: { from: fromDate, to: toDate },
        params: {
          masterMenuId: userMenuID,
        },
      };

      const result = await axios.request(options);
      const workbook = XLSX.read(result.data, { type: "array" });
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `BillingSummaryReport_${formattedYear_MonthName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setAlertMessage({ type: "success", message: "File downloaded successfully!" });
    } catch (error) {
      console.error("Error downloading the file:", error);
      setAlertMessage({ type: "error", message: "Failed to download the report." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopupTagged = async (e) => {
    debugger;
    e.stopPropagation();

    setEmail("");

    if (value === "0" || value === "0.00" || value === "null") {
      setIsLoading(true);
      setPopup(false);
      setAlertMessage({
        type: "error",
        message: "Data is not uploaded yet. Please come back later.",
      });
      setIsLoading(false);

      return;
    }
    if (insuranceCompanyReport === "") {
      setPopup(false);
      setAlertMessage({
        type: "error",
        message: "Please select Insurance Company",
      });
      setIsLoading(false);

      return;
    } else if (keyvalue === "INBNDCL" || keyvalue === "OTBNDCL" || keyvalue === "WHAPP" || keyvalue === "TXTMSG" || keyvalue === "AGNT" || keyvalue === "AIBT") {
      setPopup(true);
      setAlertMessage({
        type: "warning",
        message: "Enter your Mail id",
      });
    } else {
      setAlertMessage({
        type: "error",
        message: "Not Allowed.",
      });
      return;
    }
  };

  const handleDownloadReportTagged = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setAlertMessage({ type: "error", message: "Please enter a email" });
      setIsLoading(false);
      return;
    } else if (!emailRegex.test(email)) {
      setAlertMessage({ type: "error", message: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }

    const fileType =
      keyvalue === "INBNDCL"
        ? "IB"
        : keyvalue === "OTBNDCL"
          ? "OB"
          : keyvalue === "WHAPP"
            ? "WHATSAPP"
            : keyvalue === "TXTMSG"
              ? "SMS"
              : keyvalue === "AGNT"
                ? "MAN_POWER"
              : keyvalue === "AIBT"
              ? "AIBOT"  
              : "";

    if (!fileType) return setAlertMessage({ type: "error", message: "No Data" });

    try {
      const user = getSessionStorage("user");
      const urlSuffix = fileType === "IB" || fileType === "OB" ? "sendIBorOBTaggedRawDataOnMail" : "sendIBorOBOtherRawDataOnMail";

      const result = await axios.post(
        `${Config.BaseUrl}/FGMS/${urlSuffix}`,
        {
          type: fileType,
          year_month: yearMonth,
          ic: insuranceCompanyReport,
          ic_mailid: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: user.token.Token,
          },
        },
      );

      const { responseCode, responseMessage, rcode, rmessage } = result?.data || {};

      if (responseCode === "1" && responseMessage) {
        setPopup(false);
        setEmail("");
        setAlertMessage({ type: "success", message: responseMessage });
      } else if (rcode === 1 && rmessage) {
        setAlertMessage({ type: "error", message: rmessage });
        setPopup(false);
        setEmail("");
      }
    } catch (error) {
      console.error(error);
      setAlertMessage({ type: "error", message: "An error occurred while downloading the report." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopupUntagged = async (e) => {
    e.stopPropagation();
    setEmail("");
    setIsLoading(true);
    if (insuranceCompanyReport === "") {
      setPopup(false);
      setIsLoading(false);
      setAlertMessage({
        type: "error",
        message: "Please select Insurance Company",
      });
    } else if (activeKey === "INBNDCL" || activeKey === "OTBNDCL") {
      setPopup(true);
      setIsLoading(false);
      setAlertMessage({
        type: "warning",
        message: "Enter your Mail id",
      });
    } else {
      setAlertMessage({
        type: "error",
        message: "Not Allowed.",
      });
      setIsLoading(false);
    }
  };

  const handleDownloadReportUnTagged = async (e) => {
    e.stopPropagation();

    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      setAlertMessage({ type: "error", message: "Please enter your mail id" });
      return;
    } else if (!emailRegex.test(email)) {
      setAlertMessage({ type: "error", message: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }
    const fileType = activeKey === "INBNDCL" ? "IB" : activeKey === "OTBNDCL" ? "OB" : "";
    if (fileType !== "IB" && fileType !== "OB") {
      setIsLoading(false);
      setPopup(false);
      setAlertMessage({ type: "error", message: "Not Allowed" });
      return;
    }

    try {
      const user = getSessionStorage("user");
      const options = {
        method: "POST",
        url: `${Config.BaseUrl}FGMS/sendIBorOBUnTaggedRawDataOnMail`,
        headers: {
          "Content-Type": "application/json",
          authorization: user.token.Token,
        },
        data: {
          type: fileType,
          year_month: yearMonth,
          ic: insuranceCompanyReport,
          ic_mailid: email,
        },
      };

      const result = await axios.request(options);
      const { responseCode, responseMessage } = result.data;
      setIsLoading(true);
      if (responseCode === "1") {
        setIsLoading(false);
        setPopup(false);
        setAlertMessage({
          type: "success",
          message: responseMessage,
        });
      } else {
        setIsLoading(false);
        setAlertMessage({
          type: "error",
          message: responseMessage,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error in download request:", error);
    }
  };

  const handleClose = async () => {
    setCalcConfirmation(false);
    setPopup(false);
    setIsLoading(false);
    setPopUpImport(false);
  };

  const handlePopupFullReport = async (e) => {
    e.stopPropagation();
    setEmail("");
    setIsLoading(true);
    setPopup(true);
    setAlertMessage({ type: "warning", message: "Enter a mail id" });
    setIsLoading(false);
  };

  const handleCalculationButton = async (e) => {
    debugger;
    e.preventDefault();
    if (yearMonth === "") {
      setAlertMessage({
        type: "error",
        message: "Please select current year and previous month then click submit",
      });
      return;
    }

    if (isCalculating) {
      setAlertMessage({
        type: "warning",
        message: "Calculation is already in progress. Please wait.",
      });
      return;
    }

    setIsCalculating(true);

    const options = {
      method: "POST",
      url: `${Config.BaseUrl}FGMS/generateBillingData`,
      params: {
        masterMenuId: userMenuID,
      },
      headers: {
        Authorization: user.token.Token,
        "Content-Type": "application/json",
      },
      data: { year_month: yearMonth },
    };

    try {
      const response = await axios.request(options);

      if (response.data?.error) {
        setAlertMessage({
          type: "error",
          message: response.data.error,
        });
        setIsCalculating(false);
        setCalcConfirmation(false);
      } else {
        setAlertMessage({
          type: "success",
          message: response.data || "Calculation Started. It will take a few hours.",
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.response?.data?.error || error.message || "An unexpected error occurred.",
      });
      setIsCalculating(false);
    }
  };

  const handleNotificationButton = async () => {
    const options = {
      method: "POST",
      url: `${Config.BaseUrl}FGMS/getIcMailIdData`,
      params: { masterMenuId: userMenuID },
      headers: {
        Authorization: user.token.Token,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data?.responseCode === 1) {
        if (response.data?.responseDynamic) {
          const byteArray = Uint8Array.from(atob(response.data.responseDynamic), (c) => c.charCodeAt(0));
          response.data.responseDynamic = JSON.parse(pako.inflate(byteArray, { to: "string" }));
        }
        setICMail_Notification(response.data.responseDynamic);
        setAlertMessage({
          type: "success",
          message: "All Mails Fetched Successfully",
        });
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const handleTemplateShow = async () => {
    const options = {
      method: "POST",
      url: `${Config.BaseUrl}FGMS/publishDataAndSendNotificationToICsPreview`,
      params: { masterMenuId: userMenuID },
      headers: {
        Authorization: user.token.Token,
        "Content-Type": "application/json",
      },
      data: { year_month: yearMonth },
    };

    try {
      const response = await axios.request(options);
      if (response.data?.responseDynamic) {
        const byteArray = Uint8Array.from(atob(response.data.responseDynamic), (c) => c.charCodeAt(0));
        response.data.responseDynamic = JSON.parse(pako.inflate(byteArray, { to: "string" }));
      }
      setMailTemplateBody(response.data.responseDynamic[0].msgBody);
      setMailTemplateSubject(response.data.responseDynamic[0].subject);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleDownloadIcFile = async (e) => {
    e.stopPropagation();

    const options = {
      method: "POST",
      url: `${Config.BaseUrl}FGMS/getIcMailIdData`,
      params: { masterMenuId: userMenuID },
      headers: {
        Authorization: user.token.Token,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data?.responseCode === 1) {
        if (response.data?.responseDynamic) {
          const byteArray = Uint8Array.from(atob(response.data.responseDynamic), (c) => c.charCodeAt(0));
          response.data.responseDynamic = JSON.parse(pako.inflate(byteArray, { to: "string" }));
        }

        const icData = response.data.responseDynamic[0];
        const columnOrder = {
          company_name: "company_name",
          mail_id: "mail_id",
        };

        const mappedData = icData.map((value) => {
          return {
            company_name: value.company_name,
            mail_id: value.mail_id,
          };
        });

        const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
        const worksheet = XLSX.utils.json_to_sheet(rearrangedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "IC_Mails.xlsx");
        setAlertMessage({
          type: "success",
          message: "File Downloaded Successfully",
        });
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message || error);
    }
  };

  const handledemoImportReport = async () => {
    debugger;
    const fileType =
      keyvalue === "INBNDCL"
        ? "IB"
        : keyvalue === "OTBNDCL"
          ? "OB"
          : keyvalue === "WHAPP"
            ? "whatsapp"
            : keyvalue === "TXTMSG"
              ? "sms"
              : keyvalue === "AGNT"
                ? "MAN_POWER"
              : keyvalue === "AIBT"
              ? "AIBOT"  
              : "";

    const options = {
      method: "POST",
      url: `${Config.BaseUrl}FGMS/downloadSampleRawDataformat`,

      params: { file_type: fileType, masterMenuId: userMenuID },
      headers: {
        Authorization: user.token.Token,
      },
      responseType: "arraybuffer",
    };

    try {
      const response = await axios.request(options);

      const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Sample_Report_${fileType}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setPopUpImport(false);
      setAlertMessage({ type: "success", message: "File downloaded successfully!" });
    } catch (error) {
      console.error("Error downloading the file:", error);
      setPopUpImport(false);
      setAlertMessage({ type: "error", message: "Failed to download the report." });
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadRawDatasms_whatsapp = async () => {
    if (!selectedFile) {
      setAlertMessage({
        type: "error",
        message: "Please select a file.",
      });
      return;
    }

    const fileType =
      keyvalue === "INBNDCL"
        ? "IB"
        : keyvalue === "OTBNDCL"
          ? "OB"
          : keyvalue === "WHAPP"
            ? "whatsapp"
            : keyvalue === "TXTMSG"
              ? "sms"
              : keyvalue === "AGNT"
                ? "MAN_POWER"
              : keyvalue === "AIBT"
              ? "AIBOT"  
              : "";;

    if (!fileType) {
      setAlertMessage({
        type: "error",
        message: "Invalid file type.",
      });
      return;
    }

    const endpoint = fileType === "whatsapp" ? "uploadWhatsappRawDataXlsx" : fileType === "sms" ? "uploadSMSrawDataXlsx" : fileType === "AIBOT" ? "uploadAIrawDataXlsx" : "";

    if (!endpoint) {
      setAlertMessage({
        type: "error",
        message: "Unsupported file type.",
      });
      return;
    }

    const form = new FormData();
    form.append("file", selectedFile);

    const options = {
      method: "POST",
      url: `${Config.BaseUrl}FGMS/${endpoint}`,
      params: { year_month: yearMonth, masterMenuId: userMenuID },
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: user.token.Token,
      },
      data: form,
    };

    try {
      const response = await axios.request(options);
      setAlertMessage({
        type: "success",
        message: "Upload Successful",
      });
      setPopUpImport(false);
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Upload Failed",
      });
    }
  };

  return {
    handleUploadRawDatasms_whatsapp,
    handleFileChange,
    selectedFile,
    setSelectedFile,
    handledemoImportReport,
    handleDownloadIcFile,
    mailTemplatesubject,
    setMailTemplateSubject,
    mailTemplateBody,
    setMailTemplateBody,
    handleDownloadFullReport,
    handleDownloadReportUnTagged,
    handleDownloadReportTagged,
    handlePopupFullReport,
    handlePopupUntagged,
    handlePopupTagged,
    handleClose,
    popup,
    setPopup,
    isLoading,
    setIsLoading,
    handleTemplateShow,
    isHovered,
    setIsHovered,
    email,
    isHovered2,
    setIsHovered2,
    calcConfirmation,
    setCalcConfirmation,
    ImportReportBtnRight,
    handleCalculationButton,
    handleNotificationButton,
    setEmail,
    iCMail_Notification,
    setICMail_Notification,
    popUpImport,
    setPopUpImport,
    setPopup,
    isCalculating,
    setIsCalculating,
    error,
    setError,
  };
};

export default ExportReportLogics;
