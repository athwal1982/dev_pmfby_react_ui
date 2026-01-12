import { React, useState } from "react";
import { Form } from "Framework/Components/Layout";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { MdOutlineEmail } from "react-icons/md";
import { FaShareAltSquare, FaPalette, FaEnvelopeOpenText, FaUpload } from "react-icons/fa";
import { MdAttachFile, MdOutlineContentCopy } from "react-icons/md";
import { BsBoxes } from "react-icons/bs";
import { Loader, Button } from "Framework/Components/Widgets";
import { InputControl, InputGroup } from "Framework/OldFramework/FormComponents/FormComponents";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import { daysdifference, dateFormatDefault, dateToSpecificFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import parse from "html-react-parser";
import { getSessionStorage, getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import { getKRPHGrievenceTicketHistoryAttachmentData } from "../../../../Services/Methods";
import BizClass from "./ChatList.module.scss";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Paper, FormControl } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileViewer from "./FileViewer/FileViewer";
import FileUploadTicketHistory from "./FileUploadTicketHistory";

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

function ChatList({
  children,
  chatListDetails,
  setChatListDetails,
  isLoadingchatListDetails,
  selectedData,
  showMoreChatListOnClick,
  apiDataAttachment,
  setapiDataAttachment,
  updateStateSatifation,
  formValuesSatifation,
  formValidationSatisfyError,
  IsSatisfyList,
  btnLoaderActiveSatisfaction,
  handleSatisfaction,
  btnLoaderActiveAudit,
  handleAudit,
  expanded,
  handleChange,
}) {
  const setAlertMessage = AlertMessage();
  const user = getSessionStorage("user");
   const auditTicketRight = getUserRightCodeAccess("adtg");
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

  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [atttachmentcount, setAtttachmentcount] = useState(0);
  const toggleFileUploadModal = async (data) => {
    debugger;

    if (data) {
      try {
        setapiDataAttachment({ apiFor: "TCKHIS", GrievenceTicketHistoryID: data.GrievenceTicketHistoryID });
        const formdata = {
          grievenceSupportTicketID: data && data.GrievenceSupportTicketID ? data.GrievenceSupportTicketID : 0,
          grievenceTicketHistoryID: data && data.GrievenceTicketHistoryID ? data.GrievenceTicketHistoryID : 0,
        };
        const result = await getKRPHGrievenceTicketHistoryAttachmentData(formdata);
        if (result.responseCode === 1) {
          if (result.responseData && result.responseData.attachment && result.responseData.attachment.length > 0) {
            setAtttachmentcount(result.responseData.attachment.length);
            if (result.responseData.attachment.length === 5) {
              setAlertMessage({
                type: "error",
                message: "You have already uploaded 5 images.",
              });
              return;
            } else {
              setIsFileUploadModalOpen(!isFileUploadModalOpen);
            }
          } else {
            setIsFileUploadModalOpen(!isFileUploadModalOpen);
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
    } else {
      setIsFileUploadModalOpen(!isFileUploadModalOpen);
    }
  };

  return (
    <>
      {isFileViewerModalOpen && (
        <FileViewer
          toggleFileViewerModal={toggleFileViewerModal}
          selectedData={selectedData}
          apiDataAttachment={apiDataAttachment}
          setChatListDetails={setChatListDetails}
          chatListDetails={chatListDetails}
        />
      )}
      {isFileUploadModalOpen && (
        <FileUploadTicketHistory
          toggleFileUploadModal={toggleFileUploadModal}
          selectedData={selectedData}
          atttachmentcount={atttachmentcount}
          setapiDataAttachment={setapiDataAttachment}
          apiDataAttachment={apiDataAttachment}
          setChatListDetails={setChatListDetails}
          chatListDetails={chatListDetails}
        />
      )}
      <div className={BizClass.ChatBox}>
        <div className={classNames(BizClass.Heading, BizClass.urgent)}>
          <div className={BizClass.TicketDetail}>
            <div class={BizClass.ticketcard}>
              <div class={BizClass.ticketheader}>
                <div class={BizClass.leftpanel}>
                  <h1>
                    <strong>Ticket Number : </strong> {selectedData && selectedData.GrievenceSupportTicketNo ? selectedData.GrievenceSupportTicketNo : null}
                  </h1>
                  <h1>
                    <strong>Ticket Type : </strong>
                    {selectedData && selectedData.TicketCategoryName ? selectedData.TicketCategoryName : null} →{" "}
                    {selectedData && selectedData.TicketSubCategoryName ? selectedData.TicketSubCategoryName : null}{" "}
                  </h1>
                  <h1>
                    <strong>Source : </strong> {selectedData && selectedData.UserType ? selectedData.UserType : null}
                  </h1>
                </div>
                <div class={BizClass.rightpanel}>
                  <span
                    className={classNames(
                      BizClass.status,
                      selectedData?.TicketStatus ? BizClass[selectedData.TicketStatus.toLowerCase().toString().replace("-", "")] : "",
                    )}
                  >
                    {selectedData?.TicketStatus || ""}
                  </span>
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
              onClick={() => copyToClipboard(selectedData ? selectedData.GrievenceDescription : "")}
            />{" "}
            Farmer Query :-
            <span> {selectedData && selectedData.GrievenceDescription ? parse(selectedData.GrievenceDescription) : null} </span>
          </p> */}
        </div>
        <div className={BizClass.Event1panel}>{children}</div>
        <div className={BizClass.Event1panel} id="three_part_ticket_details">
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
                      `${selectedData.InsertDateTime.split("T")[0]} ${Convert24FourHourAndMinute(selectedData.InsertDateTime.split("T")[1])}`,
                      "DD-MM-YYYY HH:mm",
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={10} md={3}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {selectedData && selectedData.CreatedBY ? selectedData.CreatedBY : ""}
                  </Typography>
                </Grid>
                <Grid item xs={10} md={3}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {selectedData && selectedData.UserType ? selectedData.UserType : ""}
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
                      <MdOutlineContentCopy
                        style={{ color: "#000000", fontSize: "18px", cursor: "pointer" }}
                        title="Copy Ticket Description"
                        onClick={() => copyToClipboard(selectedData ? selectedData.GrievenceDescription : "")}
                      />
                      {selectedData.HasDocument && selectedData.HasDocument === 1 ? (
                        <MdAttachFile style={{ color: "#000000", fontSize: "18px", cursor: "pointer" }} onClick={() => toggleFileViewerModal("SPTCKT")} />
                      ) : null}{" "}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedData && selectedData.GrievenceDescription ? parse(selectedData.GrievenceDescription) : null}
                    </Typography>
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
                  <Accordion sx={{ borderRadius: 2, boxShadow: 3, mb: 1, overflow: "hidden" }} key={i}  expanded={expanded === i || expanded === "ALL"}
                    onChange={handleChange(i)}>
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
                            {data.CreatedBY}
                          </Typography>
                        </Grid>
                        <Grid item xs={10} md={3}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {data.UserType ? data.UserType : ""}
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
                                               <Grid container justifyContent="space-between" alignItems="center">
                       <Grid item>
                       <Typography variant="subtitle2" fontWeight="bold">
                              Description :{" "}
                              <span>
                                <MdOutlineContentCopy
                                  className="copy-icon"
                                  title="Copy Ticket Comment"
                                  style={{ color: "#000000", fontSize: "18px", cursor: "pointer" }}
                                  onClick={() => copyToClipboard(stripHtmlTags(data.TicketDescription))}
                                />
                                &nbsp;{" "}
                              </span>
                              {data.HasDocument && data.HasDocument === "1" ? (
                                <MdAttachFile
                                  onClick={() => toggleFileViewerModal("TCKHIS", data.GrievenceTicketHistoryID)}
                                  style={{ color: "#000000", fontSize: "18px", cursor: "pointer" }}
                                />
                              ) : null}
                              <FaUpload
                                onClick={() => toggleFileUploadModal(data)}
                                title="File Upload"
                                style={{ color: "#000000", fontSize: "18px", cursor: "pointer" }}
                              />
                            </Typography>
                       </Grid>
                        {/* Audit Button */}
                                                      {auditTicketRight === true &&
                                                      i + 1 === chatListDetails.length &&
                                                      selectedData &&
                                                      selectedData.TicketStatusID === 109303 &&
                                                      data &&
                                                      data.TicketStatusID === 109303 &&
                                                      data &&
                                                      data.isAudit === 0 ? (
                                                        <Grid item>
                                                          <button
                                                            style={{
                                                              backgroundColor: "#85929e",
                                                              color: "#ffffff",
                                                              border: "1px solid #85929e",
                                                              borderRadius: "10px",
                                                              padding: "5px 15px",
                                                              fontSize: "14px",
                                                              fontWeight: "400",
                                                            }}
                                                            trigger={btnLoaderActiveAudit && "true"}
                                                            onClick={() => handleAudit(data)}
                                                          >
                                                            Audit
                                                          </button>
                                                        </Grid>
                                                      ) : null}
                                                      {data && data.isAudit === 1 && data.TicketStatusID === 109303 ? (
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
                            <Typography variant="body2" color="text.secondary">
                              {data && data.TicketDescription ? parse(data.TicketDescription) : null}
                            </Typography>
                         {/* Dropdown aligned right */}
                            <Grid container justifyContent="flex-end">
                              <Grid item>
                                <FormControl size="small" sx={{ maxWidth: 340 }}>
                                  {auditTicketRight === true && data && data.isAudit === 1 && data && data.isSatisfied === null ? (
                                    <Form>
                                      <Form.Group column="2" controlwidth="300px">
                                        <Form.InputGroup label="Is Satisfied" column={2} errorMsg={formValidationSatisfyError["txtIsSatisfy"]}>
                                          <Form.InputControl
                                            control="select"
                                            name="txtIsSatisfy"
                                            onChange={(e) => updateStateSatifation("txtIsSatisfy", e)}
                                            value={formValuesSatifation.txtIsSatisfy}
                                            options={IsSatisfyList}
                                            getOptionLabel={(option) => `${option.label}`}
                                            getOptionValue={(option) => `${option}`}
                                          />
                                        </Form.InputGroup>
                                        <Form.InputGroup column={1}>
                                          <Button
                                            type="button"
                                            varient="primary"
                                            trigger={btnLoaderActiveSatisfaction && "true"}
                                            onClick={() => handleSatisfaction(data)}
                                          >
                                            Submit
                                          </Button>
                                        </Form.InputGroup>
                                      </Form.Group>
                                    </Form>
                                  ) : null}
                                  {data && data.isSatisfied === 1 && data.TicketStatusID === 109303 ? (
                                    <strong>Satisfactory Response</strong>
                                  ) : data && data.isSatisfied === 0 && data.TicketStatusID === 109303 ? (
                                    <strong>Unsatisfactory Response</strong>
                                  ) : (
                                    ""
                                  )}
                                </FormControl>
                              </Grid>
                            </Grid>
                            {formValuesSatifation &&
                            formValuesSatifation.txtIsSatisfy &&
                            formValuesSatifation.txtIsSatisfy.value === 0 &&
                            data.isSatisfied === null ? (
                              <>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  Reason :{" "}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <InputGroup Row="5" ErrorMsg={formValidationSatisfyError["txtunUnstatisfactoryReason"]}>
                                    <InputControl
                                      Input_type="textarea"
                                      name="txtunUnstatisfactoryReason"
                                      value={formValuesSatifation.txtunUnstatisfactoryReason}
                                      maxLength="500"
                                      rows="5"
                                      onChange={(e) => updateStateSatifation("txtunUnstatisfactoryReason", e.target.value)}
                                    />
                                  </InputGroup>
                                  <p className={BizClass.CounterDescKRPH}>
                                    {formValuesSatifation.txtunUnstatisfactoryReason && formValuesSatifation.txtunUnstatisfactoryReason.length
                                      ? formValuesSatifation.txtunUnstatisfactoryReason.length
                                      : 0}{" "}
                                    / {500}
                                  </p>
                                </Typography>{" "}
                              </>
                            ) : null}
                            {data && data.isSatisfied === 0 && data.AuditRemarks !== "" && data.TicketStatusID === 109303 ? (
                              <>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  Reason :{" "}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {data && data.AuditRemarks ? data.AuditRemarks : null}
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
