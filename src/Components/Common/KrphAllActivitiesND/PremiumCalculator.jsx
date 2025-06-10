import { React, useState, useEffect, useRef } from "react";
import { InputControl, InputGroup } from "Framework/OldFramework/FormComponents/FormComponents";
import { KrphButton } from "./Widgets/KrphButton";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBindingDataList, getDistrictByState } from "../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getCropListDistrictWiseDataList, AddCalculatedPremiumData } from "Components/Common/Calculator/Service/Method";
import { krphFarmerCallingHistorydata } from "./Services/Methods";
import BizClass from "./PremiumCalculator.module.scss";
import DummyImage from "../../../assets/ICLogo/dummy-thumbnail.jpg";
import FutureGeneraliLogo from "../../../assets/ICLogo/FutureGen.jpeg";
import Aic from "../../../assets/ICLogo/Aic.png";
import BajajAl from "../../../assets/ICLogo/BajajAllianza.jpeg";
import CholaMS from "../../../assets/ICLogo/CholaMS.png";
import HdfcErgo from "../../../assets/ICLogo/HdfcErgo.jpeg";
import IciciLom from "../../../assets/ICLogo/IciciLomb.png";
import IfcoTokia from "../../../assets/ICLogo/IfcoTokio.jpeg";
import kShema from "../../../assets/ICLogo/kshema.jpeg";
import NationInsur from "../../../assets/ICLogo/NationalInsur.jpeg";
import NewIndia from "../../../assets/ICLogo/NewIndiaAssur.jpeg";
import RelGen from "../../../assets/ICLogo/RelGeneral.png";
import RoyalSund from "../../../assets/ICLogo/RoyalSund.png";
import SbiGen from "../../../assets/ICLogo/SbiGen.png";
import TataAig from "../../../assets/ICLogo/TataAig.jpeg";
import UnitedIndia from "../../../assets/ICLogo/Unitedindia.jpeg";
import UnivSompo from "../../../assets/ICLogo/UnivSompo.png";
import Orient from "../../../assets/ICLogo/OrientalInsur.png";
import { formatString } from "../../../Configration/Utilities/utils";

