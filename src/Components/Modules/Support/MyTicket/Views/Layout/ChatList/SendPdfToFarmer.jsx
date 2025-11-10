import React, { useState, useEffect } from "react";
import { Loader } from "Framework/Components/Widgets";
import CustomerAvatar from "Framework/Assets/Images/CustomerAvatar.png";
import { FiCopy } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { RiNewspaperLine } from "react-icons/ri";
import { dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { KRPHFarmerTicketPdfData } from "../../../../MyTicket/Services/Services";
import "./SendPdfToFarmer.css";
import BizClass from "../TicketCustomerDetail/TicketCustomerDetail.module.scss";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Paper, FormControl } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MdOutlineTextsms } from "react-icons/md";
import Ticket from "../../../../../../../assets/img/ticket_band.png";
import parse from "html-react-parser";
import { Comment } from "@mui/icons-material";

const SendPdfToFarmer = ({ showfunc, selectedData }) => {
  const setAlertMessage = AlertMessage();

  const [ticketListDetails, setticketListDetails] = useState([]);
  const [isLoadingticketListDetails, setIsLoadingticketListDetails] = useState(false);
  const [steps, setsetps] = useState([]);
  const getticketListDetailsData = async () => {
    debugger;
    try {
      setIsLoadingticketListDetails(true);
      const formdata = {
        viewMode: "PDF",
        supportTicketNo: selectedData && selectedData.SupportTicketNo ? selectedData.SupportTicketNo : "",
      };
      const result = await KRPHFarmerTicketPdfData(formdata);
      setIsLoadingticketListDetails(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          const data = result.response.responseData;

          const masterObj = data.masterdatabinding[0];
          const historyObj = data.masterdatabinding[1];
          const commentObj = data.masterdatabinding[2];

          const masterTickets = Object.values(masterObj);
          const histories = Object.values(historyObj);
          const comments = Object.values(commentObj);

          const combinedTickets = masterTickets.map((ticket) => {
            const ticketHistories = histories.filter((h) => h.SupportTicketID === ticket.SupportTicketID);

            const ticketComments = comments.filter((c) => c.SupportTicketID === ticket.SupportTicketID);

            return {
              ...ticket,
              Histories: ticketHistories,
              Comments: ticketComments,
            };
          });
          setticketListDetails(combinedTickets);
        } else {
          setticketListDetails([]);
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

  const [stepsTATJourneyGrv] = useState([
    {
      tat: "TAT 1",
      color: "#0f99ef",
      text: "(3 Days) to respond the ticket missed ticket type changed to escalated ticket",
      date: "",
      icon: "",
      textId: "System Processed",
      agentName: "",
      ticket: "",
      status: "",
      ticketStatus: "",
      smsText: "",
      ageing: "0-3 days",
    },
    {
      tat: "TAT 2",
      color: "#eb0c7b",
      text: "(7 Days) to respond the ticket missed ticket type changed to escalated ticket",
      date: "",
      icon: "",
      textId: "System Processed",
      agentName: "",
      ticket: "",
      status: "",
      ticketStatus: "",
      smsText: "",
      ageing: "4-7 days",
    },
    {
      tat: "TAT 3",
      color: "#b94e00",
      text: "(12 Days) to respond the ticket missed ticket type changed to escalated ticket",
      date: "",
      icon: "",
      textId: "System Processed",
      agentName: "",
      ticket: "",
      status: "",
      ticketStatus: "",
      smsText: "",
      ageing: "8-12 days",
    },
    {
      tat: "TAT 4",
      color: "#6908b1",
      text: "(15 Days) to respond the ticket missed ticket type changed to escalated ticket",
      date: "",
      icon: "",
      textId: "System Processed",
      agentName: "",
      ticket: "",
      status: "",
      ticketStatus: "",
      smsText: "",
      ageing: "13-15 days",
    },
    {
      tat: "TAT 5",
      color: "#f06d1a",
      text: "(16 > Days) to respond the ticket missed ticket type changed to escalated ticket",
      date: "",
      icon: "",
      textId: "System Processed",
      agentName: "",
      ticket: "",
      status: "",
      ticketStatus: "",
      smsText: "",
      ageing: "16> days",
    },
  ]);

  const [stepsTATJourneyCrpLs] = useState([
    {
      tat: "TAT 1",
      color: "#0f99ef",
      text: "(10 Days) to respond the ticket missed ticket type changed to escalated ticket",
      date: "",
      icon: "",
      textId: "System Processed",
      agentName: "",
      ticket: "",
      status: "",
      ticketStatus: "",
      smsText: "",
      ageing: "0-10 days",
    },
    {
      tat: "TAT 2",
      color: "#eb0c7b",
      text: "(15 Days) to respond the ticket missed ticket type changed to escalated ticket",
      date: "",
      icon: "",
      textId: "System Processed",
      agentName: "",
      ticket: "",
      status: "",
      ticketStatus: "",
      smsText: "",
      ageing: "11-15 days",
    },
    {
      tat: "TAT 3",
      color: "#b94e00",
      text: "(20 Days) to respond the ticket missed ticket type changed to escalated ticket",
      date: "",
      icon: "",
      textId: "System Processed",
      agentName: "",
      ticket: "",
      status: "",
      ticketStatus: "",
      smsText: "",
      ageing: "16-20 days",
    },

    {
      tat: "TAT 4",
      color: "#f06d1a",
      text: "(20 > Days) to respond the ticket missed ticket type changed to escalated ticket",
      date: "",
      icon: "",
      textId: "System Processed",
      agentName: "",
      ticket: "",
      status: "",
      ticketStatus: "",
      smsText: "",
      ageing: "20> days",
    },
  ]);

  function getTicketAgeing(createdDate, ticketHistory, ticketHeaderID, pResolvedStatus) {
    if (!createdDate || !ticketHistory) return null;

    // A Find the first resolved entry
    const resolvedEntry = Object.values(ticketHistory).find((entry) => entry.TicketStatus === pResolvedStatus);

    if (!resolvedEntry) return null; // A no resolved status found

    const resolvedDate = moment(resolvedEntry.TicketHistoryDate);
    const created = moment(createdDate);

    // A Calculate difference in days
    const diffDays = resolvedDate.diff(created, "days");
    if (ticketHeaderID === 1) {
      if (diffDays >= 0 && diffDays <= 3) return "0-3";
      if (diffDays >= 4 && diffDays <= 7) return "4-7";
      if (diffDays >= 8 && diffDays <= 12) return "8-12";
      if (diffDays >= 13 && diffDays <= 15) return "13-15";
      if (diffDays >= 16) return "16>";
    } else if (ticketHeaderID === 4) {
      if (diffDays >= 0 && diffDays <= 10) return "0-10";
      if (diffDays >= 11 && diffDays <= 15) return "11-15";
      if (diffDays >= 16 && diffDays <= 20) return "16-20";
      if (diffDays >= 20) return "20>";
    }

    return null;
  }

  const getStatusWiseTemplate = (pStatusID, pData, pselectedData, pticketHistoryData, pticketStatus) => {
    let rtnStatusWiseTemplate = [];

    switch (pStatusID) {
      case 109301:
        rtnStatusWiseTemplate = [
          {
            tat: "",
            id: 1,
            color: "#f06d1a",
            text: `Farmer request received from  ( ${pData && pData.CreatedBY ? pData.CreatedBY : ""} )`,
            date:
              pData && pData.CreatedAt
                ? dateToSpecificFormat(`${pData.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(pData.CreatedAt.split("T")[1])}`, "DD-MM-YYYY HH:mm")
                : null,
            icon: <img src={Ticket} width="24px" height="24px" />,
            textId: "",
            agentName:
              pData && pData.CreatedBY === "Agent" ? `Agent Name : ${pData && pData.AgentName ? pData.AgentName : null}` : `User Name : ${pData.CreatedBY}`,
            ticket: "",
            status: "",
            ticketStatus:
              pStatusID === 109301 ? "Open" : pStatusID === 109302 ? "In-Progress" : pStatusID === 109303 ? "Resolved" : pStatusID === 109304 ? "Re-Open" : "",
            smsText: "",
            ageing: "",
          },
          {
            tat: "",
            id: 2,
            color: "#0f99ef",
            text: "Farmer ticket created",
            date:
              pData && pData.CreatedAt
                ? dateToSpecificFormat(`${pData.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(pData.CreatedAt.split("T")[1])}`, "DD-MM-YYYY HH:mm")
                : null,
            icon: <img src={Ticket} width="24px" height="24px" />,
            textId: "",
            agentName:
              pData && pData.CreatedBY === "Agent" ? `Agent Name : ${pData && pData.AgentName ? pData.AgentName : null}` : `User Name : ${pData.CreatedBY}`,
            ticket: "Ticket assigned to IC User",
            status: "",
            ticketStatus:
              pStatusID === 109301 ? "Open" : pStatusID === 109302 ? "In-Progress" : pStatusID === 109303 ? "Resolved" : pStatusID === 109304 ? "Re-Open" : "",
            smsText: "",
            ageing: "",
          },
          {
            tat: "",
            id: 3,
            color: "#6908b1",
            text: "SMS sent to farmer with ticket number",
            date: "",
            icon: <MdOutlineTextsms />,
            textId: `${""}`,
            agentName: "",
            ticket: "",
            status: "SMS sent successfully",
            ticketStatus:
              pStatusID === 109301 ? "Open" : pStatusID === 109302 ? "In-Progress" : pStatusID === 109303 ? "Resolved" : pStatusID === 109304 ? "Re-Open" : "",
            smsText: `प्रिय किसान , प्रधानमंत्री फसल बीमा योजना की सहायक सेवा से सम्पर्क करने के लिए आपका धन्यवाद । आपके द्वारा दर्ज करायी गयी शिकायत का क्रमांक है - ${pData.SupportTicketNo} "PMFBY सुरक्षित फसल, निश्चिंत किसान । फसल बीमा है सबका समाधान । CSC SPV`,
            ageing: "",
          },
        ];
        break;

      case 109302:
        rtnStatusWiseTemplate = [
          {
            tat: "",
            id: 4,
            color: "#dd5c9cff",
            text: "Ticket responded by IC User",
            date:
              pData && pData.TicketHistoryDate
                ? dateToSpecificFormat(
                    `${pData.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(pData.TicketHistoryDate.split("T")[1])}`,
                    "DD-MM-YYYY HH:mm",
                  )
                : null,
            icon: <img src={Ticket} width="24px" height="24px" />,
            textId: "",
            agentName:
              pData && pData.CreatedBY === "Agent" ? `Agent Name : ${pData && pData.AgentName ? pData.AgentName : null}` : `User Name : ${pData.CreatedBY}`,
            ticket: "",
            status: "",
            ticketStatus:
              pStatusID === 109301 ? "Open" : pStatusID === 109302 ? "In-Progress" : pStatusID === 109303 ? "Resolved" : pStatusID === 109304 ? "Re-Open" : "",
            smsText: "",
            ageing: "",
          },
        ];
        break;

      case 109303:
        let pAgeiing = "";
        let pReOpenStatus =
          pticketStatus === "Resolved"
            ? "Resolved"
            : pticketStatus === "Resolved1"
              ? "ReOpen"
              : pticketStatus === "Resolved2"
                ? "ReOpen1"
                : pticketStatus === "Resolved3"
                  ? "ReOpen2"
                  : "";
        if (pticketStatus === "Resolved") {
          pAgeiing = getTicketAgeing(pselectedData.CreatedAt, pticketHistoryData, pselectedData.TicketHeaderID, pticketStatus);
        } else if (pticketStatus === "Resolved1" || pticketStatus === "Resolved2" || pticketStatus === "Resolved3") {
          const filterDataReOpen = Object.values(pticketHistoryData).find((entry) => entry.TicketStatus === pReOpenStatus);
          if (filterDataReOpen) {
            if (Object.values(filterDataReOpen).length > 0) {
              pAgeiing = getTicketAgeing(filterDataReOpen.TicketHistoryDate, pticketHistoryData, selectedData.TicketHeaderID, pticketStatus);
            }
          }
        }
        if (pselectedData.TicketHeaderID === 1) {
          for (let i = 0; i < stepsTATJourneyGrv.length; i++) {
            if (stepsTATJourneyGrv[i].ageing.replace(" days", "") !== pAgeiing) {
              rtnStatusWiseTemplate.push(stepsTATJourneyGrv[i]);
            } else {
              break;
            }
          }
        } else if (pselectedData.TicketHeaderID === 4) {
          for (let i = 0; i < stepsTATJourneyCrpLs.length; i++) {
            if (stepsTATJourneyCrpLs[i].ageing.replace(" days", "") !== pAgeiing) {
              rtnStatusWiseTemplate.push(stepsTATJourneyCrpLs[i]);
            } else {
              break;
            }
          }
        }
        rtnStatusWiseTemplate.push(
          {
            tat: "",
            id: 5,
            color: "#eb0c7b",
            text: "Ticket responded by IC User",
            date:
              pData && pData.TicketHistoryDate
                ? dateToSpecificFormat(
                    `${pData.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(pData.TicketHistoryDate.split("T")[1])}`,
                    "DD-MM-YYYY HH:mm",
                  )
                : null,
            icon: <img src={Ticket} width="24px" height="24px" />,
            textId: "",
            agentName:
              pData && pData.UserType === "CSC" ? `Agent Name : ${pData && pData.AgentName ? pData.AgentName : null}` : `User Name : ${pData.CreatedBY}`,
            ticket: "Ticket assigned to IC Admin for response verification",
            status: "",
            ticketStatus:
              pStatusID === 109301 ? "Open" : pStatusID === 109302 ? "In-Progress" : pStatusID === 109303 ? "Resolved" : pStatusID === 109304 ? "Re-Open" : "",
            smsText: "",
            ageing: `(${pAgeiing !=null ? pAgeiing : 0 } days)`,
          },
          {
            tat: "",
            id: 6,
            color: "#01b981",
            text: "Notification sent to farmer with ticket status & link to see the IC Response",
            date: "",
            icon: <MdOutlineTextsms />,
            textId: `${""}`,
            agentName: "",
            ticket: "",
            status: "SMS sent successfully",
            ticketStatus:
              pStatusID === 109301 ? "Open" : pStatusID === 109302 ? "In-Progress" : pStatusID === 109303 ? "Resolved" : pStatusID === 109304 ? "Re-Open" : "",
            smsText: `प्रिय किसान , प्रधानमंत्री फसल बीमा योजना की सहायक सेवा से सम्पर्क करने के लिए आपका धन्यवाद । आपकी शिकायत - ${pselectedData.SupportTicketNo} का समाधान कर दिया गया है । लॉगइन कर अपनी शिकायत का समाधान देखने के लिए <a href="https://pmfby.gov.in/krph/FarmerLogin" target="_blank">pmfby.gov.in/krph/FarmerLogin</a> पर क्लिक करें। यदि आप संतुष्ट नहीं है तो कृपया 14447 पे कॉल करे । आपका दिन शुभ हो । PMFBY सुरक्षित फसल, निश्चिंत किसान । फसल बीमा है सबका समाधान । CSC SPV`,
            ageing: "",
          },
        );

        break;

      case 109304:
        rtnStatusWiseTemplate = [
          {
            tat: "",
            id: 7,
            color: "#b94e00",
            text: "Ticket reponed by farmer",
            date:
              pData && pData.TicketHistoryDate
                ? dateToSpecificFormat(
                    `${pData.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(pData.TicketHistoryDate.split("T")[1])}`,
                    "DD-MM-YYYY HH:mm",
                  )
                : null,
            icon: <img src={Ticket} width="24px" height="24px" />,
            textId: "",
            agentName:
              pData && pData.UserType === "CSC" ? `Agent Name : ${pData && pData.CreatedBY ? pData.CreatedBY : null}` : `User Name : ${pData.CreatedBY}`,
            ticket: "Ticket assigned to IC User",
            status: "",
            ticketStatus:
              pStatusID === 109301 ? "Open" : pStatusID === 109302 ? "In-Progress" : pStatusID === 109303 ? "Resolved" : pStatusID === 109304 ? "Re-Open" : "",
            smsText: "",
            ageing: "",
          },
          {
            tat: "",
            id: 8,
            color: "#f06d1a",
            text: "SMS sent to farmer with ticket number and reopened notification",
            date: "",
            icon: <MdOutlineTextsms />,
            textId: `${""}`,
            agentName: "",
            ticket: "",
            status: "SMS sent successfully",
            ticketStatus:
              pStatusID === 109301 ? "Open" : pStatusID === 109302 ? "In-Progress" : pStatusID === 109303 ? "Resolved" : pStatusID === 109304 ? "Re-Open" : "",
            smsText: `प्रियकिसान , प्रधानमंत्री फसल बीमा योजना की सहायकसेवा से सम्पर्क करने के लिए आपका धन्यवाद। आपकी शिकायत - ${pselectedData.SupportTicketNo} को पुनःजाँच एवं विचार के लिए भेज दिया गया है। आपका दिन शुभ हो। PMFBY सुरक्षित फसल, निश्चिंत किसान । फसल बीमा है सबका समाधान । CSC SPV`,
            ageing: "",
          },
        ];
        break;

      default:
        rtnStatusWiseTemplate = [];
        break;
    }

    return rtnStatusWiseTemplate;
  };

  const getCaseHistoryStepByStep = (commentsTickets,pdata) => {
    debugger;
    let rtnCommentsList = [];
   if (commentsTickets.length === 0) {
            const statusTemplate = getStatusWiseTemplate(pdata.TicketStatusID, pdata, "", "");
            rtnCommentsList = statusTemplate;
          } else if (commentsTickets.length > 0) {
            if (commentsTickets.length > 0) {
              let allTicketStatusTemplate = [];

              // A First statusTemplate (Initial)
              let statusTemplate = getStatusWiseTemplate(109301, pdata, "", "");
              allTicketStatusTemplate.push(...statusTemplate);

             commentsTickets.forEach(value => {
  if (value.TicketStatusID === 109302) {
    // A In-Process
    let statusTemplate = getStatusWiseTemplate(value.TicketStatusID, value, pdata, "", "");
    allTicketStatusTemplate.push(...statusTemplate);
  } else if (value.TicketStatusID === 109304) {
    // A Re-Open
    let statusTemplate = getStatusWiseTemplate(value.TicketStatusID, value, pdata, "", "");
    allTicketStatusTemplate.push(...statusTemplate);
  } else if (value.TicketStatusID === 109303) {
    // A Resolved
    let statusTemplate = getStatusWiseTemplate(
      value.TicketStatusID,
      value,
      pdata,
      commentsTickets,
      value.TicketStatus
    );
    allTicketStatusTemplate.push(...statusTemplate);
  }
});


              rtnCommentsList = allTicketStatusTemplate;
            }
          }

    return rtnCommentsList;
  };

  useEffect(() => {
    getticketListDetailsData();
  }, []);

  return (
    <>
      <Modal varient="half" title="" right="0" width="79.5vw" show={showfunc}>
        <Modal.Body>
          <div class="main-box">
            <div class="header">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="India Emblem" />
              <div class="divider"></div>
              <img src="https://pmfby.amnex.co.in/pmfby/public/img/logo-product.svg" alt="PMFBY Logo" />
              <div class="header-text">
                <h2>Pradhan Mantri Fasal Bima Yojana</h2>
                <p className="pTag">MINISTRY OF AGRICULTURE & FARMERS WELFARE</p>
              </div>
            </div>

            <div class="policy-bar">
              <div>
                Policy number: <b>{selectedData && selectedData.InsurancePolicyNo ? selectedData.InsurancePolicyNo : ""}</b>
              </div>
              <div>
                Application Status: <b>Approved By GOI</b>
              </div>
            </div>

            <div class="info-box">
              <div class="left-qr">
                <img src="https://pmfby.amnex.co.in/pmfby/public/krph/documents//leftQR.jpg" alt="Left QR" />
              </div>

              <div class="center-info">
                <table>
                  <tr>
                    <td>State</td>
                    <td>: {selectedData && selectedData.PlotStateName ? selectedData.PlotStateName : ""}</td>
                  </tr>
                  <tr>
                    <td>Scheme</td>
                    <td>: {selectedData && selectedData.SchemeName ? selectedData.SchemeName : ""}</td>
                  </tr>
                  <tr>
                    <td>Year</td>
                    <td>: {selectedData && selectedData.RequestYear ? selectedData.RequestYear : ""}</td>
                  </tr>
                  <tr>
                    <td>Season</td>
                    <td>
                      :{" "}
                      {selectedData && selectedData.RequestSeason && selectedData.RequestSeason === 1
                        ? "Kharif"
                        : selectedData.RequestSeason === 2
                          ? "Rabi"
                          : ""}
                    </td>
                  </tr>
                  <tr>
                    <td>Created By</td>
                    <td>: {selectedData && selectedData.CreatedBY ? selectedData.CreatedBY : ""}</td>
                  </tr>
                  <tr>
                    <td>Created At</td>
                    <td>
                      :{" "}
                      {dateToSpecificFormat(
                        `${selectedData.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(selectedData.CreatedAt.split("T")[1])}`,
                        "DD-MM-YYYY HH:mm",
                      )}
                    </td>
                  </tr>
                </table>
              </div>
              <div class="right-qr">
                <div class="whatsapp-label">WhatsApp ChatBot</div>
                <div class="right-qr-content">
                  <img src="https://pmfby.amnex.co.in/pmfby/public/img/whatsapp-chatbot-scanner.jpg" alt="Right QR" />
                  <div class="whatsapp-number">7065514447</div>
                </div>
              </div>
            </div>
            <table class="Farmer-info">
              <tr>
                <td>
                  <b>Farmer Name</b>
                </td>
                <td>{selectedData && selectedData.RequestorName ? selectedData.RequestorName : ""}</td>
              </tr>
              <tr>
                <td>
                  <b>Register Mobile number</b>
                </td>
                <td>{selectedData && selectedData.RequestorMobileNo ? selectedData.RequestorMobileNo : ""}</td>
              </tr>
              <tr>
                <td>
                  <b>Policy Number</b>
                </td>
                <td>{selectedData && selectedData.InsurancePolicyNo ? selectedData.InsurancePolicyNo : ""}</td>
              </tr>
              <tr>
                <td>
                  <b>Season & Year</b>
                </td>
                <td>
                  {" "}
                  {selectedData && selectedData.RequestSeason && selectedData.RequestSeason === 1
                    ? "Kharif"
                    : selectedData.RequestSeason === 2
                      ? "Rabi"
                      : ""} - {selectedData && selectedData.RequestYear ? selectedData.RequestYear : ""}
                </td>
              </tr>
              <tr>
                <td>
                  <b>State</b>
                </td>
                <td>{selectedData && selectedData.PlotStateName ? selectedData.PlotStateName : ""}</td>
              </tr>
              <tr>
                <td>
                  <b>District</b>
                </td>
                <td>{selectedData && selectedData.PlotDistrictName ? selectedData.PlotDistrictName : ""}</td>
              </tr>
              <tr>
                <td>
                  <b>Insurance Company</b>
                </td>
                <td>{selectedData && selectedData.InsuranceCompany ? selectedData.InsuranceCompany : ""}</td>
              </tr>
              <tr>
                <td>
                  <b>Crop Name</b>
                </td>
                <td>{selectedData && selectedData.ApplicationCropName ? selectedData.ApplicationCropName : ""}</td>
              </tr>
            </table>
            <div class="section-title">Crop Details</div>
            <table class="section-title-table">
              <thead>
                <tr>
                  <th>District</th>
                  <th>Village</th>
                  {/* <th>IU Level</th> */}
                  <th>Crop</th>
                  {/* <th>Khata No</th> */}
                  <th>Survey No</th>
                  {/* <th>Sum Insured (₹)</th> */}
                  <th>Area Insured (Hect./Plants)</th>
                  {/* <th>Gov. Share (₹)</th> */}
                  <th>Farmer Share (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedData && selectedData.PlotDistrictName ? selectedData.PlotDistrictName : ""}</td>
                  <td>{selectedData && selectedData.PlotVillageName ? selectedData.PlotVillageName : ""}</td>
                  {/* <td></td> */}
                  <td>{selectedData && selectedData.ApplicationCropName ? selectedData.ApplicationCropName : ""}</td>
                  {/* <td></td> */}
                  <td>{selectedData && selectedData.LandSurveyNumber ? selectedData.LandSurveyNumber : ""}</td>
                  {/* <td></td> */}
                  <td>{selectedData && selectedData.AREA ? selectedData.AREA : ""}</td>
                  {/* <td></td> */}
                  <td>{selectedData && selectedData.FarmerShare ? selectedData.FarmerShare : ""}</td>
                </tr>
              </tbody>
            </table>
            <table class="summary-table no-inner-border" style={{ display: "none" }}>
              <tr>
                <td>
                  <b>Total Area Insured (Hect./Plants):</b>
                  <br />
                </td>
                <td>
                  <b>Total Premium Paid:</b>
                  <br />
                  <span class="currency">₹</span>
                </td>
                <td>
                  <b>Total Sum Insured:</b>
                  <br />
                  <span class="currency">₹</span>
                </td>
              </tr>
            </table>
            {!isLoadingticketListDetails ? (
              ticketListDetails && ticketListDetails.length > 0 ? (
                ticketListDetails.map((data, i) => {
                  return (
                    <>
                      <div class="containerhistory">
                        <div class="left-panel">
                          <div class="ticketcard">
                            <div class="ticketheader">
                              <div class="leftpanel">
                                <h1>
                                  <strong>Ticket Number : </strong> {data && data.SupportTicketNo ? data.SupportTicketNo : null}
                                </h1>
                                <h1>
                                  <strong>Ticket Type : </strong>
                                  {data && data.TicketHeadName ? data.TicketHeadName : null} →{" "}
                                  {data && data.TicketCategoryName ? data.TicketCategoryName : null} →{" "}
                                  {data && data.TicketSubCategoryName ? data.TicketSubCategoryName : null}{" "}
                                </h1>
                                <h1>
                                  <strong>Source : </strong> {data && data.CreatedBY ? data.CreatedBY : null}
                                </h1>
                              </div>
                              <div class="rightpanel">
                                <span className={`status ${data?.TicketStatus?.toLowerCase().replaceAll("-", "") || ""}`}>{data?.TicketStatus || ""}</span>
                              </div>
                            </div>
                          </div>
                          <Accordion defaultExpanded sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                              sx={{
                                backgroundColor: "#4a90e2",
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
                                <Grid item xs={10} md={4}>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    Activity 1 : Ticket Created
                                  </Typography>
                                </Grid>
                                <Grid item xs={10} md={3}>
                                  <Typography variant="subtitle2" fontWeight="bold" textAlign="center">
                                    {dateToSpecificFormat(
                                      `${data.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(data.CreatedAt.split("T")[1])}`,
                                      "DD-MM-YYYY HH:mm",
                                    )}
                                  </Typography>
                                </Grid>
                                <Grid item xs={10} md={4}>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    Name : {data && data.AgentName ? data.AgentName : null}
                                  </Typography>
                                </Grid>
                                <Grid item xs={10} md={4}>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {data && data.CreatedType === "Agent"
                                      ? `Agent ID: ${data && data.CallingUserID ? data.CallingUserID : null}`
                                      : data.CreatedType}
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
                                      Description :
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {data && data.TicketDescription ? parse(data.TicketDescription) : null}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Paper>
                            </AccordionDetails>
                          </Accordion>
                          {data && data.Histories && data.Histories.length > 0
                            ? data.Histories.map((v, i) => {
                                return (
                                  <Accordion
                                    sx={{ borderRadius: 2, boxShadow: 3, mb: 1, overflow: "hidden" }}
                                    key={i}
                                    defaultExpanded
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                      sx={{
                                        backgroundColor: "#4a90e2",
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
                                            Activity {i + 1 + 1} : {v.TicketStatus}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={10} md={3}>
                                          <Typography variant="subtitle2" fontWeight="bold" textAlign="center">
                                            {dateToSpecificFormat(
                                              `${v.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(v.TicketHistoryDate.split("T")[1])}`,
                                              "DD-MM-YYYY HH:mm",
                                            )}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={10} md={3}>
                                          <Typography variant="subtitle2" fontWeight="bold">
                                            Name : {v.CreatedBY ? v.CreatedBY.split(" ")[0] : ""}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={10} md={3}>
                                          <Typography variant="subtitle2" fontWeight="bold">
                                            {v.UserType === "CSC" ? `Agent ID : ${v && v.CallingUserID ? v.CallingUserID : "NA"}` : data.UserType}
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
                                          <Grid item xs={12} md={12}>
                                            {/* Header row: Description + Audit button */}
                                            <Grid container justifyContent="space-between" alignItems="center">
                                              <Grid item>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                  Description :
                                                </Typography>
                                              </Grid>
                                              {v && v.isAudit === 1 && v.TicketStatusID === 109303 ? (
                                                <Grid item>
                                                  <button
                                                    style={{
                                                      backgroundColor: "#55d464ff",
                                                      color: "#ffffff",
                                                      border: "1px solid #1ce447ff",
                                                      borderRadius: "10px",
                                                      padding: "5px 15px",
                                                      fontSize: "14px",
                                                      fontWeight: "400",
                                                    }}
                                                  >
                                                    Audited
                                                  </button>
                                                </Grid>
                                              ) : null}
                                            </Grid>

                                            {/* Description Text */}
                                            <Typography variant="body2" color="text.secondary" mt={1}>
                                              {v && data.TicketDescription ? parse(v.TicketDescription) : null}
                                            </Typography>

                                            {v && data.isSatisfied === 0 && v.AuditRemarks !== "" && v.TicketStatusID === 109303 ? (
                                              <>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                  Reason :{" "}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                  {v && v.AuditRemarks ? v.AuditRemarks : null}
                                                </Typography>{" "}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </Grid>
                                        </Grid>
                                      </Paper>
                                    </AccordionDetails>
                                  </Accordion>
                                );
                              })
                            : null}
                        </div>

                        <div class="right-panel">
                          <div className={BizClass.CustomerBox} id="pdf-last-section">
                            <div className={BizClass.Heading}>
                              <div className={BizClass.ReqInfo}>
                                <img src={CustomerAvatar} alt="Customer" />
                                <h3>{data.RequestorName ? data.RequestorName : ""}</h3>
                                <br />
                                <p>{data.RequestorMobileNo && data.RequestorMobileNo ? `+91  ${data.RequestorMobileNo}` : null}</p>
                              </div>
                              <div className={BizClass.ActionBox}>
                                <HiDotsVertical />
                                <BsFillArrowDownCircleFill title="Download Farmer Information" style={{ cursor: "pointer" }} />
                              </div>
                            </div>
                            <div className={BizClass.MainBox}>
                              <div className={BizClass.InfoBox} id="iwant_flex">
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Season - Year :
                                    <span id="spnSeasonYear">
                                      {data && data.RequestSeason && data.RequestSeason === 1 ? "Kharif" : data.RequestSeason === 2 ? "Rabi" : ""} -{" "}
                                      {data && data.RequestYear ? data.RequestYear : ""}
                                    </span>
                                  </p>
                                  <FiCopy />
                                </div>
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Residential Location :
                                    <span id="spnInsStateDistrict">
                                      {data && data.StateMasterName ? data.StateMasterName : ""}{" "} 
                {data && data.DistrictMasterName  ? `, ${data.DistrictMasterName}` : ""}{" "}
                {data && data.SubDistrictName ? `, ${data.SubDistrictName}` : ""}{" "}
                {data && data.VillageName  ? `, ${data.VillageName}` : ""} 
                                    </span>
                                  </p>
                                  <FiCopy />
                                </div>
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Land Location :
                                    <span id="spnLandDistrictVillage">
                                      {data && data.PlotStateName  ? data.PlotStateName : ""}{" "}
                {data && data.PlotDistrictName  ? `, ${data.PlotDistrictName}` : ""}{" "}
                {data && data.PlotVillageName  ? `, ${data.PlotVillageName}` : ""}{" "} 
                                    </span>
                                  </p>
                                  <FiCopy />
                                </div>
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Ins Company :<span id="spnInsCompany">{data && data.InsuranceCompany ? data.InsuranceCompany : ""}</span>
                                  </p>
                                  <FiCopy />
                                </div>
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Policy No :<span id="spnPolicyNo">{data && data.InsurancePolicyNo ? data.InsurancePolicyNo : ""}</span>
                                  </p>
                                  <FiCopy />
                                </div>
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Application No :<span id="spnApplicationNo">{data && data.ApplicationNo ? data.ApplicationNo : ""}</span>
                                  </p>
                                  <FiCopy />
                                </div>
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Land Survey Or Land Division Number :
                                    <span id="spnLandSurveyDivision">
                                      {data && data.LandSurveyNumber  ? data.LandSurveyNumber : ""} Or{" "}
                {data && data.LandDivisionNumber  ? data.LandDivisionNumber : ""} 
                                    </span>
                                  </p>
                                  <FiCopy />
                                </div>
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Area :<span id="spnArea">{data && data.PolicyArea  ? data.PolicyArea : ""}</span>
                                  </p>
                                  <FiCopy />
                                </div>
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Crop Name :<span id="spnCropName">{data && data.ApplicationCropName  ? data.ApplicationCropName : ""} </span>
                                  </p>
                                  <FiCopy />
                                </div>
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Premium Amount :<span id="spnPremiumAmount">{data && data.PolicyPremium  ? data.PolicyPremium : ""}</span>
                                  </p>
                                  <FiCopy />
                                </div>
                                {/* <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Source of Enrolment :
                                    <span id="spnSourceofEnrolment">{data && data.length > 0 ? data[0].applicationSource : ""}</span>
                                  </p>
                                  <FiCopy />
                                </div> */}
                                <div className={BizClass.SubBox}>
                                  <RiNewspaperLine />
                                  <p>
                                    Scheme :<span id="spnScheme">{data && data.SchemeName ? data.SchemeName : ""}</span>
                                  </p>
                                  <FiCopy />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div id="case_history_ticket_details">
                       <h6>Case History</h6>
                        {data &&
                          data.Comments &&
                          data.Comments.length > 0 &&
                          getCaseHistoryStepByStep(data.Comments,data).map((step, index) => (
                            <div className="card-tooltipSendPdf" key={`${step.id}-${index}`}>
                              <div
                                className="pillSendPdf top"
                                style={{
                                  borderColor: step.color,
                                  background: `linear-gradient(to bottom, ${step.color} 25%, #fff 20%)`,
                                  marginBottom: "250px",
                                }}
                              >
                                {/* Circle */}
                                <div className="circleSendPdf circle-topSendPdf" style={{ borderColor: step.color }}>
                                  <p className="iconSendPdf">{step.icon !== "" ? step.icon : <img src={Ticket} width="24px" height="24px" />}</p>
                                </div>

                                {/* Text */}
                                <div className="text-partSendPdf text-topSendPdf">
                                  <strong>{step.tat ? step.tat : ""}</strong>
                                  <p>{step.text}</p>
                                  <strong style={{ fontSize: "12px" }}>{step.ticketStatus}</strong>
                                  <p>
                                    {" "}
                                    <strong style={{ fontSize: "12px" }}>{step.ageing}</strong>{" "}
                                  </p>
                                </div>

                                {/* Connector */}
                                <div className="connectorSendPdf connector-bottomSendPdf">
                                  <span className="dot" style={{ background: step.color }}></span>
                                </div>

                                {/* Always visible details */}
                                <div className="detailsSendPdf details-bottomSendPdf">
                                  <p>{step.textId}</p>
                                  <p>{step.agentName}</p>
                                  <p>{step.date}</p>
                                  <strong>{step.ticket}</strong>
                                  <p className="successSendPdf">{step.status}</p>
                                </div>
                              </div>

                              {/* Hover card (summary info only) */}
                              {step.smsText !== "" ? (
                                <div className="hover-cardSendPdf">
                                  <p dangerouslySetInnerHTML={{ __html: step.smsText }} />
                                </div>
                              ) : null}
                            </div>
                          ))}
                      </div>
                      <hr />
                    </>
                  );
                })
              ) : null
            ) : (
              <Loader />
            )}
            <br />
            <div>
              <h6 className="h6Tag">Important Note: </h6>
              <p className="pTag">
                The last page of this document contains verification points and general advisory related to the farmer’s enrollment and insurance coverage.
                Applicants must adhere to the terms and conditions of the scheme.
              </p>

              <h6 className="h6Tag">Disclaimer: </h6>
              <p className="pTag">
                This document is only for payment of the insurance premium by the farmer. As per the operational guidelines of the Pradhan Mantri Fasal Bima
                Yojana (PMFBY), the farmer’s participation in the scheme will be determined after verification of the required documents.
              </p>
              <hr className="hrTag" />
              <h6 className="h6Tag"> Important Points to Consider Before Participating in the Scheme:</h6>
              <p className="pTag">
                (a) After receiving the registration receipt, the information entered by the Walker Agent / CSC-VLE / Bank / Intermediary should be
                cross-checked. Land details, bank account number, insured crop, insured area, and premium amount must be verified again at the time of
                enrollment.{" "}
              </p>
              <p className="pTag">
                (b) The authenticity of this registration receipt can be verified by scanning the QR code printed on page 1 of the receipt. The applicant farmer
                should verify the land and related details obtained through the QR scan.
              </p>
              <p className="pTag">
                (c) In case of any discrepancy in the registration details, the applicant farmer is advised to immediately report it to the Walker Agent / CSC
                Center / Bank / Intermediary for correction.
              </p>

              <hr className="hrTag" />
              <h6 className="h6Tag">General Instructions for Applicant Farmers: </h6>
              <p className="pTag">
                (a) The applicant farmer is not required to pay any additional service or processing fee for enrollment through any mode. Only the farmer’s
                premium amount is payable.{" "}
              </p>
              <p className="pTag">
                (b) If any incorrect information is found in the portal data or the attached documents, the respective application may be rejected.{" "}
              </p>
              <p className="pTag">
                (c) As per the scheme guidelines, in case of natural calamities (hailstorm, landslide, flood, cloudburst, lightning) or post-harvest losses
                (storm, unseasonal rain, etc.), the farmer must inform the bank or concerned department within 72 hours through the Crop Insurance App.
              </p>
              <p className="pTag">
                (d) The claim amount under the scheme is determined based on the shortfall in average yield as assessed through CCEs (Crop Cutting Experiments)
                in the notified insurance area. Data declared by any other department or institution on drought or flood conditions will not be considered.
              </p>
              <p className="pTag">
                (e) Farmers can track the status of their applications through the Aadhaar-based Crop Insurance App, available on the Google Play Store and at{" "}
                <a href="https://pmfby.gov.in/" target="_blank">
                  www.pmfby.gov.in
                </a>
                .
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SendPdfToFarmer;
