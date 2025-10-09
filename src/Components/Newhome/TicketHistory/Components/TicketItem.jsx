import classNames from "classnames";
import React, { useState, useRef } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BizClass from "../TicketHistory.module.scss";
import moment from "moment";
import parse from "html-react-parser";
// A import FutureGeneraliLogo from "../../../../assets/ICLogo/FutureGen.jpeg";
import FutureGeneraliLogo from "../../../../assets/ICLogo/FutureGen.png";
import Aic from "../../../../assets/ICLogo/Aic.png";
import BajajAl from "../../../../assets/ICLogo/BajajAllianza.jpeg";
import CholaMS from "../../../../assets/ICLogo/CholaMS.png";
import HdfcErgo from "../../../../assets/ICLogo/HdfcErgo.jpeg";
import IciciLom from "../../../../assets/ICLogo/IciciLomb.png";
import IfcoTokia from "../../../../assets/ICLogo/IfcoTokio.jpeg";
import kShema from "../../../../assets/ICLogo/kshema.jpeg";
import NationInsur from "../../../../assets/ICLogo/NationalInsur.jpeg";
import NewIndia from "../../../../assets/ICLogo/NewIndiaAssur.jpeg";
import RelGen from "../../../../assets/ICLogo/RelGeneral.png";
import RoyalSund from "../../../../assets/ICLogo/RoyalSund.png";
import SbiGen from "../../../../assets/ICLogo/SbiGen.png";
import TataAig from "../../../../assets/ICLogo/TataAig.jpeg";
import UnitedIndia from "../../../../assets/ICLogo/Unitedindia.jpeg";
import UnivSompo from "../../../../assets/ICLogo/UnivSompo.png";
import Orient from "../../../../assets/ICLogo/OrientalInsur.png";
import { BiUnderline } from "react-icons/bi";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import publicIp from "public-ip";
import FarmerRating from "./FarmerRating";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Loader, Button } from "Framework/Components/Widgets";
import { Form, PageBar } from "Framework/Components/Layout";
import { dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Paper, FormControl } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { addSupportTicketReview, getMasterDataBinding } from "../../../Modules/Support/MyTicket/Services/Services";
import { gCPFileUploadData, AddKRPHTicketHistoryAttachmentData } from "../../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import TextEditor from "Framework/Components/Widgets/TextEditor/TextEditor";
import CaseHistory from "../../../Modules/Support/MyTicket/Views/Layout/ChatList/CaseHistory";
import { display } from "@mui/system";
const TicketItem = ({ item: ticket, isExpanded, onExpand, chatListDetails, isLoadingchatListDetails, expanded, setExpanded, updateTicketHistorytData }) => {
  const isResolved = ticket.TicketStatus === "Resolved";

  const removeHtmlTags = (str) => {
    if (!str) return "";
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const insuranceLogos = {
    "GENERALI CENTRAL INSURANCE COMPANY LTD.": FutureGeneraliLogo,
    "AGRICULTURE INSURANCE COMPANY": Aic,
    "BAJAJ ALLIANZ GENERAL INSURANCE CO. LTD": BajajAl,
    "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LIMITED": CholaMS,
    "HDFC ERGO GENERAL INSURANCE CO. LTD.": HdfcErgo,
    "ICICI LOMBARD GENERAL INSURANCE CO. LTD.": IciciLom,
    "IFFCO TOKIO GENERAL INSURANCE CO. LTD.": IfcoTokia,
    "KSHEMA GENERAL INSURANCE LIMITED": kShema,
    "NATIONAL INSURANCE COMPANY LIMITED": NationInsur,
    "NEW INDIA ASSURANCE COMPANY": NewIndia,
    "RELIANCE GENERAL INSURANCE CO. LTD.": RelGen,
    "ROYAL SUNDARAM GENERAL INSURANCE CO. LIMITED": RoyalSund,
    "SBI GENERAL INSURANCE": SbiGen,
    "TATA AIG GENERAL INSURANCE CO. LTD.": TataAig,
    "UNITED INDIA INSURANCE CO.": UnitedIndia,
    "UNIVERSAL SOMPO GENERAL INSURANCE COMPANY": UnivSompo,
    "ORIENTAL INSURANCE": Orient,
  };
  const getInsuranceLogo = (insuranceCompany) => {
    return insuranceLogos[insuranceCompany];
  };

  const logoPath = getInsuranceLogo(ticket.InsuranceCompany);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [open, setOpen] = useState(false);

  const handleClickCaseHistory = () => {
    debugger;
    setOpen(true);
  };

  const handleCloseCaseHistory = () => {
    setOpen(false);
  };

  const setAlertMessage = AlertMessage();

  const [value, setValue] = useState("<p></p>");
  const [replyBoxCollapsed, setReplyBoxCollapsed] = useState(true);
  const [wordcount, setWordcount] = useState(0);
  const sizeLimit = 2000;

  const toggelReOpenButton = () => {
    setReplyBoxCollapsed(!replyBoxCollapsed);
    getTicketStatusListData();
  };
  const fileRef = useRef(null);

  const [formValuesTicketProperties, setFormValuesTicketProperties] = useState({
    txtTicketStatus: null,
    txtDocumentUpload: "",
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

  const handleResetFile = async () => {
    fileRef.current.value = null;
    setFormValidationSupportTicketReviewError({});
  };

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
    if (formValuesTicketProperties.txtTicketStatus === null) {
      setAlertMessage({
        type: "warning",
        message: "Please select status",
      });
      return;
    }
    if (!handleValidationSupportTicketReview()) {
      return;
    }

    try {
      // Anil Code not in use
      // Anil let SaveTicketStatusID = "0";
      // Anil SaveTicketStatusID = ticket.TicketStatusID;
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
        supportTicketID: ticket.SupportTicketID,
        agentUserID: ticket.AgentUserID ? ticket.AgentUserID : "0",
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
        ticketDescription: value,
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
            AgentUserID: ticket.AgentUserID ? ticket.AgentUserID : "0",
            HasDocument: phasDocument.toString(),
            InsertIPAddress: ip,
            InsertUserID: user && user.LoginID ? user.LoginID.toString() : "0",
            SupportTicketID: ticket.SupportTicketID,
            TicketHistoryID: result.response.responseData.TicketHistoryID,
            TicketDescription: value,
            TicketHistoryDate: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
            TicketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
            TicketStatus: formValuesTicketProperties.txtTicketStatus.CommonMasterValue,
            AttachmentPath: "",
            IsNewlyAdded: true,
          };
          updateTicketHistorytData(newlyAddedEntry);

          ticket.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
          ticket.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;

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
                supportTicketID: ticket.SupportTicketID,
                ticketHistoryID: result.response.responseData.TicketHistoryID,
              };
              const resultdbAttachmentPath = await AddKRPHTicketHistoryAttachmentData(formDataattachmentPath);
              if (resultdbAttachmentPath.responseCode === 1) {
                console.log(resultattachment.responseMessage);
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
      setIsTicketStatusList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          const filterStatusData = result.response.responseData.masterdatabinding.filter((data) => {
            return data.CommonMasterValueID === 109304;
          });
          setTicketStatusList(filterStatusData);
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

  return (
    <>
      {open && <CaseHistory handleCloseCaseHistory={handleCloseCaseHistory} selectedData={ticket} />}
      <React.Fragment>
        <tr className={BizClass.ticketRow} onClick={onExpand}>
          <td>{ticket.SupportTicketNo}</td>
          <td>{ticket.InsurancePolicyNo}</td>
          <td>{ticket.SchemeName ?? "--"}</td>
          <td>{ticket.TicketTypeName}</td>
          <td className={classNames(BizClass.status, isResolved ? BizClass.resolved : BizClass.unresolved)}>
            {ticket.TicketStatus}
            {isExpanded ? (
              <ArrowDropUpIcon className={BizClass.arrowIcon} style={{ color: "black" }} />
            ) : (
              <ArrowDropDownIcon className={BizClass.arrowIcon} style={{ color: "black" }} />
            )}
          </td>
        </tr>

        {/* Expandable content within the same row */}
        {isExpanded && (
          <tr className={BizClass.expandableContent}>
            <td colSpan="5">
              <div className={classNames(BizClass.ticketDetails, BizClass.open)}>
                <h3>Ticket Details #{ticket.SupportTicketNo}</h3>
                {/* <div className={BizClass.detailsCol}>
                  <span>Caller Contact Number</span>
                  <span>{ticket.CallerMobileNo}</span>
                  </div> */}
                {/* <div className={BizClass.detailsCol}>
                  <span>Support Ticket No</span>
                  <span>{ticket.SupportTicketNo}</span>
                  </div> */}
                <div className={BizClass.detailsGrid} style={{ background: "white", borderRadius: "10px", paddingLeft: "20px", marginBottom: "10px" }}>
                  <div className={BizClass.detailsCol}>
                    <img
                      src={logoPath}
                      alt={ticket.InsuranceCompany}
                      className={BizClass.insuranceLogo}
                      style={{
                        width: "100px",
                        height: "auto",
                        marginTop: "10px",
                        objectFit: "contain",
                      }}
                    />
                    <span>{ticket.InsuranceCompany}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Farmer Name</strong>
                    <span>{ticket.RequestorName}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Farmer Mobile No</strong>
                    <span>{ticket.RequestorMobileNo}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Application Number</strong>
                    <span>{ticket.ApplicationNo ?? "--"}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Policy Number</strong>
                    <span>{ticket.InsurancePolicyNo ?? "--"}</span>
                  </div>
                </div>
                <div className={BizClass.detailsGrid}>
                  <div className={BizClass.detailsCol}>
                    <strong>Request Year</strong>
                    <span>{ticket.RequestYear}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Request Season </strong>
                    <span>{ticket && ticket.RequestSeason && ticket.RequestSeason === 1 ? "Kharif" : ticket.RequestSeason === 2 ? "Rabi" : ""}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Scheme Name</strong>
                    <span>{ticket.SchemeName}</span>
                  </div>
                  {/* <div className={BizClass.detailsCol}>
                  <span>Request Season</span>
                  <span>{ticket.RequestSeason}</span>
                </div> */}
                  <div className={BizClass.detailsCol}>
                    <strong>Loss Date</strong>
                    <span>{ticket.LossDate ? moment(ticket.LossDate).format("DD-MM-YYYY") : "--"}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Post Harvest Date</strong>
                    <span>{ticket.PostHarvestDate ? moment(ticket.PostHarvestDate).format("DD-MM-YYYY") : "--"}</span>
                  </div>
                  {/* <div className={BizClass.detailsCol}>
                  <span>Loss Time</span>
                  <span>{ticket.LossTime ?? "--"}</span>
                </div> */}
                  {/* <div className={BizClass.detailsCol}>
                  <span>On Time Intimation Flag</span>
                  <span>{ticket.OnTimeIntimationFlag}</span>
                </div> */}
                  <div className={BizClass.detailsCol}>
                    <strong>Application Crop Name</strong>
                    <span>{ticket.ApplicationCropName}</span>
                  </div>
                  {/* <div className={BizClass.detailsCol}>
                  <span>Crop Name</span>
                  <span>{ticket.CropName ? ticket.CropName : "--"}</span>
                </div> */}
                  <div className={BizClass.detailsCol}>
                    <strong>Area</strong>
                    <span>{ticket.AREA}</span>
                  </div>

                  {/* <div className={BizClass.detailsCol}>
                  <span>Insurance Policy Number</span>
                  <span>{ticket.InsurancePolicyNo ?? "--"}</span>
                </div> */}
                  <div className={BizClass.detailsCol}>
                    <strong>Farmer Share</strong>
                    <span>{ticket.FarmerShare ?? "--"}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Sowing Date/Seeding Date</strong>
                    <span>{ticket.SowingDate ? moment(ticket.SowingDate).format("DD-MM-YYYY") : "--"}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Ticket Type</strong>
                    <span>{ticket.TicketHeadName}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Ticket Category</strong>
                    <span>{ticket.TicketTypeName}</span>
                  </div>
                  {/* <div className={BizClass.detailsCol}>
                  <span>Ticket Status</span>
                  <span>{ticket.TicketStatus}</span>
                </div> */}

                  <div className={BizClass.detailsCol}>
                    <strong>Ticket Sub Category</strong>
                    <span>{ticket.TicketCategoryName}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Crop Category Others</strong>
                    <span>{ticket.CropCategoryOthers ? ticket.CropCategoryOthers : "--"}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>State Name</strong>
                    <span>{ticket.StateMasterName}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>District Name</strong>
                    <span>{ticket.District}</span>
                  </div>
                  <div className={BizClass.detailsCol}>
                    <strong>Village Name</strong>
                    <span>{ticket.VillageName}</span>
                  </div>
                  {/* <div className={BizClass.detailsCol}>
                  <span>Created At</span>
                  <span>{ticket.CreatedAt}</span>
                </div> */}
                  <div className={BizClass.detailsCol}>
                    <Button type="button" varient="primary" onClick={() => handleClickCaseHistory()}>
                      CASE HISTORY
                    </Button>
                  </div>
                  {ticket && ticket.TicketStatusID === 109303 ? (
                    <div className={BizClass.detailsCol}>
                      <Button type="button" varient="title" onClick={() => toggelReOpenButton()}>
                        Re Open
                      </Button>
                    </div>
                  ) : null}
                </div>
                <div className={BizClass.ReplyBox} style={{ display: replyBoxCollapsed ? "none" : "block" }}>
                  <TextEditor value={value} onChange={setValue} setWordcount={setWordcount} sizeLimit={sizeLimit} />
                  <div className={BizClass.SendBox}>
                    <p>
                      Count : {sizeLimit} / {sizeLimit - wordcount}
                    </p>
                    <Form.InputGroup label="" errorMsg={formValidationSupportTicketReviewError["txtDocumentUpload"]} style={{ display: "none" }}>
                      <Form.InputControl
                        control="input"
                        type="file"
                        accept="image/*,.pdf"
                        name="txtDocumentUpload"
                        onChange={(e) => updateStateTicketProperties(e.target.name, e.target.files)}
                        ref={fileRef}
                        multiple
                      />
                    </Form.InputGroup>
                    <Form.InputGroup column={1} style={{ display: "none" }}>
                      <Button type="button" varient="primary" onClick={() => handleResetFile()}>
                        {" "}
                        Reset File
                      </Button>
                    </Form.InputGroup>
                    <PageBar.Select
                      control="select"
                      name="txtTicketStatus"
                      options={ticketStatusList}
                      loader={isLoadingTicketStatusList ? <Loader /> : null}
                      value={formValuesTicketProperties.txtTicketStatus}
                      getOptionLabel={(option) => `${option.CommonMasterValue}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateTicketProperties("txtTicketStatus", e)}
                    />

                    <Button type="button" varient="secondary" trigger={btnLoaderActive1} onClick={(e) => handleSave(e)}>
                      Send
                    </Button>
                  </div>
                </div>
                <Accordion defaultExpanded sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    sx={{
                      backgroundColor: "#55d464ff",
                      color: "white",
                      fontWeight: "bold",
                      minHeight: 35,
                      "&.Mui-expanded": {
                        minHeight: 35,
                      },
                      "& .MuiAccordionSummary-content": {
                        margin: 0,
                        minHeight: 35,
                        alignItems: "center",
                      },
                      "& .MuiAccordionSummary-content.Mui-expanded": {
                        margin: 0,
                        minHeight: 35,
                      },
                    }}
                  >
                    <Grid container spacing={0.7}>
                      <Grid item xs={10} md={3}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Activity 1 : Ticket Generated
                        </Typography>
                      </Grid>
                      <Grid item xs={10} md={3}>
                        <Typography variant="subtitle2" fontWeight="bold" textAlign="center">
                          {dateToSpecificFormat(
                            `${ticket.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(ticket.CreatedAt.split("T")[1])}`,
                            "DD-MM-YYYY HH:mm",
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={10} md={3}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Name : {ticket && ticket.AgentName ? ticket.AgentName.split(" ")[0] : null}
                        </Typography>
                      </Grid>
                      <Grid item xs={10} md={3}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {ticket && ticket.CreatedBY === "Agent"
                            ? `Agent ID: ${ticket && ticket.CallingUserID ? ticket.CallingUserID : "NA"}`
                            : ticket.CreatedBY}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>

                  {/* Accordion Content */}
                  <AccordionDetails sx={{ backgroundColor: "#f5f7fa" }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        width: "100%",
                        backgroundColor: "white",
                      }}
                    >
                      <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={12}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Description :{" "}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {ticket && ticket.TicketDescription ? parse(ticket.TicketDescription) : null}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </AccordionDetails>
                </Accordion>
                {!isLoadingchatListDetails ? (
                  chatListDetails && chatListDetails.length > 0 ? (
                    chatListDetails.map((data, i) => {
                      return (
                        <Accordion
                          sx={{ borderRadius: 2, boxShadow: 3, mb: 1, overflow: "hidden" }}
                          key={i}
                          expanded={expanded === i}
                          onChange={handleChange(i)}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                            sx={{
                              backgroundColor: "#55d464ff",
                              color: "white",
                              fontWeight: "bold",
                              minHeight: 35,
                              "&.Mui-expanded": {
                                minHeight: 35,
                              },
                              "& .MuiAccordionSummary-content": {
                                margin: 0,
                                minHeight: 35,
                                alignItems: "center",
                              },
                              "& .MuiAccordionSummary-content.Mui-expanded": {
                                margin: 0,
                                minHeight: 35,
                              },
                            }}
                          >
                            <Grid container spacing={0.7}>
                              <Grid item xs={10} md={3}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  Activity {i + 1 + 1} : {data.TicketStatus}
                                </Typography>
                              </Grid>
                              <Grid item xs={10} md={3}>
                                <Typography variant="subtitle2" fontWeight="bold" textAlign="center">
                                  {dateToSpecificFormat(
                                    `${data.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(data.TicketHistoryDate.split("T")[1])}`,
                                    "DD-MM-YYYY HH:mm",
                                  )}
                                </Typography>
                              </Grid>
                              <Grid item xs={10} md={3}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  Name : {data.CreatedBY ? data.CreatedBY.split(" ")[0] : ""}
                                </Typography>
                              </Grid>
                              <Grid item xs={10} md={3}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {data.UserType === "CSC" ? `Agent ID : ${data && data.CallingUserID ? data.CallingUserID : "NA"}` : data.UserType}
                                </Typography>
                              </Grid>
                            </Grid>
                          </AccordionSummary>

                          <AccordionDetails sx={{ backgroundColor: "#f5f7fa" }}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                width: "100%",
                                backgroundColor: "white",
                              }}
                            >
                              <Grid container spacing={4} alignItems="center">
                                <Grid item xs={12} md={data.TicketStatusID !== 109303 ? 12 : 8}>
                                  {/* Header row: Description + Audit button */}
                                  <Grid container justifyContent="space-between" alignItems="center">
                                    <Grid item>
                                      <Typography variant="subtitle2" fontWeight="bold">
                                        Description :
                                      </Typography>
                                    </Grid>
                                  </Grid>

                                  {/* Description Text */}
                                  <Typography variant="body2" color="text.secondary" mt={1}>
                                    {data && data.TicketDescription ? parse(data.TicketDescription) : null}
                                  </Typography>
                                </Grid>
                                {data.TicketStatusID === 109303 ? (
                                  <Grid item xs={12} md={4} sx={{ textAlign: "left" }}>
                                    <Typography variant="subtitle2" fontWeight="bold" display="inline">
                                      Rating :
                                    </Typography>
                                    {data && data.Rating && data.Rating !== null ? (
                                      <div style={{ fontSize: "22px" }}>
                                        {Array.from({ length: data.Rating }, (i) => (
                                          <span
                                            key={i}
                                            style={{
                                              cursor: "pointer",
                                              color: "#ffcc00",
                                            }}
                                          >
                                            &#9733;
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <FarmerRating ticket={data} />
                                    )}
                                  </Grid>
                                ) : null}
                              </Grid>
                            </Paper>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })
                  ) : null
                ) : (
                  <Loader />
                )}
                {/* <div className={BizClass.detailsGrid}>
                <div className={BizClass.detailsCol}>
                  <strong>Ticket Description</strong>
                  <span>{ticket && ticket.TicketDescription ? parse(ticket.TicketDescription) : null}</span>
                </div>
              </div>
              <br />
              <div className={BizClass.detailsGridcomment}>
                <div className={BizClass.detailsCol}>
                  <strong>Comments</strong>
                  <span>{ticket && ticket.Comments ? parse(ticket.Comments) : "--"}</span>
                </div>
                <div className={BizClass.detailsCol} style={{paddingTop:"110px"}}>
                  {ticket.TicketStatus === "Resolved" ? <strong>Rating</strong> : null}
                  {ticket.TicketStatus === "Resolved" ? (
                    ticket && ticket.Rating && ticket.Rating !== null ? (
                      <div style={{ fontSize: "22px" }}>
                        {Array.from({ length: ticket.Rating }, (i) => (
                          <span
                            key={i}
                            style={{
                              cursor: "pointer",
                              color: "#ffcc00",
                            }}
                          >
                            &#9733;
                          </span>
                        ))}
                      </div>
                    ) : (
                      <FarmerRating ticket={ticket} />
                    )
                  ) : null}
                </div>
              </div> */}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    </>
  );
};

export default TicketItem;
