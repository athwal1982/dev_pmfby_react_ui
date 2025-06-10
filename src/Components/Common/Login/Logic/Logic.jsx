import { useState, useEffect } from "react";
import { sha256 } from "crypto-hash";
// A import bcrypt from "bcryptjs";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useNavigate } from "react-router-dom";
import { setSessionStorage, encryptStringData, decryptStringData } from "../Auth/auth";
import { authenticate, authenticateDiffUsersLogin, authenticatefarmerLogin, authenticateUserIDForCallingSolution } from "../Services/Methods";

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
  const createCaptcha = () => {
    // A clear the contents of captcha div first
    document.getElementById("captcha").innerHTML = "";
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
    canv.id = "captcha";
    canv.width = 140;
    canv.height = 38;
    const ctx = canv.getContext("2d");
    ctx.font = "20px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    // A storing captcha so that can validate you can save it somewhere else according to your specific requirements
    const code = captcha.join("");
    setCaptchaCode(code);
    document.getElementById("captcha").appendChild(canv); // A adds the canvas to the body element
  };

  const updateStateNcip = (name, value) => {
    setformValuesNcip({ ...formValuesNcip, [name]: value });
  };

  const [captchaCodeNcip, setCaptchaCodeNcip] = useState("");
  const createCaptchaNcip = () => {
    // A clear the contents of captcha div first
    document.getElementById("captchaNcip").innerHTML = "";
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
    canv.id = "captchaNcip";
    canv.width = 140;
    canv.height = 38;
    const ctx = canv.getContext("2d");
    ctx.font = "20px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    // A storing captcha so that can validate you can save it somewhere else according to your specific requirements
    const code = captcha.join("");
    setCaptchaCodeNcip(code);
    document.getElementById("captchaNcip").appendChild(canv); // A adds the canvas to the body element
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleLogin = async (captchaCode) => {
    try {
      if (formValues.txtLoginId === "") {
        setAlertMessage({
          type: "error",
          message: "User Name is required!",
        });
        return;
      }
      if (formValues.txtPassword === "") {
        setAlertMessage({
          type: "error",
          message: "Password is required!",
        });
        return;
      }
      if (formValues.txtCaptchaVal === "") {
        setAlertMessage({
          type: "error",
          message: "Captcha is required!",
        });
        return;
      }
      if (formValues.txtCaptchaVal !== captchaCode) {
        createCaptcha();
        setAlertMessage({
          type: "error",
          message: "Captcha did not match...",
        });
        return;
      }
      const encryptUserName = encryptStringData(formValues.txtLoginId ? formValues.txtLoginId : "");
      const hashPass = await sha256(formValues.txtPassword ? formValues.txtPassword : "");
      setBtnLoaderActive(true);
      const result = await authenticate(encryptUserName, hashPass);
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
          createCaptcha();
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
        createCaptcha();
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
        setBtnLoaderActive(false);
      }
      // A const resultSaltVal = await authenticateIntial(encryptUserName);
      // A if (resultSaltVal.responseCode === 1) {
      // A  const salValue = resultSaltVal.responseData;
      // A  const conctSaltAndHashPass = `${hashPass}_${salValue}`;
      // A  const salt = await bcrypt.genSalt(10);
      // A  const bcryptSaltSaltAndHashPass = await bcrypt.hash(conctSaltAndHashPass, salt);
      // A  const result = await authenticate(encryptUserName, bcryptSaltSaltAndHashPass);
      // A  setBtnLoaderActive(false);
      // A  if (result.responseCode === 1) {
      // A    if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
      // A      createCaptcha();
      // A      setAlertMessage({
      // A        type: "error",
      // A       message: "Token is missing in the response",
      // A      });
      // A      return;
      // A    }
      // A    const user = {
      // A      ...result.responseData,
      // A    };
      // A    setSessionStorage("user", user);
      // A    navigate("/home");
      // A  } else {
      // A    createCaptcha();
      // A    setAlertMessage({
      // A      type: "error",
      // A      message: result.responseMessage,
      // A    });
      // A  }
      // A } else {
      // A  setBtnLoaderActive(false);
      // A  createCaptcha();
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: resultSaltVal.responseMessage,
      // A  });
      // A }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [btnLoaderActiveNcip, setBtnLoaderActiveNcip] = useState(false);
  const handleLoginNcip = async (captchaCodeNcip) => {
    try {
      if (formValuesNcip.txtmobileno === "") {
        setAlertMessage({
          type: "error",
          message: "Mobile Number is required!",
        });
        return;
      }
      if (formValuesNcip.txtmobileno.length < 10) {
        setAlertMessage({
          type: "error",
          message: "Please enter 10 digit Mobile Number!",
        });
        return;
      }
      if (formValuesNcip.txtPasswordNcip === "") {
        setAlertMessage({
          type: "error",
          message: "Password is required!",
        });
        return;
      }
      if (formValuesNcip.txtCaptchaValNcip === "") {
        setAlertMessage({
          type: "error",
          message: "Captcha is required!",
        });
        return;
      }
      if (formValuesNcip.txtCaptchaValNcip !== captchaCodeNcip) {
        createCaptchaNcip();
        setAlertMessage({
          type: "error",
          message: "Captcha did not match...",
        });
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
          createCaptchaNcip();
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
        createCaptchaNcip();
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
      setTimeout(() => {
        createCaptcha();
      }, 500);
    } else {
      setformValuesNcip({
        ...formValuesNcip,
        txtmobileno: "",
        txtPasswordNcip: "",
        txtCaptchaValNcip: "",
      });
      setTimeout(() => {
        createCaptchaNcip();
      }, 500);
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
      setTimeout(() => {
        createCaptcha();
      }, 500);
    }
    // A createCaptcha();
  }, []);

  return {
    formValues,
    updateState,
    handleLogin,
    SearchByHandleKeyDown,
    formValuesNcip,
    updateStateNcip,
    handleLoginNcip,
    SearchByHandleKeyDownNclip,
    captchaCode,
    createCaptcha,
    captchaCodeNcip,
    createCaptchaNcip,
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
    toggleChange,
    setToggleChange,
  };
}

export default AddLoginLogics;
