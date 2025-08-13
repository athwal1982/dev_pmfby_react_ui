import { React, useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { MdOutlineEmail } from "react-icons/md";
import { FaShareAltSquare, FaPalette, FaEnvelopeOpenText } from "react-icons/fa";
import { MdAttachFile, MdOutlineContentCopy } from "react-icons/md";
import { BsBoxes } from "react-icons/bs";
import { Loader, Button } from "Framework/Components/Widgets";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import { daysdifference, dateFormatDefault, dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import parse from "html-react-parser";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import BizClass from "./ChatList.module.scss";
import FileViewer from "./FileViewer/FileViewer";

function TicketSourceIconWithSwitch(parameter) {
  switch (parameter) {
    case 132301:
      return <FaShareAltSquare title="Social Media" />;
    case 132302:
      return <FaPalette title="Physical Letter" />;
    case 132303:
      return <MdOutlineEmail title="Email" />;
    case 132304:
      return <FaEnvelopeOpenText title="CPGRAMS" />;
    default:
      return <BsBoxes />;
  }
}

function ChatList({ children, chatListDetails, isLoadingchatListDetails, selectedData, showMoreChatListOnClick, apiDataAttachment, setapiDataAttachment }) {
  const setAlertMessage = AlertMessage();
  const user = getSessionStorage("user");

  const [isFileViewerModalOpen, setIsFileViewerModalOpen] = useState(false);

  const toggleFileViewerModal = (papiFor, pGrievenceTicketHistoryID) => {
    debugger;
    setIsFileViewerModalOpen(!isFileViewerModalOpen);
    setapiDataAttachment({ apiFor: papiFor, GrievenceTicketHistoryID: pGrievenceTicketHistoryID });
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
      <div className={BizClass.ChatBox}>
        <div className={classNames(BizClass.Heading, BizClass.urgent)}>
          <div className={BizClass.TickIcon}>{TicketSourceIconWithSwitch(selectedData.GrievenceTicketSourceTypeID)}</div>
          <div className={BizClass.TicketDetail}>
            <h4>
              {`${selectedData.GrievenceSupportTicketNo} || ${selectedData.TicketCategoryName}`}{" "}
              {selectedData.HasDocument && selectedData.HasDocument === 1 ? (
                <MdAttachFile style={{ cursor: "pointer", color: "#000000" }} onClick={() => toggleFileViewerModal("SPTCKT")} />
              ) : null}{" "}
            </h4>
            <p>
              Created By {selectedData.CreatedBY} || {`${selectedData.TicketStatus}`}
            </p>
          </div>
          <div className={BizClass.TicketSubDetail}>
            <span className={BizClass.StatusBox} style={{ display: "none" }}>
              Waiting on Customer
            </span>
            <div className={BizClass.SubDetail}>
              <h4>Since {daysdifference(dateFormatDefault(new Date()), dateFormatDefault(selectedData.InsertDateTime.split("T")[0]))} Day Ago</h4>
              <p>
                From{" "}
                {dateToSpecificFormat(
                  `${selectedData.InsertDateTime.split("T")[0]} ${Convert24FourHourAndMinute(selectedData.InsertDateTime.split("T")[1])}`,
                  "DD-MM-YYYY HH:mm",
                )}
              </p>
            </div>
          </div>
        </div>
        <div className={BizClass.TicketRemarks}>
          <p>
            <MdOutlineContentCopy
              style={{ color: "#000000", fontSize: "18px", cursor: "pointer" }}
              title="Copy Ticket Description"
              onClick={() => copyToClipboard(selectedData ? selectedData.GrievenceDescription : "")}
            />{" "}
            Farmer Query :-
            <span> {selectedData && selectedData.GrievenceDescription ? parse(selectedData.GrievenceDescription) : null} </span>
          </p>
        </div>
        <div className={BizClass.MainBox}>
          {children}
          <div className={BizClass.ChattingBox}>
            {!isLoadingchatListDetails ? (
              chatListDetails && chatListDetails.length > 0 ? (
                chatListDetails.map((data, i) => {
                  return (
                    <div
                      className={classNames(
                        BizClass.ChatDiv,
                        data.InsertUserID.toString() === user.LoginID.toString() ? BizClass.Responder : BizClass.Requester,
                      )}
                      key={i}
                    >
                      <div className={BizClass.ImgDiv} />
                      <div className={BizClass.ChatContent}>
                        <div className={BizClass.ChatTitle}>
                          <p>
                            {" "}
                            ({data.CreatedBY} - {data.UserType})
                            {data.HasDocument && data.HasDocument === "1" ? (
                              <MdAttachFile
                                onClick={() => toggleFileViewerModal("TCKHIS", data.GrievenceTicketHistoryID)}
                                style={{ cursor: "pointer", color: "#000000" }}
                              />
                            ) : null}{" "}
                          </p>
                          <span>
                            {dateToSpecificFormat(
                              `${data.TicketHistoryDate.split("T")[0]} ${Convert24FourHourAndMinute(data.TicketHistoryDate.split("T")[1])}`,
                              "DD-MM-YYYY HH:mm",
                            )}
                          </span>
                        </div>
                        <div className={BizClass.ChatBody}>
                          <span>
                            <MdOutlineContentCopy
                              className="copy-icon"
                              title="Copy Ticket Comment"
                              onClick={() => copyToClipboard(stripHtmlTags(data.TicketDescription))}
                            />
                          </span>
                          <h4> {parse(data.TicketDescription)}</h4>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : null
            ) : (
              <Loader />
            )}
          </div>
          <div style={{ float: "right" }}>
            {chatListDetails.length <= 5 || chatListDetails.length === 0 ? null : <Button onClick={() => showMoreChatListOnClick()}>Show More</Button>}
          </div>
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
