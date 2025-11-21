import React from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import CustomerAvatar from "Framework/Assets/Images/CustomerAvatar.png";
import { FiCopy } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { RiNewspaperLine } from "react-icons/ri";
import { Form } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { PropTypes } from "prop-types";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import BizClass from "./TicketCustomerDetail.module.scss";

function TicketCustomerDetail({
  ticketData,
  ticketStatusList,
  isLoadingTicketStatusList,
  bankDropdownDataList,
  isLoadingBankDropdownDataList,
  formValuesTicketProperties,
  updateStateTicketProperties,
  btnloaderStatusTicketActive,
  updateStatusSupportTicketOnClick,
}) {
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");

  const copyToClipboard = (id) => {
    /* Get the text field */
    const copyText = document.getElementById(id);
    /* Copy the text inside the text field */
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard
        .writeText(copyText.innerHTML)
        .then(() => {
          setAlertMessage({
            type: "success",
            message: "Text copied to clipboard",
          });
        })
        .catch(() => {
          setAlertMessage({
            type: "error",
            message: "somthing went wrong",
          });
        });
    } else {
      setAlertMessage({
        type: "error",
        message: "somthing went wrong",
      });
    }
  };
  return (
    <div className={BizClass.CustomerBox} id="pdf-last-section">
      <div className={BizClass.Heading}>
        <div className={BizClass.ReqInfo}>
          <img src={CustomerAvatar} alt="Customer" />
          <h3>{ticketData.FarmerName}</h3>
          <br />
          <p>{ticketData.RequestorMobileNo && ticketData.RequestorMobileNo ? `+91  ${ticketData.RequestorMobileNo}` : null}</p>
        </div>
        <div className={BizClass.ActionBox}>
          <HiDotsVertical />
          {/* <BsFillArrowDownCircleFill /> */}
        </div>
      </div>
      <div className={BizClass.MainBox}>
        <div className={BizClass.InfoBox} id="iwant_flex">
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Representation Type :
              <span id="spnRepresentationType">
                {ticketData.RepresentationType && ticketData.RepresentationType === "SINGLE"
                  ? "Individual Representation"
                  : ticketData.RepresentationType === "MULTIPLE"
                    ? "Joint Representation"
                    : ""}
              </span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnRepresentationType")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Season - Year :
              <span id="spnSeasonYear">
                {ticketData && ticketData.RequestSeason && ticketData.RequestSeason === 1 ? "Kharif" : ticketData.RequestSeason === 2 ? "Rabi" : ""} -{" "}
                {ticketData && ticketData.RequestYear ? ticketData.RequestYear : ""}
              </span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnSeasonYear")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Location :
              <span id="spnInsStateDistrict">
                {" "}
                {ticketData && ticketData.StateMasterName ? ticketData.StateMasterName : ""}{" "}
                {ticketData && ticketData.DistrictMasterName ? `, ${ticketData.DistrictMasterName}` : ""}
              </span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnInsStateDistrict")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Ins Company :<span id="spnInsCompany">{ticketData && ticketData.InsuranceCompany ? ticketData.InsuranceCompany : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnInsCompany")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Policy No :<span id="spnPolicyNo">{ticketData && ticketData.InsurancePolicyNo ? ticketData.InsurancePolicyNo : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnPolicyNo")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Application No :<span id="spnApplicationNo">{ticketData && ticketData.ApplicationNo ? ticketData.ApplicationNo : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnApplicationNo")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Crop Name :<span id="spnCropName">{ticketData && ticketData.CropName ? ticketData.CropName : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnCropName")} />
          </div>
          <div className={BizClass.SubBox}>
            <RiNewspaperLine />
            <p>
              Source of Grievance :<span id="spnSourceofGrievance">{ticketData && ticketData.GrievenceSourceType ? ticketData.GrievenceSourceType : ""}</span>
            </p>
            <FiCopy onClick={() => copyToClipboard("spnSourceofGrievance")} />
          </div>
          {ticketData && ticketData.GrievenceTicketSourceTypeID === 132304 ? (
            <div className={BizClass.SubBox}>
              <RiNewspaperLine />
              <p>
                CPGRAM Registration No. :
                <span id="spnSourceofGrievance">{ticketData && ticketData.CPGramRegistrationNumber ? ticketData.CPGramRegistrationNumber : ""}</span>
              </p>
              <FiCopy onClick={() => copyToClipboard("spnSourceofGrievance")} />
            </div>
          ) : null}
          {ticketData && ticketData.GrievenceTicketSourceTypeID === 132305 ? (
            <div className={BizClass.SubBox}>
              <RiNewspaperLine />
              <p>
                Other Source of Grievance :
                <span id="spnSourceofGrievance">{ticketData && ticketData.GrievenceSourceOtherType ? ticketData.GrievenceSourceOtherType : ""}</span>
              </p>
              <FiCopy onClick={() => copyToClipboard("spnSourceofGrievance")} />
            </div>
          ) : null}
          {ticketData && ticketData.GrievenceTicketSourceTypeID === 132301 ? (
            <>
              <div className={BizClass.SubBox}>
                <RiNewspaperLine />
                <p>
                  Social Media :<span id="spnSocialMedia">{ticketData && ticketData.SocialMediaType ? ticketData.SocialMediaType : ""}</span>
                </p>
                <FiCopy onClick={() => copyToClipboard("spnSocialMedia")} />
              </div>{" "}
              <div className={BizClass.SubBox}>
                <RiNewspaperLine />
                <p>
                  URL/Link :<span id="spnURLLink">{ticketData && ticketData.SocialMediaURL ? ticketData.SocialMediaURL : ""}</span>
                </p>
                <FiCopy onClick={() => copyToClipboard("spnURLLink")} />
              </div>{" "}
            </>
          ) : null}
          {ticketData && ticketData.SocialMediaTypeID === 133305 ? (
            <div className={BizClass.SubBox}>
              <RiNewspaperLine />
              <p>
                Other Social Media :<span id="spnSourceofGrievance">{ticketData && ticketData.OtherSocialMedia ? ticketData.OtherSocialMedia : ""}</span>
              </p>
              <FiCopy onClick={() => copyToClipboard("spnSourceofGrievance")} />
            </div>
          ) : null}
          {ticketData && (ticketData.GrievenceTicketSourceTypeID === 132302 || ticketData.GrievenceTicketSourceTypeID === 132303) ? (
            <div className={BizClass.SubBox}>
              <RiNewspaperLine />
              <p>
                Source Of Receipt :<span id="spnSourceOfReceipt">{ticketData && ticketData.ReceiptSource ? ticketData.ReceiptSource : ""}</span>
              </p>
              <FiCopy onClick={() => copyToClipboard("spnSourceOfReceipt")} />
            </div>
          ) : null}
        </div>
        {/* // Code not in use start */}
        <div className={BizClass.PropertiesBox} style={{ display: "none" }}>
          <div className={BizClass.Heading}>
            <h4>Ticket Properties</h4>
            <div className={BizClass.ActionBox}>
              <BsFillArrowDownCircleFill />
            </div>
          </div>
          <div className={BizClass.FilterBox}>
            <div className={BizClass.Content}>
              <Form>
                <Form.Group column="1" controlwidth="auto">
                  <Form.InputGroup label="Status" req="false" errorMsg="">
                    <Form.InputControl
                      control="select"
                      name="txtTicketStatus"
                      options={ticketStatusList}
                      loader={isLoadingTicketStatusList ? <Loader /> : null}
                      value={formValuesTicketProperties.txtTicketStatus}
                      getOptionLabel={(option) => `${option.CommonMasterValue}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateStateTicketProperties("txtTicketStatus", e)}
                    />
                  </Form.InputGroup>
                  {userData.BRHeadTypeID.toString() === "124003" ? (
                    <Form.InputGroup label="" req="false" errorMsg="" style={{ display: "none" }}>
                      <Form.InputControl
                        control="select"
                        name="txtBankName"
                        value={formValuesTicketProperties.txtBankName}
                        options={bankDropdownDataList}
                        loader={isLoadingBankDropdownDataList ? <Loader /> : null}
                        getOptionLabel={(option) => `${option.bankName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateTicketProperties("txtBankName", e)}
                      />
                    </Form.InputGroup>
                  ) : null}
                </Form.Group>
              </Form>
            </div>
            <div className={BizClass.Footer}>
              <Button type="button" trigger={btnloaderStatusTicketActive && "true"} onClick={() => updateStatusSupportTicketOnClick()}>
                Update
              </Button>
            </div>
          </div>
        </div>
        {/* // Code not in use end */}
      </div>
    </div>
  );
}

export default TicketCustomerDetail;

TicketCustomerDetail.propTypes = {
  ticketData: PropTypes.object,
  ticketStatusList: PropTypes.array.isRequired,
  isLoadingTicketStatusList: PropTypes.bool,
  bankDropdownDataList: PropTypes.array.isRequired,
  isLoadingBankDropdownDataList: PropTypes.bool,
  formValuesTicketProperties: PropTypes.object.isRequired,
  updateStateTicketProperties: PropTypes.func.isRequired,
  btnloaderStatusTicketActive: PropTypes.bool,
  updateStatusSupportTicketOnClick: PropTypes.func.isRequired,
};
