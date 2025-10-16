import { React } from "react";
// Anil import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { PropTypes } from "prop-types";
import { PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
// Anil import { useNavigate } from "react-router-dom";
import { getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import BizClass from "./MyTicket.module.scss";
import CaseHistoryComponent from "../Views/Layout/ChatList/CaseHistory";

function MyTicket({ children, replyBoxCollapsed, setReplyBoxCollapsed, setTicketStatusBtn, ticketData, showfunc, downloadPDF, pageRef, isLoadingDownloadpdf,selectedData, pdfDownlaodStatus, showAnother }) {
  // Anil const setAlertMessage = AlertMessage();
  // Anil const navigate = useNavigate();
  const replyTicketRight = getUserRightCodeAccess("mgif");
  const reopenTicketRight = getUserRightCodeAccess("yj31");

  const toggelReplyCloseButton = (type) => {
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
    //  Anil     message: "You do not have right to change Reply!",
    //  Anil   });
    //  Anil   return;
    //  Anil }
    // Anil }

    // Anil if (chkAccessALL === "N") {
    // Anil  if (chkRightResolved === false) {
    // Anil    setAlertMessage({
    // Anil      type: "warning",
    // Anil      message: "You do not have right to Reply!",
    //  Anil   });
    //  Anil   return;
    // Anil  }
    // Anil }

    if (type === "Reply") {
      setReplyBoxCollapsed(!replyBoxCollapsed);
      setTicketStatusBtn("Reply");
    } else if (type === "Close") {
      setReplyBoxCollapsed(!replyBoxCollapsed);
      setTicketStatusBtn("Close");
    }
  };

  const toggelReOpenButton = () => {
    setReplyBoxCollapsed(!replyBoxCollapsed);
  };

  return (
    <div className={BizClass.Box}>
      <div className={BizClass.ActionDiv}>
        {/* <PageBar.Button onClick={() => navigate("/ManageTicket")}>Back</PageBar.Button>
         */}
        <PageBar.Button onClick={() => showfunc(null)}>Back</PageBar.Button>
        {replyTicketRight ? (
          ticketData.TicketStatusID && ticketData.TicketStatusID.toString() !== "109303" ? (
            <PageBar.Button onClick={() => toggelReplyCloseButton("Reply")}>Reply</PageBar.Button>
          ) : null
        ) : null}
        {reopenTicketRight ? (
          ticketData.TicketStatusID && ticketData.TicketStatusID.toString() === "109303" && ticketData.TicketHeaderID && ticketData.TicketHeaderID !== 2 ? (
            <PageBar.Button onClick={() => toggelReOpenButton()}>Re-Open</PageBar.Button>
          ) : null
        ) : null}
        <Button type="button" varient="title" trigger={isLoadingDownloadpdf} onClick={() => downloadPDF()}>
          {" "}
          Export To PDF{" "}
        </Button>
      </div>
      <div className={BizClass.ContentDiv} ref={pageRef}>
        {children}
        {showAnother && <div style={{ display: "none" }}>
        <CaseHistoryComponent  selectedData={selectedData} pdfDownlaodStatus={pdfDownlaodStatus} />
      </div>}
         
      </div>
    </div>
  );
}

export default MyTicket;

MyTicket.propTypes = {
  children: PropTypes.node.isRequired,
  replyBoxCollapsed: PropTypes.bool.isRequired,
  setReplyBoxCollapsed: PropTypes.func.isRequired,
  setTicketStatusBtn: PropTypes.func.isRequired,
  ticketData: PropTypes.object,
  showfunc: PropTypes.func.isRequired,
};
