import React, { useEffect, useState, Suspense } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Loader } from "Framework/Components/Widgets";
import { setSessionStorage, decryptStringData, getSessionStorage } from "../Common/Login/Auth/auth.jsx";
import { authenticateUserIDForCallingSolution, authenticateUserIDForCSCCallingAgentLogin } from "../Common/Login/Services/Methods.jsx";
import { useNavigate } from "react-router-dom";
import "./LandingKrph.css";
import "./Header.css";

// Lazy load components
const Header = React.lazy(() => import("./Header.jsx"));
const HeroSection = React.lazy(() => import("./HeroSection.jsx"));
const ImportantInfo = React.lazy(() => import("./ImportantInfo.jsx"));
const AboutSection = React.lazy(() => import("./AboutSection.jsx"));
const Footer = React.lazy(() => import("./Footer.jsx"));

const LandingKrph = () => {
  const setAlertMessage = AlertMessage();
  const [showHideLogin, setShowHideLogin] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const navigate = useNavigate();
  const [language, setLanguage] = useState(getSessionStorage("Language") || "English");

  const handleWhatsAppClick = () => {
    window.open("https://api.whatsapp.com/send/?phone=917065514447&text&type=phone_number&app_absent=0", "_blank", "noopener,noreferrer");
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setSessionStorage("Language", selectedLanguage);
  };

  const pathUrl = window.location.href;

  const callKrphAllActivityPage = async () => {
    try {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      const encptUID = decryptStringData(params && params.userID ? params.userID : "uID");
      const encptUMBLENO = decryptStringData(params && params.mobileNumber ? params.mobileNumber : "uMO");
      setIsLoadingPage(true);
      const result = await authenticateUserIDForCallingSolution(encptUMBLENO, encptUID);
      setIsLoadingPage(false);
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
        navigate("/KrphAllActivitiesNDN");
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

  const callAgentDashBoard = async () => {
    debugger;
    try {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      const encptUID = decryptStringData(params && params.userID ? params.userID : "uID");
      const encptUMBLENO = decryptStringData(params && params.mobileNumber ? params.mobileNumber : "uMO");
      setIsLoadingPage(true);
      const result = await authenticateUserIDForCSCCallingAgentLogin(encptUMBLENO, encptUID);
      setIsLoadingPage(false);
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
        navigate("/TraineeDashboard");
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
    } else if (pathUrl.indexOf("userID") !== -1 && pathUrl.indexOf("mobileNumber") !== -1) {
      setShowHideLogin(false);
      callAgentDashBoard();
    } else {
      setShowHideLogin(true);
    }
  }, []);

  return showHideLogin === true ? (
    <div className="landing-container">
      <Suspense fallback={<Loader />}>
        <Header handleWhatsAppClick={handleWhatsAppClick} language={language} setLanguage={setLanguage} handleLanguageChange={handleLanguageChange} />
        <HeroSection handleWhatsAppClick={handleWhatsAppClick} />
        <ImportantInfo handleWhatsAppClick={handleWhatsAppClick} language={language} setLanguage={setLanguage} />
        <AboutSection language={language} setLanguage={setLanguage} />
        <Footer handleWhatsAppClick={handleWhatsAppClick} language={language} setLanguage={setLanguage} handleLanguageChange={handleLanguageChange} />
      </Suspense>
    </div>
  ) : isLoadingPage ? (
    <Loader />
  ) : null;
};

export default LandingKrph;
