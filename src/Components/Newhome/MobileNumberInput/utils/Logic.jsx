import { useState, useEffect } from "react";
import { smsotpsend, verifyOtp } from "Components/Common/Login/ForgotPasswordModal/Servcie/Methods";
import publicIp from "public-ip";
import { sha256 } from "crypto-hash";
import bcrypt from "bcryptjs";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useNavigate } from "react-router-dom";
import { setSessionStorage, encryptStringData, decryptStringData } from "../../../../Components/Common/Login/Auth/auth";
import {
  authenticate,
  authenticateDiffUsersLogin,
  authenticatefarmerLogin,
  authenticateUserIDForCallingSolution,
  authenticateIntial,
} from "../../../../Components/Common/Login/Services/Methods";
import { generateCaptcha } from "./capthcaUtils";
function AddLoginLogics() {
  const setAlertMessage = AlertMessage();
  const pathUrl = window.location.href;
  const [showHideLogin, setShowHideLogin] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [activeTabfarmer, setActiveTabfarmer] = useState(0);
  const [farmertab, setFarmertab] = useState(0);
  const [toggleChange, setToggleChange] = useState(false);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    txtLoginId: "",
    txtPassword: "",
    txtCaptchaVal: "",
  });

  const [formValuesNcip, setformValuesNcip] = useState({
    txtmobileno: "",
    txtPasswordNcip: "",
    txtCaptchaValNcip: "",
  });

  const [formValuesfarmer, setformValuesfarmer] = useState({
    txtmobilenofarmer: "",
    txtCaptchaValfarmer: "",
  });

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const updateStatefarmer = (name, value) => {
    setformValuesfarmer({ ...formValuesfarmer, [name]: value });
  };

  const [captchaCode, setCaptchaCode] = useState("");

  const updateStateNcip = (name, value) => {
    setformValuesNcip({ ...formValuesNcip, [name]: value });
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const [btnLoaderActiveNcip, setBtnLoaderActiveNcip] = useState(false);

  const handleLogin = async (formValues, enteredCaptcha, captchaCode, setCaptchaCode, setAlertMessage) => {
    
    if (formValues.txtLoginId === "") {
      setAlertMessage({
        type: "error",
        message: "User Name is required!",
      });
      setCaptchaCode(generateCaptcha());

      return;
    } else if (formValues.txtPassword === "") {
      setAlertMessage({
        type: "error",
        message: "Password is required!",
      });
      setCaptchaCode(generateCaptcha());

      return;
    } else if (enteredCaptcha.trim() === "") {
      setAlertMessage({
        type: "error",
        message: "Empty CAPTCHA",
      });
      setCaptchaCode(generateCaptcha());
      return;
    } else if (enteredCaptcha !== captchaCode) {
      setAlertMessage({
        type: "error",
        message: "Incorrect CAPTCHA, please try again.",
      });
      setCaptchaCode(generateCaptcha());
      return;
    }
    try {
      // A const encryptUserName = encryptStringData(formValues.txtLoginId || "");
      // A const hashPass = await sha256(formValues.txtPassword || "");
      // A setBtnLoaderActive(true);

      // A const result = await authenticate(encryptUserName, hashPass);
      // A setBtnLoaderActive(false);

      // A if (result.responseCode === 1) {
      // A  if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
      // A    setAlertMessage({
      // A      type: "error",
      // A      message: "Token is missing in the response",
      // A    });
      // A    setCaptchaCode(generateCaptcha());
      // A    return;
      // A  }

      // A  const user = { ...result.responseData };
      // A  setSessionStorage("user", user);
      // A  navigate("/welcome");
      // A } else {
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: result.responseMessage,
      // A  });
      // A  setBtnLoaderActive(false);
      // A  setCaptchaCode(generateCaptcha());
      // }
      debugger;
      const encryptUserName = encryptStringData(formValues.txtLoginId ? formValues.txtLoginId : "");
      const hashPass = await sha256(formValues.txtPassword ? formValues.txtPassword : "");
      setBtnLoaderActive(true);
      const resultSaltVal = await authenticateIntial(encryptUserName);
      if (resultSaltVal.responseCode === 1) {
        const salValue = resultSaltVal.responseData;
        const conctSaltAndHashPass = `${hashPass}_${salValue}`;
        const salt = await bcrypt.genSalt(10);
        const bcryptSaltSaltAndHashPass = await bcrypt.hash(conctSaltAndHashPass, salt);
        const result = await authenticate(encryptUserName, bcryptSaltSaltAndHashPass);
        setBtnLoaderActive(false);
        if (result.responseCode === 1) {
          if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
            setCaptchaCode(generateCaptcha());
            setAlertMessage({
              type: "error",
              message: "Token is missing in the response",
            });
            return;
          }
          const user = {
            ...result.responseData,
          };
          setSessionStorage("user", user);
          navigate("/welcome");
        } else {
         setCaptchaCode(generateCaptcha());
          setAlertMessage({
            type: "error",
            message: result.responseMessage,
          });
        }
      } else {
        setBtnLoaderActive(false);
        setCaptchaCode(generateCaptcha());
        setAlertMessage({
          type: "error",
          message: resultSaltVal.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "An error occurred. Please try again.",
      });
      setCaptchaCode(generateCaptcha());
    }
  };

  const handleLoginNcip = async (formValuesNcip, enteredCaptcha, captchaCode, setCaptchaCode, setAlertMessage) => {
    
    try {
      if (formValuesNcip.txtmobileno === "") {
        setAlertMessage({
          type: "error",
          message: "Mobile Number is required!",
        });
        setCaptchaCode(generateCaptcha());

        return;
      }
      if (formValuesNcip.txtmobileno.length < 10) {
        setAlertMessage({
          type: "error",
          message: "Please enter 10 digit Mobile Number!",
        });
        setCaptchaCode(generateCaptcha());

        return;
      }
      if (formValuesNcip.txtPasswordNcip === "") {
        setAlertMessage({
          type: "error",
          message: "Password is required!",
        });
        setCaptchaCode(generateCaptcha());

        return;
      }
      if (enteredCaptcha.trim() === "") {
        setAlertMessage({
          type: "error",
          message: "Empty CAPTCHA",
        });
        setCaptchaCode(generateCaptcha());
        return;
      } else if (enteredCaptcha !== captchaCode) {
        setAlertMessage({
          type: "error",
          message: "Incorrect CAPTCHA, please try again.",
        });
        setCaptchaCode(generateCaptcha());
        return;
      }

      const userName = formValuesNcip.txtmobileno ? formValuesNcip.txtmobileno : "";
      const encryptPassword = encryptStringData(formValuesNcip.txtPasswordNcip ? formValuesNcip.txtPasswordNcip : "");
      setBtnLoaderActiveNcip(true);
      const result = await authenticateDiffUsersLogin(userName, encryptPassword);
      setBtnLoaderActiveNcip(false);
      console.log(result, "result");
      if (result.responseCode === 1) {
        if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
          setAlertMessage({
            type: "error",
            message: "Token is missing in the response",
          });
          return;
        }
        const user = {
          ...result.responseData,
        };
        setSessionStorage("user", user);
        navigate("/welcome");
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
        setCaptchaCode(generateCaptcha());
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
      setCaptchaCode(generateCaptcha());
    }
  };

  const SearchByHandleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  const SearchByHandleKeyDownNclip = (e) => {
    if (e.key === "Enter") {
      handleLoginNcip();
    }
  };

  const [captchaCodefarmer, setCaptchaCodefarmer] = useState("");
  const createCaptchafarmer = () => {
    if (farmertab != 0) {
      // A clear the contents of captcha div first
      document.getElementById("captchafarmer").innerHTML = "";
      const charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
      const lengthOtp = 6;
      const captcha = [];
      for (let i = 0; i < lengthOtp; i += 1) {
        // A below code will not allow Repetition of Characters
        const index = Math.floor(Math.random() * charsArray.length + 1); // A get the next character from the array
        if (captcha.indexOf(charsArray[index]) === -1) captcha.push(charsArray[index]);
        else i -= 1;
      }
      const canv = document.createElement("canvas");
      canv.id = "captchafarmer";
      canv.width = 140;
      canv.height = 38;
      const ctx = canv.getContext("2d");
      ctx.font = "20px Georgia";
      ctx.strokeText(captcha.join(""), 0, 30);
      // A storing captcha so that can validate you can save it somewhere else according to your specific requirements
      const code = captcha.join("");
      setCaptchaCodefarmer(code);
      document.getElementById("captchafarmer").appendChild(canv); // A adds the canvas to the body element
    }
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
    if (tabIndex === 0) {
      setFormValues({
        ...formValues,
        txtLoginId: "",
        txtPassword: "",
        txtCaptchaVal: "",
      });
    } else {
      setformValuesNcip({
        ...formValuesNcip,
        txtmobileno: "",
        txtPasswordNcip: "",
        txtCaptchaValNcip: "",
      });
    }
  };
  const handleTabClickfarmer = (tabIndex) => {
    console.log(tabIndex);
    setFarmertab(tabIndex);
    if (tabIndex === 0) {
    } else {
      setTimeout(() => {
        createCaptchafarmer();
      }, 500);
    }
  };

  const handleTabFarmerClick = (tabIndex) => {
    setActiveTabfarmer(tabIndex);
    if (tabIndex === 0) {
      setFormValues({
        ...formValues,
        txtLoginId: "",
        txtPassword: "",
        txtCaptchaVal: "",
      });
      setformValuesNcip({
        ...formValuesNcip,
        txtmobileno: "",
        txtPasswordNcip: "",
        txtCaptchaValNcip: "",
      });
      setActiveTab(0);
      setToggleChange(false);
      // C navigate("/");
      // A setTimeout(() => {
      // A  createCaptcha();
      // A}, 1000);
    } else {
      setformValuesfarmer({
        ...formValuesfarmer,
        txtmobilenfarmer: "",
        txtCaptchaValfarmer: "",
      });
      setTimeout(() => {
        createCaptchafarmer();
      }, 500);
      setActiveTab(2);
    }
  };

  const [btnLoaderActivefarmer, setBtnLoaderActivefarmer] = useState(false);
  const handleLoginfarmer = async (captchaCodefarmer) => {
    if (formValuesfarmer.txtmobilenofarmer === "") {
      setAlertMessage({
        type: "error",
        message: "Mobile Number is required!",
      });
      return;
    }
    if (formValuesfarmer.txtmobilenofarmer.length < 10) {
      setAlertMessage({
        type: "error",
        message: "Please enter 10 digit Mobile Number!",
      });
      return;
    }
    if (formValuesfarmer.txtCaptchaValfarmer === "") {
      setAlertMessage({
        type: "error",
        message: "Captcha is required!",
      });
      return;
    }
    if (formValuesfarmer.txtCaptchaValfarmer !== captchaCodefarmer) {
      setAlertMessage({
        type: "error",
        message: "Captcha did not match...",
      });
      return;
    }
    const userName = formValuesfarmer.txtmobilenofarmer ? formValuesfarmer.txtmobilenofarmer : "";
    setBtnLoaderActivefarmer(true);
    const result = await authenticatefarmerLogin(userName);
    setBtnLoaderActivefarmer(false);
    console.log(result, "result");
    if (result.responseCode === 1) {
      if (!(result.responseData.token && result.responseData.token.expirationTime)) {
        createCaptchafarmer();
        setAlertMessage({
          type: "error",
          message: "Token is missing in the response",
        });
        return;
      }
      const user = {
        ...result.responseData,
      };
      setSessionStorage("user", user);
      navigate("/welcome");
    } else {
      createCaptchafarmer();
      setAlertMessage({
        type: "error",
        message: result.responseMessage,
      });
    }
  };

  const callKrphAllActivityPage = async () => {
    try {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      // A console.log(encryptStringData(params && params.userName ? params.userName : "uN"));
      // A console.log(encryptStringData(params && params.userID ? params.userID : "uID"));
      // A console.log(encryptStringData(params && params.mobileNumber ? params.mobileNumber : "uMO"));
      // A console.log(encryptStringData(params && params.uniqueID ? params.uniqueID : "UNQEID"));

      // A const encptUN = decryptStringData(params && params.userName ? params.userName : "uN");
      const encptUID = decryptStringData(params && params.userID ? params.userID : "uID");
      const encptUMBLENO = decryptStringData(params && params.mobileNumber ? params.mobileNumber : "uMO");
      // A const encptUNQEID = decryptStringData(params && params.uniqueID ? params.uniqueID : "UNQEID");
      setIsLoadingPage(true);
      const result = await authenticateUserIDForCallingSolution(encptUMBLENO, encptUID);
      setIsLoadingPage(false);
      // A const user = {
      // A  AppAccessTypeID: 472,
      // A  AppAccessUID: "CCE_Admin",
      // A  BRHeadTypeID: 124001,
      // A  CompanyName: "CSC",
      // A  LoginID: 3,
      // A  SessionID: 1758,
      // A  rcode: 1,
      // A  rmessage: "SUCCESS",
      // A  token: {
      // A    Token:
      // A      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIyMDI0LTExLTIwVDE5OjA5OjM5Ljk5M1oiLCJpYXQiOjE3MzIwOTM3NzkuOTkzLCJpZCI6MywidXNlcm5hbWUiOiJDQ0VfQWRtaW4ifQ.GIGeIZlbNwHm6W1xoWRwTKaC8p0aI3bDqjDQbsqNcgQ",
      // A    expirationTime: 1732095653.586,
      // A    validFrom: "2024-11-26T10:40:53.587Z",
      // A    validTo: "2024-11-26T22:40:53.586Z",
      // A  },
      // A};
      // AsetSessionStorage("user", user);
      // A navigate("/KrphAllActivities");
      if (result.responseCode === 1) {
        if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
          setAlertMessage({
            type: "error",
            message: "Token is missing in the response",
          });
          return;
        }
        const user = {
          ...result.responseData,
        };
        setSessionStorage("user", user);
        // A navigate("/KrphAllActivities");
        navigate("/KrphAllActivitiesND");
      } else if (result.responseCode === 0) {
        setAlertMessage({
          type: "error",
          message: "User Name does not exist.",
        });
        setIsLoadingPage(false);
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    if (pathUrl.indexOf("uniqueID") !== -1 && pathUrl.indexOf("userID") !== -1 && pathUrl.indexOf("mobileNumber") !== -1) {
      setShowHideLogin(false);
      callKrphAllActivityPage();
    } else {
      setShowHideLogin(true);
      // A setTimeout(() => {
      //  A createCaptcha();
      // A }, 500);
    }
    // A createCaptcha();
  }, []);

  const [value, setValue] = useState("");

  const [isdisabled, setDisabled] = useState(false);
  const [isComplaintStatusDisabled, setComplaintStatusDisabled] = useState(false);
  const [mobileNum, setMobileNum] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  useEffect(() => {
    if (otpFieldVisible) {
      setOtp("");
      setEnteredCaptcha("");
    }
    setCaptchaCode(generateCaptcha());
  }, [otpFieldVisible]);

  const handleMobileInputSubmission = async () => {
    

    try {
      if (!mobileNum.trim()) {
        setAlertMessage({ type: "error", message: "Please enter mobile number" });
        setCaptchaCode(generateCaptcha());
        return;
      }

      if (mobileNum.length !== 10) {
        setAlertMessage({ type: "error", message: "Please enter a 10-digit mobile number" });
        setCaptchaCode(generateCaptcha());
        return;
      }

      if (!enteredCaptcha.trim()) {
        setAlertMessage({ type: "error", message: "Please enter CAPTCHA" });
        setCaptchaCode(generateCaptcha());
        return;
      }

      if (enteredCaptcha !== captchaCode) {
        setAlertMessage({ type: "error", message: "Incorrect CAPTCHA, please try again." });
        setCaptchaCode(generateCaptcha());
        return;
      }

      const ip = await publicIp.v4();

      const result = await smsotpsend(mobileNum, ip);

      if (result.data.responseCode === "1") {
        setAlertMessage({ type: "success", message: "OTP sent successfully" });
        handleOtpSent();
        setOtpFieldVisible(true);
        setIsButtonVisible(false);
      } else {
        setAlertMessage({ type: "error", message: result.data.responseMessage });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({ type: "error", message: "An error occurred while sending OTP. Please try again." });
    }

    // Reset CAPTCHA in all cases
    setCaptchaCode(generateCaptcha());
  };

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit5 = async (value) => {
    if (value === "ComplaintStatus") {
      navigate("/complaint-status", { state: { mobileNum } });
    } else if (value === "CropLossIntimation") {
      navigate("/croploss", { state: { mobileNum } });
    } else {
      setAlertMessage({
        type: "error",
        message: "Select module",
      });
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    try {
      if (!otpFieldVisible) {
        setAlertMessage({
          type: "error",
          message: "Please validate your mobile number first.",
        });
        setCaptchaCode(generateCaptcha());

        return;
      }

      const ip = await publicIp.v4();
      const result = await smsotpsend(mobileNum, ip);

      if (result.data.responseCode === "1") {
        setAlertMessage({
          type: "success",
          message: "OTP resent successfully",
        });
        setCaptchaCode(generateCaptcha());
      } else {
        setAlertMessage({
          type: "error",
          message: result.data.responseMessage || "Failed to resend OTP",
        });
        setCaptchaCode(generateCaptcha());
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setAlertMessage({
        type: "error",
        message: "An error occurred while resending OTP. Please try again.",
      });
      setCaptchaCode(generateCaptcha());
    }
  };

  const handleOtpSubmit = async (e) => {
    
    e.preventDefault();
    if (otp.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Please enter the OTP.",
      });
      setCaptchaCode(generateCaptcha());

      return;
    } else if (otp[0].trim().length === 0) {
      setAlertMessage({
        type: "error",
        message: "OTP cannot be only spaces!",
      });
      setCaptchaCode(generateCaptcha());

      return;
    }

    if (enteredCaptcha !== captchaCode) {
      setAlertMessage({
        type: "error",
        message: "Incorrect CAPTCHA, please try again.",
      });
      setCaptchaCode(generateCaptcha());
      return;
    }

    const enteredOtp = otp;
    try {
      const ip = await publicIp.v4();
      const verifyResult = await verifyOtp(mobileNum, enteredOtp, ip);

      if (verifyResult.responseCode == 1 || verifyResult.responseCode === "1") {
        const { responseData } = verifyResult;

        if (!(responseData.token && responseData.token.expirationTime)) {
          setAlertMessage({
            type: "error",
            message: "Enter the correct OTP.",
          });
          setCaptchaCode(generateCaptcha());
          return;
        }

        const user = { ...responseData };
        setSessionStorage("user", user);
        setAlertMessage({
          type: "success",
          message: "Mobile number is registered.",
        });
        if (getSessionStorage("Links") === "CLI") {
          setValue("CropLossIntimation");
          setComplaintStatusDisabled(true);
          setCropLossDisabled(true);
        } else if (getSessionStorage("Links") === "CS") {
          setValue("ComplaintStatus");
          setComplaintStatusDisabled(true);
          setCropLossDisabled(true);
        }
        setCaptchaCode(generateCaptcha());
        setOtp("");
        setEnteredCaptcha("");
        setOtpFieldVisible(false);
        setIsVerificationComplete(true);
      } else {
        console.error("Unexpected responseCode:", verifyResult.responseCode);
        setAlertMessage({
          type: "error",
          message: "This number is not registered. Kindly contact the admin.",
        });
        setCaptchaCode(generateCaptcha());
      }
    } catch (error) {
      console.error("Error verifying mobile number:", error);
      setAlertMessage({
        type: "error",
        message: error?.message || "An error occurred. Please try again.",
      });
    }
  };

  const handleCaptchaChange = (e) => {
    setEnteredCaptcha(e.target.value);
  };

  return {
    handleCaptchaChange,
    handleMobileInputSubmission,
    refreshCaptcha,
    handleChange,
    handleSubmit5,
    handleResendOtp,
    handleOtpSubmit,
    isButtonVisible,
    setIsButtonVisible,
    otpFieldVisible,
    setOtpFieldVisible,
    enteredCaptcha,
    setEnteredCaptcha,
    isVerificationComplete,
    setIsVerificationComplete,
    otp,
    setOtp,
    mobileNum,
    setMobileNum,
    isComplaintStatusDisabled,
    setComplaintStatusDisabled,
    isdisabled,
    setDisabled,
    value,
    setValue,

    formValues,
    updateState,
    handleLogin,
    SearchByHandleKeyDown,
    formValuesNcip,
    updateStateNcip,
    handleLoginNcip,
    SearchByHandleKeyDownNclip,
    activeTab,
    handleTabClick,
    handleTabClickfarmer,
    btnLoaderActive,
    btnLoaderActiveNcip,
    handleTabFarmerClick,
    formValuesfarmer,
    updateStatefarmer,
    handleLoginfarmer,
    captchaCodefarmer,
    createCaptchafarmer,
    activeTabfarmer,
    farmertab,
    setFarmertab,
    btnLoaderActivefarmer,
    showHideLogin,
    isLoadingPage,
    setCaptchaCode,
    captchaCode,
    toggleChange,
    setToggleChange,
  };
}

export default AddLoginLogics;
