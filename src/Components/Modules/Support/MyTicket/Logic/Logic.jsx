import { useEffect, useState, useRef } from "react";
import moment from "moment";
import publicIp from "public-ip";
import { getSessionStorage, getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import {
  getSupportTicketReview,
  addSupportTicketReview,
  getMasterDataBinding,
  ticketStatusUpdate,
  editSupportTicketReview,
  addCSCSupportTicketReview,
  KrphSupportTicketAuditUpdateData,
  KrphSupportTicketSatisfiedUpdateData,
} from "../Services/Services";
import {
  getFarmerPolicyDetail,
  sendSMSToFarmer,
  gCPFileUploadData,
  AddKRPHTicketHistoryAttachmentData,
} from "../../ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { FaLaptopHouse } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function MyTicketLogics() {
  const [value, setValue] = useState("<p></p>");
  const [replyBoxCollapsed, setReplyBoxCollapsed] = useState(true);
  const [wordcount, setWordcount] = useState(0);

  const editableRef = useRef(null);
  const editableRef1 = useRef(null);

  const [content, setContent] = useState("");
  const [content1, setContent1] = useState("");
  const handleInput = () => {
    if (editableRef.current) {
      setContent(editableRef.current.innerHTML); // A get updated HTML
    }
  };

  const handleInput1 = () => {
    if (editableRef1.current) {
      setContent1(editableRef1.current.innerHTML); // A get updated HTML
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editableRef.current) {
        setContent(editableRef.current.innerHTML);

        if (editableRef1.current) {
          setContent1(editableRef1.current.innerHTML);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const resolvedTicketRight = getUserRightCodeAccess("mdh9");
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
      setFormValuesTicketProperties({
        ...formValuesTicketProperties,
        txtTicketStatus:
          pticketData && pticketData.TicketStatus && pticketData.TicketStatusID
            ? {
                CommonMasterValueID: pticketData.TicketStatusID,
                CommonMasterValue: pticketData.TicketStatus,
                BMCGCode: pticketData.BMCGCode,
              }
            : null,
      });
      setIsLoadingchatListDetails(true);
      const formdata = {
        supportTicketID: pticketData.SupportTicketID,
        pageIndex: pPageIndex,
        pageSize: pPageSize,
      };
      const result = await getSupportTicketReview(formdata);
      console.log(result, "chat List");
      setIsLoadingchatListDetails(false);
      if (result.responseCode === 1) {
        if (result.responseData.supportTicket && result.responseData.supportTicket.length > 0) {
          setChatListDetails(result.responseData.supportTicket);
        } else {
          setChatListDetails([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const showMoreChatListOnClick = () => {
    getChatListDetailsData(ticketData, 1, -1);
  };

  const [selectedPolicyDetails, setSelectedPolicyDetails] = useState([]);
  const getPolicyDetailsOfFarmer = async (pticketData) => {
    debugger;
    try {
      let result = "";
      let formData = "";

      formData = {
        mobilenumber: "7776543289",
        seasonID: pticketData && pticketData.RequestSeason ? pticketData.RequestSeason.toString() : "",
        year: pticketData && pticketData.RequestYear ? pticketData.RequestYear.toString() : "",
        farmerID: pticketData ? pticketData.TicketRequestorID : "",
      };
      result = await getFarmerPolicyDetail(formData);
      console.log(result, "applicationData");
      setSelectedPolicyDetails([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length > 0) {
            const farmersData = Object.values(result.response.responseData.data);
            if (farmersData && farmersData.length > 0) {
              const farmerAndApplicationData = [];
              farmersData.forEach((v) => {
                v.applicationList.forEach((x) => {
                  farmerAndApplicationData.push({
                    mobile: v.mobile,
                    farmerName: v.farmerName,
                    farmerID: v.farmerID,
                    aadharNumber: v.aadharNumber,
                    accountNumber: v.accountNumber,
                    relation: v.relation,
                    relativeName: v.relativeName,
                    resDistrict: v.resDistrict,
                    resState: v.resState,
                    resVillage: v.resVillage,
                    resSubDistrict: v.resSubDistrict,
                    resDistrictID: v.resDistrictID,
                    resStateID: v.resStateID,
                    resVillageID: v.resVillageID,
                    resSubDistrictID: v.resSubDistrictID,
                    policyPremium: parseFloat(v.policyPremium).toFixed(2),
                    sumInsured: parseFloat(x.sumInsured).toFixed(2),
                    policyArea: v.policyArea,
                    policyType: v.policyType,
                    scheme: v.scheme,
                    insuranceCompanyName: v.insuranceCompanyName,
                    policyID: x.policyID,
                    applicationStatus: x.applicationStatus,
                    applicationStatusCode: x.applicationStatusCode,
                    applicationNo: x.applicationNo,
                    landSurveyNumber: x.landSurveyNumber,
                    landDivisionNumber: x.landDivisionNumber,
                    applicationSource: x.applicationSource,
                    plotStateName: x.plotStateName,
                    plotDistrictName: x.plotDistrictName,
                    plotVillageName: x.plotVillageName,
                    cropName: x.cropName,
                    cropShare: parseFloat(x.cropShare).toFixed(3),
                    createdAt: x.createdAt,
                    ifscCode: x.ifscCode,
                    farmerShare: x.farmerShare,
                    sowingDate: x.sowingDate,
                  });
                });
              });
              const filteredData = farmerAndApplicationData.filter((data) => {
                return data.applicationNo === pticketData.ApplicationNo && data.policyID === pticketData.InsurancePolicyNo;
              });
              setSelectedPolicyDetails(filteredData);
            } else {
              setSelectedPolicyDetails([]);
            }
          } else {
            setSelectedPolicyDetails([]);
          }
        } else {
          setSelectedPolicyDetails([]);
        }
      } else {
        setSelectedPolicyDetails([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
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

  const [btnLoaderActiveOld, setBtnLoaderActiveOld] = useState(false);
  const handleSaveOld = async (e) => {
    if (e) e.preventDefault();
    let popUpMsg = "";
    if (value === "") {
      if (ticketStatusBtn === "Reply") {
        popUpMsg = "Ticket Reply Comment is required!";
      } else if (ticketStatusBtn === "Close") {
        popUpMsg = "Ticket Close Comment is required!";
      }
      setAlertMessage({
        type: "error",
        message: popUpMsg,
      });
      return;
    }
    try {
      let SaveTicketStatusID = "0";
      if (ticketStatusBtn === "Reply") {
        SaveTicketStatusID = ticketData.TicketStatusID;
      } else if (ticketStatusBtn === "Close") {
        SaveTicketStatusID = 109018;
      } else {
        SaveTicketStatusID = ticketData.TicketStatusID;
      }

      const formData = {
        ticketHistoryID: 0,
        supportTicketID: ticketData.SupportTicketID,
        agentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
        ticketStatusID: SaveTicketStatusID,
        ticketDescription: value,
        hasDocument: 0,
      };
      setBtnLoaderActiveOld(true);
      const result = await addSupportTicketReview(formData);
      setBtnLoaderActiveOld(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData && result.response.responseData.TicketHistoryID) {
          const ip = await publicIp.v4();
          const user = getSessionStorage("user");
          const newlyAddedEntry = {
            CreatedBY: user && user.UserDisplayName ? user.UserDisplayName.toString() : "",
            UserType: user && user.UserCompanyType ? user.UserCompanyType.toString() : "",
            AgentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
            HasDocument: 0,
            InsertIPAddress: ip,
            InsertUserID: user && user.LoginID ? user.LoginID.toString() : "1",
            SupportTicketID: ticketData.SupportTicketID,
            TicketDescription: value,
            TicketHistoryDate: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
            TicketStatusID: SaveTicketStatusID,
            IsNewlyAdded: true,
          };
          updateTicketHistorytData(newlyAddedEntry);
          setValue("<p></p>");
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });

          if (ticketStatusBtn === "Close") {
            ticketData.TicketStatusID = SaveTicketStatusID;
            ticketData.TicketStatus = "Resolved";
            setReplyBoxCollapsed(!replyBoxCollapsed);
          }
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
        message: error,
      });
    }
  };

  const SendSMSToFarmerAgaintSupportTicket = async (ptemplateID, pmobileNO, psupportTicketNo) => {
    try {
      const formData = {
        templateID: ptemplateID,
        mobileNO: pmobileNO,
        supportTicketNo: psupportTicketNo,
      };

      const result = await sendSMSToFarmer(formData);
      if (result.response.responseCode === 1) {
        console.log(`Success: TemplateID : ${ptemplateID} ${JSON.stringify(result)}`);
      } else {
        console.log(`Error: TemplateID : ${ptemplateID} ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const handleResetFile = async () => {
    fileRef.current.value = null;
    setFormValidationSupportTicketReviewError({});
  };

  const updateStatusSupportTicket = async () => {
    try {
      const formData = {
        supportTicketID: ticketData.SupportTicketID,
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
      };
      const result = await ticketStatusUpdate(formData);
      if (result.response.responseCode === 1) {
        ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
        ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;
        setReplyBoxCollapsed(!replyBoxCollapsed);
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
          SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
        }
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
        message: error,
      });
    }
  };

  const [apiDataAttachment, setapiDataAttachment] = useState({ apiFor: "", TicketHistoryID: 0 });
  const [btnLoaderActive1, setBtnLoaderActive1] = useState(false);
  const handleSave = async (e) => {
    debugger;
    if (e) e.preventDefault();
    let popUpMsg = "";
    if (value === "" || value === "<p></p>") {
      popUpMsg = "Ticket comment is required!";
      setAlertMessage({
        type: "warning",
        message: popUpMsg,
      });
      return;
    }
    if (!handleValidationSupportTicketReview()) {
      return;
    }
    const user = getSessionStorage("user");
    const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";
    const ChkAppAccessTypeID = user && user.AppAccessTypeID ? user.AppAccessTypeID.toString() : "0";
    if (formValuesTicketProperties.txtTicketStatus !== null) {
      // Anil const chkAccessALL = ticketData && ticketData.AccessALL ? ticketData.AccessALL : "";

      // Anil const chkRightResolved =
      // Anil   ticketData && ticketData.RightResolved && ticketData.RightResolved === 1
      // Anil     ? true
      //  Anil    : ticketData.RightResolved === 0
      // Anil    ? false
      // Anil    : ticketData.RightResolved === undefined
      // Anil    ? ""
      // Anil    : "";
      // Anil if (chkAccessALL === "E") {
      // Anil  if (chkRightResolved === false) {
      // Anil    setAlertMessage({
      //  Anil     type: "warning",
      //  Anil     message: "You do not have right to change status!",
      //  Anil   });
      //  Anil   return;
      //  Anil }
      // Anil }

      // Anil if (chkAccessALL === "N") {
      // Anil  if (chkRightResolved === false) {
      // Anil    setAlertMessage({
      // Anil      type: "warning",
      // Anil      message: "You do not have right to change status!",
      //  Anil   });
      //  Anil   return;
      // Anil  }
      // Anil }
      if (ticketData.TicketStatusID === formValuesTicketProperties.txtTicketStatus.CommonMasterValueID) {
        setAlertMessage({
          type: "warning",
          message: "The system does not allow updating a ticket to the same status. To change the status, please select a different option.",
        });
        return;
      }

      if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
        if (resolvedTicketRight === false) {
          setAlertMessage({
            type: "warning",
            message: "Users without the required permissions will not be able to resolve tickets.",
          });
          return;
        }
      }

      if (ChkBRHeadTypeID === "124001" || ChkBRHeadTypeID === "124002") {
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
          setAlertMessage({
            type: "warning",
            message: "CSC users are not authorized to resolve tickets.",
          });
          return;
        }
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019") {
          setAlertMessage({
            type: "warning",
            message: "CSC users are not allowed to change the ticket status from Open.",
          });
          return;
        }
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109014") {
          setAlertMessage({
            type: "warning",
            message: "CSC users are not allowed to change the ticket status from In-Progress.",
          });
          return;
        }
        if (ticketData.TicketStatusID.toString() === "109301") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "CSC users cannot Re-open a ticket if the status is Open.",
            });
            return;
          }
        }
        if (ticketData.TicketStatusID.toString() === "109302") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "CSC users cannot Re-open a ticket if the status is In-Progress.",
            });
            return;
          }
        }
        if (ticketData.TicketStatusID.toString() === "109303") {
          if (
            formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109014" ||
            formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019"
          ) {
            setAlertMessage({
              type: "warning",
              message: "CSC users cannot change the ticket status to In-Progress or Open when the status is Resolved.",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            if (ticketData.TicketHeaderID.toString() === "2") {
              setAlertMessage({
                type: "warning",
                message: " CSC users are not authorised to Re-open a ticket if the ticket type is Information.",
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
              message: "Insurance Admin users cannot Open a ticket.",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: " Insurance Admin users are not authorised to Re-Open tickets.",
            });
            return;
          }
        }
        if (ChkAppAccessTypeID === "503") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019") {
            setAlertMessage({
              type: "warning",
              message: "Insurance users cannot Open a ticket.",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "Insurance users are not authorised to Re-Open tickets.",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
            setAlertMessage({
              type: "warning",
              message: "Insurance users are not allowed to Resolve tickets.",
            });
            return;
          }
        }
      }
    }
    try {
      // Anil Code not in use
      // Anil let SaveTicketStatusID = "0";
      // Anil SaveTicketStatusID = ticketData.TicketStatusID;
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

      const formData = {
        ticketHistoryID: 0,
        supportTicketID: ticketData.SupportTicketID,
        agentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
        ticketDescription: ChkBRHeadTypeID === "124003" ? content + value + content1 : value,
        hasDocument: phasDocument,
        attachmentPath: "",
      };

      setBtnLoaderActive1(true);
      const result = await addSupportTicketReview(formData);
      setBtnLoaderActive1(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData && result.response.responseData.TicketHistoryID) {
          const ip = await publicIp.v4();
          const user = getSessionStorage("user");
          const newlyAddedEntry = {
            CreatedBY: user && user.UserDisplayName ? user.UserDisplayName.toString() : "",
            UserType: user && user.UserCompanyType ? user.UserCompanyType.toString() : "",
            AgentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
            HasDocument: phasDocument.toString(),
            InsertIPAddress: ip,
            InsertUserID: user && user.LoginID ? user.LoginID.toString() : "0",
            SupportTicketID: ticketData.SupportTicketID,
            TicketHistoryID: result.response.responseData.TicketHistoryID,
            TicketDescription: ChkBRHeadTypeID === "124003" ? content + value + content1 : value,
            TicketHistoryDate: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
            TicketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
            TicketStatus: formValuesTicketProperties.txtTicketStatus.CommonMasterValue,
            AttachmentPath: "",
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
                } else if (resultattachment.responseCode === 0) {
                  setAlertMessage({
                    type: "error",
                    message: resultattachment.responseMessage,
                  });
                }
              } catch (error) {
                console.log(error);
              }
            }
            handleResetFile();
            try {
              const formDataattachmentPath = {
                attachment: pdbAttachmentPath,
                supportTicketID: ticketData.SupportTicketID,
                ticketHistoryID: result.response.responseData.TicketHistoryID,
              };
              const resultdbAttachmentPath = await AddKRPHTicketHistoryAttachmentData(formDataattachmentPath);
              if (resultdbAttachmentPath.responseCode === 1) {
                setapiDataAttachment({ apiFor: "TCKHIS", TicketHistoryID: result.response.responseData.TicketHistoryID });
              } else if (resultdbAttachmentPath.responseCode === 0) {
                setAlertMessage({
                  type: "error",
                  message: resultattachment.responseMessage,
                });
              }
            } catch (error) {
              console.log(error);
              setAlertMessage({
                type: "error",
                message: error,
              });
            }
          }
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
            SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
          } else if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            SendSMSToFarmerAgaintSupportTicket("R", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
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
        message: error,
      });
    }
  };
  const [ticketStatusList, setTicketStatusList] = useState([]);
  const [isLoadingTicketStatusList, setIsTicketStatusList] = useState(false);
  const getTicketStatusListData = async () => {
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
          setTicketStatusList(result.response.responseData.masterdatabinding);
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
        message: error,
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
        message: error,
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
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109014") {
          setAlertMessage({
            type: "warning",
            message: "CSC user can not change the ticket status(In-Progress)",
          });
          return;
        }
        if (ticketData.TicketStatusID.toString() === "109014") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "CSC user can not Re-Open the ticket if status is In-Progress",
            });
            return;
          }
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
        supportTicketID: ticketData.SupportTicketID,
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
      };
      setBtnloaderStatusTicketActive(true);
      const result = await ticketStatusUpdate(formData);
      setBtnloaderStatusTicketActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
        ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
          SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
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
        message: error,
      });
    }
  };

  const [valueEditTicketComment, setValueEditTicketComment] = useState("<p></p>");
  const [wordcountEditTicketComment, setWordcountEditTicketComment] = useState(0);
  const [selectedHistoryData, setSelectedHistoryData] = useState();
  const [btnLoaderActiveEditTicketComment, setbtnLoaderActiveEditTicketComment] = useState(false);
  const handleSaveEditTicketComment = async (toggleEditTicketCommentModal) => {
    console.log(ticketData);
    if (valueEditTicketComment === "" || valueEditTicketComment === "<p></p>" || valueEditTicketComment === "<p><br></p>") {
      popUpMsg = "Ticket comment is required!";
      setAlertMessage({
        type: "warning",
        message: popUpMsg,
      });
      return;
    }

    try {
      const formData = {
        ticketHistoryID: selectedHistoryData.TicketHistoryID,
        supportTicketID: selectedHistoryData.SupportTicketID,
        ticketDescription: valueEditTicketComment,
      };
      setbtnLoaderActiveEditTicketComment(true);
      const result = await editSupportTicketReview(formData);
      setbtnLoaderActiveEditTicketComment(FaLaptopHouse);
      if (result.response.responseCode === 1) {
        for (let i = 0; i < chatListDetails.length; i += 1) {
          if (selectedHistoryData.TicketHistoryID === chatListDetails[i].TicketHistoryID) {
            chatListDetails[i].TicketDescription = valueEditTicketComment;
            break;
          }
        }
        setChatListDetails(chatListDetails);
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        toggleEditTicketCommentModal();
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
        message: error,
      });
    }
  };

  const [btnLoaderActiveComment, setbtnLoaderActiveComment] = useState(false);
  const handleAddComment = async (e) => {
    try {
      if (e) e.preventDefault();
      let popUpMsg = "";
      if (value === "" || value === "<p></p>") {
        popUpMsg = "Ticket comment is required!";
        setAlertMessage({
          type: "warning",
          message: popUpMsg,
        });
        return;
      }
      const formData = {
        ticketHistoryID: 0,
        supportTicketID: ticketData.SupportTicketID,
        agentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
        ticketStatusID: ticketData && ticketData.TicketStatusID ? ticketData.TicketStatusID : 0,
        ticketDescription: value,
        hasDocument: 0,
        attachmentPath: "",
      };
      setbtnLoaderActiveComment(true);
      const result = await addCSCSupportTicketReview(formData);
      setbtnLoaderActiveComment(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData && result.response.responseData.TicketReviewHistoryID) {
          const ip = await publicIp.v4();
          const user = getSessionStorage("user");
          const newlyAddedEntry = {
            CreatedBY: user && user.UserDisplayName ? user.UserDisplayName.toString() : "",
            UserType: user && user.UserCompanyType ? user.UserCompanyType.toString() : "",
            AgentUserID: ticketData.AgentUserID ? ticketData.AgentUserID : "0",
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

  const [formValidationSatisfyError, setFormValidationSatisfyError] = useState({});

  const [formValuesSatifation, setFormValuesSatifation] = useState({
    txtIsSatisfy: null,
    txtReason: "",
  });
  const updateStateSatifation = (name, value) => {
    setFormValuesSatifation({ ...formValuesSatifation, [name]: value });
    formValidationSatisfyError[name] = validateFieldSatifation(name, value);
  };

  const validateFieldSatifation = (name, value) => {
    let errorsMsg = "";
    if (name === "txtIsSatisfy") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Is Satisfied is required!";
      }
    }
    if (name === "txtunUnstatisfactoryReason") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Unstatisfactory Reason is required!";
      }
    }
    return errorsMsg;
  };

  const handleValidationSatifation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtIsSatisfy"] = validateFieldSatifation("txtIsSatisfy", formValuesSatifation.txtIsSatisfy);
      if (formValuesSatifation && formValuesSatifation.txtIsSatisfy && formValuesSatifation.txtIsSatisfy.value === 0) {
        errors["txtunUnstatisfactoryReason"] = validateFieldSatifation("txtunUnstatisfactoryReason", formValuesSatifation.txtunUnstatisfactoryReason);
      }

      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationSatisfyError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const [IsSatisfyList] = useState([
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ]);

  const [btnLoaderActiveAudit, setbtnLoaderActiveAudit] = useState(false);
  const handleAudit = async (data) => {
    debugger;
    try {
      const formData = {
        ticketHistoryID: data.TicketHistoryID,
        isAudit: 1,
      };
      setbtnLoaderActiveAudit(true);
      const result = await KrphSupportTicketAuditUpdateData(formData);
      setbtnLoaderActiveAudit(false);
      if (result.response.responseCode === 1) {
        for (let i = 0; i < chatListDetails.length; i += 1) {
          if (data.TicketHistoryID === chatListDetails[i].TicketHistoryID) {
            chatListDetails[i].isAudit = 1;
            break;
          }
        }
        setChatListDetails(chatListDetails);
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
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
        message: error,
      });
    }
  };

  const [btnLoaderActiveSatisfaction, setbtnLoaderActiveSatisfaction] = useState(false);
  const handleSatisfaction = async (data) => {
    debugger;
    if (!handleValidationSatifation()) {
      return;
    }

    try {
      const formData = {
        ticketHistoryID: data.TicketHistoryID,
        isSatisfied:
          formValuesSatifation && formValuesSatifation.txtIsSatisfy && formValuesSatifation.txtIsSatisfy.value ? formValuesSatifation.txtIsSatisfy.value : 0,
        auditRemarks: formValuesSatifation && formValuesSatifation.txtunUnstatisfactoryReason ? formValuesSatifation.txtunUnstatisfactoryReason : "",
      };
      setbtnLoaderActiveSatisfaction(true);
      const result = await KrphSupportTicketSatisfiedUpdateData(formData);
      setbtnLoaderActiveSatisfaction(false);
      if (result.response.responseCode === 1) {
        for (let i = 0; i < chatListDetails.length; i += 1) {
          if (data.TicketHistoryID === chatListDetails[i].TicketHistoryID) {
            chatListDetails[i].isSatisfied = formValuesSatifation.txtIsSatisfy.value;
            chatListDetails[i].AuditRemarks = formValuesSatifation.txtunUnstatisfactoryReason;
            break;
          }
        }
        setChatListDetails(chatListDetails);
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
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
        message: error,
      });
    }
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
    selectedPolicyDetails,
    getPolicyDetailsOfFarmer,
    handleSaveOld,
    wordcount,
    setWordcount,
    btnLoaderActiveOld,
    btnLoaderActive1,
    formValidationSupportTicketReviewError,
    valueEditTicketComment,
    setValueEditTicketComment,
    handleSaveEditTicketComment,
    btnLoaderActiveEditTicketComment,
    wordcountEditTicketComment,
    setWordcountEditTicketComment,
    setSelectedHistoryData,
    fileRef,
    handleResetFile,
    btnLoaderActiveComment,
    handleAddComment,
    setapiDataAttachment,
    apiDataAttachment,
    handleInput,
    editableRef,
    handleInput1,
    editableRef1,
    updateStateSatifation,
    formValuesSatifation,
    formValidationSatisfyError,
    IsSatisfyList,
    btnLoaderActiveSatisfaction,
    handleSatisfaction,
    btnLoaderActiveAudit,
    handleAudit,
  };
}

export default MyTicketLogics;