function PremiumCalculator({ objStateData, objDistrictData, formValuesGI, dcryptUNQEID, dcryptUID }) {
  // A const myRef = useRef(null);
  // A const executeScroll = () => myRef.current.scrollIntoView({ behavior: "smooth" });
  const setAlertMessage = AlertMessage();
  const [logoPath, setlogoPath] = useState();

  const insuranceLogos = [
    { compName: "FUTURE GENERALI INDIA INSURANCE CO. LTD.", complog: FutureGeneraliLogo },
    { compName: "AGRICULTURE INSURANCE COMPANY", complog: Aic },
    { compName: "BAJAJ ALLIANZ GENERAL INSURANCE CO. LTD", complog: BajajAl },
    { compName: "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LIMITED", complog: CholaMS },
    { compName: "HDFC ERGO GENERAL INSURANCE CO. LTD.", complog: HdfcErgo },
    { compName: "ICICI LOMBARD GENERAL INSURANCE CO. LTD.", complog: IciciLom },
    { compName: "IFFCO TOKIO GENERAL INSURANCE CO. LTD.", complog: IfcoTokia },
    { compName: "KSHEMA GENERAL INSURANCE LIMITED", complog: kShema },
    { compName: "NATIONAL INSURANCE COMPANY LIMITED", complog: NationInsur },
    { compName: "NEW INDIA ASSURANCE COMPANY", complog: NewIndia },
    { compName: "RELIANCE GENERAL INSURANCE CO. LTD.", complog: RelGen },
    { compName: "ROYAL SUNDARAM GENERAL INSURANCE CO. LIMITED", complog: RoyalSund },
    { compName: "SBI GENERAL INSURANCE", complog: SbiGen },
    { compName: "TATA AIG GENERAL INSURANCE CO. LTD.", complog: TataAig },
    { compName: "UNITED INDIA INSURANCE CO.", complog: UnitedIndia },
    { compName: "UNIVERSAL SOMPO GENERAL INSURANCE COMPANY", complog: UnivSompo },
    { compName: "ORIENTAL INSURANCE", complog: Orient },
  ].map((item) => ({ ...item, compName: formatString(item.compName) }));

  const getInsuranceLogo = (insuranceCompanyName) => {
    const filterInsuranceLogo = insuranceLogos.filter((data) => {
      return data.compName === insuranceCompanyName;
    });
    return filterInsuranceLogo;
  };

  const [seasonForCalculatorDropdownDataList] = useState([
    { CropSeasonID: 1, CropSeasonName: "Kharif" },
    { CropSeasonID: 2, CropSeasonName: "Rabi" },
  ]);

  const [schemeList] = useState([
    { SchemeID: 2, SchemeName: "Weather Based Crop Insurance Scheme(WBCIS)" },
    { SchemeID: 4, SchemeName: "Pradhan Mantri Fasal Bima Yojna(PMFBY)" },
  ]);

  const [formValuesForCalculator, setFormValuesForCalculator] = useState({
    txtCallerMobileNumber: "",
    txtStateForCalculator: null,
    txtDistrictForCalculator: null,
    txtSeasonForCalculator: null,
    txtYearForCalculator: null,
    txtSchemeForCalculator: null,
    txtCropForCalculator: null,
    txtAreaInHectareForCalculator: "",
  });
  const [formValidationFarmersError, setFormValidationFarmersError] = useState({});

  const validateFarmersFieldCalculator = (name, value) => {
    let errorsMsg = "";

    if (name === "txtCallerMobileNumber") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Mobile Number is required!";
      } else if (value) {
        const isValidIndianMobile = /^[6-9]\d{9}$/.test(value);
        const isAllSameDigit = /^(\d)\1{9}$/.test(value);

        if (!isValidIndianMobile) {
          errorsMsg = "Enter a valid 10-digit mobile number";
        } else if (isAllSameDigit) {
          errorsMsg = "Mobile Number cannot be all the same digit!";
        }
      }
    }

    if (name === "txtStateForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "State is required!";
      }
    }
    if (name === "txtDistrictForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "District is required!";
      }
    }
    if (name === "txtSeasonForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Season is required!";
      }
    }
    if (name === "txtYearForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Year is required!";
      }
    }
    if (name === "txtSchemeForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Scheme is required!";
      }
    }
    if (name === "txtCropForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Crop is required!";
      }
    }
    if (name === "txtAreaInHectareForCalculator") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Area is required!";
      } else if (value) {
        const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
        if (!regex.test(value)) {
          errorsMsg = "Area should be numeric!";
        }
      }
    }

    return errorsMsg;
  };

  const handleFarmersValidationCalculator = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtCallerMobileNumber"] = validateFarmersFieldCalculator("txtCallerMobileNumber", formValuesForCalculator.txtCallerMobileNumber);
      errors["txtStateForCalculator"] = validateFarmersFieldCalculator("txtStateForCalculator", formValuesForCalculator.txtStateForCalculator);
      errors["txtDistrictForCalculator"] = validateFarmersFieldCalculator("txtDistrictForCalculator", formValuesForCalculator.txtDistrictForCalculator);
      errors["txtYearForCalculator"] = validateFarmersFieldCalculator("txtYearForCalculator", formValuesForCalculator.txtYearForCalculator);
      errors["txtSeasonForCalculator"] = validateFarmersFieldCalculator("txtSeasonForCalculator", formValuesForCalculator.txtSeasonForCalculator);
      errors["txtSchemeForCalculator"] = validateFarmersFieldCalculator("txtSchemeForCalculator", formValuesForCalculator.txtSchemeForCalculator);
      errors["txtCropForCalculator"] = validateFarmersFieldCalculator("txtCropForCalculator", formValuesForCalculator.txtCropForCalculator);
      errors["txtAreaInHectareForCalculator"] = validateFarmersFieldCalculator(
        "txtAreaInHectareForCalculator",
        formValuesForCalculator.txtAreaInHectareForCalculator,
      );
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationFarmersError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const [selectedCropData, setSelectedCropData] = useState({});
  const [selectedCropHeader, setSelectedCropHeader] = useState("");
  const [selectedCalculation, setselectedCalculation] = useState({});
  const updateStateForCalculator = (name, value) => {
    setFormValuesForCalculator({ ...formValuesForCalculator, [name]: value });
    formValidationFarmersError[name] = validateFarmersFieldCalculator(name, value);

    if (name === "txtStateForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtStateForCalculator: value,
        txtDistrictForCalculator: null,
        txtCropForCalculator: null,
      });
      setDistrictForCalculatorDropdownDataList([]);
      setCropForCalculatorDropdownDataList([]);
      if (value) {
        getDistrictByStateForCalculatorListData(value.StateCodeAlpha);
      }
    }
    if (name === "txtDistrictForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtDistrictForCalculator: value,
        txtCropForCalculator: null,
      });

      setCropForCalculatorDropdownDataList([]);
      if (
        value &&
        formValuesForCalculator.txtSeasonForCalculator &&
        formValuesForCalculator.txtYearForCalculator &&
        formValuesForCalculator.txtSchemeForCalculator
      ) {
        getCropDataByDistrictData(value.level3ID);
      } else if (
        value &&
        !formValuesForCalculator.txtSeasonForCalculator &&
        !formValuesForCalculator.txtYearForCalculator &&
        !formValuesForCalculator.txtSchemeForCalculator
      ) {
        setAlertMessage({
          type: "warning",
          message: "Select Season, Year And Scheme",
        });
      }
    }
    if (name === "txtSeasonForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtSeasonForCalculator: value,
        txtDistrictForCalculator: null,
        txtCropForCalculator: null,
      });

      setCropForCalculatorDropdownDataList([]);
    }
    if (name === "txtYearForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtYearForCalculator: value,
        txtDistrictForCalculator: null,
        txtCropForCalculator: null,
      });

      setCropForCalculatorDropdownDataList([]);
    }
    if (name === "txtSchemeForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtSchemeForCalculator: value,
        txtDistrictForCalculator: null,
        txtCropForCalculator: null,
      });

      setCropForCalculatorDropdownDataList([]);
    }
    if (name === "txtCropForCalculator") {
      setFormValuesForCalculator({
        ...formValuesForCalculator,
        txtCropForCalculator: value,
      });
      setSelectedCropData({});
      setSelectedCropData(value);
      setSelectedCropHeader("");
      const cropHeader = `${formValuesForCalculator.txtStateForCalculator.StateMasterName} - ${formValuesForCalculator.txtSeasonForCalculator.CropSeasonName} - ${formValuesForCalculator.txtSchemeForCalculator.SchemeName} - ${formValuesForCalculator.txtYearForCalculator.Name}`;
      setSelectedCropHeader(cropHeader);
      if (value) {
        const insCompLogo = getInsuranceLogo(formatString(value.insuranceCompanyName));
        setlogoPath(insCompLogo && insCompLogo.length > 0 ? insCompLogo[0].complog : "");
      } else {
        setlogoPath();
      }
    }
  };
  const [stateForCalculatorDropdownDataList, setStateForCalculatorDropdownDataList] = useState([]);
  const [isLoadingStateForCalculatorDropdownDataList, setIsLoadingStateForCalculatorDropdownDataList] = useState(false);
  const getStateForCalculatorListData = async () => {
    try {
      setIsLoadingStateForCalculatorDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "STATEMAS",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      console.log(result, "State Data");
      setIsLoadingStateForCalculatorDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateForCalculatorDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setStateForCalculatorDropdownDataList([]);
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

  const [districtForCalculatorDropdownDataList, setDistrictForCalculatorDropdownDataList] = useState([]);
  const [isLoadingDistrictForCalculatorDropdownDataList, setIsLoadingDistrictForCalculatorDropdownDataList] = useState(false);
  const getDistrictByStateForCalculatorListData = async (pstateAlphaCode) => {
    try {
      setIsLoadingDistrictForCalculatorDropdownDataList(true);
      const formdata = {
        stateAlphaCode: pstateAlphaCode,
      };
      const result = await getDistrictByState(formdata);
      console.log(result, "District Data");
      setIsLoadingDistrictForCalculatorDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData.data).length === 0) {
            setDistrictForCalculatorDropdownDataList([]);
          } else {
            setDistrictForCalculatorDropdownDataList(result.response.responseData.data.hierarchy.level3);
          }
        } else {
          setDistrictForCalculatorDropdownDataList([]);
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

  const [isLoadingCropForCalculatorDropdownDataList, setIsLoadingCropForCalculatorDropdownDataList] = useState(false);
  const [cropForCalculatorDropdownDataList, setCropForCalculatorDropdownDataList] = useState([]);
  const getCropDataByDistrictData = async (pDistrictID) => {
    try {
      let result = "";
      let formData = "";

      const user = getSessionStorage("user");

      const pschemeID =
        formValuesForCalculator.txtSchemeForCalculator.SchemeID === 2 ? "02" : formValuesForCalculator.txtSchemeForCalculator.SchemeID === 4 ? "04" : "";
      const pseasonID =
        formValuesForCalculator.txtSeasonForCalculator.CropSeasonID === 1
          ? "01"
          : formValuesForCalculator.txtSeasonForCalculator.CropSeasonID === 2
            ? "02"
            : "";
      const pstateID =
        formValuesForCalculator.txtStateForCalculator.StateMasterID.toString().length < 2
          ? `0${formValuesForCalculator.txtStateForCalculator.StateMasterID}`
          : formValuesForCalculator.txtStateForCalculator.StateMasterID;
      const pyearID = formValuesForCalculator.txtYearForCalculator.Value.toString().substr(formValuesForCalculator.txtYearForCalculator.Value.length - 2);
      const psssyID = `${pschemeID}${pseasonID}${pstateID}${pyearID}`;

      formData = {
        disctrictID: pDistrictID,
        sssyID: psssyID,
        mobilenumber: user && user.UserMobileNumber ? user.UserMobileNumber : "7906071897",
      };
      setIsLoadingCropForCalculatorDropdownDataList(true);
      result = await getCropListDistrictWiseDataList(formData);
      setIsLoadingCropForCalculatorDropdownDataList(false);
      console.log(result, "result");
      setCropForCalculatorDropdownDataList([]);
      if (result.response.responseCode === 1) {
        if (result.response.responseData.length > 0) {
          setCropForCalculatorDropdownDataList(result.response.responseData);
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

  const SavevalidateFarmerOnClick = async () => {
    try {
      const formData = {
        CallingMasterID: 0,
        callerMobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        user: dcryptUID,
        callingUniqueID: dcryptUNQEID,
        farmerMobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        farmerName: formValuesGI.txtFarmerName ? formValuesGI.txtFarmerName : "",
        callStatus: formValuesGI.txtCallStatus && formValuesGI.txtCallStatus.Value ? formValuesGI.txtCallStatus.Value : "",
        reason: formValuesGI.txtReason && formValuesGI.txtReason.Value ? formValuesGI.txtReason.Value : "",
        stateCodeAlpha: formValuesGI.txtState && formValuesGI.txtState.StateCodeAlpha ? formValuesGI.txtState.StateCodeAlpha : "",
        districtCodeAlpha: formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3ID ? formValuesGI.txtDistrict.level3ID : "",
        farmerStateName: formValuesGI.txtState && formValuesGI.txtState.StateMasterName ? formValuesGI.txtState.StateMasterName : "",
        farmerDistrictName: formValuesGI.txtDistrict && formValuesGI.txtDistrict.level3Name ? formValuesGI.txtDistrict.level3Name : "",
        callPurpose: formValuesGI.txtCallPurpose && formValuesGI.txtCallPurpose.Value ? formValuesGI.txtCallPurpose.Value : "",
        isRegistered: "P",
      };
      const result = await krphFarmerCallingHistorydata(formData);
      if (result.response.responseCode === 1) {
        console.log("success");
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
        return false;
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
      return false;
    }
  };

  const [btnCalculateState, setbtnCalculateState] = useState(false);
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const SaveCalculatedPremiumData = async (pAreaInhectare, pcalculatedSumInsured) => {
    try {
      const pschemeID =
        formValuesForCalculator.txtSchemeForCalculator.SchemeID === 2 ? "02" : formValuesForCalculator.txtSchemeForCalculator.SchemeID === 4 ? "04" : "";
      const pseasonID =
        formValuesForCalculator.txtSeasonForCalculator.CropSeasonID === 1
          ? "01"
          : formValuesForCalculator.txtSeasonForCalculator.CropSeasonID === 2
            ? "02"
            : "";
      const pstateID =
        formValuesForCalculator.txtStateForCalculator.StateMasterID.toString().length < 2
          ? `0${formValuesForCalculator.txtStateForCalculator.StateMasterID}`
          : formValuesForCalculator.txtStateForCalculator.StateMasterID;
      const pyearID = formValuesForCalculator.txtYearForCalculator.Value.toString().substr(formValuesForCalculator.txtYearForCalculator.Value.length - 2);
      const psssyID = `${pschemeID}${pseasonID}${pstateID}${pyearID}`;
      const formdata = {
        mobileNumber: formValuesGI.txtMobileCallerNumber ? formValuesGI.txtMobileCallerNumber : "",
        districtID: formValuesForCalculator.txtDistrictForCalculator.level3ID ? formValuesForCalculator.txtDistrictForCalculator.level3ID : "",
        stateMasterID: formValuesForCalculator.txtStateForCalculator.StateCodeAlpha ? formValuesForCalculator.txtStateForCalculator.StateCodeAlpha : "",
        year:
          formValuesForCalculator.txtYearForCalculator && formValuesForCalculator.txtYearForCalculator.Value
            ? formValuesForCalculator.txtYearForCalculator.Value
            : 0,
        cropSeasonID:
          formValuesForCalculator.txtSeasonForCalculator && formValuesForCalculator.txtSeasonForCalculator.CropSeasonID
            ? formValuesForCalculator.txtSeasonForCalculator.CropSeasonID
            : 0,
        cropName: selectedCropData.cropName,
        schemeID:
          formValuesForCalculator.txtSchemeForCalculator && formValuesForCalculator.txtSchemeForCalculator.SchemeID
            ? formValuesForCalculator.txtSchemeForCalculator.SchemeID
            : 0,
        selectedCropID: selectedCropData.cropID,
        sSSYID: psssyID,
        insuranceCompanyCode: Number(selectedCropData.insuranceCompanyCode),
        area: pAreaInhectare,
        calculatedPremium: pcalculatedSumInsured,
        description: "",
      };
      const result = await AddCalculatedPremiumData(formdata);
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        setbtnCalculateState(true);
        SavevalidateFarmerOnClick();
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setBtnLoaderActive(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getCalculatorDataOnClick = () => {
    if (!handleFarmersValidationCalculator()) {
      return;
    }
    setBtnLoaderActive(true);
    const calculatedSumInsured = parseFloat(formValuesForCalculator.txtAreaInHectareForCalculator) * parseFloat(selectedCropData.sumInsured);
    const actualRate = parseFloat(selectedCropData.goiShare) + parseFloat(selectedCropData.stateShare);
    const acturialRate = parseFloat(selectedCropData.farmerShare) + parseFloat(selectedCropData.goiShare) + parseFloat(selectedCropData.stateShare);
    const preminumpaidbyfarmer = (parseFloat(calculatedSumInsured) * parseFloat(selectedCropData.farmerShare)) / 100;
    const preminumpaidbygovt = (parseFloat(calculatedSumInsured) * parseFloat(actualRate)) / 100;
    setselectedCalculation({
      CalculatedSumInsured: parseFloat(calculatedSumInsured).toFixed(2),
      ActurialRate: acturialRate,
      Preminumpaidbyfarmer: parseFloat(preminumpaidbyfarmer).toFixed(2),
      Preminumpaidbygovt: parseFloat(preminumpaidbygovt).toFixed(2),
      AreaInhectare: formValuesForCalculator.txtAreaInHectareForCalculator,
    });
    // A setTimeout(() => executeScroll(), 0);
    setTimeout(() => {
      SaveCalculatedPremiumData(formValuesForCalculator.txtAreaInHectareForCalculator, calculatedSumInsured);
    }, 500);
  };

  const clearFormOnClick = () => {
    setFormValuesForCalculator({
      ...formValuesForCalculator,
      txtCallerMobileNumber: "",
      txtStateForCalculator: null,
      txtDistrictForCalculator: null,
      txtSeasonForCalculator: null,
      txtYearForCalculator: null,
      txtSchemeForCalculator: null,
      txtCropForCalculator: null,
      txtAreaInHectareForCalculator: "",
    });
    setFormValidationFarmersError({});
    setselectedCalculation({});
    setSelectedCropData({});
    setDistrictForCalculatorDropdownDataList([]);
    setCropForCalculatorDropdownDataList([]);
    setbtnCalculateState(false);
    setlogoPath();
  };

  const [yearList, setYearList] = useState([]);
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let i = 2018; i <= currentYear; i += 1) {
      yearArray.push({ Name: i.toString(), Value: i.toString() });
    }

    setYearList(yearArray.sort().reverse());
    getStateForCalculatorListData();
  }, []);

  return (
    <div style={{ padding: "2px" }}>
      <div
        style={{
          backgroundColor: "#075307",
          color: "white",
          textAlign: "center",
          padding: "4px",
          fontSize: "20px",
          borderRadius: "10px",
        }}
      >
        INSURANCE PREMIUM CALCULATOR
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <div style={{ width: "65%" }}>
          <form>
            <div style={{ display: "flex", gap: "20px" }}>
              <div className="col-md-6">
                <div className="form-group" style={{ width: "320px" }}>
                  <label>
                    Caller Mobile No. <span className="asteriskCss">&#42;</span>
                  </label>
                  <InputGroup>
                    <InputControl
                      Input_type="input"
                      name="txtCallerMobileNumber"
                      value={formValuesForCalculator.txtCallerMobileNumber}
                      maxlength="10"
                      minlength="10"
                      onChange={(e) => updateStateForCalculator("txtCallerMobileNumber", e.target.value.replace(/\D/g, ""))}
                      autoComplete="off"
                    />
                  </InputGroup>
                  <span className="login_ErrorTxt">{formValidationFarmersError["txtCallerMobileNumber"]}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group" style={{ width: "320px" }}>
                  <label>
                    Season <span className="asteriskCss">&#42;</span>
                  </label>
                  <InputGroup>
                    <InputControl
                      Input_type="select"
                      name="txtSeasonForCalculator"
                      getOptionLabel={(option) => `${option.CropSeasonName}`}
                      value={formValuesForCalculator.txtSeasonForCalculator}
                      getOptionValue={(option) => `${option}`}
                      options={seasonForCalculatorDropdownDataList}
                      onChange={(e) => updateStateForCalculator("txtSeasonForCalculator", e)}
                      ControlTxt="Season"
                      focus="true"
                    />
                  </InputGroup>
                  <span className="login_ErrorTxt">{formValidationFarmersError["txtSeasonForCalculator"]}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <div className="col-md-6">
                <div className="form-group" style={{ width: "320px" }}>
                  <label>
                    Year <span className="asteriskCss">&#42;</span>
                  </label>
                  <InputGroup>
                    <InputControl
                      Input_type="select"
                      name="txtYearForCalculator"
                      getOptionLabel={(option) => `${option.Name}`}
                      value={formValuesForCalculator.txtYearForCalculator}
                      getOptionValue={(option) => `${option}`}
                      options={yearList}
                      onChange={(e) => updateStateForCalculator("txtYearForCalculator", e)}
                      ControlTxt="Year"
                    />
                  </InputGroup>
                  <span className="login_ErrorTxt">{formValidationFarmersError["txtYearForCalculator"]}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group" style={{ width: "320px" }}>
                  <label>
                    Scheme <span className="asteriskCss">&#42;</span>
                  </label>
                  <InputGroup>
                    <InputControl
                      Input_type="select"
                      name="txtSchemeForCalculator"
                      getOptionLabel={(option) => `${option.SchemeName}`}
                      value={formValuesForCalculator.txtSchemeForCalculator}
                      getOptionValue={(option) => `${option}`}
                      options={schemeList}
                      onChange={(e) => updateStateForCalculator("txtSchemeForCalculator", e)}
                      ControlTxt="Scheme"
                      focus="true"
                    />
                  </InputGroup>
                  <span className="login_ErrorTxt">{formValidationFarmersError["txtSchemeForCalculator"]}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <div className="col-md-6">
                <div className="form-group" style={{ width: "320px" }}>
                  <label>
                    State <span className="asteriskCss">&#42;</span>
                  </label>
                  <InputGroup>
                    <InputControl
                      Input_type="select"
                      name="txtStateForCalculator"
                      isLoading={isLoadingStateForCalculatorDropdownDataList}
                      getOptionLabel={(option) => `${option.StateMasterName}`}
                      value={formValuesForCalculator.txtStateForCalculator}
                      getOptionValue={(option) => `${option}`}
                      options={stateForCalculatorDropdownDataList}
                      ControlTxt="State"
                      onChange={(e) => updateStateForCalculator("txtStateForCalculator", e)}
                    />
                  </InputGroup>
                  <span className="login_ErrorTxt">{formValidationFarmersError["txtStateForCalculator"]}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group" style={{ width: "320px" }}>
                  <label>
                    District <span className="asteriskCss">&#42;</span>
                  </label>
                  <InputGroup>
                    <InputControl
                      Input_type="select"
                      name="txtDistrictForCalculator"
                      isLoading={isLoadingDistrictForCalculatorDropdownDataList}
                      getOptionLabel={(option) => `${option.level3Name}`}
                      value={formValuesForCalculator.txtDistrictForCalculator}
                      getOptionValue={(option) => `${option}`}
                      options={districtForCalculatorDropdownDataList}
                      ControlTxt="District"
                      onChange={(e) => updateStateForCalculator("txtDistrictForCalculator", e)}
                    />
                  </InputGroup>
                  <span className="login_ErrorTxt">{formValidationFarmersError["txtDistrictForCalculator"]}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <div className="col-md-6">
                <div className="form-group" style={{ width: "320px" }}>
                  <label>
                    Crop <span className="asteriskCss">&#42;</span>
                  </label>
                  <InputGroup>
                    <InputControl
                      Input_type="select"
                      name="txtCropForCalculator"
                      isLoading={isLoadingCropForCalculatorDropdownDataList}
                      getOptionLabel={(option) => `${option.cropName}`}
                      value={formValuesForCalculator.txtCropForCalculator}
                      getOptionValue={(option) => `${option}`}
                      options={cropForCalculatorDropdownDataList}
                      ControlTxt="Crop"
                      onChange={(e) => updateStateForCalculator("txtCropForCalculator", e)}
                    />
                  </InputGroup>
                  <span className="login_ErrorTxt">{formValidationFarmersError["txtCropForCalculator"]}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group" style={{ width: "320px" }}>
                  <label>
                    Area in Hectare <span className="asteriskCss">&#42;</span>
                  </label>
                  <InputGroup>
                    <InputControl
                      Input_type="input"
                      name="txtAreaInHectareForCalculator"
                      value={formValuesForCalculator.txtAreaInHectareForCalculator}
                      maxlength="3"
                      minlength="3"
                      onChange={(e) => updateStateForCalculator("txtAreaInHectareForCalculator", e.target.value)}
                      autoComplete="off"
                    />
                  </InputGroup>
                  <span className="login_ErrorTxt">{formValidationFarmersError["txtAreaInHectareForCalculator"]}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <KrphButton type="button" varient="primary" trigger={btnLoaderActive && "true"} onClick={() => getCalculatorDataOnClick()}>
                Calculate
              </KrphButton>
              <button
                type="button"
                style={{
                  backgroundColor: "white",
                  color: "red",
                  border: "1px solid #DC2626",
                  borderRadius: "15px",
                  padding: "10px 35px",
                  fontSize: "14px",
                }}
                onClick={() => clearFormOnClick()}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div
          style={{
            height: "100%",
            width: "30%",
            borderTop: "10px solid #16A34A",
            borderRight: "2px solid #16A34A",
            borderBottom: "2px solid #16A34A",
            borderLeft: "2px solid #16A34A",
            borderRadius: "20px 20px 10px 10px",
            padding: "15px 0 100px 0px",
            // AbackgroundColor: "#f9f9f9",
          }}
        >
          <div style={{ marginLeft: "7px" }}>
            <div
              style={{
                flexDirection: "column",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                border: "1px solid #000000",
                borderRadius: "40px",
                boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                padding: "16px 16px 16px 20px",
                width: "98%",
              }}
            >
              <img
                src={logoPath}
                style={{
                  width: "40%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
              <span style={{ padding: "8px", fontWeight: "bold" }}>
                {selectedCropData && selectedCropData.insuranceCompanyName ? selectedCropData.insuranceCompanyName : "Insurance Company"}
              </span>
            </div>
          </div>
          <h1
            style={{
              color: "#16A34A",
              textAlign: "center",
              fontSize: "32px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            {selectedCalculation && selectedCalculation.Preminumpaidbyfarmer ? `₹ ${selectedCalculation.Preminumpaidbyfarmer}` : "₹ 0"}
          </h1>
          <>
            {" "}
            <p
              style={{
                textAlign: "center",
                margin: 0,
                fontWeight: "bold",
                fontSize: "16px",
                textDecoration: "underline",
              }}
            >
              Estimated Premium{" "}
            </p>
          </>{" "}
          <p
            style={{
              textAlign: "center",
            }}
          ></p>
          <table
            style={{
              width: "100%",
              marginTop: "15px",
              borderSpacing: "0",
              fontSize: "14px",
              padding: "0 0 100px 0",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                {/* <td style={{ padding: "8px" }}>Insurance Company</td> */}
                {/* <td style={{ padding: "8px" }}>
                               {selectedCropData && selectedCropData.insuranceCompanyName
                                 ? selectedCropData.insuranceCompanyName
                                 : "................................"}
                             </td> */}
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>Sum Insured(Rs)/Hectare</td>
                <td style={{ padding: "8px" }}>{selectedCropData && selectedCropData.sumInsured ? selectedCropData.sumInsured : "0"}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>Farmer Share(%)</td>
                <td style={{ padding: "8px" }}>{selectedCropData && selectedCropData.farmerShare ? selectedCropData.farmerShare : "0"}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>Actuarial Rate(%)</td>
                <td style={{ padding: "8px" }}>{selectedCalculation && selectedCalculation.ActurialRate ? selectedCalculation.ActurialRate : "0"}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>Cut Off Date</td>
                <td style={{ padding: "8px" }}>
                  {selectedCropData && selectedCropData.cutOfDate
                    ? dateFormatDDMMYY(selectedCropData.cutOfDate.split("T")[0])
                    : "................................"}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>Crop</td>
                <td style={{ padding: "8px" }}>
                  {selectedCropData && selectedCropData.cropName ? selectedCropData.cropName : "................................"}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>Area(Hectare)</td>
                <td style={{ padding: "8px" }}>{selectedCalculation && selectedCalculation.AreaInhectare ? selectedCalculation.AreaInhectare : "0"}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>Premium Paid By Govt(Rs)</td>
                <td style={{ padding: "8px" }}>
                  {selectedCalculation && selectedCalculation.Preminumpaidbygovt ? selectedCalculation.Preminumpaidbygovt : "0"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px" }}>Sum Insured(Rs)</td>
                <td style={{ padding: "8px" }}>
                  {selectedCalculation && selectedCalculation.CalculatedSumInsured ? selectedCalculation.CalculatedSumInsured : "0"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PremiumCalculator;
