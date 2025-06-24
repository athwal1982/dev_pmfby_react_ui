import { React, useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Form, Modal } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { getMasterDataBinding } from "../../Modules/Support/ManageTicket/Services/Methods";
import {editGrievenceSupportTicketData} from "./Services/Methods";
const EditInsuranceCompany = ({ showfunc, selectedData, updateInsuranceCompany }) => {

      const setAlertMessage = AlertMessage();
      const [formValues, setFormValues] = useState({
        txtInsuranceCompany: null,

      });

       const [formValidationError, setFormValidationError] = useState({});

         const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    formValidationError[name] = validateField(name, value);
         };      
    const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
      const [isLoadingInsuranceCompanyList, setIsLoadingInsuranceCompanyList] = useState(false);
      const getInsuranceCompanyListData = async () => {
        try {
          setInsuranceCompanyList([]);
          setIsLoadingInsuranceCompanyList(true);
          const formdata = {
            filterID: 124003,
            filterID1: 0,
            masterName: "CMPLST",
            searchText: "#ALL",
            searchCriteria: "",
          };
          const result = await getMasterDataBinding(formdata);
          setIsLoadingInsuranceCompanyList(false);
          if (result.response.responseCode === 1) {
            if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
              setInsuranceCompanyList(result.response.responseData.masterdatabinding);
            } else {
              setInsuranceCompanyList([]);
            }
          } else {
            setAlertMessage({
              type: "error",
              message: result.response.responseMessage,
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
  const validateField = (name, value) => {
    let errorsMsg = "";
   
    if (name === "txtInsuranceCompany") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Insurance company is required!";
      }
    }

    return errorsMsg;
  };
const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtInsuranceCompany"] = validateField("txtInsuranceCompany", formValues.txtInsuranceCompany);

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
        const handleSave = async (e, updateUserData) => {
          if (e) e.preventDefault();
          debugger;
          if (!handleValidation()) {
            return;
          }
              try {
                const formData = {
                  grievenceSupportTicketID: selectedData && selectedData.GrievenceSupportTicketID ?  selectedData.GrievenceSupportTicketID : 0,
                  insuranceCompanyID:  formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID : 0,
                };
                setBtnLoaderActive(true);
                const result = await editGrievenceSupportTicketData(formData);
                if (result.responseCode === 1) {
                  if (result && result.responseData) {
                    selectedData.InsuranceCompanyID = formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID : 0;
                    selectedData.InsuranceCompany =  formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyName ? formValues.txtInsuranceCompany.CompanyName : "",
                    updateInsuranceCompany(selectedData);
                    showfunc();
                  }
                  setBtnLoaderActive(false);
                  setAlertMessage({
                    type: "success",
                    message: result.responseMessage,
                  });
                } else {
                  setBtnLoaderActive(false);
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
          getInsuranceCompanyListData();
        }, []);
      
    return (
        <>
          <Modal varient="center" title="Edit Insurance Company" right="0" width="35vw" show={showfunc}>
            <Modal.Body>
                        <Form>
                          <Form.Group column={1} controlwidth="400px">
 <Form.InputGroup label="Insurance Company" errorMsg={formValidationError["txtInsuranceCompany"]} req="true">
                <Form.InputControl
                  control="select"
                  name="txtInsuranceCompany"
                  loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
                  onChange={(e) => updateState("txtInsuranceCompany", e)}
                  value={formValues.txtInsuranceCompany}
                  options={insuranceCompanyList}
                  getOptionLabel={(option) => `${option.CompanyName}`}
                  getOptionValue={(option) => `${option}`}
                />
              </Form.InputGroup>
                          </Form.Group>
                          </Form>
            </Modal.Body>
           <Modal.Footer>
                     <Button type="button" varient="secondary" trigger={btnLoaderActive} onClick={() => handleSave()}>
                       Save
                     </Button>
                   </Modal.Footer>
            </Modal>
           </>
      );

};

export default EditInsuranceCompany;