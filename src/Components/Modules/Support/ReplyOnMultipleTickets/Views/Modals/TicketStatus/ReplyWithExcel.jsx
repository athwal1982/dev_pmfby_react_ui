import React from "react";
import { Button } from "Framework/Components/Widgets";
import { Form, Modal } from "Framework/Components/Layout";
import { FaFileDownload } from "react-icons/fa";
import { PropTypes } from "prop-types";
import ReplyWithExcelLogic from "./Logic/ReplyWithExcelLogic";

function ReplyWithExcel({ showfunc, farmersTicketData, filterValues, setFarmersTicketData, setSatatusCount, settotalSatatusCount }) {
  const {
    updateStateReplyWithExcel,
    formValidationReplyWithExcelError,
    handleSave,
    btnLoaderActive,
    handleResetFile,
    fileRef,
    downloadExcelFile,
    successStatus,
    successStatusMsg,
  } = ReplyWithExcelLogic();

  return (
    <Modal varient="center" title="Upload Excel File" show={showfunc} width="42.5vw" height="30.5vh">
      <Modal.Body>
        {successStatus === true ? (
          <span style={{ textAlign: "center", padding: "10px", fontSize: "14px" }}>{successStatusMsg}</span>
        ) : (
          <Form>
            <Form.Group column={3} controlwidth="290px">
              <Form.InputGroup column={3} label="File" errorMsg={formValidationReplyWithExcelError["txtDocumentUpload"]}>
                <Form.InputControl
                  control="input"
                  type="file"
                  accept=".xlsx"
                  name="txtDocumentUpload"
                  onChange={(e) => updateStateReplyWithExcel(e.target.name, e.target.files[0])}
                  ref={fileRef}
                />
              </Form.InputGroup>
              <Form.InputGroup column={1}>
                <Button type="button" varient="primary" onClick={() => handleResetFile()}>
                  {" "}
                  Reset File
                </Button>
              </Form.InputGroup>
              <Form.InputGroup column={1}>
                <FaFileDownload style={{ cursor: "pointer" }} title="Download the Excel File" onClick={() => downloadExcelFile(farmersTicketData)} />
              </Form.InputGroup>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {successStatus === true ? null : (
          <Button
            type="button"
            varient="secondary"
            trigger={btnLoaderActive}
            onClick={() => handleSave(showfunc, filterValues, setFarmersTicketData, setSatatusCount, settotalSatatusCount, farmersTicketData)}
          >
            Submit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ReplyWithExcel;

ReplyWithExcel.propTypes = {
  showfunc: PropTypes.func.isRequired,
  farmersTicketData: PropTypes.array,
  filterValues: PropTypes.object.isRequired,
  setFarmersTicketData: PropTypes.func.isRequired,
  setSatatusCount: PropTypes.func.isRequired,
  settotalSatatusCount: PropTypes.func.isRequired,
};
