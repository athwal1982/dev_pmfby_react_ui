import { React, useState, useEffect, useMemo, useRef } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, Input, TextareaAutosize } from "@mui/material";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage, setSessionStorage } from "Components/Common/Login/Auth/auth";
import classNames from "classnames";
import { DataGrid, Form, Modal, PageBar } from "Framework/Components/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { ticketDataBindingData } from "../../../Common/Welcome/Service/Methods";
import { Loader, Button } from "Framework/Components/Widgets";
import moment from "moment";
import { addKRPHSupportTicketdata } from "../../KrphAllActivities/Services/Methods";
import { dateToSpecificFormat, daysdifference, dateToCompanyFormat } from "Configration/Utilities/dateformat";
import { getFarmerPolicyDetail, farmergenerateSupportTicket } from "../Service/Methods";
import { sendSMSToFarmer } from "../../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { maskMobileNumber } from "Configration/Utilities/utils";
import BizClass from "./CropLossintimationTickets.module.scss";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import Header from "../../Complaint Status/Layout/Header";
import Footer from "../../Complaint Status/Layout/Footer";
import { Box, TextField, Typography, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Grid } from "@mui/system";
import DummyImage from "../../../../assets/ICLogo/dummy-thumbnail.jpg";
// A import FutureGeneraliLogo from "../../../../assets/ICLogo/FutureGen.jpeg";
import FutureGeneraliLogo from "../../../../assets/ICLogo/FutureGen.png";
import Aic from "../../../../assets/ICLogo/Aic.png";
import BajajAl from "../../../../assets/ICLogo/BajajAllianza.jpeg";
import CholaMS from "../../../../assets/ICLogo/CholaMS.png";
import HdfcErgo from "../../../../assets/ICLogo/HdfcErgo.jpeg";
import IciciLom from "../../../../assets/ICLogo/IciciLomb.png";
import IfcoTokia from "../../../../assets/ICLogo/IfcoTokio.jpeg";
import kShema from "../../../../assets/ICLogo/kshema.jpeg";
import NationInsur from "../../../../assets/ICLogo/NationalInsur.jpeg";
import NewIndia from "../../../../assets/ICLogo/NewIndiaAssur.jpeg";
import RelGen from "../../../../assets/ICLogo/RelGeneral.png";
import RoyalSund from "../../../../assets/ICLogo/RoyalSund.png";
import SbiGen from "../../../../assets/ICLogo/SbiGen.png";
import TataAig from "../../../../assets/ICLogo/TataAig.jpeg";
import UnitedIndia from "../../../../assets/ICLogo/Unitedindia.jpeg";
import UnivSompo from "../../../../assets/ICLogo/UnivSompo.png";
import Orient from "../../../../assets/ICLogo/OrientalInsur.png";

