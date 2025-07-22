import { React, useState, useEffect, useRef } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Box, Card, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { dateToCompanyFormat, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { InputControl, InputGroup } from "Framework/OldFramework/FormComponents/FormComponents";
import { KrphButton } from "../../Common/KrphAllActivitiesND/Widgets/KrphButton";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { getSessionStorage, setSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBindingDataList, getDistrictByState } from "../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getMasterDataBinding } from "../../Modules/Support/ManageTicket/Services/Methods";
import { ticketDataBindingData } from "Components/Common/Welcome/Service/Methods";
import { editKRPHGrievenceSupportTicket } from "./Services/Methods";
import BizClass from "./OfflineGrievance.module.scss";

const EditOfflineGrievance = ({ showfunc,selectedData, updateOfflineGrievance }) => {
  const setAlertMessage = AlertMessage();

  const ticketBindingData = getSessionStorage("ticketDataBindingSsnStrg");
  const [seasonForPolicyNumberDropdownDataList] = useState([
    { CropSeasonID: 1, CropSeasonName: "Kharif" },
    { CropSeasonID: 2, CropSeasonName: "Rabi" },
  ]);

  const [RepresentationTypeDropdownDataList] = useState([
      { Value: "SINGLE", label: "Individual Representation" },
      { Value: "MULTIPLE", label: "Joint Representation" },
  ]);

  const [yearList, setYearList] = useState([]);

  const [socialMediaList] = useState([
    { CommonMasterValueID: 133301, CommonMasterValue: "Facebook" },
    { CommonMasterValueID: 133302, CommonMasterValue: "Twitter" },
    { CommonMasterValueID: 133303, CommonMasterValue: "LinkedIn" },
    { CommonMasterValueID: 133304, CommonMasterValue: "WhatsApp" },
    { CommonMasterValueID: 133305, CommonMasterValue: "Other" },
  ]);

  const [sourceofgrievenceList] = useState([
    { CommonMasterValueID: 132301, CommonMasterValue: "Social Media" },
    { CommonMasterValueID: 132302, CommonMasterValue: "Physical Letter" },
    { CommonMasterValueID: 132303, CommonMasterValue: "Email" },
    { CommonMasterValueID: 132304, CommonMasterValue: "CPGRAMS" },
    { CommonMasterValueID: 132305, CommonMasterValue: "Other" },
  ]);

  const [isIdentified] = useState([
    { ID: 1, Value: "Yes" },
    { ID: 2, Value: "No" },
  ]);

  const [sourceOfReceiptList] = useState([
    { CommonMasterValueID: 134301, CommonMasterValue: "CPGRAMS" },
    { CommonMasterValueID: 134302, CommonMasterValue: "HAM Office" },
    { CommonMasterValueID: 134303, CommonMasterValue: "Secretary Office" },
    { CommonMasterValueID: 134304, CommonMasterValue: "Joint Secretary Office" },
    { CommonMasterValueID: 134305, CommonMasterValue: "Directly to Department/Section" },
  ]);

  const [formValuesGI, setFormValuesGI] = useState({
    txtRepresentationType: selectedData  && selectedData.RepresentationType ? { Value: selectedData.RepresentationType, label: selectedData.RepresentationType === "SINGLE" ? "Individual Representation" : selectedData.RepresentationType === "MULTIPLE" ? "Joint Representation" : "" } : null,
    txtState: selectedData  && selectedData.StateMasterName && selectedData.StateCodeAlpha ? { StateCodeAlpha: selectedData.StateCodeAlpha, StateMasterName: selectedData.StateMasterName } : null,
    txtDistrict: selectedData  && selectedData.DistrictMasterName && selectedData.DistrictRequestorID ? { level3ID: selectedData.DistrictRequestorID, level3Name: selectedData.DistrictMasterName } : null,
    txtMobileNumber:  selectedData && selectedData.RequestorMobileNo ? selectedData.RequestorMobileNo : "",
    txtFarmerName: selectedData && selectedData.FarmerName ? selectedData.FarmerName : "",
    txtComplaintDate: selectedData  &&  selectedData.ComplaintDate ?  dateToSpecificFormat(selectedData.ComplaintDate,"YYYY-MM-DD") : "",
    txtFarmerEmailID: selectedData && selectedData.Email ? selectedData.Email : "",
    txtYearForFarmerInfo: selectedData  && selectedData.RequestYear  ? { Value: selectedData.RequestYear, Name: selectedData.RequestYear } : null,
    txtSeasonForFarmerInfo: selectedData  && selectedData.RequestSeason ? { CropSeasonID: selectedData.RequestSeason, CropSeasonName: selectedData.RequestSeason && selectedData.RequestSeason === 1 ? "Kharif" : selectedData.RequestSeason === 2 ? "Rabi": "" } : null,
    txtSourceOfGrievance: selectedData  && selectedData.GrievenceSourceType && selectedData.GrievenceTicketSourceTypeID ? { CommonMasterValueID: selectedData.GrievenceTicketSourceTypeID, CommonMasterValue: selectedData.GrievenceSourceType } : null,
    txtOtherSourceOfGrievance: selectedData && selectedData.GrievenceSourceOtherType ? selectedData.GrievenceSourceOtherType : "",
    txtSocialMedia: selectedData  && selectedData.SocialMediaType && selectedData.SocialMediaTypeID ? { CommonMasterValueID: selectedData.SocialMediaTypeID, CommonMasterValue: selectedData.SocialMediaType } : null,
    txturl: selectedData && selectedData.SocialMediaURL ? selectedData.SocialMediaURL : "",
    txtOtherSocialMediaSource: selectedData && selectedData.OtherSocialMedia ? selectedData.OtherSocialMedia : "",
    txtSourceOfReceipt: selectedData  && selectedData.ReceiptSource && selectedData.ReceiptSourceID ? { CommonMasterValueID: selectedData.ReceiptSourceID, CommonMasterValue: selectedData.ReceiptSource } : null,
    txtisIdentified: selectedData && selectedData.InsuranceCompanyID === 0 ? { ID: 2, Value: "No" } : selectedData.InsuranceCompanyID > 0 ? { ID: 2, Value: "Yes" }: null ,
    txtInsuranceCompany: selectedData  && selectedData.InsuranceCompanyID && selectedData.InsuranceCompany ? { CompanyID: selectedData.InsuranceCompanyID, CompanyName: selectedData.InsuranceCompany } : null,
    txtApplicationNumber: selectedData && selectedData.ApplicationNo ? selectedData.ApplicationNo : "",
    txtPolicyNumber: selectedData && selectedData.InsurancePolicyNo ? selectedData.InsurancePolicyNo : "",
    txtCropName: selectedData && selectedData.CropName ? selectedData.CropName : "",
    txtTicketCategoryType: selectedData  && selectedData.TicketCategoryName && selectedData.TicketCategoryID ? { SupportTicketTypeID: selectedData.TicketCategoryID, SupportTicketTypeName: selectedData.TicketCategoryName } : null,
    txtTicketCategory:  selectedData  && selectedData.TicketSubCategoryName && selectedData.TicketSubCategoryID ? { TicketCategoryID: selectedData.TicketSubCategoryID, TicketCategoryName: selectedData.TicketSubCategoryName } : null,
    txtDocumentUpload: "",
    txtTicketDescription: selectedData && selectedData.GrievenceDescription ? selectedData.GrievenceDescription : "",
  });

  const [formValidationKRPHError, setFormValidationKRPHError] = useState({});
  const validateKRPHInfoField = (name, value) => {
    let errorsMsg = "";

        if (name === "txtRepresentationType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Representation Type is required!";
      }
    }
    if (name === "txtState") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "State is required!";
      }
    }
    if (name === "txtDistrict") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "District is required!";
      }
    }
    if (name === "txtFarmerName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Farmer Name is required!";
      }
    }

    if (name === "txtFarmerEmailID") {
      if (value) {
        const regex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        if (!regex.test(value)) {
          errorsMsg = "Email ID is not valid";
        }
      }
    }

    const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");

    if (name === "txtMobileNumber") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Mobile Number is required!";
      } else if (value) {
        if (!regex.test(value)) {
          errorsMsg = "Mobile Number is not valid!";
        } else if (value.length < 10) {
          errorsMsg = "Enter Valid 10 digit Mobile Number!";
        }
      }
    }

    if (name === "txtComplaintDate") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Complaint Date is required!";
      }
    }

    if (name === "txtSourceOfGrievance") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Source Of Grievance is required!";
      }
    }

    if (name === "txtOtherSourceOfGrievance") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Other Source Of Grievance is required!";
      }
    }

    if (name === "txtSocialMedia") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Social Media is required!";
      }
    }

    if (name === "txtOtherSocialMediaSource") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Other Social Media is required!";
      }
    }

    if (name === "txtSourceOfReceipt") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Source Of Receipt is required!";
      }
    }

    if (name === "txtisIdentified") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Insurance Company Identified is required!";
      }
    }

    if (name === "txtInsuranceCompany") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Insurance Company is required!";
      }
    }

    if (name === "txtTicketCategoryType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Please select Ticket Category!";
      }
    }

    if (name === "txtTicketCategory") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Please select Ticket Sub Category!";
      }
    }

    if (name === "txtTicketDescription") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Ticket Description is required!";
      } else if (value.trim().length === 0) {
        errorsMsg = "Ticket Description cannot be only spaces!";
      } else if (value) {
        if (value.length > 500) {
          errorsMsg = "Ticket Description can not exceed more than 500 characters!";
        }
      }
    }

    return errorsMsg;
  };

  const handleKRPHInfoValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtRepresentationType"] = validateKRPHInfoField("txtRepresentationType", formValuesGI.txtRepresentationType);
      errors["txtFarmerEmailID"] = validateKRPHInfoField("txtFarmerEmailID", formValuesGI.txtFarmerEmailID);
      // A errors["txtMobileNumber"] = validateKRPHInfoField("txtMobileNumber", formValuesGI.txtMobileNumber);
      errors["txtComplaintDate"] = validateKRPHInfoField("txtComplaintDate", formValuesGI.txtComplaintDate);
      errors["txtSourceOfGrievance"] = validateKRPHInfoField("txtSourceOfGrievance", formValuesGI.txtSourceOfGrievance);
      if (
        formValuesGI &&
        formValuesGI.txtSourceOfGrievance &&
        formValuesGI.txtSourceOfGrievance.CommonMasterValueID &&
        formValuesGI.txtSourceOfGrievance.CommonMasterValueID === 132301
      ) {
        errors["txtSocialMedia"] = validateKRPHInfoField("txtSocialMedia", formValuesGI.txtSocialMedia);
      }
      if (
        formValuesGI &&
        formValuesGI.txtSocialMedia &&
        formValuesGI.txtSocialMedia.CommonMasterValueID &&
        formValuesGI.txtSocialMedia.CommonMasterValueID === 133305
      ) {
        errors["txtOtherSocialMediaSource"] = validateKRPHInfoField("txtOtherSocialMediaSource", formValuesGI.txtOtherSocialMediaSource);
      }
      if (
        formValuesGI &&
        formValuesGI.txtSourceOfGrievance &&
        formValuesGI.txtSourceOfGrievance.CommonMasterValueID &&
        formValuesGI.txtSourceOfGrievance.CommonMasterValueID === 132305
      ) {
        errors["txtOtherSourceOfGrievance"] = validateKRPHInfoField("txtOtherSourceOfGrievance", formValuesGI.txtOtherSourceOfGrievance);
      }
      if (
        formValuesGI &&
        formValuesGI.txtSourceOfGrievance &&
        formValuesGI.txtSourceOfGrievance.CommonMasterValueID &&
        (formValuesGI.txtSourceOfGrievance.CommonMasterValueID === 132302 || formValuesGI.txtSourceOfGrievance.CommonMasterValueID === 132303)
      ) {
        errors["txtSourceOfReceipt"] = validateKRPHInfoField("txtSourceOfReceipt", formValuesGI.txtSourceOfReceipt);
      }
      if (
        formValuesGI &&
        formValuesGI.txtisIdentified &&
        formValuesGI.txtisIdentified.ID &&
        formValuesGI.txtisIdentified.ID === 1
      ) {
      errors["txtInsuranceCompany"] = validateKRPHInfoField("txtInsuranceCompany", formValuesGI.txtInsuranceCompany);
      }
     // A errors["txtTicketCategoryType"] = validateKRPHInfoField("txtTicketCategoryType", formValuesGI.txtTicketCategoryType);
     // A errors["txtTicketCategory"] = validateKRPHInfoField("txtTicketCategory", formValuesGI.txtTicketCategory);
      errors["txtTicketDescription"] = validateKRPHInfoField("txtTicketDescription", formValuesGI.txtTicketDescription);

      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationKRPHError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const [formValidationCounter, setFormValidationCounter] = useState({});
  const updateStateGI = (name, value) => {
    debugger;
    setFormValuesGI({ ...formValuesGI, [name]: value });
    setFormValidationKRPHError[name] = validateKRPHInfoField(name, value);

    if (name === "txtState") {
      setFormValuesGI({
        ...formValuesGI,
        txtState: value,
        txtDistrict: null,
      });
      setDistrictKRPHDropdownDataList([]);
      if (value) {
        getDistrictByStateKRPHListData(value.StateCodeAlpha);
      }
    }

    if (name === "txtTicketCategoryType") {
      setFormValuesGI({
        ...formValuesGI,
        txtTicketCategoryType: value,
        txtTicketCategory: null,
      });
      setTicketCategoryList([]);
      if (value) {
        getTicketCategoryListData(value.SupportTicketTypeID, value);
      }
    }

    if (name === "txtTicketDescription") {
      formValidationCounter[name] = value ? 500 - value.length : 500;
      setFormValidationCounter({ ...formValidationCounter });
    }

    if (name === "txtSourceOfGrievance") {
      setFormValuesGI({
        ...formValuesGI,
        txtSourceOfGrievance: value,
        txtSocialMedia: null,
      });
    }
  };

  const [stateKRPHDropdownDataList, setStateKRPHDropdownDataList] = useState([]);
  const [isLoadingStateDKRPHropdownDataList, setIsLoadingStateKRPHDropdownDataList] = useState(false);
  const getStateKRPHListData = async () => {
    try {
      setIsLoadingStateKRPHDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "STATEMAS",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      setIsLoadingStateKRPHDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateKRPHDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setStateKRPHDropdownDataList([]);
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

  const [districtKRPHDropdownDataList, setDistrictKRPHDropdownDataList] = useState([]);
  const [isLoadingDistrictKRPHDropdownDataList, setIsLoadingDistrictKRPHDropdownDataList] = useState(false);
  const getDistrictByStateKRPHListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictKRPHDropdownDataList(true);
      const formdata = {
        stateAlphaCode: pstateAlphaCode,
      };
      const result = await getDistrictByState(formdata);
      setIsLoadingDistrictKRPHDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setDistrictKRPHDropdownDataList([]);
          } else {
            setDistrictKRPHDropdownDataList(result.response.responseData.data.hierarchy.level3);
          }
        } else {
          setDistrictKRPHDropdownDataList([]);
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

  const getticketDataBindingKrphAllActivitiesData = async () => {
    try {
      if (getSessionStorage("ticketDataBindingKrphAllActivitiesSsnStrg") === null) {
        const result = await ticketDataBindingData({});
        if (result.response.responseCode === 1) {
          if (result.response.responseData) {
            console.log(result.response.responseData);
            setSessionStorage("ticketDataBindingKrphAllActivitiesSsnStrg", result.response.responseData);
          } else {
            setSessionStorage("ticketDataBindingKrphAllActivitiesSsnStrg", null);
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
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

  const transitionVariants = {
    hidden: { opacity: 0, scale: 0.8 }, // Starts small and in the background
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }, // Moves forward smoothly
    // Aexit: { opacity: 0, scale: 1.2, transition: { duration: 0.3, ease: "easeIn" } }, // Shrinks and moves backward
  };

  function dynamicSort(properties) {
    return function (a, b) {
      for (let i = 0; i < properties.length; i++) {
        let prop = properties[i];
        if (a[prop] < b[prop]) return -1;
        if (a[prop] > b[prop]) return 1;
      }
      return 0;
    };
  }

  const [ticketCategoryList, setTicketCategoryList] = useState([]);
  const [isLoadingTicketCategoryList, setIsTicketCategoryList] = useState(false);
  const getTicketCategoryListData = async (supportTicketTypeID, data) => {
    console.log(data);
    try {
      if (ticketBindingData) {
        setTicketCategoryList([]);
        setIsTicketCategoryList(true);
        const filterticketBindingData = ticketBindingData.TCKCGZ.filter((data) => {
          return data.SupportTicketTypeID === Number(supportTicketTypeID);
        });
        const sortticketBindingData = filterticketBindingData.sort(dynamicSort(["preference", "TicketCategoryName"]));
        setTicketCategoryList(sortticketBindingData);
        setIsTicketCategoryList(false);
      } else {
        setTicketCategoryList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const [ticketCategoryTypeList, setTicketCategoryTypeList] = useState([]);
  const [isLoadingTicketCategoryTypeList, setIsTicketCategoryTypeList] = useState(false);
  const getTicketCategoryTypeListData = async (pselectedOption, pCropLossDetailID, pMasterName) => {
    if (ticketBindingData) {
      setIsTicketCategoryTypeList(true);
      if (pMasterName === "TCKTYP") {
        const filterticketBindingData = ticketBindingData.CRPTYP.filter((data) => {
          return data.CategoryHeadID === Number(pselectedOption);
        });
        const sortticketBindingData = filterticketBindingData.sort((a, b) => {
          if (a.SupportTicketTypeName < b.SupportTicketTypeName) return -1;
        });
        setTicketCategoryTypeList(sortticketBindingData);
      } else if (pMasterName === "CRPTYP") {
        const filterticketBindingData = ticketBindingData.CRPTYP.filter((data) => {
          return data.CategoryHeadID === Number(pselectedOption) && data.CropLossDetailID === pCropLossDetailID;
        });
        const sortticketBindingData = filterticketBindingData.sort((a, b) => {
          if (a.SupportTicketTypeName < b.SupportTicketTypeName) return -1;
        });
        setTicketCategoryTypeList(sortticketBindingData);
      }
      setIsTicketCategoryTypeList(false);
    } else {
      setTicketCategoryTypeList([]);
    }
  };

  const ClearFormFields = () => {
    setFormValuesGI({
      ...formValuesGI,
      txtState: null,
      txtDistrict: null,
      txtMobileNumber: "",
      txtFarmerName: "",
      txtComplaintDate: "",
      txtFarmerEmailID: "",
      txtYearForFarmerInfo: null,
      txtSeasonForFarmerInfo: null,
      txtSourceOfGrievance: null,
      txtOtherSourceOfGrievance: "",
      txtSocialMedia: null,
      txturl: "",
      txtOtherSocialMediaSource: "",
      txtInsuranceCompany: null,
      txtApplicationNumber: "",
      txtPolicyNumber: "",
      txtCropName: "",
      txtTicketCategoryType: null,
      txtTicketCategory: null,
      txtDocumentUpload: "",
      txtTicketDescription: "",
    });
  };

  const [isBtndisabled, setisBtndisabled] = useState(0);
  const [btnLoaderSupportTicketActive, setBtnLoaderSupportTicketActive] = useState(false);
  const supportTicketOnClick = async () => {
    debugger;
    if (!handleKRPHInfoValidation()) {
      return;
    }
    debugger;
    try {
      const formData = {
        representationType: formValuesGI.txtRepresentationType && formValuesGI.txtRepresentationType.Value
            ? formValuesGI.txtRepresentationType.Value
            : "",
        grievenceSupportTicketID: selectedData && selectedData.GrievenceSupportTicketID ? selectedData.GrievenceSupportTicketID : 0,
        farmerName: formValuesGI.txtFarmerName ? formValuesGI.txtFarmerName : "",
        email: formValuesGI.txtFarmerEmailID ? formValuesGI.txtFarmerEmailID : "",
        requestorMobileNo: formValuesGI.txtMobileNumber ? formValuesGI.txtMobileNumber : "",
        subCategoryName: "",
        complaintDate: formValuesGI && formValuesGI.txtComplaintDate ? dateToCompanyFormat(formValuesGI.txtComplaintDate) : "",
        stateCodeAlpha: formValuesGI.txtState && formValuesGI.txtState.StateCodeAlpha ? formValuesGI.txtState.StateCodeAlpha : "",
        districtRequestorID: formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3ID ? formValuesGI.txtDistrict.level3ID : "",
        grievenceSourceTypeID:
          formValuesGI.txtSourceOfGrievance && formValuesGI.txtSourceOfGrievance.CommonMasterValueID
            ? formValuesGI.txtSourceOfGrievance.CommonMasterValueID
            : 0,
        grievenceSourceOtherType: formValuesGI && formValuesGI.txtOtherSourceOfGrievance ? formValuesGI.txtOtherSourceOfGrievance : "",
        socialMediaTypeID: formValuesGI.txtSocialMedia && formValuesGI.txtSocialMedia.CommonMasterValueID ? formValuesGI.txtSocialMedia.CommonMasterValueID : 0,
        otherSocialMedia: formValuesGI && formValuesGI.txtOtherSocialMediaSource ? formValuesGI.txtOtherSocialMediaSource : "",
        socialMediaURL: formValuesGI && formValuesGI.txturl ? formValuesGI.txturl : "",
        receiptSourceID:
          formValuesGI.txtSourceOfReceipt && formValuesGI.txtSourceOfReceipt.CommonMasterValueID ? formValuesGI.txtSourceOfReceipt.CommonMasterValueID : 0,
        ticketCategoryID:
          formValuesGI.txtTicketCategoryType && formValuesGI.txtTicketCategoryType.SupportTicketTypeID
            ? formValuesGI.txtTicketCategoryType.SupportTicketTypeID
            : 0,
        ticketSubCategoryID:
          formValuesGI.txtTicketCategory && formValuesGI.txtTicketCategory.TicketCategoryID ? formValuesGI.txtTicketCategory.TicketCategoryID : 0,
        requestYear: formValuesGI.txtYearForFarmerInfo && formValuesGI.txtYearForFarmerInfo.Value ? formValuesGI.txtYearForFarmerInfo.Value : 0,
        requestSeason:
          formValuesGI.txtSeasonForFarmerInfo && formValuesGI.txtSeasonForFarmerInfo.CropSeasonID ? formValuesGI.txtSeasonForFarmerInfo.CropSeasonID : 0,
        cropName: formValuesGI && formValuesGI.txtCropName ? formValuesGI.txtCropName : "",
        applicationNo: formValuesGI && formValuesGI.txtApplicationNumber ? formValuesGI.txtApplicationNumber : "",
        insuranceCompanyID: formValuesGI.txtInsuranceCompany && formValuesGI.txtInsuranceCompany.CompanyID ? formValuesGI.txtInsuranceCompany.CompanyID : 0,
        insurancePolicyNo: formValuesGI && formValuesGI.txtPolicyNumber ? formValuesGI.txtPolicyNumber : "",
        attachmentPath: "",
        hasDocument: 0,
        subDistrictID: "",
        subDistrictName: "",
        districtMasterName: formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3Name ? formValuesGI.txtDistrict.level3Name : "",
        ticketSubCategoryName:
          formValuesGI.txtTicketCategory && formValuesGI.txtTicketCategory.TicketCategoryName ? formValuesGI.txtTicketCategory.TicketCategoryName : "",
        ticketCategoryName:
          formValuesGI.txtTicketCategoryType && formValuesGI.txtTicketCategoryType.SupportTicketTypeName
            ? formValuesGI.txtTicketCategoryType.SupportTicketTypeName
            : "",
        insuranceCompany: formValuesGI.txtInsuranceCompany && formValuesGI.txtInsuranceCompany.CompanyName ? formValuesGI.txtInsuranceCompany.CompanyName : "",
        stateMasterName: formValuesGI.txtState && formValuesGI.txtState.StateMasterName ? formValuesGI.txtState.StateMasterName : "",
        grievenceDescription: formValuesGI && formValuesGI.txtTicketDescription ? formValuesGI.txtTicketDescription : "",
      };
      setisBtndisabled(1);
      setBtnLoaderSupportTicketActive(true);
      const result = await editKRPHGrievenceSupportTicket(formData);
      setBtnLoaderSupportTicketActive(false);
      setisBtndisabled(0);
     if (result.responseCode === 1) {
                  if (result && result.responseData) {
        selectedData.RepresentationType =  formValuesGI.txtRepresentationType && formValuesGI.txtRepresentationType.Value
            ? formValuesGI.txtRepresentationType.Value
            : "";
        selectedData.InsuranceCompanyID = formValuesGI.txtInsuranceCompany && formValuesGI.txtInsuranceCompany.CompanyID ? formValuesGI.txtInsuranceCompany.CompanyID : 0;
        selectedData.InsuranceCompany =  formValuesGI.txtInsuranceCompany && formValuesGI.txtInsuranceCompany.CompanyName ? formValuesGI.txtInsuranceCompany.CompanyName : "";
        selectedData.FarmerName= formValuesGI.txtFarmerName ? formValuesGI.txtFarmerName : "";
        selectedData.Email= formValuesGI.txtFarmerEmailID ? formValuesGI.txtFarmerEmailID : "";
        selectedData.RequestorMobileNo= formValuesGI.txtMobileNumber ? formValuesGI.txtMobileNumber : "";
        selectedData.ComplaintDate= formValuesGI && formValuesGI.txtComplaintDate ? dateToCompanyFormat(formValuesGI.txtComplaintDate) : "";
        selectedData.StateCodeAlpha= formValuesGI.txtState && formValuesGI.txtState.StateCodeAlpha ? formValuesGI.txtState.StateCodeAlpha : "";
        selectedData.DistrictRequestorID= formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3ID ? formValuesGI.txtDistrict.level3ID : "";
        selectedData.GrievenceSourceTypeID=
          formValuesGI.txtSourceOfGrievance && formValuesGI.txtSourceOfGrievance.CommonMasterValueID
            ? formValuesGI.txtSourceOfGrievance.CommonMasterValueID
            : 0;
        selectedData.GrievenceSourceOtherType= formValuesGI && formValuesGI.txtOtherSourceOfGrievance ? formValuesGI.txtOtherSourceOfGrievance : "";
        selectedData.SocialMediaTypeID= formValuesGI.txtSocialMedia && formValuesGI.txtSocialMedia.CommonMasterValueID ? formValuesGI.txtSocialMedia.CommonMasterValueID : 0;
        selectedData.OtherSocialMedia= formValuesGI && formValuesGI.txtOtherSocialMediaSource ? formValuesGI.txtOtherSocialMediaSource : "";
        selectedData.SocialMediaURL= formValuesGI && formValuesGI.txturl ? formValuesGI.txturl : "";
        selectedData.ReceiptSourceID=
          formValuesGI.txtSourceOfReceipt && formValuesGI.txtSourceOfReceipt.CommonMasterValueID ? formValuesGI.txtSourceOfReceipt.CommonMasterValueID : 0;
        selectedData.TicketCategoryID=
          formValuesGI.txtTicketCategoryType && formValuesGI.txtTicketCategoryType.SupportTicketTypeID
            ? formValuesGI.txtTicketCategoryType.SupportTicketTypeID
            : 0;
        selectedData.TicketSubCategoryID=
          formValuesGI.txtTicketCategory && formValuesGI.txtTicketCategory.TicketCategoryID ? formValuesGI.txtTicketCategory.TicketCategoryID : 0;
        selectedData.RequestYear= formValuesGI.txtYearForFarmerInfo && formValuesGI.txtYearForFarmerInfo.Value ? formValuesGI.txtYearForFarmerInfo.Value : 0;
        selectedData.RequestSeason=
          formValuesGI.txtSeasonForFarmerInfo && formValuesGI.txtSeasonForFarmerInfo.CropSeasonID ? formValuesGI.txtSeasonForFarmerInfo.CropSeasonID : 0;
        selectedData.CropName= formValuesGI && formValuesGI.txtCropName ? formValuesGI.txtCropName : "";
        selectedData.ApplicationNo= formValuesGI && formValuesGI.txtApplicationNumber ? formValuesGI.txtApplicationNumber : "";
        selectedData.InsurancePolicyNo= formValuesGI && formValuesGI.txtPolicyNumber ? formValuesGI.txtPolicyNumber : "";
        selectedData.DistrictMasterName= formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3Name ? formValuesGI.txtDistrict.level3Name : "";
        selectedData.ticketSubCategoryName=
          formValuesGI.txtTicketCategory && formValuesGI.txtTicketCategory.TicketCategoryName ? formValuesGI.txtTicketCategory.TicketCategoryName : "";
        selectedData.ticketCategoryName=
          formValuesGI.txtTicketCategoryType && formValuesGI.txtTicketCategoryType.SupportTicketTypeName
            ? formValuesGI.txtTicketCategoryType.SupportTicketTypeName
            : "";
        selectedData.StateMasterName= formValuesGI.txtState && formValuesGI.txtState.StateMasterName ? formValuesGI.txtState.StateMasterName : "";
        selectedData.GrievenceDescription= formValuesGI && formValuesGI.txtTicketDescription ? formValuesGI.txtTicketDescription : "";
                    updateOfflineGrievance(selectedData);
                    showfunc();
                  }
                  setBtnLoaderSupportTicketActive(false);
                  setAlertMessage({
                    type: "success",
                    message: result.responseMessage,
                  });
                } else {
                  setBtnLoaderSupportTicketActive(false);
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

  const fileRef = useRef(null);

  const handleResetFile = async () => {
    fileRef.current.value = null;
    setFormValidationSupportTicketReviewError({});
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    // A setRunningCurrentYear(currentYear);
    const yearArray = [];
    for (let i = 2018; i <= currentYear; i += 1) {
      yearArray.push({ Name: i.toString(), Value: i.toString() });
    }
    setYearList(yearArray.sort().reverse());
    getticketDataBindingKrphAllActivitiesData();
    getStateKRPHListData();
    getInsuranceCompanyListData();
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
    getTicketCategoryListData(selectedData.TicketCategoryID, {SupportTicketTypeID: selectedData.TicketCategoryID, SupportTicketTypeName: selectedData.TicketCategoryName});
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.height = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      document.body.style.overflowX = "";
    };
  }, []);

  return (
    <>
      <Modal varient="half" title="Edit Grievance From Other Sources" right="0" width="90.5vw" show={showfunc}>
        <Modal.Body>
          <Box
            sx={{
              width: "100%",
              padding: "5px 40px 5px 40px",
              background: "linear-gradient(to bottom, #21862d, #c3eb68)",
              minHeight: "100vh",
              height: "fit-content",
            }}
          >
            <motion.div key="farmer" initial="hidden" animate="visible" exit="exit" variants={transitionVariants}>
              <AnimatePresence mode="wait">
                <motion.div key="farmer" initial="hidden" animate="visible" exit="exit" variants={transitionVariants}>
                  <Card
                    sx={{
                      mt: 1,
                      padding: " 10px 25px 5px 25px",
                      borderRadius: 3,
                    }}
                  >
                    <Typography sx={{ fontFamily: "Quicksand, sans-serif", fontSize: "16px" }} fontWeight="bold">
                      General Information
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                     <Typography
                                                sx={{
                                                  fontFamily: "Quicksand, sans-serif",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  gap: "2px",
                                                  fontSize: "14px",
                                                }}
                                              >
                                                <span>
                                                  Representation Type <span className="asteriskCss">&#42;</span>
                                                </span>{" "}
                                                <InputGroup ErrorMsg={formValidationKRPHError["txtRepresentationType"]}>
                                                  <InputControl
                                                    Input_type="select"
                                                    name="txtRepresentationType"
                                                    getOptionLabel={(option) => `${option.label}`}
                                                    value={formValuesGI.txtRepresentationType}
                                                    getOptionValue={(option) => `${option}`}
                                                    options={RepresentationTypeDropdownDataList}
                                                    ControlTxt="Representation Type"
                                                    onChange={(e) => updateStateGI("txtRepresentationType", e)}
                                                  />
                                                </InputGroup>
                                                {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtSocialMedia"]}</span> */}
                                              </Typography>  
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          Farmer Name 
                        </span>
                        <InputGroup ErrorMsg={formValidationKRPHError["txtFarmerName"]}>
                          <InputControl
                            Input_type="input"
                            name="txtFarmerName"
                            value={formValuesGI.txtFarmerName}
                            onChange={(e) => updateStateGI("txtFarmerName", e.target.value.replace(/[^a-zA-Z ]+/g, ""))}
                            autoComplete="off"
                            maxLength={70}
                          />
                        </InputGroup>
                        {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtFarmerName"]}</span> */}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          Mobile Number 
                        </span>
                        <InputGroup ErrorMsg={formValidationKRPHError["txtMobileNumber"]}>
                          <InputControl
                            Input_type="input"
                            name="txtMobileNumber"
                            value={formValuesGI.txtMobileNumber}
                            onChange={(e) => updateStateGI("txtMobileNumber", e.target.value.replace(/\D/g, ""))}
                            autoComplete="off"
                            maxLength={10}
                          />
                        </InputGroup>
                        {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtMobileNumber"]}</span> */}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>Email ID </span>{" "}
                        <InputGroup ErrorMsg={formValidationKRPHError["txtFarmerEmailID"]}>
                          <InputControl
                            Input_type="input"
                            name="txtFarmerEmailID"
                            value={formValuesGI.txtFarmerEmailID}
                            onChange={(e) => updateStateGI("txtFarmerEmailID", e.target.value)}
                            autoComplete="off"
                          />
                        </InputGroup>
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>Policy Number </span>{" "}
                        <InputGroup>
                          <InputControl
                            Input_type="input"
                            name="txtPolicyNumber"
                            value={formValuesGI.txtPolicyNumber}
                            onChange={(e) => updateStateGI("txtPolicyNumber", e.target.value.replace(/\D/g, ""))}
                            autoComplete="off"
                            maxLength={30}
                          />
                        </InputGroup>
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          Complaint Date <span className="asteriskCss">&#42;</span>
                        </span>
                        <InputGroup ErrorMsg={formValidationKRPHError["txtComplaintDate"]}>
                          <InputControl
                            Input_type="input"
                            type="date"
                            name="txtComplaintDate"
                            value={formValuesGI.txtComplaintDate}
                            onChange={(e) => updateStateGI("txtComplaintDate", e.target.value)}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                        </InputGroup>
                        {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtComplaintDate"]}</span> */}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          State 
                        </span>{" "}
                        <InputGroup ErrorMsg={formValidationKRPHError["txtState"]}>
                          <InputControl
                            Input_type="select"
                            name="txtState"
                            isLoading={isLoadingStateDKRPHropdownDataList}
                            getOptionLabel={(option) => `${option.StateMasterName}`}
                            value={formValuesGI.txtState}
                            getOptionValue={(option) => `${option}`}
                            options={stateKRPHDropdownDataList}
                            ControlTxt="State"
                            onChange={(e) => updateStateGI("txtState", e)}
                          />
                        </InputGroup>
                        {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtState"]}</span> */}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          District 
                        </span>
                        <InputGroup ErrorMsg={formValidationKRPHError["txtDistrict"]}>
                          <InputControl
                            Input_type="select"
                            name="txtDistrict"
                            isLoading={isLoadingDistrictKRPHDropdownDataList}
                            getOptionLabel={(option) => `${option.level3Name}`}
                            value={formValuesGI.txtDistrict}
                            getOptionValue={(option) => `${option}`}
                            options={districtKRPHDropdownDataList}
                            ControlTxt="District"
                            onChange={(e) => updateStateGI("txtDistrict", e)}
                          />
                        </InputGroup>
                        {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtDistrict"]}</span> */}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          Source Of Grievance <span className="asteriskCss">&#42;</span>
                        </span>{" "}
                        <InputGroup ErrorMsg={formValidationKRPHError["txtSourceOfGrievance"]}>
                          <InputControl
                            Input_type="select"
                            name="txtSourceOfGrievance"
                            getOptionLabel={(option) => `${option.CommonMasterValue}`}
                            value={formValuesGI.txtSourceOfGrievance}
                            getOptionValue={(option) => `${option}`}
                            options={sourceofgrievenceList}
                            ControlTxt="Source Of Grievance"
                            onChange={(e) => updateStateGI("txtSourceOfGrievance", e)}
                          />
                        </InputGroup>
                        {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtSourceOfGrievance"]}</span> */}
                      </Typography>
                      {formValuesGI &&
                      formValuesGI.txtSourceOfGrievance &&
                      formValuesGI.txtSourceOfGrievance.CommonMasterValueID &&
                      formValuesGI.txtSourceOfGrievance.CommonMasterValueID === 132301 ? (
                        <>
                          <Typography
                            sx={{
                              fontFamily: "Quicksand, sans-serif",
                              display: "flex",
                              flexDirection: "column",
                              gap: "2px",
                              fontSize: "14px",
                            }}
                          >
                            <span>
                              Social Media <span className="asteriskCss">&#42;</span>
                            </span>{" "}
                            <InputGroup ErrorMsg={formValidationKRPHError["txtSocialMedia"]}>
                              <InputControl
                                Input_type="select"
                                name="txtSocialMedia"
                                getOptionLabel={(option) => `${option.CommonMasterValue}`}
                                value={formValuesGI.txtSocialMedia}
                                getOptionValue={(option) => `${option}`}
                                options={socialMediaList}
                                ControlTxt="Social Media"
                                onChange={(e) => updateStateGI("txtSocialMedia", e)}
                              />
                            </InputGroup>
                            {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtSocialMedia"]}</span> */}
                          </Typography>
                          {formValuesGI &&
                          formValuesGI.txtSocialMedia &&
                          formValuesGI.txtSocialMedia.CommonMasterValueID &&
                          formValuesGI.txtSocialMedia.CommonMasterValueID === 133305 ? (
                            <Typography
                              sx={{
                                fontFamily: "Quicksand, sans-serif",
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                                fontSize: "14px",
                              }}
                            >
                              <span>
                                Other Social Media <span className="asteriskCss">&#42;</span>
                              </span>{" "}
                              <InputGroup ErrorMsg={formValidationKRPHError["txtOtherSocialMediaSource"]}>
                                <InputControl
                                  Input_type="input"
                                  name="txtOtherSocialMediaSource"
                                  value={formValuesGI.txtOtherSocialMediaSource}
                                  onChange={(e) => updateStateGI("txtOtherSocialMediaSource", e.target.value)}
                                />
                              </InputGroup>
                              {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtOtherSocialMediaSource"]}</span> */}
                            </Typography>
                          ) : null}
                          <Typography
                            sx={{
                              fontFamily: "Quicksand, sans-serif",
                              display: "flex",
                              flexDirection: "column",
                              gap: "2px",
                              fontSize: "14px",
                            }}
                          >
                            <span>URL/Link </span>{" "}
                            <InputGroup>
                              <InputControl
                                Input_type="input"
                                name="txturl"
                                value={formValuesGI.txturl}
                                onChange={(e) => updateStateGI("txturl", e.target.value)}
                                autoComplete="off"
                              />
                            </InputGroup>
                          </Typography>{" "}
                        </>
                      ) : null}
                      {formValuesGI &&
                      formValuesGI.txtSourceOfGrievance &&
                      formValuesGI.txtSourceOfGrievance.CommonMasterValueID &&
                      (formValuesGI.txtSourceOfGrievance.CommonMasterValueID === 132302 || formValuesGI.txtSourceOfGrievance.CommonMasterValueID === 132303) ? (
                        <Typography
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                            fontSize: "14px",
                          }}
                        >
                          <span>
                            Source Of Receipt <span className="asteriskCss">&#42;</span>
                          </span>{" "}
                          <InputGroup ErrorMsg={formValidationKRPHError["txtSourceOfReceipt"]}>
                            <InputControl
                              Input_type="select"
                              name="txtSourceOfReceipt"
                              getOptionLabel={(option) => `${option.CommonMasterValue}`}
                              value={formValuesGI.txtSourceOfReceipt}
                              getOptionValue={(option) => `${option}`}
                              options={sourceOfReceiptList}
                              ControlTxt=" Source Of Receipt"
                              onChange={(e) => updateStateGI("txtSourceOfReceipt", e)}
                            />
                          </InputGroup>
                        </Typography>
                      ) : null}
                      {formValuesGI &&
                      formValuesGI.txtSourceOfGrievance &&
                      formValuesGI.txtSourceOfGrievance.CommonMasterValueID &&
                      formValuesGI.txtSourceOfGrievance.CommonMasterValueID === 132305 ? (
                        <Typography
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                            fontSize: "14px",
                          }}
                        >
                          <span>
                            Other Source Of Grievance <span className="asteriskCss">&#42;</span>
                          </span>{" "}
                          <InputGroup ErrorMsg={formValidationKRPHError["txtOtherSourceOfGrievance"]}>
                            <InputControl
                              Input_type="input"
                              name="txtOtherSourceOfGrievance"
                              value={formValuesGI.txtOtherSourceOfGrievance}
                              onChange={(e) => updateStateGI("txtOtherSourceOfGrievance", e.target.value)}
                            />
                          </InputGroup>
                          {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtOtherSourceOfGrievance"]}</span> */}
                        </Typography>
                      ) : null}
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>Year</span>{" "}
                        <InputGroup>
                          <InputControl
                            Input_type="select"
                            name="txtYearForFarmerInfo"
                            getOptionLabel={(option) => `${option.Value}`}
                            value={formValuesGI.txtYearForFarmerInfo}
                            getOptionValue={(option) => `${option}`}
                            options={yearList}
                            ControlTxt="Year"
                            onChange={(e) => updateStateGI("txtYearForFarmerInfo", e)}
                          />
                        </InputGroup>
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>Season</span>{" "}
                        <InputGroup>
                          <InputControl
                            Input_type="select"
                            name="txtSeasonForFarmerInfo"
                            getOptionLabel={(option) => `${option.CropSeasonName}`}
                            value={formValuesGI.txtSeasonForFarmerInfo}
                            getOptionValue={(option) => `${option}`}
                            options={seasonForPolicyNumberDropdownDataList}
                            ControlTxt="Season"
                            onChange={(e) => updateStateGI("txtSeasonForFarmerInfo", e)}
                          />
                        </InputGroup>
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>Application Number </span>
                        <InputGroup>
                          <InputControl
                            Input_type="input"
                            name="txtApplicationNumber"
                            value={formValuesGI.txtApplicationNumber}
                            onChange={(e) => updateStateGI("txtApplicationNumber", e.target.value.replace(/\D/g, ""))}
                            autoComplete="off"
                            maxLength={30}
                          />
                        </InputGroup>
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Quicksand, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          Insurance Company Identified <span className="asteriskCss">&#42;</span> :
                        </span>{" "}
                        <InputGroup ErrorMsg={formValidationKRPHError["txtisIdentified"]}>
                          <InputControl
                            Input_type="select"
                            name="txtisIdentified"
                            getOptionLabel={(option) => `${option.Value}`}
                            value={formValuesGI.txtisIdentified}
                            getOptionValue={(option) => `${option}`}
                            options={isIdentified}
                            ControlTxt="Identity"
                            onChange={(e) => updateStateGI("txtisIdentified", e)}
                          />
                        </InputGroup>
                        <span className="login_ErrorTxt">{formValidationKRPHError["txtisIdentified"]}</span>
                      </Typography>
                      {selectedData && selectedData.InsuranceCompanyID > 0 ? (
                        <Typography
                          sx={{
                            fontFamily: "Quicksand, sans-serif",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                            fontSize: "14px",
                          }}
                        >
                          <span>
                            Insurance Company <span className="asteriskCss">&#42;</span> :
                          </span>{" "}
                          <InputGroup ErrorMsg={formValidationKRPHError["txtInsuranceCompany"]}>
                            <InputControl
                              Input_type="select"
                              name="txtInsuranceCompany"
                              getOptionLabel={(option) => `${option.CompanyName}`}
                              value={formValuesGI.txtInsuranceCompany}
                              getOptionValue={(option) => `${option}`}
                              options={insuranceCompanyList}
                              ControlTxt="Insurance Company"
                              onChange={(e) => updateStateGI("txtInsuranceCompany", e)}
                            />
                          </InputGroup>
                          {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtInsuranceCompany"]}</span> */}
                        </Typography>
                      ) : null}
                    </Box>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div key="farmer" initial="hidden" animate="visible" exit="exit" variants={transitionVariants}>
                <Box
                  sx={{
                    background: "#fff",
                    padding: "10px 25px 5px 25px",
                    borderRadius: 2,
                    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                    mt: 1,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" style={{ fontFamily: " Quicksand, sans-serif", fontSize: "16px" }}>
                    Grievance Information
                  </Typography>

                  <Box className="ticket-content_agent">
                    <div className="container_agent">
                      <div className="form-group_agent">
                        <label className="ticket-label_agent">
                          Category 
                        </label>
                        <InputGroup ErrorMsg={formValidationKRPHError["txtTicketCategoryType"]}>
                          <InputControl
                            Input_type="select"
                            name="txtTicketCategoryType"
                            getOptionLabel={(option) => `${option.SupportTicketTypeName}`}
                            value={formValuesGI.txtTicketCategoryType}
                            getOptionValue={(option) => `${option}`}
                            options={ticketCategoryTypeList}
                            ControlTxt="Category"
                            onChange={(e) => updateStateGI("txtTicketCategoryType", e)}
                          />
                        </InputGroup>
                        {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtTicketCategoryType"]}</span> */}
                      </div>
                      <div className="form-group_agent">
                        <label className="ticket-label_agent">
                          {" "}
                          Sub Category 
                        </label>
                        <InputGroup ErrorMsg={formValidationKRPHError["txtTicketCategory"]}>
                          <InputControl
                            Input_type="select"
                            name="txtTicketCategory"
                            getOptionLabel={(option) => `${option.TicketCategoryName}`}
                            value={formValuesGI.txtTicketCategory}
                            getOptionValue={(option) => `${option}`}
                            options={ticketCategoryList}
                            ControlTxt=" Sub Category"
                            onChange={(e) => updateStateGI("txtTicketCategory", e)}
                          />
                        </InputGroup>
                        {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtTicketCategory"]}</span> */}
                      </div>
                    </div>
                    <div className="container_agent">
                      <div className="form-group_agent">
                        <label className="ticket-label_agent">Crop Name</label>
                        <InputGroup>
                          <InputControl
                            Input_type="input"
                            name="txtCropName"
                            value={formValuesGI.txtCropName}
                            onChange={(e) => updateStateGI("txtCropName", e.target.value)}
                            autoComplete="off"
                          />
                        </InputGroup>
                      </div>
                      <div className="form-group_agent" style={{display: "none"}}>
                        <label className="ticket-label_agent">
                          {" "}
                          Attachment <b>(File Size : 500 kb , File Type: .pdf, .jpg, .jpeg, .png)</b>
                        </label>
                        <InputGroup>
                          <InputControl
                            style={{ padding: "2px 10px 0px 10px", width: "340px" }}
                            Input_type="input"
                            type="file"
                            accept="image/*,.pdf"
                            name="txtDocumentUpload"
                            value={formValuesGI.txtDocumentUpload}
                            onChange={(e) => updateStateGI(e.target.name, e.target.files[0])}
                          />
                          <KrphButton type="button" varient="primary" onClick={() => handleResetFile()}>
                            {" "}
                            Reset
                          </KrphButton>
                        </InputGroup>
                      </div>
                    </div>
                    <div className="form-group_agent">
                      <label htmlFor="Description" className="ticket-label_agent">
                        Description <span className="asteriskCss">&#42;</span>
                      </label>
                      <InputGroup Row="4" ErrorMsg={formValidationKRPHError["txtTicketDescription"]}>
                        <InputControl
                          Input_type="textarea"
                          name="txtTicketDescription"
                          value={formValuesGI.txtTicketDescription}
                          maxLength="500"
                          rows="4"
                          onChange={(e) => updateStateGI("txtTicketDescription", e.target.value)}
                        />
                      </InputGroup>
                      <p className={BizClass.CounterDescKRPH}>
                        {formValuesGI.txtTicketDescription && formValuesGI.txtTicketDescription.length ? formValuesGI.txtTicketDescription.length : 0} / {500}
                      </p>
                      {/* <span className="login_ErrorTxt">{formValidationKRPHError["txtTicketDescription"]}</span> */}
                    </div>

                    <div style={{ display: "flex" }}>
                      <KrphButton
                        type="button"
                        varient="secondary"
                        disabled={isBtndisabled}
                        trigger={btnLoaderSupportTicketActive && "true"}
                        onClick={() => supportTicketOnClick()}
                      >
                        Update
                      </KrphButton>
                    </div>
                  </Box>
                </Box>
              </motion.div>
            </AnimatePresence>
          </Box>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditOfflineGrievance;