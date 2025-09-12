import { React, useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { dateToCompanyFormat } from "Configration/Utilities/dateformat";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getSupportTicketHistoryData } from "../Services/Methods";

function DownloadReport({ toggleDownloadReportModal, formValues }) {
  const setAlertMessage = AlertMessage();
  const [formValuesDR, setFormValuesDR] = useState({
    txtEmailID: "",
  });
  const [formValidationError, setFormValidationError] = useState({});
  const updateState = (name, value) => {
    setFormValuesDR({ ...formValuesDR, [name]: value });
    formValidationError[name] = validateField(name, value);
  };
  const validateField = (name, value) => {
    debugger;
    let errorsMsg = "";
    if (name === "txtEmailID") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Email ID is required!";
      } else {
        const regex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        if (!regex.test(value)) {
          errorsMsg = "Email ID is not valid";
        }
      }
    }

    return errorsMsg;
  };
  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;

      errors["txtEmailID"] = validateField("txtEmailID", formValuesDR.txtEmailID);

      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async () => {
    debugger;
    try {
      if (!handleValidation()) {
        return;
      }

      setBtnLoaderActive(true);
      const userData = getSessionStorage("user");
      const formData = {
        SPFROMDATE: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        SPTODATE: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        SPInsuranceCompanyID:
          formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID.toString() : "#ALL",
        SPStateID: formValues.txtState && formValues.txtState.StateMasterID ? formValues.txtState.StateMasterID.toString() : "#ALL",
        SPTicketHeaderID: formValues.txtTicketType && formValues.txtTicketType.TicketTypeID ? formValues.txtTicketType.TicketTypeID : 0,
        SPUserID: userData && userData.LoginID ? userData.LoginID : 0,
        userEmail: formValuesDR.txtEmailID ? formValuesDR.txtEmailID : "",
      };
      const result = await getSupportTicketHistoryData(formData);
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });
        toggleDownloadReportModal();
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
  return (
    <Modal varient="center" title="Export Report" show={toggleDownloadReportModal} width="40vw" right="0">
      <Modal.Body>
        <Form>
          <Form.Group column="1" controlwidth="280px">
            <Form.InputGroup label="Email ID" errorMsg={formValidationError["txtEmailID"]} req="true">
              <Form.InputControl
                control="input"
                type="text"
                autoComplete="off"
                value={formValues.txtEmailID}
                name="txtEmailID"
                onChange={(e) => updateState("txtEmailID", e.target.value)}
              />
            </Form.InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" varient="secondary" onClick={(e) => handleSave()} trigger={btnLoaderActive}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DownloadReport;
