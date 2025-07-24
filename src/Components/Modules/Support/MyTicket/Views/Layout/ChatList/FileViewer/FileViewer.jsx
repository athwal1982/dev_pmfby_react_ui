import { React, useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Modal } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { getKRPHSupportAttachmentData, getKRPHTicketHistoryAttachmentData } from "../../../../../ManageTicket/Views/Modals/AddTicket/Services/Methods";

function FileViewer({ toggleFileViewerModal, selectedData, apiFor }) {
  const setAlertMessage = AlertMessage();

  const [fileViewerIsLoading, setFileViewerIsLoading] = useState(false);
  const [attachmentData, setAttachmentData] = useState([]);
  const getAttachmentListData = async () => {
    debugger;
    try {
      setAttachmentData([]);
      setFileViewerIsLoading(true);
      let formdata = null;
      let result = null;
      if (apiFor === "SPTCKT") {
        formdata = {
          supportTicketID: selectedData && selectedData.SupportTicketID ? selectedData.SupportTicketID : 0,
        };
        result = await getKRPHSupportAttachmentData(formdata);
      } else if (apiFor === "TCKHIS") {
        formdata = {
          supportTicketID: selectedData && selectedData.SupportTicketID ? selectedData.SupportTicketID : 0,
          ticketHistoryID: selectedData && selectedData.TicketHistoryID ? selectedData.TicketHistoryID : 0,
        };
        result = await getKRPHTicketHistoryAttachmentData(formdata);
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

  useEffect(() => {
    getAttachmentListData();
  }, []);

  return (
    <Modal
      varient="center"
      title={`Attachmet Detail (Ticket No. :  ${selectedData && selectedData.SupportTicketNo ? selectedData.SupportTicketNo : ""})`}
      show={toggleFileViewerModal}
      width="62vw"
      right="0"
      style={{ zindex: "999999999999999999999" }}
    >
      <Modal.Body>
        {fileViewerIsLoading ? <Loader /> : null}
        <table className="table_bordered table_Height_module_wise_training">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
            {attachmentData.map((v, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>
                  <a href={v.AttachmentPath} target="_blank">
                    {v.AttachmentPath}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default FileViewer;
