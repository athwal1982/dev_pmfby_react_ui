import { React, useState, useEffect, useRef } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Modal } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { Box } from "@mui/material";
import { InputControl, InputGroup } from "Framework/OldFramework/FormComponents/FormComponents";
import { KrphButton } from "../../../../../../Common/KrphAllActivitiesND/Widgets/KrphButton";
import { gCPFileUploadData, addKRPHGrievenceTicketHistoryAttachmentData } from "../../../../../OfflineGrievance/Services/Methods";

function FileUploadTicketHistory({
  selectedData,
  toggleFileUploadModal,
  atttachmentcount,
  setapiDataAttachment,
  apiDataAttachment,
  setChatListDetails,
  chatListDetails,
}) {
  const setAlertMessage = AlertMessage();

  const fileRef = useRef(null);

  const handleResetFile = async () => {
    fileRef.current.value = null;
  };

  const [formValues, setFormValues] = useState({
    txtDocumentUpload: "",
  });
  const updateStateGI = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async () => {
    debugger;
    let pAttachmentPath = "pmfby/public/krph/documents";
    let pAttachmentSize = 0;
    let pdbAttachmentPath = [];
    const pAttachment = formValues.txtDocumentUpload && formValues.txtDocumentUpload ? formValues.txtDocumentUpload : "";
    if (pAttachment.length > 0) {
      if (pAttachment.length > 5) {
        setAlertMessage({
          type: "error",
          message: "Please select only 5 attachments.",
        });
        return;
      }

      if (atttachmentcount + pAttachment.length > 5) {
        setAlertMessage({
          type: "error",
          message: `You can upload 5 attachments, ${atttachmentcount} ${atttachmentcount > 1 ? "attachments" : "attachment"}  already uploaed.`,
        });
        return;
      }
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
      if (pAttachment.length > 0) {
        for (let i = 0; i < pAttachment.length; i++) {
          const formDataDoc = new FormData();
          formDataDoc.append("filePath", pAttachmentPath);
          formDataDoc.append("documents", pAttachment[i]);
          formDataDoc.append("uploadedBy", "KRPH");

          try {
            setBtnLoaderActive(true);
            const resultattachment = await gCPFileUploadData(formDataDoc);
            setBtnLoaderActive(false);
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
            setBtnLoaderActive(false);
          }
        }
        handleResetFile();
        try {
          const formDataattachmentPath = {
            attachment: pdbAttachmentPath,
            grievenceSupportTicketID: selectedData.GrievenceSupportTicketID,
            grievenceTicketHistoryID: apiDataAttachment.GrievenceTicketHistoryID,
          };
          setBtnLoaderActive(true);
          const resultattachmentdb = await addKRPHGrievenceTicketHistoryAttachmentData(formDataattachmentPath);
          setBtnLoaderActive(false);
          if (resultattachmentdb.responseCode === 1) {
            setAlertMessage({
              type: "success",
              message: resultattachmentdb.responseMessage,
            });
            setapiDataAttachment({ apiFor: "TCKHIS", GrievenceTicketHistoryID: apiDataAttachment.GrievenceTicketHistoryID });
            for (let i = 0; i < chatListDetails.length; i += 1) {
              if (apiDataAttachment.GrievenceTicketHistoryID === chatListDetails[i].GrievenceTicketHistoryID) {
                chatListDetails[i].HasDocument = "1";
                break;
              }
            }
            setChatListDetails(chatListDetails);
            toggleFileUploadModal();
          } else {
            setAlertMessage({
              type: "error",
              message: resultattachmentdb.responseMessage,
            });
          }
        } catch (error) {
          console.log(error);
          setBtnLoaderActive(false);
          setAlertMessage({
            type: "error",
            message: error,
          });
        }
      }
    }
  };

  return (
    <Modal
      varient="center"
      title={`File Upload (Ticket No. :  ${selectedData && selectedData.GrievenceSupportTicketNo ? selectedData.GrievenceSupportTicketNo : ""})`}
      show={toggleFileUploadModal}
      width="42vw"
      right="0"
    >
      <Modal.Body>
        <Box
          sx={{
            background: "#fff",
            padding: "15px",
            mt: 1,
          }}
        >
          <Box className="ticket-content_agent">
            <div className="form-group_agent">
              <label className="ticket-label_agent">
                {" "}
                Attachment <b>(File Size : 10MB , File Type: .pdf, .jpg, .jpeg, .png)</b>
              </label>
              <InputGroup>
                <InputControl
                  style={{ padding: "2px 10px 0px 10px", width: "340px" }}
                  Input_type="input"
                  type="file"
                  accept="image/*,.pdf"
                  name="txtDocumentUpload"
                  onChange={(e) => updateStateGI(e.target.name, e.target.files)}
                  ref={fileRef}
                  multiple
                />
                <KrphButton type="button" varient="primary" onClick={() => handleResetFile()}>
                  {" "}
                  Reset
                </KrphButton>
              </InputGroup>
            </div>
          </Box>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" varient="secondary" trigger={btnLoaderActive} onClick={() => handleSave()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FileUploadTicketHistory;
