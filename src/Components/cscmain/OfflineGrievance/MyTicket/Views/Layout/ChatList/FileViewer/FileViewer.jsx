import { React, useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Modal } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { FaFileImage, FaFilePdf, FaRegTrashAlt } from "react-icons/fa";
import ConfirmDialog from "Framework/ConfirmDialog/ConfirmDialog";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getKRPHGrievanceAttachmentData, deleteKRPHGrievanceAttachmentData } from "../../../../../Services/Methods";

function FileViewer({ toggleFileViewerModal, selectedData, updateRowOfAttachment }) {
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
      const formdata = {
        grievenceSupportTicketID: selectedData && selectedData.GrievenceSupportTicketID ? selectedData.GrievenceSupportTicketID : 0,
      };
      setFileViewerIsLoading(true);
      const result = await getKRPHGrievanceAttachmentData(formdata);
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

  const deleteFileOnClick = async (pGrievenceTicketAttachmentID) => {
    debugger;
    try {
      const formdata = {
        grievenceSupportTicketID: selectedData && selectedData.GrievenceSupportTicketID ? selectedData.GrievenceSupportTicketID : 0,
        grievenceTicketAttachmentID: pGrievenceTicketAttachmentID,
      };
      const result = await deleteKRPHGrievanceAttachmentData(formdata);
      setFileViewerIsLoading(false);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });
        const filteredData = attachmentData.filter((item) => item.GrievenceTicketAttachmentID.toString() !== pGrievenceTicketAttachmentID.toString());
        setAttachmentData(filteredData);
        if (filteredData.length === 0) {
          selectedData.HasDocument = 0;
          updateRowOfAttachment(selectedData);
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

  const handleDeleteFile = (pGrievenceTicketAttachmentID) => {
    setConfirmAlert({
      open: true,
      title: "Delete Confirmation",
      msg: "Do you want to delete ?",
      button: { confirmText: "Yes", abortText: "No", Color: "Danger" },
      onConfirm: () => deleteFileOnClick(pGrievenceTicketAttachmentID),
    });
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
        style={{ zindex: "999999999999999999999" }}
      >
        <Modal.Body>
          {fileViewerIsLoading ? <Loader /> : null}
          <table className="table_bordered table_Height_module_wise_training">
            <thead>
              <tr>
                {ChkBRHeadTypeID === "124002" || ChkBRHeadTypeID === "124001" ? <th>Action</th> : null}
                <th>Sr. No.</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody>
              {attachmentData.map((v, i) => (
                <tr>
                  {ChkBRHeadTypeID === "124002" || ChkBRHeadTypeID === "124001" ? (
                    <td>
                      <FaRegTrashAlt
                        style={{ fontSize: "22px", color: "#000000", cursor: "pointer" }}
                        onClick={() => handleDeleteFile(v.GrievenceTicketAttachmentID)}
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
