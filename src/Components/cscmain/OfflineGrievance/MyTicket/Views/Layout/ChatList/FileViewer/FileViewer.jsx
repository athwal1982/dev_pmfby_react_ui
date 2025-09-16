import { React, useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Modal } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { FaFileImage, FaFilePdf, FaRegTrashAlt } from "react-icons/fa";
import ConfirmDialog from "Framework/ConfirmDialog/ConfirmDialog";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import {
  getKRPHGrievanceAttachmentData,
  deleteKRPHGrievanceAttachmentData,
  deleteKRPHGrievanceHistoryAttachmentData,
  getKRPHGrievenceTicketHistoryAttachmentData,
} from "../../../../../Services/Methods";

function FileViewer({ toggleFileViewerModal, selectedData, updateRowOfAttachment, apiDataAttachment, setChatListDetails, chatListDetails }) {
  const setAlertMessage = AlertMessage();
  const user = getSessionStorage("user");
  const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";

  const [confirmAlert, setConfirmAlert] = useState({
    open: false,
    title: "",
    msg: "",
    onConfirm: null,
    button: { confirmText: "", abortText: "" },
  });

  const [fileViewerIsLoading, setFileViewerIsLoading] = useState(false);
  const [attachmentData, setAttachmentData] = useState([]);
  const getAttachmentListData = async () => {
    debugger;
    try {
      setAttachmentData([]);
      let formdata = null;
      let result = null;
      setFileViewerIsLoading(true);
      if (apiDataAttachment.apiFor === "SPTCKT") {
        formdata = {
          grievenceSupportTicketID: selectedData && selectedData.GrievenceSupportTicketID ? selectedData.GrievenceSupportTicketID : 0,
        };
        result = await getKRPHGrievanceAttachmentData(formdata);
      } else if (apiDataAttachment.apiFor === "TCKHIS") {
        formdata = {
          grievenceSupportTicketID: selectedData && selectedData.GrievenceSupportTicketID ? selectedData.GrievenceSupportTicketID : 0,
          grievenceTicketHistoryID: apiDataAttachment && apiDataAttachment.GrievenceTicketHistoryID ? apiDataAttachment.GrievenceTicketHistoryID : 0,
        };
        result = await getKRPHGrievenceTicketHistoryAttachmentData(formdata);
      }
      setFileViewerIsLoading(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.attachment && result.responseData.attachment.length > 0) {
          setAttachmentData(result.responseData.attachment);
        } else {
          setAttachmentData([]);
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

  const deleteFileOnClick = async (pTicketAttachmentID) => {
    debugger;
    try {
      let formdata = null;
      let result = null;
      setFileViewerIsLoading(true);
      if (apiDataAttachment.apiFor === "SPTCKT") {
        formdata = {
          grievenceSupportTicketID: selectedData && selectedData.GrievenceSupportTicketID ? selectedData.GrievenceSupportTicketID : 0,
          grievenceTicketAttachmentID: pTicketAttachmentID,
        };
        result = await deleteKRPHGrievanceAttachmentData(formdata);
      } else if (apiDataAttachment.apiFor === "TCKHIS") {
        formdata = {
          grievenceTicketHistoryAttachmentID: pTicketAttachmentID,
          grievenceTicketHistoryID: apiDataAttachment && apiDataAttachment.GrievenceTicketHistoryID ? apiDataAttachment.GrievenceTicketHistoryID : 0,
        };
        result = await deleteKRPHGrievanceHistoryAttachmentData(formdata);
      }

      setFileViewerIsLoading(false);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });
        let filteredData = [];
        if (apiDataAttachment.apiFor === "SPTCKT") {
          filteredData = attachmentData.filter((item) => item.GrievenceTicketAttachmentID.toString() !== pTicketAttachmentID.toString());
          setAttachmentData(filteredData);
        } else if (apiDataAttachment.apiFor === "TCKHIS") {
          filteredData = attachmentData.filter((item) => item.GrievenceTicketHistoryAttachmentID.toString() !== pTicketAttachmentID.toString());
          setAttachmentData(filteredData);
        }

        if (filteredData.length === 0) {
          if (apiDataAttachment.apiFor === "SPTCKT") {
            selectedData.HasDocument = 0;
          } else if (apiDataAttachment.apiFor === "TCKHIS") {
            for (let i = 0; i < chatListDetails.length; i += 1) {
              if (apiDataAttachment.GrievenceTicketHistoryID === chatListDetails[i].GrievenceTicketHistoryID) {
                chatListDetails[i].HasDocument = "0";
                break;
              }
            }
            setChatListDetails(chatListDetails);
          }
          // A updateRowOfAttachment(selectedData);
          toggleFileViewerModal();
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

  const handleDeleteFile = (pTicketAttachmentID) => {
    // A setConfirmAlert({
    // A  open: true,
    // A  title: "Delete Confirmation",
    // A  msg: "Do you want to delete ?",
    // A  button: { confirmText: "Yes", abortText: "No", Color: "Danger" },
    // A  onConfirm: () => deleteFileOnClick(pGrievenceTicketAttachmentID),
    // A });
    deleteFileOnClick(pTicketAttachmentID);
  };

  useEffect(() => {
    getAttachmentListData();
  }, []);

  return (
    <>
      {" "}
      {confirmAlert.open && <ConfirmDialog confirmAlert={confirmAlert} setConfirmAlert={setConfirmAlert} />}
      <Modal
        varient="center"
        title={`Attachmet Detail (Ticket No. :  ${selectedData && selectedData.GrievenceSupportTicketNo ? selectedData.GrievenceSupportTicketNo : ""})`}
        show={toggleFileViewerModal}
        width="34vw"
        right="0"
      >
        <Modal.Body>
          {fileViewerIsLoading ? <Loader /> : null}
          <table className="table_bordered table_Height_module_wise_training">
            <thead>
              <tr>
                {((ChkBRHeadTypeID === "124002" || ChkBRHeadTypeID === "124001") && apiDataAttachment.apiFor === "SPTCKT") ||
                apiDataAttachment.apiFor === "TCKHIS" ? (
                  <th>Action</th>
                ) : null}
                <th>Sr. No.</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody>
              {attachmentData.map((v, i) => (
                <tr>
                  {(ChkBRHeadTypeID === "124002" || ChkBRHeadTypeID === "124001") && apiDataAttachment.apiFor === "SPTCKT" ? (
                    <td>
                      <FaRegTrashAlt
                        style={{ fontSize: "22px", color: "#000000", cursor: "pointer" }}
                        onClick={() => handleDeleteFile(v.GrievenceTicketAttachmentID)}
                      />
                    </td>
                  ) : (ChkBRHeadTypeID === "124002" || ChkBRHeadTypeID === "124001") && apiDataAttachment.apiFor === "TCKHIS" ? (
                    <td>
                      <FaRegTrashAlt
                        style={{ fontSize: "22px", color: "#000000", cursor: "pointer" }}
                        onClick={() => handleDeleteFile(v.GrievenceTicketHistoryAttachmentID)}
                      />
                    </td>
                  ) : null}
                  <td>{i + 1}</td>
                  <td>
                    {v.AttachmentPath && v.AttachmentPath.split(".").pop().split("?")[0] === "pdf" ? (
                      <a href={v.AttachmentPath} style={{ cursor: "pointer" }} target="_blank">
                        <FaFilePdf style={{ fontSize: "40px", color: "e5252a" }} />
                      </a>
                    ) : (
                      <a href={v.AttachmentPath} style={{ cursor: "pointer" }} target="_blank">
                        <FaFileImage style={{ fontSize: "40px", color: "#000000" }} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

export default FileViewer;
