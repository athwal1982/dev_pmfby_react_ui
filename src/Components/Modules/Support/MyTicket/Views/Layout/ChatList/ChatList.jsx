import { React, useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import Config from "Configration/Config.json";
import { BsTelephoneOutbound, BsBank2 } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";
import { MdOutlineWeb, MdOutlineDisabledByDefault, MdAttachFile, MdOutlineContentCopy } from "react-icons/md";
import { FaTwitterSquare, FaEdit } from "react-icons/fa";
import { Loader, Button } from "Framework/Components/Widgets";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import { daysdifference, dateFormatDefault, dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import parse from "html-react-parser";
import AudioFile from "Framework/Assets/Images/audio-file.png";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import FileViewer from "./FileViewer/FileViewer";
import EditTicketComment from "./EditTicketComment";
import BizClass from "./ChatList.module.scss";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";


function TicketSourceIconWithSwitch(parameter) {
  switch (parameter) {
    case 1:
      return <BsTelephoneOutbound title="Toll Free" />;
    case 2:
      return <CgWebsite title="DOA Website" />;
    case 3:
      return <MdOutlineWeb title="CSC Portal" />;
    case 4:
      return <FaTwitterSquare title="Twitter" />;
    case 5:
      return <BsBank2 title="Bank" />;
    case 6:
      return <MdOutlineWeb title="CSC" />;
    default:
      return <MdOutlineDisabledByDefault />;
  }
}

function ChatList({
  children,
  chatListDetails,
  isLoadingchatListDetails,
  selectedData,
  showMoreChatListOnClick,
  valueEditTicketComment,
  setValueEditTicketComment,
  handleSaveEditTicketComment,
  btnLoaderActiveEditTicketComment,
  wordcountEditTicketComment,
  setWordcountEditTicketComment,
  setSelectedHistoryData,
  apiDataAttachment,
  setapiDataAttachment,
}) {
  const setAlertMessage = AlertMessage();
  const user = getSessionStorage("user");
  const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";

  const [isFileViewerModalOpen, setIsFileViewerModalOpen] = useState(false);

  const toggleFileViewerModal = (papiFor, pGrievenceTicketHistoryID) => {
    debugger;
    setIsFileViewerModalOpen(!isFileViewerModalOpen);
    setapiDataAttachment({ apiFor: papiFor, GrievenceTicketHistoryID: pGrievenceTicketHistoryID });
  };
  const [isEditTicketCommentModalOpen, setIsEditTicketCommentModalOpen] = useState(false);
  const toggleEditTicketCommentModal = (data) => {
    
    if (data) {
      setSelectedHistoryData(data);
      setValueEditTicketComment(data.TicketDescription);
    }
    setIsEditTicketCommentModalOpen(!isEditTicketCommentModalOpen);
  };

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setAlertMessage({
        type: "success",
        message: "Text copied to clipboard!",
      });
    }
  };

  function stripHtmlTags(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  return (
    <>
      {isFileViewerModalOpen && <FileViewer toggleFileViewerModal={toggleFileViewerModal} selectedData={selectedData} apiDataAttachment={apiDataAttachment} />}
      {isEditTicketCommentModalOpen && (
        <EditTicketComment
          toggleEditTicketCommentModal={toggleEditTicketCommentModal}
          valueEditTicketComment={valueEditTicketComment}
          setValueEditTicketComment={setValueEditTicketComment}
          handleSaveEditTicketComment={handleSaveEditTicketComment}
          btnLoaderActiveEditTicketComment={btnLoaderActiveEditTicketComment}
          wordcountEditTicketComment={wordcountEditTicketComment}
          setWordcountEditTicketComment={setWordcountEditTicketComment}
        />
      )}
      <div className={BizClass.ChatBox}>
        <div className={classNames(BizClass.Heading, BizClass.urgent)}>
          
          <div className={BizClass.TicketDetail}>
           <div class={BizClass.ticketcard}>
    <div class={BizClass.ticketheader}>
      <div class={BizClass.leftpanel}>
        <h1><strong>Ticket Number : </strong>  {selectedData && selectedData.SupportTicketNo  ? selectedData.SupportTicketNo  : null}</h1>
        <h1><strong>Ticket Type : </strong>{selectedData && selectedData.TicketHeadName ? selectedData.TicketHeadName : null} → {selectedData && selectedData.TicketTypeName ? selectedData.TicketTypeName : null} →  {selectedData && selectedData.TicketCategoryName ? selectedData.TicketCategoryName : null} </h1>
        <h1><strong>Source : </strong>  {selectedData && selectedData.CreatedBY  ? selectedData.CreatedBY  : null}</h1>
      </div>
      <div class={BizClass.rightpanel}>
        <span
  className={classNames(
    BizClass.status, 
    selectedData?.TicketStatus ? BizClass[selectedData.TicketStatus.toLowerCase().toString().replace("-","")] : ""
  )}
>
  {selectedData?.TicketStatus || ""}
</span><br />
<br />
<Button type="button"  className={BizClass.buttonTrail} >
          Case History
        </Button>
      </div>
    </div>
    </div>
          </div>
          
        </div>
        
        <div className={BizClass.TicketRemarks}>
           {/* <p>
            <MdOutlineContentCopy
              style={{ color: "#000000", fontSize: "18px", cursor: "pointer" }}
              title="Copy Ticket Description"
              onClick={() => copyToClipboard(selectedData ? selectedData.TicketDescription : "")}
            />{" "}
            Farmer Query :-
            <span> {selectedData && selectedData.TicketDescription ? parse(selectedData.TicketDescription) : null} </span>
          </p> */}
        </div> 
 <div className={BizClass.Event1panel}>
{children}  
</div>        
<div className={BizClass.Event1panel}>
        <Accordion defaultExpanded sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            sx={{
      backgroundColor: "#31af40ff",
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
        <Grid container spacing={1}>
          <Grid item xs={10} md={3}>
            <Typography variant="body2">Event 1: Ticket Generated</Typography>
          </Grid>
          <Grid item xs={10} md={3}>
            <Typography variant="body2">{dateToSpecificFormat(
                  `${selectedData.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(selectedData.CreatedAt.split("T")[1])}`,
                  "DD-MM-YYYY HH:mm",
                )}</Typography>
          </Grid>
          <Grid item xs={10} md={3}>
            <Typography variant="body2">Agent ID: {selectedData && selectedData.AgentUserID ? selectedData.AgentUserID : null}</Typography>
          </Grid>
          <Grid item xs={10} md={3}>
            <Typography variant="body2">Name: {selectedData && selectedData.AgentName ? selectedData.AgentName : null}</Typography>
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
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle2" fontWeight="bold">
                Description : <MdOutlineContentCopy
              style={{ color: "#000000", fontSize: "18px", cursor: "pointer" }}
              title="Copy Ticket Description"
              onClick={() => copyToClipboard(selectedData ? selectedData.TicketDescription : "")}
            />
            {selectedData.HasDocument && selectedData.HasDocument === 1 ? (
                             <MdAttachFile style={{ color: "#000000", fontSize: "18px", cursor: "pointer" }} onClick={() => toggleFileViewerModal("SPTCKT")} />
                           ) : null}{" "}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedData && selectedData.TicketDescription ? parse(selectedData.TicketDescription) : null}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4} sx={{ textAlign: "left" }}>
              <Typography variant="subtitle2" fontWeight="bold" display="inline">
                Recording:
              </Typography>
               <audio controls style={{width:"250px", height:"28px", backgroundColor:"#21862",}} src={selectedData.CallingAudioFile && selectedData.CallingAudioFile ? selectedData.CallingAudioFile : null}>
          </audio>
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
</div> 
<div className={BizClass.Event1panel}>
       {!isLoadingchatListDetails ? (
              chatListDetails && chatListDetails.length > 0 ? (
                chatListDetails.map((data, i) => {
                  return (
                     <Accordion  sx={{ borderRadius: 2, boxShadow: 3, mb: 1, overflow: "hidden" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
           sx={{
      backgroundColor: "#31af40ff",
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
        <Grid container spacing={1}>
          <Grid item xs={10} md={3}>
            <Typography variant="body2">Event {(i+1) + 1}: {data.TicketStatus}</Typography>
          </Grid>
          <Grid item xs={10} md={3}>
            <Typography variant="body2">{dateToSpecificFormat(
                              `${data.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(data.TicketHistoryDate.split("T")[1])}`,
                              "DD-MM-YYYY HH:mm",
                            )}</Typography>
          </Grid>
          <Grid item xs={10} md={3}>
            <Typography variant="body2">{data.UserType}</Typography>
          </Grid>
          <Grid item xs={10} md={3}>
            <Typography variant="body2">Name: {data.CreatedBY}</Typography>
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
              <Typography variant="subtitle2" fontWeight="bold">
                Description : {ChkBRHeadTypeID.toString() === "124003" && selectedData.TicketStatusID.toString() === "109302" && i === 0 ? (
                            <span>
                              <MdOutlineContentCopy
                                className="copy-icon"
                                title="Copy Ticket Comment"
                                onClick={() => copyToClipboard(stripHtmlTags(data.TicketDescription))}
                              />
                              &nbsp;
                              <FaEdit title="Update Comment" onClick={() => toggleEditTicketCommentModal(data)} />
                            </span>
                          ) : (
                            <span>
                              <MdOutlineContentCopy
                                className="copy-icon"
                                title="Copy Ticket Comment"
                                onClick={() => copyToClipboard(stripHtmlTags(data.TicketDescription))}
                              />
                            </span>
                          )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data && data.TicketDescription ? parse(data.TicketDescription) : null}
              </Typography>
            </Grid>

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
       </div> 
      </div>
    </>
  );
}

export default ChatList;

ChatList.propTypes = {
  children: PropTypes.node.isRequired,
  chatListDetails: PropTypes.array,
  isLoadingchatListDetails: PropTypes.bool,
  selectedData: PropTypes.object,
  showMoreChatListOnClick: PropTypes.func.isRequired,
};