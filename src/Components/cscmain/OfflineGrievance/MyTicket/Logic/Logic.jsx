import { useEffect, useState, useRef } from "react";
import moment from "moment";
import publicIp from "public-ip";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { addGrievenceSupportTicketReview, getMasterDataBinding, farmerTicketStatusUpdate, addKRPHGrievanceSupportTicketComment,getKRPHGrievanceSupportTicketComment } from "../Services/Services";
import { gCPFileUploadData, addKRPHGrievenceTicketHistoryAttachmentData } from "../../Services/Methods";

function MyTicketLogics() {
  const [value, setValue] = useState("<p></p>");
  const [replyBoxCollapsed, setReplyBoxCollapsed] = useState(true);
  const [wordcount, setWordcount] = useState(0);

  const setAlertMessage = AlertMessage();
  const fileRef = useRef(null);

  const [formValuesTicketProperties, setFormValuesTicketProperties] = useState({
    txtTicketStatus: null,
    txtDocumentUpload: "",
    txtBankName: null,
  });

  const [formValidationSupportTicketReviewError, setFormValidationSupportTicketReviewError] = useState({});

  const validateFieldSupportTicketReview = (name, value) => {
    let errorsMsg = "";
    // A if (name === "txtDocumentUpload") {
    // A  if (value && typeof value !== "undefined") {
    // A    const regex = new RegExp("^[a-zA-Z0-9_.-]*$");
    // A    if (!regex.test(value.name)) {
    // A      errorsMsg = "Attachment name is not in valid format.";
    // A    }
    // A  }
    // A }
    return errorsMsg;
  };

  const handleValidationSupportTicketReview = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtDocumentUpload"] = validateFieldSupportTicketReview("txtDocumentUpload", formValuesTicketProperties.txtDocumentUpload);
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationSupportTicketReviewError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const updateStateTicketProperties = (name, value) => {
    setFormValuesTicketProperties({ ...formValuesTicketProperties, [name]: value });
    formValidationSupportTicketReviewError[name] = validateFieldSupportTicketReview(name, value);
  };

  const [ticketData, setTicketData] = useState("");
  const [ticketStatusBtn, setTicketStatusBtn] = useState("");

  const [chatListDetails, setChatListDetails] = useState([]);
  const [isLoadingchatListDetails, setIsLoadingchatListDetails] = useState(false);
  const getChatListDetailsData = async (pticketData, pPageIndex, pPageSize) => {
    try {
      setTicketData(pticketData);
      // A setFormValuesTicketProperties({
      // A  ...formValuesTicketProperties,
      // A  txtTicketStatus:
      // A    pticketData && pticketData.TicketStatus && pticketData.TicketStatusID
      // A      ? {
      // A          CommonMasterValueID: pticketData.TicketStatusID,
      // A          CommonMasterValue: pticketData.TicketStatus,
      // A          BMCGCode: pticketData.BMCGCode,
      // A        }
      // A      : null,
      // A });
      setIsLoadingchatListDetails(true);
      const formdata = {
        grievenceSupportTicketID: pticketData.GrievenceSupportTicketID,
        pageIndex: pPageIndex,
        pageSize: pPageSize,
      };
      const result = await getKRPHGrievanceSupportTicketComment(formdata);
      console.log(result, "chat List");
      setIsLoadingchatListDetails(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData.supportTicket && result.response.responseData.supportTicket.length > 0) {
          setChatListDetails(result.response.responseData.supportTicket);
        } else {
          setChatListDetails([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const showMoreChatListOnClick = () => {
    getChatListDetailsData(ticketData, 1, -1);
  };

  useEffect(() => {
    console.log(value);
  }, [value]);

  const updateTicketHistorytData = (addedData) => {
    if (addedData.IsNewlyAdded === true) {
      chatListDetails.unshift(addedData);
    }
    console.log(addedData);
    setChatListDetails([]);
    setChatListDetails(chatListDetails);
  };

  const updateStatusSupportTicket = async () => {
    try {
      const formData = {
        farmerSupportTicketID: ticketData.FarmerSupportTicketID,
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
      };
      const result = await farmerTicketStatusUpdate(formData);
      if (result.response.responseCode === 1) {
        ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
        ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;
        setReplyBoxCollapsed(!replyBoxCollapsed);
        // A if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
        // A  SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
        // A }
        setFormValuesTicketProperties({
          ...formValuesTicketProperties,
          txtTicketStatus: {
            CommonMasterValueID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
            CommonMasterValue: formValuesTicketProperties.txtTicketStatus.CommonMasterValue,
            BMCGCode: formValuesTicketProperties.txtTicketStatus.BMCGCode,
          },
        });
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const handleResetFile = async () => {
    fileRef.current.value = null;
    setFormValidationSupportTicketReviewError({});
  };

  const [apiDataAttachment, setapiDataAttachment] = useState({apiFor: "", GrievenceTicketHistoryID: 0 });
  const [btnLoaderActive1, setBtnLoaderActive1] = useState(false);
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    let popUpMsg = "";

    const strippedText = value.replace(/<[^>]*>/g, "").trim();

    if (!strippedText) {
      popUpMsg = "Ticket comment is required!";
      setAlertMessage({
        type: "warning",
        message: popUpMsg,
      });
      return;
    }

    if (formValuesTicketProperties.txtTicketStatus === null) {
      setAlertMessage({
        type: "warning",
        message: "Ticket status is required!",
      });
      return;
    }
    if (formValuesTicketProperties.txtTicketStatus !== null) {
      if (ticketData.TicketStatusID === formValuesTicketProperties.txtTicketStatus.CommonMasterValueID) {
        setAlertMessage({
          type: "warning",
          message: "Same status is not allowed to change the ticket status",
        });
        return;
      }
    }
    let phasDocument = 0;
      let pAttachmentPath = "pmfby/public/krph/documents";
      let pAttachmentSize = 0;
      let pdbAttachmentPath = [];
      const pAttachment =
        formValuesTicketProperties.txtDocumentUpload && formValuesTicketProperties.txtDocumentUpload ? formValuesTicketProperties.txtDocumentUpload : "";
      if (pAttachment.length > 0) {
        if (pAttachment.length > 5) {
          setAlertMessage({
            type: "error",
            message: "Please select only 5 attachments.",
          });
          return;
        }
        phasDocument = 1;
        for (let i = 0; i < pAttachment.length; i++) {
          const val = pAttachment[i].name;
          const valExtension = val.substring(val.lastIndexOf(".")).toLowerCase().slice(1);
          switch (valExtension) {
            case "jpeg":
            case "jpg":
            case "png":
            case "pdf":
              break;
            default:
              setAlertMessage({
                type: "error",
                message: "Please select only jpeg,jpg,png,pdf extension attachment.",
              });
              return;
          }
        }
        for (let i = 0; i < pAttachment.length; i++) {
          pAttachmentSize = +pAttachment[i].size;
        }
        if (pAttachmentSize > 10485760) {
          setAlertMessage({
            type: "error",
            message: "Please upload less than 10MB or 10MB attachment!",
          });
          return;
        }
      }
    try {
      const formData = {
        grievenceTicketHistoryID: 0,
        grievenceSupportTicketID: ticketData.GrievenceSupportTicketID,
        agentUserID: ticketData.InsertUserID ? ticketData.InsertUserID : "0",
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
        ticketDescription: value,
        hasDocument: phasDocument,
        attachmentPath: "",
      };
      setBtnLoaderActive1(true);
      const result = await addGrievenceSupportTicketReview(formData);
      setBtnLoaderActive1(false);
      if (result.response.responseCode === 1) {
         debugger;
        if (result.response && result.response.responseData && result.response.responseData.GrievenceTicketHistoryID) {
          const ip = await publicIp.v4();
          const user = getSessionStorage("user");
          const newlyAddedEntry = {
            CreatedBY: user && user.UserDisplayName ? user.UserDisplayName.toString() : "",
            UserType: user && user.UserCompanyType ? user.UserCompanyType.toString() : "",
            AgentUserID: ticketData.InsertUserID ? ticketData.InsertUserID : "0",
            HasDocument: phasDocument.toString(),
            InsertIPAddress: ip,
            InsertUserID: user && user.LoginID ? user.LoginID.toString() : "0",
            GrievenceSupportTicketID: ticketData.GrievenceSupportTicketID,
            GrievenceTicketHistoryID: result.response.responseData.GrievenceTicketHistoryID,
            TicketDescription: value,
            TicketHistoryDate: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
            TicketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
            IsNewlyAdded: true,
          };
          updateTicketHistorytData(newlyAddedEntry);

          ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
          ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;

          setFormValuesTicketProperties({
            ...formValuesTicketProperties,
            txtTicketStatus: {
              CommonMasterValueID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
              CommonMasterValue: formValuesTicketProperties.txtTicketStatus.CommonMasterValue,
              BMCGCode: formValuesTicketProperties.txtTicketStatus.BMCGCode,
            },
          });
          setValue("<p></p>");
          setWordcount(0);
          setReplyBoxCollapsed(!replyBoxCollapsed);
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
                   if (pAttachment.length > 0) {
                      for (let i = 0; i < pAttachment.length; i++) {
                        const formDataDoc = new FormData();
                        formDataDoc.append("filePath", pAttachmentPath);
                        formDataDoc.append("documents", pAttachment[i]);
                        formDataDoc.append("uploadedBy", "KRPH");
          
                        try {
                          const resultattachment = await gCPFileUploadData(formDataDoc);
                          if (resultattachment.responseCode === 1) {
                            pdbAttachmentPath.push({ attachmentPath: `https://pmfby.amnex.co.in/pmfby/public/krph/documents/${pAttachment[i].name}` });
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      }
                      handleResetFile();
                      try {
                        const formDataattachmentPath = {
                          attachment: pdbAttachmentPath,
                          grievenceSupportTicketID: ticketData.GrievenceSupportTicketID,
                          grievenceTicketHistoryID: result.response.responseData.GrievenceTicketHistoryID,
                        };
                        await addKRPHGrievenceTicketHistoryAttachmentData(formDataattachmentPath);
                        setapiDataAttachment({apiFor: "TCKHIS", GrievenceTicketHistoryID: result.response.responseData.GrievenceTicketHistoryID});
                      } catch (error) {
                        console.log(error);
                        setAlertMessage({
                          type: "error",
                          message: error,
                        });
                      }
                    }
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };
  const [ticketStatusList, setTicketStatusList] = useState([]);
  const [isLoadingTicketStatusList, setIsTicketStatusList] = useState(false);
  const getTicketStatusListData = async (pticketData) => {
    debugger;
    try {
      setTicketStatusList([]);
      setIsTicketStatusList(true);
      const formdata = {
        filterID: 109,
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "ticketStatus");
      setIsTicketStatusList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          let filterStatusData = [];
          const user = getSessionStorage("user");
          const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";
          if (pticketData && pticketData.GrievenceTicketSourceTypeID === 132304 && ChkBRHeadTypeID === "124002") {
            filterStatusData = result.response.responseData.masterdatabinding.filter((data) => {
              return data.CommonMasterValueID === 109302 || data.CommonMasterValueID === 109303;
            });
            setTicketStatusList(filterStatusData);
          } else if (pticketData && pticketData.GrievenceTicketSourceTypeID === 132304 && ChkBRHeadTypeID === "124003") {
            filterStatusData = result.response.responseData.masterdatabinding.filter((data) => {
              return data.CommonMasterValueID === 109302;
            });
            setTicketStatusList(filterStatusData);
          } else if (pticketData && pticketData.TicketStatusID === 109303 && (ChkBRHeadTypeID === "124001" || ChkBRHeadTypeID === "124002")) {
            filterStatusData = result.response.responseData.masterdatabinding.filter((data) => {
              return data.CommonMasterValueID === 109304;
            });
            setTicketStatusList(filterStatusData);
          } else if ((pticketData && pticketData.TicketStatusID === 109301) || (pticketData && pticketData.TicketStatusID === 109302) || (pticketData && pticketData.TicketStatusID === 109304) && ChkBRHeadTypeID === "124003") {
            filterStatusData = result.response.responseData.masterdatabinding.filter((data) => {
              return data.CommonMasterValueID === 109302 || data.CommonMasterValueID === 109303;
            });
            setTicketStatusList(filterStatusData);
          }
        } else {
          setTicketStatusList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [bankDropdownDataList, setBankDropdownDataList] = useState([]);
  const [isLoadingBankDropdownDataList, setIsLoadingBankDropdownDataList] = useState(false);
  const getBankListData = async () => {
    try {
      setIsLoadingBankDropdownDataList(true);
      const formdata = {
        filterID: 124004,
        filterID1: 0,
        masterName: "CMPLST",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "Bank Data");
      setIsLoadingBankDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
            setBankDropdownDataList(result.response.responseData.masterdatabinding);
          } else {
            setBankDropdownDataList([]);
          }
        } else {
          setBankDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [btnloaderStatusTicketActive, setBtnloaderStatusTicketActive] = useState(false);
  const updateStatusSupportTicketOnClick = async () => {
    try {
      const chkAccessALL = ticketData && ticketData.AccessALL ? ticketData.AccessALL : "";

      const chkRightResolved =
        ticketData && ticketData.RightResolved && ticketData.RightResolved === 1
          ? true
          : ticketData.RightResolved === 0
            ? false
            : ticketData.RightResolved === undefined
              ? ""
              : "";
      if (chkAccessALL === "E") {
        if (chkRightResolved === false) {
          setAlertMessage({
            type: "warning",
            message: "You do not have right to change status!",
          });
          return;
        }
      }

      if (chkAccessALL === "N") {
        if (chkRightResolved === false) {
          setAlertMessage({
            type: "warning",
            message: "You do not have right to change status!",
          });
          return;
        }
      }
      const user = getSessionStorage("user");
      const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";
      const ChkAppAccessTypeID = user && user.AppAccessTypeID ? user.AppAccessTypeID.toString() : "0";

      if (ChkBRHeadTypeID === "124001" || ChkBRHeadTypeID === "124002") {
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
          setAlertMessage({
            type: "warning",
            message: "CSC user can not resolved the ticket ",
          });
          return;
        }
        if (ticketData.TicketStatusID.toString() === "109303") {
          if (
            formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109014" ||
            formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019"
          ) {
            setAlertMessage({
              type: "warning",
              message: "CSC user can not change the status(In-Progress or Open) or  if status is resolved ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            if (ticketData.TicketHeaderID.toString() === "2") {
              setAlertMessage({
                type: "warning",
                message: "CSC user can not Re-Open the ticket with ticket type(Information) ",
              });
              return;
            }
          }
        }
      }

      if (ChkBRHeadTypeID === "124003") {
        if (ChkAppAccessTypeID === "472") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019") {
            setAlertMessage({
              type: "warning",
              message: "Insurance admin user can not Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "Insurance admin user can not Re-Open the ticket ",
            });
            return;
          }
        }
        if (ChkAppAccessTypeID === "503") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Re-Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Resolved the ticket ",
            });
            return;
          }
        }
      }

      const formData = {
        farmerSupportTicketID: ticketData.FarmerSupportTicketID,
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
      };
      setBtnloaderStatusTicketActive(true);
      const result = await farmerTicketStatusUpdate(formData);
      setBtnloaderStatusTicketActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
        ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;
        // A if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
        // A  SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
        // A }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

    const [btnLoaderActiveComment, setbtnLoaderActiveComment] = useState(false);
    const handleAddComment = async (e) => {
      debugger;
      try {
        if (e) e.preventDefault();
        let popUpMsg = "";
        const strippedText = value.replace(/<[^>]*>/g, "").trim();

    if (!strippedText) {
      popUpMsg = "Ticket comment is required!";
      setAlertMessage({
        type: "warning",
        message: popUpMsg,
      });
      return;
    }
        const formData = {
          grievenceTicketHistoryID: 0,
          grievenceSupportTicketID: ticketData.GrievenceSupportTicketID,
          userID: ticketData.InsertUserID ? ticketData.InsertUserID : "0",
          ticketStatusID: ticketData && ticketData.TicketStatusID ? ticketData.TicketStatusID : 0,
          ticketDescription: value,
          hasDocument: 0,
          attachmentPath: "",
        };
        setbtnLoaderActiveComment(true);
        const result = await addKRPHGrievanceSupportTicketComment(formData);
        setbtnLoaderActiveComment(false);
        if (result.response.responseCode === 1) {
          if (result.response && result.response.responseData && result.response.responseData.GrievenceTicketReviewHistoryID) {
            const ip = await publicIp.v4();
            const user = getSessionStorage("user");
            const newlyAddedEntry = {
              CreatedBY: user && user.UserDisplayName ? user.UserDisplayName.toString() : "",
              UserType: user && user.UserCompanyType ? user.UserCompanyType.toString() : "",
              AgentUserID: ticketData.InsertUserID ? ticketData.InsertUserID : "0",
              HasDocument: 0,
              InsertIPAddress: ip,
              InsertUserID: user && user.LoginID ? user.LoginID.toString() : "0",
              SupportTicketID: ticketData.SupportTicketID,
              TicketDescription: value,
              TicketHistoryDate: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
              TicketStatusID: 0,
              AttachmentPath: "",
              IsNewlyAdded: true,
            };
            updateTicketHistorytData(newlyAddedEntry);
            setValue("<p></p>");
            setWordcount(0);
            setReplyBoxCollapsed(!replyBoxCollapsed);
            setAlertMessage({
              type: "success",
              message: result.response.responseMessage,
            });
          }
        } else {
          setAlertMessage({
            type: "warning",
            message: result.response.responseMessage,
          });
        }
      } catch (error) {}
    };

  return {
    value,
    setValue,
    replyBoxCollapsed,
    setReplyBoxCollapsed,
    ticketStatusBtn,
    setTicketStatusBtn,
    chatListDetails,
    isLoadingchatListDetails,
    getChatListDetailsData,
    ticketData,
    handleSave,
    formValuesTicketProperties,
    updateStateTicketProperties,
    ticketStatusList,
    isLoadingTicketStatusList,
    getTicketStatusListData,
    bankDropdownDataList,
    isLoadingBankDropdownDataList,
    getBankListData,
    btnloaderStatusTicketActive,
    updateStatusSupportTicketOnClick,
    // Anil funstion not in use
    updateStatusSupportTicket,
    // Anil funstion not in use
    showMoreChatListOnClick,
    wordcount,
    setWordcount,
    btnLoaderActive1,
    fileRef,
    formValidationSupportTicketReviewError,
    handleResetFile,
    btnLoaderActiveComment,
    handleAddComment,
    setapiDataAttachment,
    apiDataAttachment,
  };
}

export default MyTicketLogics;
