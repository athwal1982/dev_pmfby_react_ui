import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import { Close } from "@mui/icons-material";
import "./CaseHistory.css";
import { MdOutlineTextsms } from "react-icons/md";
import Ticket from "../../../../../../../assets/img/ticket_band.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Loader } from "Framework/Components/Widgets";
import { getkrphTicketTrailData } from "../../../../MyTicket/Services/Services";
const CaseHistory = ({ setOpen, handleCloseCaseHistory, selectedData }) => {
  const setAlertMessage = AlertMessage();

  const [steps, setsetps] = useState([]);

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [animating, setAnimating] = useState(false);

  const stepChunks = chunkArray(steps, 7);

  const changePage = (nextPage) => {
    if (nextPage < 0 || nextPage >= stepChunks.length) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentPage(nextPage);
      setAnimating(false);
    }, 300);
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
            date: dateToSpecificFormat(`${pData.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(pData.CreatedAt.split("T")[1])}`, "DD-MM-YYYY HH:mm"),
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
            date: dateToSpecificFormat(`${pData.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(pData.CreatedAt.split("T")[1])}`, "DD-MM-YYYY HH:mm"),
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
            date: dateToSpecificFormat(
              `${pData.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(pData.TicketHistoryDate.split("T")[1])}`,
              "DD-MM-YYYY HH:mm",
            ),
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
          if (Object.values(filterDataReOpen).length > 0) {
            pAgeiing = getTicketAgeing(filterDataReOpen.TicketHistoryDate, pticketHistoryData, selectedData.TicketHeaderID, pticketStatus);
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
            date: dateToSpecificFormat(
              `${pData.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(pData.TicketHistoryDate.split("T")[1])}`,
              "DD-MM-YYYY HH:mm",
            ),
            icon: <img src={Ticket} width="24px" height="24px" />,
            textId: "",
            agentName:
              pData && pData.UserType === "CSC" ? `Agent Name : ${pData && pData.AgentName ? pData.AgentName : null}` : `User Name : ${pData.CreatedBY}`,
            ticket: "Ticket assigned to IC Admin for response verification",
            status: "",
            ticketStatus:
              pStatusID === 109301 ? "Open" : pStatusID === 109302 ? "In-Progress" : pStatusID === 109303 ? "Resolved" : pStatusID === 109304 ? "Re-Open" : "",
            smsText: "",
            ageing: `(${pAgeiing} days)`,
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
            date: dateToSpecificFormat(
              `${pData.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(pData.TicketHistoryDate.split("T")[1])}`,
              "DD-MM-YYYY HH:mm",
            ),
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

  const [krphTicketTrailIsLoading, setkrphTicketTrailIsLoading] = useState(false);
  const [krphTicketTrailData, setkrphTicketTrailData] = useState([]);
  const getkrphTicketTrailListData = async () => {
    debugger;
    try {
      setkrphTicketTrailData([]);
      setkrphTicketTrailIsLoading(true);
      const formdata = {
        supportTicketNo: selectedData && selectedData.SupportTicketNo ? selectedData.SupportTicketNo : 0,
      };
      const result = await getkrphTicketTrailData(formdata);

      setkrphTicketTrailIsLoading(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setkrphTicketTrailData(result.response.responseData.masterdatabinding);
          if (Object.values(result.response.responseData.masterdatabinding[0]).length === 0) {
            const statusTemplate = getStatusWiseTemplate(selectedData.TicketStatusID, selectedData, "", "");
            setsetps(statusTemplate);
          } else if (Object.values(result.response.responseData.masterdatabinding[0]).length > 0) {
            if (Object.values(result.response.responseData.masterdatabinding[0]).length > 0) {
              let allTicketStatusTemplate = [];

              // A First statusTemplate (Initial)
              let statusTemplate = getStatusWiseTemplate(109301, selectedData, "", "");
              allTicketStatusTemplate.push(...statusTemplate);

              Object.entries(result.response.responseData.masterdatabinding[0]).forEach(([key, value]) => {
                if (value.TicketStatusID === 109302) {
                  // A In-Process
                  let statusTemplate = getStatusWiseTemplate(value.TicketStatusID, value, selectedData, "", "");
                  allTicketStatusTemplate.push(...statusTemplate);
                } else if (value.TicketStatusID === 109304) {
                  // A Re-Open
                  let statusTemplate = getStatusWiseTemplate(value.TicketStatusID, value, selectedData, "", "");
                  allTicketStatusTemplate.push(...statusTemplate);
                } else if (value.TicketStatusID === 109303) {
                  // A Resolved
                  let statusTemplate = getStatusWiseTemplate(
                    value.TicketStatusID,
                    value,
                    selectedData,
                    result.response.responseData.masterdatabinding[0],
                    value.TicketStatus,
                  );
                  allTicketStatusTemplate.push(...statusTemplate);
                }
              });

              setsetps(allTicketStatusTemplate);
            }
          }
        } else {
          setkrphTicketTrailData([]);
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

  useEffect(() => {
    getkrphTicketTrailListData();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", background: "white", borderRadius: "5px", width: "95%", maxWidth: "1480px", maxHeight: "95vh", overflowY: "auto" }}>
        <div
          style={{
            width: "100%",
            background: "green",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            color: "white",
            fontWeight: "500",
            fontSize: "18px",
          }}
        >
          <span style={{ flex: 1, textAlign: "center" }}>
            Ticket Type : {selectedData && selectedData.TicketHeadName ? selectedData.TicketHeadName : null} - KRPH Ticket No :{" "}
            {selectedData && selectedData.SupportTicketNo ? selectedData.SupportTicketNo : null} - CASE HISTORY
          </span>
          <span style={{ cursor: "pointer" }}>
            <Close onClick={() => handleCloseCaseHistory()} />
          </span>
        </div>
        {krphTicketTrailIsLoading ? <Loader /> : null}
        {/* Steps */}
        {steps && steps.length > 0 ? (
          <>
            <div
              className="trail-container"
              style={{
                transition: "opacity 0.3s ease",
                opacity: animating ? 0 : 1,
              }}
            >
              {/* {stepChunks[currentPage].map((step, index) => (
               
                <div
                  
                  className="pill top "
                  style={{
                    borderColor: step.color,
                    background: `linear-gradient(to bottom, ${step.color} 25%, #fff 20%)`,
                    marginBottom: "250px",
                  }}
                >
                  

                  
              
                  <div className="circle circle-top" style={{ borderColor: step.color }}>
                    <p className="icon">{step.icon}</p>
                  </div>

                
                  <div className="text-part text-top">
                    <p>{step.text}</p>
                    <strong style={{fontSize: "12px"}}>{step.ticketStatus}</strong>
                  </div>

                 
                  <div className="connector connector-bottom">
                    <span className="dot" style={{ background: step.color }}></span>
                  </div>

                
                  <div className="details details-bottom">
                    <p>{step.textId}</p>
                    <p>{step.agentName}</p>
                    <p>{step.date}</p>
                     <strong>{step.ticket}</strong> 
                    <p className="success">{step.status}</p>
                  </div>
                </div>
              
              ))} */}

              {stepChunks[currentPage].map((step, index) => (
                <div className="card-tooltip" key={`${step.id}-${index}`}>
                  <div
                    className="pill top"
                    style={{
                      borderColor: step.color,
                      background: `linear-gradient(to bottom, ${step.color} 25%, #fff 20%)`,
                      marginBottom: "250px",
                    }}
                  >
                    {/* Circle */}
                    <div className="circle circle-top" style={{ borderColor: step.color }}>
                      <p className="icon">{step.icon !== "" ? step.icon : <img src={Ticket} width="24px" height="24px" />}</p>
                    </div>

                    {/* Text */}
                    <div className="text-part text-top">
                      <strong>{step.tat ? step.tat : ""}</strong>
                      <p>{step.text}</p>
                      <strong style={{ fontSize: "12px" }}>{step.ticketStatus}</strong>
                      <p>
                        {" "}
                        <strong style={{ fontSize: "12px" }}>{step.ageing}</strong>{" "}
                      </p>
                    </div>

                    {/* Connector */}
                    <div className="connector connector-bottom">
                      <span className="dot" style={{ background: step.color }}></span>
                    </div>

                    {/* Always visible details */}
                    <div className="details details-bottom">
                      <p>{step.textId}</p>
                      <p>{step.agentName}</p>
                      <p>{step.date}</p>
                      <strong>{step.ticket}</strong>
                      <p className="success">{step.status}</p>
                    </div>
                  </div>

                  {/* Hover card (summary info only) */}
                  {step.smsText !== "" ? (
                   <div className="hover-card">
                   <p dangerouslySetInnerHTML={{ __html: step.smsText }} />
                   </div>
                   ) : null}
                </div>
              ))}
            </div>
            {/* Left Arrow */}
            {currentPage >= 0 && (
              <button
                onClick={() => changePage(currentPage - 1)}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "white",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                  borderRadius: "50%",
                  padding: "12px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
              >
                <FaChevronLeft size={20} />
              </button>
            )}

            {/* Right Arrow */}
            {currentPage < stepChunks.length - 1 && (
              <button
                onClick={() => changePage(currentPage + 1)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "white",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                  borderRadius: "50%",
                  padding: "12px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
              >
                <FaChevronRight size={20} />
              </button>
            )}

            {/* Dots indicator */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
                gap: "8px",
              }}
            >
              {stepChunks.map((_, i) => (
                <span
                  key={i}
                  style={{
                    height: "12px",
                    width: "12px",
                    borderRadius: "50%",
                    background: i === currentPage ? "#382922" : "#ccc",
                    transition: "background 0.3s ease",
                  }}
                ></span>
              ))}
            </div>
          </>
        ) : (
          <div
            className="trail-container"
            style={{
              transition: "opacity 0.3s ease",
              opacity: animating ? 0 : 1,
              height: "60vh",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default CaseHistory;