function CropLossintimationTickets() {
  const setAlertMessage = AlertMessage();
  const [data, setData] = useState(null);

  const userData = getSessionStorage("user");
  const ticketBindingData = getSessionStorage("ticketDataBindingSsnStrg");
  const [formValidationFarmersInfoError, setFormValidationFarmersInfoError] = useState({});
  const [formValuesForFarmerInfo, setFormValuesForFarmerInfo] = useState({
    txtSeasonForFarmerInfo: null,
    txtYearForFarmerInfo: null,
    txtSchemeForFarmerInfo: null,
  });
  const [selectedFarmer] = useState(userData ? userData.data.data.result : "");
  const [formValidationSupportTicketError, setFormValidationSupportTicketError] = useState({});
  const [formValidationCounter, setFormValidationCounter] = useState({});
  const [formValuesTicketCreation, setFormValuesTicketCreation] = useState({
    // A txtDocumentUpload: "",
    txtTicketCategory: null,
    txtTicketCategoryType: null,
    txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    // AtxtCropLossIntimation: "On-time",
    txtCropLossTime: "",
    txtTicketDescription: "",
    txtLossAt: null,
    txtOtherSubCategory: "",
    txtCropStage: null,
    txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    txtCropName: "",
  });
  const [formValuesCallerInformation, setFormValuesCallerInformation] = useState({
    txtCallerMobileNumber: userData ? userData.data.data.result.mobile : "",
  });
  const [yearList, setYearList] = useState([]);
  // A const [schemeList, setSchemeList] = useState([]);
  const [schemeList] = useState([
    { SchemeID: 2, SchemeName: "Weather Based Crop Insurance Scheme(WBCIS)" },
    { SchemeID: 4, SchemeName: "Pradhan Mantri Fasal Bima Yojna(PMFBY)" },
  ]);
  // A const [seasonForPolicyNumberDropdownDataList, setSeasonForPolicyNumberDropdownDataList] = useState([]);
  const [seasonForPolicyNumberDropdownDataList] = useState([
    { CropSeasonID: 1, CropSeasonName: "Kharif" },
    { CropSeasonID: 2, CropSeasonName: "Rabi" },
  ]);
  const [selectedInsuranceDetails, setSelectedInsuranceDetails] = useState([]);
  const [selectedClaimOrGrievence, setSelectedClaimOrGrievence] = useState("");

  const [selectedOption, setSelectedOption] = useState("4");
  const [selectedOptionCropStage, setSelectedOptionCropStage] = useState("1");
  const [selectedValidateOption, setSelectedValidateOption] = useState("1");
  const fileRef = useRef(null);

  const [isBtndisabled, setisBtndisabled] = useState(0);
  const [btnLoaderSupportTicketActive, setBtnLoaderSupportTicketActive] = useState(false);
  const [stateCropLossIntimation, setStateCropLossIntimation] = useState("YES");
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

  const handleBackClick = () => {
    sessionStorage.clear();
    navigate("/");
  };

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
      // A setTicketCategoryList([]);
      // A setIsTicketCategoryList(true);
      // A const formdata = {
      // A   filterID: supportTicketTypeID,
      // A  filterID1: 0,
      // A  masterName: "TCKCGZ",
      // A  searchText: "#ALL",
      // A  searchCriteria: "AW",
      // A };
      // A const result = await getMasterDataBindingDataList(formdata);
      // A console.log(result, "ticketCategory");
      // A setIsTicketCategoryList(false);
      // A if (result.response.responseCode === 1) {
      // A  if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
      // A    setTicketCategoryList(result.response.responseData.masterdatabinding);
      // A  } else {
      // A    setTicketCategoryList([]);
      // A  }
      // A } else {
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: result.response.responseMessage,
      // A  });
      // A}
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
    // A try {
    // A  setIsTicketCategoryTypeList(true);
    // A  const formdata = {
    // A    filterID: pselectedOption,
    // A    filterID1: pCropLossDetailID,
    // A    masterName: pMasterName, // A "TCKTYP",
    // A    searchText: "#ALL",
    // A    searchCriteria: "AW",
    // A  };
    // A  const result = await getMasterDataBindingDataList(formdata);
    // A  console.log(result, "ticktCategoryType");
    // A  setIsTicketCategoryTypeList(false);
    // A  if (result.response.responseCode === 1) {
    // A    if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
    // A      setTicketCategoryTypeList(result.response.responseData.masterdatabinding);
    // A    } else {
    // A      setTicketCategoryTypeList([]);
    // A    }
    // A  } else {
    // A    setAlertMessage({
    // A      type: "error",
    // A      message: result.response.responseMessage,
    // A    });
    // A  }
    // A} catch (error) {
    // A  console.log(error);
    // A  setAlertMessage({
    // A    type: "error",
    // A    message: error,
    // A  });
    // A}
  };
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    sessionStorage.clear();
    navigate("/");
  };
  const location = useLocation();
  const { mobileNum } = location.state || {};

  const handleNavigateComplaintStatus = () => {
    navigate("/complaint-status", { state: { mobileNum } });
  };

  const [lossAtList, setLossAtList] = useState([]);
  const [isLoadingLossAtList, setIsLoadingLossAtList] = useState(false);
  const getLossAtListData = async (pCropStageID) => {
    try {
      if (ticketBindingData) {
        setIsLoadingLossAtList(true);
        const filterticketBindingData = ticketBindingData.CRPDTL.filter((data) => {
          return data.CropStageID === Number(pCropStageID);
        });
        setLossAtList(filterticketBindingData);
        setIsLoadingLossAtList(false);
      } else {
        setLossAtList([]);
      }
      // A setIsLoadingLossAtList(true);
      // A const formdata = {
      // A  filterID: pCropStageID,
      // A  filterID1: 0,
      // A  masterName: "CRPDTL",
      // A  searchText: "#ALL",
      // A  searchCriteria: "AW",
      // A};
      // A const result = await getMasterDataBindingDataList(formdata);
      // A setIsLoadingLossAtList(false);
      // A setLossAtList([]);
      // A if (result.response.responseCode === 1) {
      // A if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
      // A    setLossAtList(result.response.responseData.masterdatabinding);
      // A  } else {
      // A    setLossAtList([]);
      // A  }
      // A} else {
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: result.response.responseMessage,
      // A  });
      // }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [cropStageList, setCropStageList] = useState([]);
  const [isLoadingCropStageList, setIsLoadingCropStageList] = useState(false);
  const getCropStageListData = async (pCropStageID) => {
    try {
      if (ticketBindingData) {
        setIsLoadingCropStageList(true);
        const filterticketBindingData = ticketBindingData.CRPSTG.filter((data) => {
          return data.CropStageID === Number(pCropStageID);
        });
        setCropStageList(filterticketBindingData);
        setIsLoadingCropStageList(false);
      } else {
        setCropStageList([]);
      }
      // A setIsLoadingCropStageList(true);
      // A const formdata = {
      // A  filterID: pCropStageID,
      // A  filterID1: 0,
      // A  masterName: "CRPSTG",
      // A  searchText: "#ALL",
      // A  searchCriteria: "AW",
      // A };
      // A const result = await getMasterDataBindingDataList(formdata);
      // A setIsLoadingCropStageList(false);
      // A setCropStageList([]);
      // A if (result.response.responseCode === 1) {
      // A  if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
      // A    setCropStageList(result.response.responseData.masterdatabinding);
      // A  } else {
      // A    setCropStageList([]);
      // A  }
      // A} else {
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: result.response.responseMessage,
      //   });
      // }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const validateFieldSupportTicket = (name, value) => {
    let errorsMsg = "";
    // A if (name === "txtDocumentUpload") {
    // A  if (value && typeof value !== "undefined") {
    // A    const regex = new RegExp("^[a-zA-Z0-9_.-]*$");
    // A    if (!regex.test(value.name)) {
    // A      errorsMsg = "Attachment name is not in valid format.";
    // A    }
    // A  }
    // A }
    if (name === "txtCallerMobileNumber") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Caller Mobile Number is required!";
      } else if (value) {
        if (value.length < 10) {
          errorsMsg = "Enter Valid 10 digit Caller Mobile Number!";
        }
      }
    }
    if (name === "txtTicketCategory") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Please select Ticket Sub Category!";
      }
    }
    if (name === "txtSchemeForFarmerInfo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Scheme is required!";
      }
    }
    if (name === "txtTicketCategoryType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Please select Ticket Category!";
      }
    }
    if (name === "txtOtherSubCategory") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Other Sub Cat. is required!";
      }
    }
    if (name === "txtLossAt") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Loss At is required!";
      }
    }
    if (name === "txtCropStage") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Crop Stage is required!";
      }
    }
    if (name === "txtCropLossDate") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "CropLoss Date is required!";
      }
    }
    // A if (name === "txtCropLossTime") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Crop Loss Time is required!";
    // A  }
    // A }
    if (name === "txtCropHarvestDate") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Harvest Date is required!";
      }
    }
    if (name === "txtCropName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Crop Name is required!";
      } else if (value.trim().length === 0) {
        errorsMsg = "Crop Name cannot be only spaces!";
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

  const [ticketCategoryOtherList, setTicketCategoryOtherList] = useState([]);
  const [isLoadingTicketCategoryOtherList, setIsTicketCategoryOtherList] = useState(false);
  const getTicketCategoryOtherListData = async (supportTicketTypeID, data) => {
    try {
      if (ticketBindingData) {
        setTicketCategoryOtherList([]);
        setIsTicketCategoryOtherList(true);
        if (data.TicketCategoryID === 51) {
          const filterticketBindingData = ticketBindingData.CRPOTH.filter((data) => {
            return data.OtherCategory1 === Number(supportTicketTypeID);
          });
          setTicketCategoryOtherList(filterticketBindingData);
        } else if (data.TicketCategoryID === 52) {
          const filterticketBindingData = ticketBindingData.CRPOTH.filter((data) => {
            return data.OtherCategory2 === Number(supportTicketTypeID);
          });
          setTicketCategoryOtherList(filterticketBindingData);
        } else if (data.TicketCategoryID === 53) {
          const filterticketBindingData = ticketBindingData.CRPOTH.filter((data) => {
            return data.OtherCategory3 === Number(supportTicketTypeID);
          });
          setTicketCategoryOtherList(filterticketBindingData);
        } else if (data.TicketCategoryID === 58) {
          const filterticketBindingData = ticketBindingData.CRPOTH.filter((data) => {
            return data.OtherCategory4 === Number(supportTicketTypeID);
          });
          setTicketCategoryOtherList(filterticketBindingData);
        }
        setIsTicketCategoryOtherList(false);
      } else {
        setTicketCategoryOtherList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const updateStateTicketCreation = (name, value) => {
    setFormValuesTicketCreation({ ...formValuesTicketCreation, [name]: value });
    formValidationSupportTicketError[name] = validateFieldSupportTicket(name, value);
    if (name === "txtTicketCategoryType") {
      setFormValuesTicketCreation({
        ...formValuesTicketCreation,
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

    if (name === "txtLossAt") {
      setFormValuesTicketCreation({
        ...formValuesTicketCreation,
        txtLossAt: value,
        txtTicketCategoryType: null,
        txtTicketCategory: null,
      });
      setTicketCategoryTypeList([]);
      setTicketCategoryList([]);
      if (value) {
        getTicketCategoryTypeListData("4", value.CropLossDetailID, "CRPTYP");
      }
    }
    if (name === "txtCropLossDate") {
      const currentDate = new Date();
      const dateDiffrence = daysdifference(dateToSpecificFormat(currentDate, "YYYY-MM-DD"), dateToSpecificFormat(value, "YYYY-MM-DD"));
      if (dateDiffrence > 3) {
        setFormValuesTicketCreation({
          ...formValuesTicketCreation,
          txtCropLossDate: value,
          txtCropLossIntimation: "Late",
        });
        setStateCropLossIntimation("NO");
      } else {
        setFormValuesTicketCreation({
          ...formValuesTicketCreation,
          txtCropLossDate: value,
          // AtxtCropLossIntimation: "On-time",
        });
        setStateCropLossIntimation("YES");
      }
    }
    if (name === "txtTicketCategory") {
      setFormValuesTicketCreation({
        ...formValuesTicketCreation,
        txtTicketCategory: value,
        txtOtherSubCategory: null,
      });
      setTicketCategoryOtherList([]);
      if (value) {
        getTicketCategoryOtherListData(value.SupportTicketTypeID, value);
      }
    }
  };

  const updateStateCallerInformation = (name, value) => {
    setFormValuesCallerInformation({ ...formValuesCallerInformation, [name]: value });
    formValidationSupportTicketError[name] = validateFieldSupportTicket(name, value);
  };
  const selectedOptionOnClick = (pselectedOption) => {
    if (pselectedOption === "GR") {
      setSelectedOption("1");
      setSelectedOptionCropStage("1");
      setTicketCategoryList([]);
      getTicketCategoryTypeListData("1", 0, "TCKTYP");
    } else if (pselectedOption === "IN") {
      setSelectedOption("2");
      setSelectedOptionCropStage("1");
      setTicketCategoryList([]);
      getTicketCategoryTypeListData("2", 0, "TCKTYP");
    } else if (pselectedOption === "LO") {
      setSelectedOption("4");
      setSelectedOptionCropStage("1");
      setTicketCategoryTypeList([]);
      setTicketCategoryList([]);
      getLossAtListData(1);
      getCropStageListData(1);
    }
    setFormValuesTicketCreation({
      ...formValuesTicketCreation,
      txtTicketCategoryType: null,
      txtTicketCategory: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      // AtxtCropLossIntimation: "On-time",
      txtCropLossTime: "",
      txtLossAt: null,
      txtOtherSubCategory: "",
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    });
    setStateCropLossIntimation("YES");
  };

  const selectedOptionOnClickCropStage = (pselectedOption) => {
    if (pselectedOption === "SCS") {
      setSelectedOptionCropStage("1");
      getCropStageListData(1);
      getLossAtListData(1);
    } else if (pselectedOption === "HS") {
      setSelectedOptionCropStage("2");
      getCropStageListData(2);
      getLossAtListData(2);
    }
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    setFormValuesTicketCreation({
      ...formValuesTicketCreation,
      txtTicketCategoryType: null,
      txtTicketCategory: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      // AtxtCropLossIntimation: "On-time",
      txtCropLossTime: "",
      txtLossAt: null,
      txtOtherSubCategory: "",
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    });
    setStateCropLossIntimation("YES");
  };
  const clearFarmerAuthenticationForm = () => {
    setFormValuesForFarmerInfo({
      ...formValuesForFarmerInfo,
      txtSeasonForFarmerInfo: null,
      txtYearForFarmerInfo: null,
      txtSchemeForFarmerInfo: null,
    });
    setFormValuesTicketCreation({
      ...formValuesTicketCreation,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      // AtxtCropLossIntimation: "On-Time",
      txtCropLossTime: "",
      txtTicketDescription: "",
      txtLossAt: null,
      txtOtherSubCategory: "",
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });
    setFormValuesCallerInformation({
      ...formValuesCallerInformation,
      txtCallerMobileNumber: "",
    });

    setFormValidationFarmersInfoError({});
    setSelectedOption("1");
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    getTicketCategoryTypeListData("1", 0, "TCKTYP");
    setSelectedInsuranceDetails([]);
    setSelectedClaimOrGrievence([]);
    setInsuranceCompanyDataGreivence([]);
    setLossAtList([]);
    setCropStageList([]);
    setFormValidationSupportTicketError({});
    setStateCropLossIntimation("YES");
  };
  const clearAddTicketForm = () => {
    clearFarmerAuthenticationForm();
  };

  const validateFarmersInfoField = (name, value) => {
    let errorsMsg = "";

    if (name === "txtSeasonForFarmerInfo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Season is required!";
      }
    }

    if (name === "txtYearForFarmerInfo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Year is required!";
      }
    }
    if (name === "txtSchemeForFarmerInfo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Scheme is required!";
      }
    }

    return errorsMsg;
  };

  const handleFarmersInfoValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtSeasonForFarmerInfo"] = validateFarmersInfoField("txtSeasonForFarmerInfo", formValuesForFarmerInfo.txtSeasonForFarmerInfo);
      errors["txtYearForFarmerInfo"] = validateFarmersInfoField("txtYearForFarmerInfo", formValuesForFarmerInfo.txtYearForFarmerInfo);
      errors["txtSchemeForFarmerInfo"] = validateFarmersInfoField("txtSchemeForFarmerInfo", formValuesForFarmerInfo.txtSchemeForFarmerInfo);

      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationFarmersInfoError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const handleValidationSupportTicket = () => {
    try {
      const errors = {};
      let formIsValid = true;

      // A errors["txtDocumentUpload"] = validateFieldSupportTicket("txtDocumentUpload", formValuesTicketCreation.txtDocumentUpload);
      errors["txtCallerMobileNumber"] = validateFieldSupportTicket("txtCallerMobileNumber", formValuesCallerInformation.txtCallerMobileNumber);
      errors["txtSchemeForFarmerInfo"] = validateFieldSupportTicket("txtSchemeForFarmerInfo", formValuesForFarmerInfo.txtSchemeForFarmerInfo);
      errors["txtTicketCategoryType"] = validateFieldSupportTicket("txtTicketCategoryType", formValuesTicketCreation.txtTicketCategoryType);
      errors["txtTicketCategory"] = validateFieldSupportTicket("txtTicketCategory", formValuesTicketCreation.txtTicketCategory);

      if (selectedOption === "4") {
        errors["txtCropLossDate"] = validateFieldSupportTicket("txtCropLossDate", formValuesTicketCreation.txtCropLossDate);
        // A errors["txtCropLossTime"] = validateFieldSupportTicket("txtCropLossTime", formValuesTicketCreation.txtCropLossTime);
        errors["txtLossAt"] = validateFieldSupportTicket("txtLossAt", formValuesTicketCreation.txtLossAt);
        errors["txtCropStage"] = validateFieldSupportTicket("txtCropStage", formValuesTicketCreation.txtCropStage);
        errors["txtCropName"] = validateFieldSupportTicket("txtCropName", formValuesTicketCreation.txtCropName);
        if (selectedOptionCropStage === "2") {
          errors["txtCropHarvestDate"] = validateFieldSupportTicket("txtCropHarvestDate", formValuesTicketCreation.txtCropHarvestDate);
        }

        if (
          (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 51
            : 0) ||
          (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 52
            : 0) ||
          (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 53
            : 0) ||
          (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 58
            : 0)
        ) {
          errors["txtOtherSubCategory"] = validateFieldSupportTicket("txtOtherSubCategory", formValuesTicketCreation.txtOtherSubCategory);
        }
      }
      errors["txtTicketDescription"] = validateFieldSupportTicket("txtTicketDescription", formValuesTicketCreation.txtTicketDescription);
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationSupportTicketError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const [btnLoaderFarmerGreivenceInfoActive, setBtnLoaderFarmerGreivenceInfoActive] = useState(false);
  const [isLoadingApplicationNoDatGreivence, setIsLoadingApplicationNodatGreivence] = useState(false);
  const [insuranceCompanyDataGreivence, setInsuranceCompanyDataGreivence] = useState([]);
  const getPolicyOfFarmerGreivenceOnClick = async () => {
    setValue("");

    if (!handleFarmersInfoValidation()) {
      return;
    }
    try {
      setBtnLoaderFarmerGreivenceInfoActive(true);
      setIsLoadingApplicationNodatGreivence(true);
      if (selectedFarmer.length === 0 && selectedFarmer.length !== undefined) {
        setAlertMessage({
          type: "error",
          message: "Farmer Authentication is required!",
        });
        setBtnLoaderFarmerGreivenceInfoActive(false);
        setIsLoadingApplicationNodatGreivence(false);
        return;
      }

      let result = "";
      let formData = "";

      formData = {
        mobilenumber: "7776543289",
        seasonID: formValuesForFarmerInfo.txtSeasonForFarmerInfo ? formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID.toString() : "",
        year: formValuesForFarmerInfo.txtYearForFarmerInfo ? formValuesForFarmerInfo.txtYearForFarmerInfo.Value.toString() : "",
        farmerID: selectedFarmer ? selectedFarmer.farmerID : "",
      };
      result = await getFarmerPolicyDetail(formData);
      console.log(result, "applicationData Greivence");
      setBtnLoaderFarmerGreivenceInfoActive(false);
      setIsLoadingApplicationNodatGreivence(false);
      setSelectedInsuranceDetails([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length > 0) {
            const farmersData = Object.values(result.response.responseData.data);
            if (farmersData && farmersData.length > 0) {
              const farmerAndApplicationData = [];
              farmersData.forEach((v) => {
                v.applicationList.forEach((x) => {
                  farmerAndApplicationData.push({
                    mobile: v.mobile,
                    farmerName: v.farmerName,
                    farmerID: v.farmerID,
                    aadharNumber: v.aadharNumber,
                    accountNumber: v.accountNumber,
                    relation: v.relation,
                    relativeName: v.relativeName,
                    resDistrict: v.resDistrict,
                    resState: v.resState,
                    resVillage: v.resVillage,
                    resSubDistrict: v.resSubDistrict,
                    resDistrictID: v.resDistrictID,
                    resStateID: v.resStateID,
                    resVillageID: v.resVillageID,
                    resSubDistrictID: v.resSubDistrictID,
                    policyPremium: parseFloat(v.policyPremium).toFixed(2),
                    policyArea: v.policyArea,
                    policyType: v.policyType,
                    scheme: v.scheme,
                    SchemeName:
                      v.scheme === "WBCIS"
                        ? "Weather Based Crop Insurance Scheme(WBCIS)"
                        : v.scheme === "PMFBY"
                          ? "Pradhan Mantri Fasal Bima Yojna(PMFBY)"
                          : "",
                    SchemeID: v.scheme === "WBCIS" ? 2 : v.scheme === "PMFBY" ? 4 : 0,
                    insuranceCompanyName: v.insuranceCompanyName,
                    policyID: x.policyID,
                    applicationStatus: x.applicationStatus,
                    applicationStatusCode: x.applicationStatusCode,
                    applicationNo: x.applicationNo,
                    landSurveyNumber: x.landSurveyNumber,
                    landDivisionNumber: x.landDivisionNumber,
                    plotStateName: x.plotStateName,
                    plotDistrictName: x.plotDistrictName,
                    plotVillageName: x.plotVillageName,
                    plotDistrictID: x.plotDistrictID,
                    applicationSource: x.applicationSource,
                    cropName: x.cropName,
                    cropShare: parseFloat(x.cropShare).toFixed(3),
                    createdAt: x.createdAt,
                    ifscCode: x.ifscCode,
                    farmerShare: x.farmerShare,
                    sowingDate: x.sowingDate,
                  });
                });
              });
              setInsuranceCompanyDataGreivence(farmerAndApplicationData);
              toggleInsuranceCompanyModalGreivence();
            } else {
              setInsuranceCompanyDataGreivence([]);
              setAlertMessage({
                type: "warning",
                message: "Policy Data not found.",
              });
            }
          } else {
            setInsuranceCompanyDataGreivence([]);
            setAlertMessage({
              type: "warning",
              message: "Policy Data not found.",
            });
          }
        } else {
          setInsuranceCompanyDataGreivence([]);
          setAlertMessage({
            type: "warning",
            message: "Policy Data not found.",
          });
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: "Policy Data not found.",
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
  const updateStateForFarmerInfo = (name, value) => {
    setFormValuesForFarmerInfo({ ...formValuesForFarmerInfo, [name]: value });
    formValidationFarmersInfoError[name] = validateFarmersInfoField(name, value);
  };

  const [openInsuranceCompanyModalGreivence, setOpenInsuranceCompanyModalGreivence] = useState(false);
  const toggleInsuranceCompanyModalGreivence = () => {
    setOpenInsuranceCompanyModalGreivence(!openInsuranceCompanyModalGreivence);
  };

  const onCellDoubleClickedDetailsGreivence = (event) => {
    setSelectedOption("4");
    setSelectedClaimOrGrievence("GR");
    setSelectedInsuranceDetails(event.data);
    if (event.data && event.data.scheme) {
      const scheme = event.data && event.data.scheme ? schemeList.find((x) => x.ShortName === event.data.scheme) : null;
      if (scheme !== null) {
        if (formValuesForFarmerInfo.txtSchemeForFarmerInfo === null) {
          setFormValuesForFarmerInfo({
            ...formValuesForFarmerInfo,
            txtSchemeForFarmerInfo: scheme,
          });
        }
      }
    }
    setSelectedOptionCropStage("1");
    setStateCropLossIntimation("YES");
    setFormValuesTicketCreation({
      ...formValuesTicketCreation,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      // AtxtCropLossIntimation: "On-Time",
      txtCropLossTime: "",
      txtTicketDescription: "",
      txtLossAt: null,
      txtOtherSubCategory: "",
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });
    toggleInsuranceCompanyModalGreivence();
  };

  const clearInsuranceFieldsAndTicketCreation = () => {
    setSelectedInsuranceDetails([]);
    setFormValuesForFarmerInfo({
      ...formValuesForFarmerInfo,
      txtSeasonForFarmerInfo: null,
      txtYearForFarmerInfo: null,
      txtSchemeForFarmerInfo: null,
    });
    setFormValuesTicketCreation({
      ...formValuesTicketCreation,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtCropLossDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      // AtxtCropLossIntimation: "On-time",
      txtCropLossTime: "",
      txtTicketDescription: "",
      txtLossAt: null,
      txtOtherSubCategory: "",
      txtCropStage: null,
      txtCropHarvestDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtCropName: "",
    });
    setSelectedOption("4");
    setSelectedOptionCropStage("1");
    setStateCropLossIntimation("YES");
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
    getLossAtListData(1);
    getCropStageListData(1);
  };

  const supportTicketOnClick = async () => {
    // Snavigate("/ticketSuccess", { state: { pSupportTicketNo } });

    setIsLoading(true);
    try {
      if (value === "") {
        setAlertMessage({
          type: "error",
          message: "Please select a crop stage!",
        });
        setIsLoading(false);
        return;
      }

      if (selectedValidateOption !== "6" && selectedValidateOption !== "7") {
        if (selectedFarmer.length === 0 && selectedFarmer.length !== undefined) {
          setAlertMessage({
            type: "warning",
            message: "Farmer Authentication is required!",
          });
          setIsLoading(false);
          return;
        }

        if (selectedInsuranceDetails.length === 0 && selectedInsuranceDetails.length !== undefined) {
          setAlertMessage({
            type: "warning",
            message: "Insurance Company is required!",
          });
          setIsLoading(false);
          return;
        }

        if (!handleValidationSupportTicket()) {
          setIsLoading(false);
          return;
        }

        await CreateTicketBAuthOptions();
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error.message || "An error occurred",
      });
      setIsLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [pSupportTicketNo, setPSupportTicketNo] = useState("");

  const handleContinue = () => {
    setOpenPopup(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const SendSMSToFarmerAgaintSupportTicket = async (ptemplateID, pmobileNO, psupportTicketNo) => {
    try {
      const formData = {
        templateID: ptemplateID,
        mobileNO: pmobileNO,
        supportTicketNo: psupportTicketNo,
      };

      const result = await sendSMSToFarmer(formData);
      if (result.response.responseCode === 1) {
        console.log(`Success: TemplateID : ${ptemplateID} ${JSON.stringify(result)}`);
      } else {
        console.log(`Error: TemplateID : ${ptemplateID} ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const CreateTicketBAuthOptions = async () => {
    try {
      let pticketStatusID = 0;
      // A let pticketStatusNoneBMCG = 0;
      let pticketStatus = "";
      let papplicationNo = "";
      let pPolicyID = "";
      let pticketHeaderID = 0;
      const pticketHeaderName =
        selectedOption === "1" ? "Grievance" : selectedOption === "2" ? "Information" : selectedOption === "4" ? "Crop Loss Intimation" : "";

      if (selectedOption === "1" || selectedOption === "4") {
        // A pticketStatusID = 109019;
        pticketStatusID = 109301;
        pticketStatus = "Open";
        // A pticketStatusNoneBMCG = "109301";
        pticketHeaderID = Number(selectedOption);
      } else if (selectedOption === "2") {
        // A pticketStatusID = 109025;
        pticketStatusID = 109303;
        pticketStatus = "Resolved";
        // A pticketStatusNoneBMCG = "109303";
        pticketHeaderID = Number(selectedOption);
      }
      if (selectedClaimOrGrievence === "CI") {
        papplicationNo = selectedInsuranceDetails && selectedInsuranceDetails.applicationNo ? selectedInsuranceDetails.applicationNo : "";
        pPolicyID = selectedInsuranceDetails && selectedInsuranceDetails.policyID ? selectedInsuranceDetails.policyID : "";
      } else {
        papplicationNo = selectedInsuranceDetails && selectedInsuranceDetails.applicationNo ? selectedInsuranceDetails.applicationNo : "";
        pPolicyID = selectedInsuranceDetails && selectedInsuranceDetails.policyID ? selectedInsuranceDetails.policyID : "";
      }
      const user = getSessionStorage("user");
      const pcreationMode = "MOB";

      let pselectedOptionCropStage = "";
      if (selectedOption === "4") {
        pselectedOptionCropStage = selectedOptionCropStage === "1" ? "Standing Crop Stage" : selectedOptionCropStage === "2" ? "Harvested Stage" : "";
      }

      const formData = {
        creationMode: pcreationMode,
        subCategoryName:
          formValuesTicketCreation.txtOtherSubCategory && formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            ? formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            : "",
        callerContactNumber: formValuesCallerInformation.txtCallerMobileNumber ? formValuesCallerInformation.txtCallerMobileNumber : "",
        supportTicketID: 0,
        ticketRequestorID: selectedFarmer ? selectedFarmer.farmerID : "",
        stateCodeAlpha: selectedFarmer && selectedFarmer.stateID ? selectedFarmer.stateID : "",
        districtRequestorID: selectedFarmer && selectedFarmer.districtID ? selectedFarmer.districtID : "",
        villageRequestorID: selectedFarmer && selectedFarmer.villageID ? selectedFarmer.villageID : "",
        supportTicketNo: "0",
        requestorName: selectedFarmer ? selectedFarmer.farmerName : "",
        requestorMobileNo: selectedFarmer && selectedFarmer.mobile ? selectedFarmer.mobile : "",
        requestorAccountNo: selectedFarmer && selectedFarmer.accountNumber ? selectedFarmer.accountNumber : "",
        requestorAadharNo: selectedFarmer && selectedFarmer.aadharNumber ? selectedFarmer.aadharNumber : "",
        ticketCategoryID:
          formValuesTicketCreation.txtTicketCategoryType && formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeID
            ? formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeID
            : 0,
        // A cropCategoryOthers: formValuesTicketCreation.txtOtherSubCategory ? formValuesTicketCreation.txtOtherSubCategory : "",
        cropCategoryOthers:
          formValuesTicketCreation.txtOtherSubCategory && formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            ? formValuesTicketCreation.txtOtherSubCategory.OtherCategoryName
            : "",
        cropStageMasterID:
          formValuesTicketCreation.txtCropStage && formValuesTicketCreation.txtCropStage.CropStageMasterID
            ? formValuesTicketCreation.txtCropStage.CropStageMasterID
            : 0,
        cropStageMaster:
          formValuesTicketCreation.txtCropStage && formValuesTicketCreation.txtCropStage.CropStageMaster
            ? formValuesTicketCreation.txtCropStage.CropStageMaster
            : "",
        cropLossDetailID:
          formValuesTicketCreation.txtLossAt && formValuesTicketCreation.txtLossAt.CropLossDetailID ? formValuesTicketCreation.txtLossAt.CropLossDetailID : 0,
        cropStage: pselectedOptionCropStage,
        ticketHeaderID: pticketHeaderID,
        requestYear:
          formValuesForFarmerInfo.txtYearForFarmerInfo && formValuesForFarmerInfo.txtYearForFarmerInfo.Value
            ? formValuesForFarmerInfo.txtYearForFarmerInfo.Value
            : 0,
        requestSeason:
          formValuesForFarmerInfo.txtSeasonForFarmerInfo && formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID
            ? formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonID
            : 0,

        ticketDescription: formValuesTicketCreation.txtTicketDescription,
        lossDate: selectedOption !== "4" ? null : formValuesTicketCreation.txtCropLossDate ? dateToCompanyFormat(formValuesTicketCreation.txtCropLossDate) : "",
        lossTime: selectedOption !== "4" ? null : formValuesTicketCreation.txtCropLossTime ? formValuesTicketCreation.txtCropLossTime : "",
        postHarvestDate:
          selectedOption !== "4" || selectedOptionCropStage !== "2"
            ? null
            : formValuesTicketCreation.txtCropHarvestDate
              ? dateToCompanyFormat(formValuesTicketCreation.txtCropHarvestDate)
              : "",
        ticketSourceID: 6,
        ticketSourceName: "CSC",
        ticketStatusID: pticketStatusID,
        ticketStatus: pticketStatus,
        applicationNo: papplicationNo,
        insuranceCompanyID: 0,
        insuranceCompany: selectedInsuranceDetails ? selectedInsuranceDetails.insuranceCompanyName : "",
        insuranceCompanyCode: 0,
        cropSeasonName:
          formValuesForFarmerInfo.txtSeasonForFarmerInfo && formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonName
            ? formValuesForFarmerInfo.txtSeasonForFarmerInfo.CropSeasonName
            : "",
        ticketCategoryName:
          formValuesTicketCreation.txtTicketCategoryType && formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeName
            ? formValuesTicketCreation.txtTicketCategoryType.SupportTicketTypeName
            : "",
        ticketSubCategoryID:
          formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID
            : 0,
        ticketSubCategoryName:
          formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryName
            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryName
            : "",
        ticketHeadName: pticketHeaderName,
        nyayPanchayatID: "0",
        nyayPanchayat: "",
        gramPanchayatID: "0",
        gramPanchayat: "",
        businessRelationName: user && user.UserCompanyType ? user.UserCompanyType : "",
        schemeName:
          formValuesForFarmerInfo.txtSchemeForFarmerInfo && formValuesForFarmerInfo.txtSchemeForFarmerInfo.SchemeName
            ? formValuesForFarmerInfo.txtSchemeForFarmerInfo.SchemeName
            : "",
        agentName: user && user.UserDisplayName ? user.UserDisplayName : "",
        createdBY: user && user.UserDisplayName ? user.UserDisplayName : "",
        createdOn: null,
        farmerName: selectedFarmer ? selectedFarmer.farmerName : "",
        callStatus: "",
        insurancePolicyNo: pPolicyID,
        insurancePolicyDate: "",
        insuranceExpiryDate: "",
        agentUserID: user && user.LoginID ? user.LoginID.toString() : "0",
        bankMasterID: 0,
        schemeID:
          formValuesForFarmerInfo.txtSchemeForFarmerInfo && formValuesForFarmerInfo.txtSchemeForFarmerInfo.SchemeID
            ? formValuesForFarmerInfo.txtSchemeForFarmerInfo.SchemeID
            : 0,
        onTimeIntimationFlag: stateCropLossIntimation,
        hasDocument: 0,
        attachmentPath: "",
        callingMasterID: 0,
        cropName: formValuesTicketCreation.txtCropName ? formValuesTicketCreation.txtCropName : "",
        applicationCropName: selectedInsuranceDetails ? selectedInsuranceDetails.cropName : "",
        area: selectedInsuranceDetails ? selectedInsuranceDetails.policyArea : "",
        villageName: selectedInsuranceDetails ? selectedInsuranceDetails.resVillage : "",
        relation: selectedInsuranceDetails ? selectedInsuranceDetails.relation : "",
        relativeName: selectedInsuranceDetails ? selectedInsuranceDetails.relativeName : "",
        stateMasterName: selectedFarmer && selectedFarmer.stateID ? selectedFarmer.state : selectedFarmer.resState ? selectedFarmer.resState : "",
        districtMasterName: selectedInsuranceDetails ? selectedInsuranceDetails.resDistrict : "",
        subDistrictID: selectedInsuranceDetails ? selectedInsuranceDetails.resSubDistrictID : "",
        subDistrictName: selectedInsuranceDetails ? selectedInsuranceDetails.resSubDistrict : "",
        policyPremium: selectedInsuranceDetails ? selectedInsuranceDetails.policyPremium : "",
        policyArea: selectedInsuranceDetails ? selectedInsuranceDetails.policyArea : "",
        policyType: selectedInsuranceDetails ? selectedInsuranceDetails.policyType : "",
        landSurveyNumber: selectedInsuranceDetails ? selectedInsuranceDetails.landSurveyNumber : "",
        landDivisionNumber: selectedInsuranceDetails ? selectedInsuranceDetails.landDivisionNumber : "",
        plotVillageName: selectedInsuranceDetails ? selectedInsuranceDetails.plotVillageName : "",
        plotDistrictName: selectedInsuranceDetails ? selectedInsuranceDetails.plotDistrictName : "",
        plotStateName: selectedInsuranceDetails ? selectedInsuranceDetails.plotStateName : "",
        plotDistrictRequestorID: selectedInsuranceDetails ? selectedInsuranceDetails.plotDistrictID : "",
        applicationSource: selectedInsuranceDetails ? selectedInsuranceDetails.applicationSource : "",
        cropShare: selectedInsuranceDetails ? selectedInsuranceDetails.cropShare : "",
        iFSCCode: selectedInsuranceDetails ? selectedInsuranceDetails.ifscCode : "",
        farmerShare: selectedInsuranceDetails ? selectedInsuranceDetails.farmerShare : "",
        sowingDate: selectedInsuranceDetails ? selectedInsuranceDetails.sowingDate : "",
      };
      setisBtndisabled(1);
      setBtnLoaderSupportTicketActive(true);
      const result = await addKRPHSupportTicketdata(formData);
      setBtnLoaderSupportTicketActive(false);
      setisBtndisabled(0);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData) {
          const ticketNo = result.response.responseData.SupportTicketNo || "";
          setPSupportTicketNo(ticketNo);
          SendSMSToFarmerAgaintSupportTicket("G", selectedFarmer && selectedFarmer.mobile ? selectedFarmer.mobile : "", ticketNo);
          navigate("/ticketSuccess", { state: { ticketNo } });

          clearInsuranceFieldsAndTicketCreation();
          setValue("");
          // AsetOpenPopup(true);
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

  const getticketDataBindingData = async () => {
    try {
      if (getSessionStorage("ticketDataBindingSsnStrg") === null) {
        const result = await ticketDataBindingData({});
        if (result.response.responseCode === 1) {
          if (result.response.responseData) {
            console.log(result.response.responseData);
            setSessionStorage("ticketDataBindingSsnStrg", result.response.responseData);
          } else {
            setSessionStorage("ticketDataBindingSsnStrg", null);
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
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let i = 2025; i <= currentYear; i += 1) {
      yearArray.push({ Name: i.toString(), Value: i.toString() });
    }

    setYearList(yearArray.sort().reverse());
    getticketDataBindingData();
    selectedOptionOnClick("LO");
    // A getTicketCategoryTypeListData("1", 0, "TCKTYP");
  }, []);

  const requestorDetails = useMemo(() => {
    if (data && data.responseDynamic) {
      const item = data.responseDynamic.resolved?.[0];
      if (item) {
        return {
          requestorMobileNo: item.RequestorMobileNo,
          requestorName: item.RequestorName,
          requestorDistrict: item.DistrictMasterName,
          requestorState: item.StateMasterName,
        };
      } else {
        const item = data.responseDynamic.unresolved?.[0];
        if (item) {
          return {
            requestorMobileNo: item.RequestorMobileNo,
            requestorName: item.RequestorName,
            requestorDistrict: item.DistrictMasterName,
            requestorState: item.StateMasterName,
          };
        }
      }
    }
  }, [data]);

  const InsuranceC = selectedInsuranceDetails && selectedInsuranceDetails.insuranceCompanyName ? selectedInsuranceDetails.insuranceCompanyName : "";

  const ApplicationNo =
    selectedClaimOrGrievence === "CI"
      ? selectedInsuranceDetails && selectedInsuranceDetails.applicationNo
        ? selectedInsuranceDetails.applicationNo
        : ""
      : selectedInsuranceDetails && selectedInsuranceDetails.applicationNo
        ? selectedInsuranceDetails.applicationNo
        : "";
  const FarmerPremium =
    selectedClaimOrGrievence === "CI"
      ? selectedInsuranceDetails && selectedInsuranceDetails.farmerPremium
        ? selectedInsuranceDetails.farmerPremium
        : ""
      : selectedInsuranceDetails && selectedInsuranceDetails.policyPremium
        ? selectedInsuranceDetails.policyPremium
        : "";

  const village =
    selectedClaimOrGrievence === "CI"
      ? selectedInsuranceDetails && selectedInsuranceDetails.plotVillageName
        ? selectedInsuranceDetails.plotVillageName
        : ""
      : selectedInsuranceDetails && selectedInsuranceDetails.plotVillageName
        ? selectedInsuranceDetails.plotVillageName
        : "";
  const areaInHectare =
    selectedClaimOrGrievence === "CI"
      ? selectedInsuranceDetails && selectedInsuranceDetails.area
        ? selectedInsuranceDetails.area
        : ""
      : selectedInsuranceDetails && selectedInsuranceDetails.policyArea
        ? selectedInsuranceDetails.policyArea
        : "";
  const State =
    selectedFarmer && selectedFarmer.state
      ? selectedFarmer.state
      : selectedFarmer.stateName
        ? selectedFarmer.stateName
        : selectedFarmer.resState
          ? selectedFarmer.resState
          : "";
  const District =
    selectedFarmer && selectedFarmer.district
      ? selectedFarmer.district
      : selectedFarmer.districtName
        ? selectedFarmer.districtName
        : selectedFarmer.resDistrict
          ? selectedFarmer.resDistrict
          : "";
  const Taluka = selectedFarmer && selectedFarmer.subDistrict ? selectedFarmer.subDistrict : selectedFarmer.resSubDistrict ? selectedFarmer.resSubDistrict : "";
  const Village =
    selectedFarmer && selectedFarmer.village
      ? selectedFarmer.village
      : selectedFarmer.villageName
        ? selectedFarmer.villageName
        : selectedFarmer.resVillage
          ? selectedFarmer.resVillage
          : "";
  const insuranceLogos = {
    "GENERALI CENTRAL INSURANCE COMPANY LTD.": FutureGeneraliLogo,
    "AGRICULTURE INSURANCE COMPANY": Aic,
    "BAJAJ ALLIANZ GENERAL INSURANCE CO. LTD": BajajAl,
    "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LIMITED": CholaMS,
    "HDFC ERGO GENERAL INSURANCE CO. LTD.": HdfcErgo,
    "ICICI LOMBARD GENERAL INSURANCE CO. LTD.": IciciLom,
    "IFFCO TOKIO GENERAL INSURANCE CO. LTD.": IfcoTokia,
    "KSHEMA GENERAL INSURANCE LIMITED": kShema,
    "NATIONAL INSURANCE COMPANY LIMITED": NationInsur,
    "NEW INDIA ASSURANCE COMPANY": NewIndia,
    "RELIANCE GENERAL INSURANCE CO. LTD.": RelGen,
    "ROYAL SUNDARAM GENERAL INSURANCE CO. LIMITED": RoyalSund,
    "SBI GENERAL INSURANCE": SbiGen,
    "TATA AIG GENERAL INSURANCE CO. LTD.": TataAig,
    "UNITED INDIA INSURANCE CO.": UnitedIndia,
    "UNIVERSAL SOMPO GENERAL INSURANCE COMPANY": UnivSompo,
    "ORIENTAL INSURANCE": Orient,
  };

  const defaultLogo = DummyImage;

  const getInsuranceLogo = (insuranceCompany) => {
    return insuranceLogos[insuranceCompany] || defaultLogo;
  };

  const logoPath = getInsuranceLogo(InsuranceC);

  return (
    <>
      {openInsuranceCompanyModalGreivence && (
        <InsuranceCompanyModalGreivence
          toggleInsuranceCompanyModalGreivence={toggleInsuranceCompanyModalGreivence}
          onCellDoubleClickedDetailsGreivence={onCellDoubleClickedDetailsGreivence}
          insuranceCompanyDataGreivence={insuranceCompanyDataGreivence}
        />
      )}
      <div className={BizClass.Box}>
        <div className={BizClass.Div}>
          <Header
            onComplaintClick={handleNavigateComplaintStatus}
            showComplaintButton={true}
            title={selectedFarmer?.farmerName || "Unknown Farmer"}
            handleBackClick={handleBackClick}
          />
          <>
            <>
              <Box
                elevation={2}
                sx={{
                  background: "white",
                  border: "2px solid transparent",
                  boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px",
                  width: "96.5%",
                  padding: "16px",
                  margin: "16px auto",
                  marginBottom: "0",
                }}
              >
                <div style={{ backgroundColor: "#075307", color: "white", padding: "10px", borderRadius: "10px" }}>
                  <span style={{ fontSize: "16px", gap: 2 }}>Claim Intimation</span>
                </div>
                <br />{" "}
                <div>
                  <span style={{ fontSize: "16px", gap: 2 }}>Farmer Information</span>
                </div>
                <br />
                <Box
                  display="flex"
                  gap={2}
                  mb={2}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on larger screens
                  }}
                >
                  <TextField
                    label="Farmer Name"
                    size="small"
                    fullWidth
                    value={selectedFarmer ? selectedFarmer.farmerName : ""}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                    }}
                  />
                  <TextField
                    label="Mobile No"
                    size="small"
                    fullWidth
                    value={selectedFarmer && selectedFarmer.mobile}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                    }}
                  />
                </Box>
                <Box
                  display="flex"
                  gap={2}
                  mb={2}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on larger screens
                  }}
                >
                  <TextField
                    label="State"
                    size="small"
                    fullWidth
                    value={State ? State.charAt(0).toUpperCase() + State.slice(1).toLowerCase() : ""}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                    }}
                  />

                  <TextField
                    label="District"
                    size="small"
                    fullWidth
                    value={District}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                    }}
                  />
                  <TextField
                    label="Taluka"
                    size="small"
                    fullWidth
                    value={Taluka}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                    }}
                  />
                  <TextField
                    label="Village"
                    size="small"
                    fullWidth
                    value={Village}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                    }}
                  />
                </Box>
                <Form.Group column="4">
                  <Form.CustomGroup column={4} columntemplate="140px 140px auto">
                    <Form.InputGroup label="" errorMsg={formValidationFarmersInfoError["txtYearForFarmerInfo"]}>
                      <Form.InputControl
                        style={{ width: "100%" }}
                        control="select"
                        label="Year"
                        name="txtYearForFarmerInfo"
                        value={formValuesForFarmerInfo.txtYearForFarmerInfo}
                        options={yearList}
                        getOptionLabel={(option) => `${option.Name}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateForFarmerInfo("txtYearForFarmerInfo", e)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup errorMsg={formValidationFarmersInfoError["txtSeasonForFarmerInfo"]}>
                      <Form.InputControl
                        control="select"
                        label="Season"
                        name="txtSeasonForFarmerInfo"
                        value={formValuesForFarmerInfo.txtSeasonForFarmerInfo}
                        options={seasonForPolicyNumberDropdownDataList}
                        // A loader={isLoadingSeasonPolicyNumberDropdownDataList ? <Loader /> : null}
                        // A isLoading={isLoadingSeasonPolicyNumberDropdownDataList}
                        getOptionLabel={(option) => `${option.CropSeasonName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateForFarmerInfo("txtSeasonForFarmerInfo", e)}
                      />
                    </Form.InputGroup>
                    <Form.InputGroup label="" errorMsg={formValidationFarmersInfoError["txtSchemeForFarmerInfo"]}>
                      <Form.InputControl
                        control="select"
                        label="Scheme"
                        name="txtSchemeForFarmerInfo"
                        value={formValuesForFarmerInfo.txtSchemeForFarmerInfo}
                        options={schemeList}
                        getOptionLabel={(option) => `${option.SchemeName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateStateForFarmerInfo("txtSchemeForFarmerInfo", e)}
                      />
                    </Form.InputGroup>
                    <button
                      onClick={() => getPolicyOfFarmerGreivenceOnClick()}
                      disabled={btnLoaderFarmerGreivenceInfoActive}
                      style={{
                        background: "#075307",
                        border: "none",
                        opacity: 1,
                        color: "white",
                        padding: " 5px 5px 5px 5px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      ↻ Fetch Details
                    </button>
                  </Form.CustomGroup>
                </Form.Group>
              </Box>
            </>
            <Box
              sx={{
                borderRadius: "10px",
                width: "96.5%",
                margin: "16px auto",
                marginTop: "0",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "2fr 1fr",
                  },
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    background: "white",
                    border: "2px solid transparent",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                    width: "100%",
                    padding: "16px",
                    margin: "16px auto",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <div>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                          Ticket Creation
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "green" }}>
                          Ticket Type: <strong>Crop Loss Intimation</strong>
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <div>
                        {/* <Form.InputGroup label="Ticket Type" errorMsg="" column={3}>
                        <ul className={BizClass.ValidateTabGroup}>
                          <button type="button" className={selectedOption === "4" && BizClass.Active} onClick={() => selectedOptionOnClick("LO")}>
                            <div className={BizClass.ValidateTabCheckBox} />
                            <span>Crop Loss Intimation</span>
                          </button>
                        </ul> */}
                        <div style={{ marginLeft: "15px", marginBottom: "10px" }}>
                          {/* </Form.InputGroup> */}
                          {selectedOption === "4" ? (
                            <Form.InputGroup label="" errorMsg="" column={4}>
                              <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={value}
                                defaultValue={selectedOptionCropStage}
                                onChange={handleChange}
                                className="radio-group"
                                row
                              >
                                <FormControlLabel
                                  style={{
                                    width: "240px",
                                    height: "50px",
                                    border: "1.4px solid var(--unnamed-color-7ed321)",
                                    background: "#F2FEDA 0% 0% no-repeat padding-box",
                                    border: "1px solid #7ED321",
                                    borderRadius: "4px",
                                    opacity: "1",
                                  }}
                                  value="StandingCropStage"
                                  control={<Radio />}
                                  onClick={() => selectedOptionOnClickCropStage("SCS")}
                                  label={"Standing Crop Stage"}
                                  // AclassName={`radio-button ${selectedOptionCropStage === "1" ? "active-class" : ""}`}
                                />
                                <FormControlLabel
                                  style={{
                                    width: "240px",
                                    height: "50px",
                                    border: "1.4px solid var(--unnamed-color-7ed321)",
                                    background: "#F2FEDA 0% 0% no-repeat padding-box",
                                    border: "1px solid #7ED321",
                                    borderRadius: "4px",
                                    opacity: "1",
                                  }}
                                  value="Harvested Stage"
                                  control={<Radio />}
                                  onClick={() => selectedOptionOnClickCropStage("HS")}
                                  label={"Harvested Stage"}
                                  // AclassName={`radio-button ${selectedOptionCropStage === "1" ? "active-class" : ""}`}
                                />
                              </RadioGroup>

                              {/* <button
                              type="button"
                              className={selectedOptionCropStage === "1" && BizClass.Active}
                              onClick={() => selectedOptionOnClickCropStage("SCS")}
                              >
                              <div className={BizClass.ValidateTabCheckBox} />
                              <span>Standing Crop Stage</span>
                              </button>
                              <button
                              type="button"
                              className={selectedOptionCropStage === "2" && BizClass.Active}
                              onClick={() => selectedOptionOnClickCropStage("HS")}
                              >
                              <div className={BizClass.ValidateTabCheckBox} />
                              <span>Harvested Stage</span>
                              </button> */}
                            </Form.InputGroup>
                          ) : null}
                        </div>
                        <>
                          <Grid container spacing={2}>
                            <Grid item xs={4} style={{ width: "32%" }}>
                              {selectedOption === "4" ? (
                                <div column={3} label="Loss At" req="true" errorMsg={formValidationSupportTicketError["txtLossAt"]}>
                                  <div style={{ display: "grid", gridTemplateRows: "30px auto" }}>
                                    <span style={{ color: "#2A2A2A", fontSize: "13px", lineHeight: "1.5" }}>Loss at</span>
                                  </div>{" "}
                                  <Form.InputControl
                                    control="select"
                                    name="txtLossAt"
                                    value={formValuesTicketCreation.txtLossAt}
                                    options={lossAtList}
                                    isLoading={isLoadingLossAtList}
                                    getOptionLabel={(option) => `${option.CropStageSelection}`}
                                    getOptionValue={(option) => `${option}`}
                                    onChange={(e) => updateStateTicketCreation("txtLossAt", e)}
                                  />
                                </div>
                              ) : null}
                            </Grid>
                            <Grid item xs={4} style={{ width: "32%" }}>
                              <div label="Category" req="true" errorMsg={formValidationSupportTicketError["txtTicketCategoryType"]}>
                                <div style={{ display: "grid", gridTemplateRows: "30px auto" }}>
                                  <span style={{ color: "#2A2A2A", fontSize: "13px" }}>Category </span>
                                </div>
                                <Form.InputControl
                                  control="select"
                                  name="txtTicketCategoryType"
                                  value={formValuesTicketCreation.txtTicketCategoryType}
                                  options={ticketCategoryTypeList}
                                  isLoading={isLoadingTicketCategoryTypeList}
                                  getOptionLabel={(option) => `${option.SupportTicketTypeName}`}
                                  getOptionValue={(option) => `${option}`}
                                  onChange={(e) => updateStateTicketCreation("txtTicketCategoryType", e)}
                                />
                              </div>
                            </Grid>
                            <Grid item xs={4} style={{ width: "32%" }}>
                              <div label="Category" req="true" errorMsg={formValidationSupportTicketError["txtTicketCategory"]}>
                                <div style={{ display: "grid", gridTemplateRows: "30px auto" }}>
                                  <span style={{ color: "#2A2A2A", fontSize: "13px", lineHeight: "1.5" }}>Sub category </span>
                                </div>{" "}
                                <Form.InputControl
                                  control="select"
                                  name="txtTicketCategory"
                                  value={formValuesTicketCreation.txtTicketCategory}
                                  options={ticketCategoryList}
                                  isLoading={isLoadingTicketCategoryList}
                                  getOptionLabel={(option) => `${option.TicketCategoryName}`}
                                  getOptionValue={(option) => `${option}`}
                                  onChange={(e) => updateStateTicketCreation("txtTicketCategory", e)}
                                />
                              </div>
                            </Grid>
                          </Grid>
                          {(formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 51
                            : 0) ||
                          (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 52
                            : 0) ||
                          (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 53
                            : 0) ||
                          (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                            ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 58
                            : 0) ? (
                            <Grid item xs={6} style={{ width: "50%" }}>
                              <Form.InputGroup column={3} label="Other Sub Cat." req="true" errorMsg={formValidationSupportTicketError["txtOtherSubCategory"]}>
                                <Form.InputControl
                                  control="select"
                                  name="txtOtherSubCategory"
                                  value={formValuesTicketCreation.txtOtherSubCategory}
                                  options={ticketCategoryOtherList}
                                  isLoading={isLoadingTicketCategoryOtherList}
                                  getOptionLabel={(option) => `${option.OtherCategoryName}`}
                                  getOptionValue={(option) => `${option}`}
                                  onChange={(e) => updateStateTicketCreation("txtOtherSubCategory", e)}
                                />
                              </Form.InputGroup>
                            </Grid>
                          ) : null}
                          {selectedOption === "4" ? (
                            <Form.InputGroup column={3} label="Crop Stage" req="true" errorMsg={formValidationSupportTicketError["txtCropStage"]}>
                              <Form.InputControl
                                control="select"
                                name="txtCropStage"
                                value={formValuesTicketCreation.txtCropStage}
                                options={cropStageList}
                                // A loader={isLoadingCropStageList ? <Loader /> : null}
                                isLoading={isLoadingCropStageList}
                                getOptionLabel={(option) => `${option.CropStageMaster}`}
                                getOptionValue={(option) => `${option}`}
                                onChange={(e) => updateStateTicketCreation("txtCropStage", e)}
                              />
                            </Form.InputGroup>
                          ) : null}
                          {selectedOption === "4" ? (
                            <Form.CustomGroup
                              style={{ marginTop: "20px", gap: "26px" }}
                              column={4}
                              columntemplate={
                                (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                                  ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 51
                                  : 0) ||
                                (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                                  ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 52
                                  : 0) ||
                                (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                                  ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 53
                                  : 0) ||
                                (formValuesTicketCreation.txtTicketCategory && formValuesTicketCreation.txtTicketCategory.TicketCategoryID
                                  ? formValuesTicketCreation.txtTicketCategory.TicketCategoryID === 58
                                  : 0)
                                  ? "90px 110px 68px 110px 85px auto"
                                  : selectedOptionCropStage === "2"
                                    ? "75px 110px 60px 110px 85px auto"
                                    : selectedOptionCropStage === "1"
                                      ? "70px 110px 85px auto"
                                      : null
                              }
                            >
                              {selectedOptionCropStage === "2" ? (
                                <Form.InputGroup
                                  label="Harvest Date"
                                  style={{ marginLeft: "8px" }}
                                  req="true"
                                  errorMsg={formValidationSupportTicketError["txtCropHarvestDate"]}
                                >
                                  <Form.InputControl
                                    control="input"
                                    type="date"
                                    style={{ width: "105px" }}
                                    name="txtCropHarvestDate"
                                    value={formValuesTicketCreation.txtCropHarvestDate}
                                    onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                                    max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
                                    onKeyDown={(e) => e.preventDefault()}
                                  />
                                </Form.InputGroup>
                              ) : null}
                              {selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                                <Form.InputGroup
                                  label="Loss Date"
                                  style={{ marginLeft: "14px" }}
                                  req="true"
                                  errorMsg={formValidationSupportTicketError["txtCropLossDate"]}
                                >
                                  <Form.InputControl
                                    control="input"
                                    type="date"
                                    style={{ width: "105px" }}
                                    name="txtCropLossDate"
                                    value={formValuesTicketCreation.txtCropLossDate}
                                    onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                                    min={dateToSpecificFormat(moment().subtract(1, "months"), "YYYY-MM-DD")}
                                    max={dateToSpecificFormat(moment(), "YYYY-MM-DD")}
                                    onKeyDown={(e) => e.preventDefault()}
                                  />
                                </Form.InputGroup>
                              ) : null}
                              {/* {selectedOptionCropStage === "2" || selectedOptionCropStage === "1" ? (
                                <Form.InputGroup label="">
                                  <Form.InputControl
                                    control="input"
                                    type="text"
                                    name="txtCropLossIntimation"
                                    value={formValuesTicketCreation.txtCropLossIntimation}
                                    onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                                    style={
                                      stateCropLossIntimation === "YES" || stateCropLossIntimation === "NA"
                                        ? { color: "#3f4254", background: "#ffffff" }
                                        : { color: "#ffffff" }
                                    }
                                    className={
                                      stateCropLossIntimation === "YES" || stateCropLossIntimation === "NA"
                                        ? BizClass.disabledOnIntimationTextBox
                                        : BizClass.disabledLateIntimationTextBox
                                    }
                                  />
                                </Form.InputGroup>
                              ) : null} */}
                              <Form.InputGroup label="" req={false} errorMsg={formValidationSupportTicketError["txtCropLossTime"]} style={{ display: "none" }}>
                                <Form.InputControl
                                  control="input"
                                  type="time"
                                  name="txtCropLossTime"
                                  value={formValuesTicketCreation.txtCropLossTime}
                                  onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                                />
                              </Form.InputGroup>
                            </Form.CustomGroup>
                          ) : null}
                          {selectedOption === "4" ? (
                            <Form.InputGroup column={3} req="true" errorMsg={formValidationSupportTicketError["txtCropName"]} label="Crop Name">
                              <Form.InputControl
                                control="input"
                                autoComplete="off"
                                name="txtCropName"
                                value={formValuesTicketCreation.txtCropName}
                                placeholder=""
                                onChange={(e) => updateStateTicketCreation(e.target.name, e.target.value)}
                              />
                            </Form.InputGroup>
                          ) : null}
                          <Form.InputGroup
                            label="Description"
                            column={3}
                            row={11}
                            req="true"
                            errorMsg={formValidationSupportTicketError["txtTicketDescription"]}
                          >
                            <Form.InputControl
                              control="textarea"
                              row="11"
                              maxLength="500"
                              name="txtTicketDescription"
                              value={formValuesTicketCreation.txtTicketDescription}
                              onChange={(e) => updateStateTicketCreation("txtTicketDescription", e.target.value)}
                            />
                          </Form.InputGroup>
                        </>
                      </div>
                      <div>
                        <br />
                        <button
                          type="button"
                          className={BizClass.backbutton}
                          disabled={isBtndisabled || isLoading}
                          style={{
                            width: "411px",
                            height: "48px",
                            background: "#075307",
                            color: "white",
                            borderRadius: "4px",
                            opacity: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                          }}
                          onClick={supportTicketOnClick}
                        >
                          {isLoading ? (
                            <CircularProgress
                              size={24}
                              style={{
                                position: "absolute",
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            />
                          ) : (
                            "Submit"
                          )}
                        </button>

                        {/* <Button className={BizClass.FormFooterButton} onClick={() => clearAddTicketForm()}>
                    Clear
                  </Button> */}
                        {/* <Button >Logout</Button> */}
                        {/* <Button className={BizClass.FormFooterButton} onClick={handleNavigateHome}>
                    Log Out
                  </Button> */}

                        <div>
                          <Dialog
                            style={{
                              position: "absolute",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              top: "0",
                              left: "0",
                              width: "100%",
                              height: "100%",
                              zIndex: "10087977770",
                              backgroundColor: "rgba(0, 0, 0, 0.5) !important",
                            }}
                            open={openPopup}
                            onClose={() => setOpenPopup(false)}
                          >
                            <div
                              style={{
                                background: "white !important",
                                padding: "20px !important",
                                borderRadius: "10px !important",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3) !important",
                                maxWidth: "400px !important",
                                width: "90% !important",
                                textAlign: "center !important",
                                margin: "auto",
                              }}
                            >
                              <DialogTitle
                                style={{
                                  fontSize: "16px !important",
                                  marginBottom: "20px !important",
                                }}
                              >
                                {pSupportTicketNo && (
                                  <p
                                    style={{
                                      fontWeight: "bold",
                                      color: "#4CAF50",
                                    }}
                                  >
                                    Ticket Created Successfully with Ticket No. {pSupportTicketNo}
                                  </p>
                                )}
                                "Do you want to create more tickets? Click Continue."
                              </DialogTitle>
                              <DialogActions
                                style={{
                                  display: "flex !important",
                                  justifyContent: "space-between !important",
                                }}
                              >
                                <div style={{ display: "flex", flexDirection: "flex-start" }}>
                                  <button
                                    type="button"
                                    className={BizClass.backbutton}
                                    style={{
                                      width: "1% !important",
                                      padding: "0px !important",
                                      position: "flex !important",
                                      right: "50px !important",
                                      top: "20px !important",
                                      alignItem: "flex-end !important",
                                    }}
                                    onClick={handleContinue}
                                  >
                                    Continue{" "}
                                  </button>
                                  &nbsp;&nbsp;
                                  <button
                                    type="button"
                                    className={BizClass.backbutton}
                                    style={{
                                      width: "1% !important",
                                      padding: "0px !important",
                                      position: "flex !important",
                                      right: "50px !important",
                                      top: "20px !important",
                                      alignItem: "flex-end !important",
                                    }}
                                    onClick={handleLogout}
                                  >
                                    Log Out
                                  </button>
                                </div>
                                {/* <Button
                            onClick={handleLogout}
                            style={{
                              backgroundColor: "#F44336 !important",
                              color: "white !important",
                              padding: "10px 20px !important",
                              borderRadius: "5px !important",
                              fontWeight: "bold !important",
                              border: "none !important",
                              cursor: "pointer !important",
                              transition: "background-color 0.3s ease !important",
                            }}
                          >
                            Logout
                          </Button> */}
                              </DialogActions>
                            </div>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </Box>
                {/* Insurance Company Information Section */}

                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    margin: "20px",
                    marginTop: "17px",
                    marginRight: "0",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box
                    sx={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "18px",
                        color: "#333",
                        marginBottom: "16px",
                      }}
                    >
                      Insurance Company Information
                    </Typography>

                    <br />

                    {/* Logo and Company Name */}
                    <div
                      style={{
                        border: "1px solid #075307",
                        textAlign: "center",
                        marginBottom: "20px",
                        backgroundColor: "#ffffff",
                        padding: "12px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        src={logoPath}
                        alt={InsuranceC}
                        style={{
                          maxWidth: "120px",
                          maxHeight: "60px",
                          marginBottom: "10px",
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />

                      <Typography
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "#555",
                        }}
                      >
                        {InsuranceC}{" "}
                      </Typography>
                    </div>

                    {/* Details Section */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div
                        style={{
                          borderBottom: "1px solid #ddd",
                          paddingBottom: "5px",
                          display: "flex",
                          flexDirection: "row",
                          padding: "10px 0",
                          gap: "50px",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{}}>Application Number</div>
                        <div style={{ color: "#555" }}>{ApplicationNo}</div>
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ddd",
                          paddingBottom: "5px",
                          display: "flex",
                          flexDirection: "row",
                          padding: "10px 0",
                          gap: "50px",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{}}>Village</div>
                        <div style={{ color: "#555" }}>{village}</div>
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ddd",
                          paddingBottom: "5px",
                          display: "flex",
                          flexDirection: "row",
                          padding: "10px 0",
                          gap: "50px",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{}}>Farmer Premium</div>
                        <div style={{ color: "#555" }}>{FarmerPremium}</div>
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #ddd",
                          paddingBottom: "5px",
                          display: "flex",
                          flexDirection: "row",
                          padding: "10px 0",
                          gap: "50px",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{}}>Area (Hectare)</div>
                        <div style={{ color: "#555" }}>{areaInHectare}</div>
                      </div>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Footer />
          </>
        </div>
      </div>
    </>
  );
}

export default CropLossintimationTickets;

function InsuranceCompanyModalGreivence({ toggleInsuranceCompanyModalGreivence, onCellDoubleClickedDetailsGreivence, insuranceCompanyDataGreivence }) {
  return (
    <Modal title="Grievance" varient="center" width="100vw" show={toggleInsuranceCompanyModalGreivence} right={0} height="60vh">
      <Modal.Body>
        <div className={BizClass.ModalBox}>
          <PageBar>
            <PageBar.Search />
          </PageBar>
          <DataGrid
            rowData={insuranceCompanyDataGreivence}
            // A loader={isLoadingApplicationNoDataGreivence ? <Loader /> : null}
            rowSelection="single"
            suppressRowClickSelection="true"
            // A onGridReady={onGridReadySupportTicketGreivence}
            onCellDoubleClicked={(event) => onCellDoubleClickedDetailsGreivence(event)}
            tooltipShowDelay={500}
            tooltipMouseTrack={true}
            tooltipInteraction={true}
          >
            <DataGrid.Column field="insuranceCompanyName" headerName="Insurance Company Name" width="280px" headerTooltip="Name of the insurance company" />
            <DataGrid.Column
              field="policyID"
              headerName="Policy Number"
              width="180"
              headerTooltip="Policy no.: <scheme code><season code><state code><YY><Insurance policy>"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].policyID : null;
              // A }}
            />
            <DataGrid.Column
              field="policyPremium"
              headerName="Total Premium"
              width="132px"
              headerTooltip="Total Premium of policy for all the applications against the policy"
            />
            <DataGrid.Column
              field="policyArea"
              headerName="Total Area"
              width="110px"
              headerTooltip="Total Area of policy in hectare, for all the applications against the policy"
            />
            <DataGrid.Column
              field="applicationNo"
              headerName="Application Number"
              width="170"
              headerTooltip="Application number against respective land and crop. It may be multiple against the same policy ID for different land"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationNo : null;
              // A  }}
            />
            <DataGrid.Column
              field="#"
              headerName="Scheme"
              width="275"
              headerTooltip="Scheme"
              cellRenderer={(node) => {
                return node.data.scheme === "WBCIS"
                  ? "Weather Based Crop Insurance Scheme(WBCIS)"
                  : node.data.scheme === "PMFBY"
                    ? "Pradhan Mantri Fasal Bima Yojna(PMFBY)"
                    : "";
              }}
            />
            {/* <DataGrid.Column
                field="cropName"
                headerName="Crop Name"
                width="140"
                headerTooltip="Crop Covered for the particular application against the policy"
                // A cellRenderer={(node) => {
                // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].cropName : null;
                // A }}
              /> */}
            <DataGrid.Column
              field="farmerShare"
              headerName="Premium Share"
              width="140"
              headerTooltip="Premium Share of particular Application"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].farmerShare : null;
              // A }}
            />
            <DataGrid.Column
              field="cropShare"
              headerName="Area covered under Application"
              width="235"
              headerTooltip="sowing crop area in land"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].cropShare : null;
              // A }}
            />
            <DataGrid.Column
              field="landSurveyNumber"
              headerName="Land Number"
              width="125"
              headerTooltip="Registered Number of Total Land (Khata Number)"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].landSurveyNumber : null;
              // A }}
            />
            <DataGrid.Column
              field="landDivisionNumber"
              headerName="Division Number"
              width="140"
              headerTooltip="Division number against of that particular Land"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].landDivisionNumber : null;
              // A }}
            />

            <DataGrid.Column
              field="applicationSource"
              headerName="Source"
              width="90"
              headerTooltip="Source of the application submitted by Farmer"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationSource : null;
              // A  }}
            />
            <DataGrid.Column
              field="applicationStatus"
              headerName="Application Status"
              width="190"
              headerTooltip="Status of the application submitted by farmer"
              // A cellRenderer={(node) => {
              // A  return node.data.applicationList.length > 0 ? node.data.applicationList[0].applicationStatus : null;
              // A }}
            />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

InsuranceCompanyModalGreivence.propTypes = {
  toggleInsuranceCompanyModalGreivence: PropTypes.func.isRequired,
  onGridReadySupportTicketGreivence: PropTypes.func.isRequired,
  insuranceCompanyDataGreivence: PropTypes.func.isRequired,
  isLoadingApplicationNoDataGreivence: PropTypes.bool.isRequired,
  onCellDoubleClickedDetailsGreivence: PropTypes.func.isRequired,
  getClaimStatusOnClick: PropTypes.func.isRequired,
};

function ClaimStatusModal({
  toggleClaimStatusModal,
  onGridReadyClaimStatus,
  claimStatusData,
  onChangeClamStatus,
  isLoadingClaimStatusDataData,
  openCustomeWindow,
  OnClickCustomeWindow,
  customeWindowWidth,
  customeWindowHeight,
}) {
  return (
    <Modal
      title="Claim Status"
      varient="bottom"
      width={customeWindowWidth}
      show={toggleClaimStatusModal}
      left="90px"
      bottom="12.5px"
      height={customeWindowHeight}
    >
      <Modal.Header>
        <span style={{ width: "100%" }} />
        {openCustomeWindow === "S" ? (
          <AiOutlinePlusSquare title="Maximize The Window" style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => OnClickCustomeWindow("S")} />
        ) : openCustomeWindow === "B" ? (
          <AiOutlineMinusSquare title="Minimize The Window" style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => OnClickCustomeWindow("B")} />
        ) : null}
      </Modal.Header>
      <Modal.Body>
        <div className={BizClass.ModalBox}>
          <PageBar>
            <PageBar.Search onChange={(e) => onChangeClamStatus(e.target.value)} />
          </PageBar>
          <DataGrid
            rowData={claimStatusData}
            loader={isLoadingClaimStatusDataData ? <Loader /> : null}
            rowSelection="single"
            suppressRowClickSelection="true"
            onGridReady={onGridReadyClaimStatus}
          >
            <DataGrid.Column field="applicationNo" headerName="Application Number" width="175px" />
            <DataGrid.Column
              field="claimDate"
              headerName="Claim Date"
              width="115px"
              cellRenderer={(node) => {
                return dateFormatDDMMYY(node.data.claimDate);
              }}
            />
            <DataGrid.Column field="amount" headerName="Claim Amount" width="135px" />
            <DataGrid.Column field="ClaimType" headerName="Claim Type" width="150px" />
            <DataGrid.Column field="UtrNumber" headerName="UTR Number" width="140px" />
            <DataGrid.Column field="aadharPaymentAccountNumber" headerName="Payment To Account Number" width="220px" />
            <DataGrid.Column field="aadharPaymentBankName" headerName="Payment To Bank Name" width="220px" />
            <DataGrid.Column field="aadharPaymentFarmerName" headerName="Farmer Name" width="290px" />
            <DataGrid.Column
              field="aadharPaymentAadharNumber"
              headerName="Aadhar Number"
              width="140px"
              valueGetter={(node) => {
                return node.data.aadharPaymentAadharNumber ? node.data.aadharPaymentAadharNumber.replace(/.(?=.{4})/g, "x") : null;
              }}
            />
            <DataGrid.Column field="ClaimStatus" headerName="Claim Status" width="220px" />
            <DataGrid.Column field="paymentMode" headerName="Payment Mode" width="140px" />
            <DataGrid.Column field="Status" headerName="Status" width="155px" />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

ClaimStatusModal.propTypes = {
  toggleClaimStatusModal: PropTypes.func.isRequired,
  onGridReadyClaimStatus: PropTypes.func.isRequired,
  claimStatusData: PropTypes.func.isRequired,
  onChangeClamStatus: PropTypes.func.isRequired,
  isLoadingClaimStatusDataData: PropTypes.bool.isRequired,
  OnClickCustomeWindow: PropTypes.func.isRequired,
  openCustomeWindow: PropTypes.string,
  customeWindowWidth: PropTypes.string,
  customeWindowHeight: PropTypes.string,
};
