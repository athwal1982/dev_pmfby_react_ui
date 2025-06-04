import { React, useState, useEffect, useRef } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Box, Button, Card, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { InputControl, InputGroup } from "Framework/OldFramework/FormComponents/FormComponents";
import { KrphButton } from "../../Common/KrphAllActivitiesND/Widgets/KrphButton";
import { getSessionStorage, setSessionStorage } from "Components/Common/Login/Auth/auth";
import {
  getMasterDataBindingDataList,
  getDistrictByState,
} from "../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getMasterDataBinding } from "../../Modules/Support/ManageTicket/Services/Methods";
import { ticketDataBindingData } from "Components/Common/Welcome/Service/Methods";
import BizClass from "../../Common/KrphAllActivitiesND/KrphAllActivitiesND.module.scss";
import { Tabs, Tab } from "@mui/material";
import "./OfflineGrievance.scss";

const OfflineGrievance = () => {
  const setAlertMessage = AlertMessage();

  const tabOptions = ["Social Media", "Physical Letter", "Email", "Other"];



  const [selectedTab, setSelectedTab] = useState("Social Media");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const ticketBindingData = getSessionStorage("ticketDataBindingSsnStrg");
  const [seasonForPolicyNumberDropdownDataList] = useState([
    { CropSeasonID: 1, CropSeasonName: "Kharif" },
    { CropSeasonID: 2, CropSeasonName: "Rabi" },
  ]);

  const [yearList, setYearList] = useState([]);

  const [socialMediaList] = useState([
    { ID: 1, Value: "Facebook" },
    { ID: 2, Value: "Twitter" },
    { ID: 3, Value: "LinkedIn" },
    { ID: 4, Value: "WhatsApp" },
  ]);
  const [isIdentified] = useState([
    { ID: 1, Value: "Yes" },
    { ID: 2, Value: "No" },
  ]);

  const [formValuesGI, setFormValuesGI] = useState({
    txtState: null,
    txtDistrict: null,
    txtMobileNumber: "",
    txtFarmerName: "",
    txtComplaintDate: "",
    txtFarmerEmailID: "",
    txtYearForFarmerInfo: null,
    txtSeasonForFarmerInfo: null,
    txtSourceOfGrievance: null,
    txtSocialMedia: null,
    txtInsuranceCompany: null,
    txtApplicationNumber: "",
    txtPolicyNumber: "",
    txtCropName: "",
    txtTicketCategoryType: null,
    txtTicketCategory: null,
    txtDocumentUpload: "",
    txtTicketDescription: "",
  });

  const [formValidationKRPHError, setFormValidationKRPHError] = useState({});
  const validateKRPHInfoField = (name, value) => {
    let errorsMsg = "";


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

    if (name === "txtSourceOfGrievance") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Source Of Grievance is required!";
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

      errors["txtState"] = validateKRPHInfoField("txtState", formValuesGI.txtState);
      errors["txtDistrict"] = validateKRPHInfoField("txtDistrict", formValuesGI.txtDistrict);
      errors["txtFarmerName"] = validateKRPHInfoField("txtFarmerName", formValuesGI.txtFarmerName);
      errors["txtMobileNumber"] = validateKRPHInfoField("txtMobileNumber", formValuesGI.txtMobileNumber);
      errors["txtSourceOfGrievance"] = validateKRPHInfoField("txtSourceOfGrievance", formValuesGI.txtSourceOfGrievance);
      errors["txtInsuranceCompany"] = validateKRPHInfoField("txtInsuranceCompany", formValuesGI.txtSourceOfGrievance);
      errors["txtTicketCategoryType"] = validateKRPHInfoField("txtTicketCategoryType", formValuesGI.txtTicketCategoryType);
      errors["txtTicketCategory"] = validateKRPHInfoField("txtTicketCategory", formValuesGI.txtTicketCategory);
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

  const updateStateGI = (name, value) => {
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
  const [isBtndisabled, setisBtndisabled] = useState(0);
  const [btnLoaderSupportTicketActive, setBtnLoaderSupportTicketActive] = useState(false);
  const supportTicketOnClick = async () => {
    if (!handleKRPHInfoValidation()) {
      return;
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
      <Box
        sx={{
          width: "100%",
          padding: "5px 40px 5px 40px",
          background: "linear-gradient(to bottom, #21862d, #c3eb68)",
          minHeight: "100vh",
          height: "fit-content",
        }}
      >

        {/* Tabs Header */}
        <Box className="tabHeaderWrapper">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabOptions.map((tab) => (
              <Tab label={tab} value={tab} key={tab} />
            ))}
          </Tabs>
        </Box>

        <Card sx={{ mt: 0, padding: "10px 25px 25px 25px", borderBottomLeftRadius: 8, borderBottomRightRadius: 8,borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <Typography sx={{ fontFamily: "Quicksand, sans-serif", fontSize: "16px" }} fontWeight="bold">
            General Information -  {" " + selectedTab}
          </Typography>




          {selectedTab === "Social Media" && (
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
                  Farmer Name
                </span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    name="txtFarmerName"
                    value={formValuesGI.txtFarmerName}
                    onChange={(e) => updateStateGI("txtFarmerName", e.target.value.replace(/[^a-zA-Z ]+/g, ""))}
                    autoComplete="off"
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtFarmerName"]}</span>
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
                <span>Mobile Number</span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    name="txtMobileNumber"
                    value={formValuesGI.txtMobileNumber}
                    onChange={(e) => updateStateGI("txtMobileNumber", e.target.value.replace(/\D/g, ""))}
                    autoComplete="off"
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtMobileNumber"]}</span>
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
                <InputGroup>
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
                  State
                </span>{" "}
                <InputGroup>
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
                <InputGroup>
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
                <span>Complaint Date <span className="asteriskCss">&#42;</span></span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    type="date"
                    name="txtComplaintDate"
                    value={formValuesGI.txtComplaintDate}
                    onChange={(e) => updateStateGI("txtComplaintDate", e.target.value)}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtComplaintDate"]}</span>
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
                  Social Media <span className="asteriskCss">&#42;</span>
                </span>{" "}
                <InputGroup>
                  <InputControl
                    Input_type="select"
                    name="txtSocialMedia"
                    getOptionLabel={(option) => `${option.Value}`}
                    value={formValuesGI.txtSocialMedia}
                    getOptionValue={(option) => `${option}`}
                    options={socialMediaList}
                    ControlTxt="Social Media"
                    onChange={(e) => updateStateGI("txtSocialMedia", e)}
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtSocialMedia"]}</span>
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
                  Year
                </span>{" "}
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
                <span>
                  Season
                </span>{" "}
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
                <InputGroup>
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
              {formValuesGI && formValuesGI.txtisIdentified && formValuesGI.txtisIdentified.ID && formValuesGI.txtisIdentified.ID === 1 ? <Typography
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
                <InputGroup>
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
                <span className="login_ErrorTxt">{formValidationKRPHError["txtInsuranceCompany"]}</span>
              </Typography> : null}

            </Box>
          )}

          {selectedTab === "Email" && (
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
                  Farmer Name
                </span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    name="txtFarmerName"
                    value={formValuesGI.txtFarmerName}
                    onChange={(e) => updateStateGI("txtFarmerName", e.target.value.replace(/[^a-zA-Z ]+/g, ""))}
                    autoComplete="off"
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtFarmerName"]}</span>
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
                <span>Mobile Number</span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    name="txtMobileNumber"
                    value={formValuesGI.txtMobileNumber}
                    onChange={(e) => updateStateGI("txtMobileNumber", e.target.value.replace(/\D/g, ""))}
                    autoComplete="off"
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtMobileNumber"]}</span>
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
                <span>Email ID <span className="asteriskCss">&#42;</span></span>{" "}
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    name="txtFarmerEmailID"
                    value={formValuesGI.txtFarmerEmailID}
                    onChange={(e) => updateStateGI("txtFarmerEmailID", e.target.value)}
                    autoComplete="off"
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtFarmerEmailID"]}</span>
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
                  State
                </span>{" "}
                <InputGroup>
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
                <InputGroup>
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
                <span>Complaint Date <span className="asteriskCss">&#42;</span></span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    type="date"
                    name="txtComplaintDate"
                    value={formValuesGI.txtComplaintDate}
                    onChange={(e) => updateStateGI("txtComplaintDate", e.target.value)}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtComplaintDate"]}</span>
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
                  Year
                </span>{" "}
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
                <span>
                  Season
                </span>{" "}
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
                <InputGroup>
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
              {formValuesGI && formValuesGI.txtisIdentified && formValuesGI.txtisIdentified.ID && formValuesGI.txtisIdentified.ID === 1 ? <Typography
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
                <InputGroup>
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
                <span className="login_ErrorTxt">{formValidationKRPHError["txtInsuranceCompany"]}</span>
              </Typography> : null}

            </Box>
          )}

          {selectedTab === "Physical Letter" && (
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
                  Farmer Name
                </span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    name="txtFarmerName"
                    value={formValuesGI.txtFarmerName}
                    onChange={(e) => updateStateGI("txtFarmerName", e.target.value.replace(/[^a-zA-Z ]+/g, ""))}
                    autoComplete="off"
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtFarmerName"]}</span>
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
                <span>Mobile Number</span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    name="txtMobileNumber"
                    value={formValuesGI.txtMobileNumber}
                    onChange={(e) => updateStateGI("txtMobileNumber", e.target.value.replace(/\D/g, ""))}
                    autoComplete="off"
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtMobileNumber"]}</span>
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
                <InputGroup>
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
                  State
                </span>{" "}
                <InputGroup>
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
                <InputGroup>
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
                <span>Complaint Date <span className="asteriskCss">&#42;</span></span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    type="date"
                    name="txtComplaintDate"
                    value={formValuesGI.txtComplaintDate}
                    onChange={(e) => updateStateGI("txtComplaintDate", e.target.value)}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtComplaintDate"]}</span>
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
                  Year
                </span>{" "}
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
                <span>
                  Season
                </span>{" "}
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
                <InputGroup>
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
              {formValuesGI && formValuesGI.txtisIdentified && formValuesGI.txtisIdentified.ID && formValuesGI.txtisIdentified.ID === 1 ? <Typography
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
                <InputGroup>
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
                <span className="login_ErrorTxt">{formValidationKRPHError["txtInsuranceCompany"]}</span>
              </Typography> : null}

            </Box>
          )}

          {selectedTab === "Other" && (
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
                  Farmer Name
                </span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    name="txtFarmerName"
                    value={formValuesGI.txtFarmerName}
                    onChange={(e) => updateStateGI("txtFarmerName", e.target.value.replace(/[^a-zA-Z ]+/g, ""))}
                    autoComplete="off"
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtFarmerName"]}</span>
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
                <span>Mobile Number</span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    name="txtMobileNumber"
                    value={formValuesGI.txtMobileNumber}
                    onChange={(e) => updateStateGI("txtMobileNumber", e.target.value.replace(/\D/g, ""))}
                    autoComplete="off"
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtMobileNumber"]}</span>
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
                <InputGroup>
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
                  State
                </span>{" "}
                <InputGroup>
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
                <InputGroup>
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
                <span>Complaint Date <span className="asteriskCss">&#42;</span></span>
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    type="date"
                    name="txtComplaintDate"
                    value={formValuesGI.txtComplaintDate}
                    onChange={(e) => updateStateGI("txtComplaintDate", e.target.value)}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtComplaintDate"]}</span>
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
                <InputGroup>
                  <InputControl
                    Input_type="input"
                    name="txtSourceOfGrievance"
                    value={formValuesGI.txtSourceOfGrievance}
                    onChange={(e) => updateStateGI("txtSourceOfGrievance", e.target.value)}

                  />
                </InputGroup>
                <span className="login_ErrorTxt">{formValidationKRPHError["txtSourceOfGrievance"]}</span>
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
                  Year
                </span>{" "}
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
                <span>
                  Season
                </span>{" "}
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
                <InputGroup>
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
              {formValuesGI && formValuesGI.txtisIdentified && formValuesGI.txtisIdentified.ID && formValuesGI.txtisIdentified.ID === 1 ? <Typography
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
                <InputGroup>
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
                <span className="login_ErrorTxt">{formValidationKRPHError["txtInsuranceCompany"]}</span>
              </Typography> : null}

            </Box>
          )}

        </Card>




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
                      Category <span className="asteriskCss">&#42;</span>
                    </label>
                    <InputGroup>
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
                    <span className="login_ErrorTxt">{formValidationKRPHError["txtTicketCategoryType"]}</span>
                  </div>
                  <div className="form-group_agent">
                    <label className="ticket-label_agent">
                      {" "}
                      Sub Category <span className="asteriskCss">&#42;</span>
                    </label>
                    <InputGroup>
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
                    <span className="login_ErrorTxt">{formValidationKRPHError["txtTicketCategory"]}</span>
                  </div>
                </div>
                <div className="container_agent">
                  <div className="form-group_agent">
                    <label className="ticket-label_agent">
                      Crop Name
                    </label>
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
                  <div className="form-group_agent">
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
                  <InputGroup Row="4">
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
                    {formValuesGI.txtTicketDescription && formValuesGI.txtTicketDescription.length
                      ? formValuesGI.txtTicketDescription.length
                      : 0}{" "}
                    / {500}
                  </p>
                  <span className="login_ErrorTxt">{formValidationKRPHError["txtTicketDescription"]}</span>
                </div>

                <div style={{ display: "flex" }}>
                  <KrphButton
                    type="button"
                    varient="secondary"
                    onClick={() => supportTicketOnClick()}
                  >
                    Submit
                  </KrphButton>
                </div>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </>
  );
};

export default OfflineGrievance;
