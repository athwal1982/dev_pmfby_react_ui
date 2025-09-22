import React, { useEffect, useState, Suspense } from "react";
import { Loader } from "Framework/Components/Widgets";
import { AiOutlineHome } from "react-icons/ai";
import downImg from "../../../assets/raster-img-overlay.svg";
import kissan from "../../../assets/img/pmfby-kissan.png";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import "./KRPHPortal.css";
import { getSessionStorage } from "../../Common/Login/Auth/auth.jsx";
import ministry_logo from "../../../assets/goi-krph@2x.png";
import { Close, Headphones } from "@mui/icons-material";
import farmerImage from "assets/img/farmer_img.svg";
import supportImage from "assets/img/support_img.svg";
import ncipImage from "assets/img/ncip_img.svg";
import { Tooltip } from "@mui/material";
import { ReactComponent as LogoPMFBY } from "assets/img/Group 161806.svg";
import { ReactComponent as LogoPMFBYHindi } from "assets/icons_new/pmfby_logo_hindi.svg";

// A Lazy load components
const AdminLogin = React.lazy(() => import("./AdminLogin.jsx"));
const NCIPLogin = React.lazy(() => import("./NCIPLogin.jsx"));
const FarmerLogin = React.lazy(() => import("./FarmerLogin.jsx"));
const ForgotPasswordd = React.lazy(() => import("./ForgotPasswordd.jsx"));

const KRPHPortal = () => {
  const [popup, setPopup] = useState(false);
  const [showOTPFields, setShowOTPFields] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [currentselectedOption, setCurrentSelectedOption] = useState();

  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const captchaLength = 6;
    let captcha = "";

    for (let i = 0; i < captchaLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      captcha += characters[randomIndex];
    }

    setCaptchaCode(captcha);
  };

  const handleCaptchaChange = (e) => {
    setEnteredCaptcha(e.target.value);
    if (captchaError) setCaptchaError(null);
  };

  useEffect(() => {
    /*  Aif (getSessionStorage("Links") === "SUP") {
      // AsetPopup(true);
      setSelectedOption("Support"); */
    // A}
    if (getSessionStorage("Links") === "CSC") {
      setSelectedOption("Support-CSC");
      setCurrentSelectedOption("Support-CSC");
    } else if (getSessionStorage("Links") === "IC") {
      setSelectedOption("Support-IC");
      setCurrentSelectedOption("Support-IC");
    } else if (getSessionStorage("Links") === "GOI") {
      setSelectedOption("Support-GOI");
      setCurrentSelectedOption("Support-GOI");
    } else if (getSessionStorage("Links") === "ST") {
      setSelectedOption("NCIP-ST");
    } else if (getSessionStorage("Links") === "BNK") {
      setSelectedOption("NCIP-BNK");
    } else if (getSessionStorage("Links") === "CS") {
      setSelectedOption("Farmer-CS");
    } else if (getSessionStorage("Links") === "CLI") {
      setSelectedOption("Farmer-CLI");
    }
    if (showOTPFields) {
      generateCaptcha();
    }
  }, [showOTPFields]);

  const renderFormFields = (selectedOption, captchaCode, enteredCaptcha, handleCaptchaChange, captchaError) => {
    switch (selectedOption) {
      case "Farmer-CS":
        return <FarmerLogin handleOtpSent={handleOtpSent} />;
      case "Farmer-CLI":
        return <FarmerLogin handleOtpSent={handleOtpSent} />;
      case "Support-GOI":
        return (
          <Suspense fallback={<Loader />}>
            <AdminLogin
              handleOtpSent={handleOtpSent}
              captchaCode={captchaCode}
              enteredCaptcha={enteredCaptcha}
              setSelectedOption={setSelectedOption}
              handleCaptchaChange={handleCaptchaChange}
              captchaError={captchaError}
            />
          </Suspense>
        );
      case "Support-CSC":
        return (
          <Suspense fallback={<Loader />}>
            <AdminLogin
              handleOtpSent={handleOtpSent}
              captchaCode={captchaCode}
              enteredCaptcha={enteredCaptcha}
              setSelectedOption={setSelectedOption}
              handleCaptchaChange={handleCaptchaChange}
              captchaError={captchaError}
            />
          </Suspense>
        );

      case "Support-IC":
        return (
          <Suspense fallback={<Loader />}>
            <AdminLogin
              handleOtpSent={handleOtpSent}
              captchaCode={captchaCode}
              enteredCaptcha={enteredCaptcha}
              setSelectedOption={setSelectedOption}
              handleCaptchaChange={handleCaptchaChange}
              captchaError={captchaError}
            />
          </Suspense>
        );
      case "NCIP-BNK":
        return (
          <Suspense fallback={<Loader />}>
            <NCIPLogin />
          </Suspense>
        );
      case "NCIP-ST":
        return (
          <Suspense fallback={<Loader />}>
            <NCIPLogin />
          </Suspense>
        );
      case "CHPass":
        return null;
      default:
        return null;
    }
  };
  const handleOtpSent = () => {
    setIsOtpSent(true);
  };

  const handlebackOption = () => {
    setIsForgotPassword(false);
    setSelectedOption(currentselectedOption);
  };

  const [language, setLanguage] = useState("english");

  const handleChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
    }
  };

  const handleClose = () => {
    setPopup(false);
  };

  return (
    <>
      <div className="main_container_portal">
        <div className="portal-container">
          <>
            <div className="left-section">
              <div className="img-toggle-container">
                <img className="ministry_logo" src={ministry_logo} alt="Ministry of Agriculture" />
                <div className="containerr" style={{ marginTop: "7px", display: "none" }}>
                  <div className="toggle-containerr">
                    <span onClick={(event) => handleChange(event, "english")} className={language === "english" ? "activee" : ""}>
                      English
                    </span>
                    <span onClick={(event) => handleChange(event, "hindi")} className={language === "hindi" ? "activee" : ""}>
                      Hindi
                    </span>
                  </div>
                </div>
              </div>
              <div className="content-left-section">
                <div className="logo">
                  {language === "english" ? (
                    <LogoPMFBY style={{ width: "85%" }} className="logo-svg2" />
                  ) : language === "hindi" ? (
                    <LogoPMFBYHindi style={{ width: "85%" }} className="logo-svg2" />
                  ) : (
                    <LogoPMFBY style={{ width: "85%" }} className="logo-svg2" />
                  )}
                </div>
                {language === "english" && (
                  <div className="pmfby-description">
                    <>
                      Pradhan Mantri Fasal Bima Yojana (PMFBY) is a crop insurance scheme that provides financial assistance to farmers in the event of crop
                      loss or damage due to unforeseen events like natural calamities, pests, and diseases.
                      <br />
                      <br />
                      <br />
                      <div className="queries-txt">For all queries, concerns, and grievances related to PMFBY, Please call us at</div>
                      <div className="helpline">
                        <Headphones />
                        <span style={{ paddingTop: "3px" }}>
                          <span> Krishi Rakshak Portal Helpline -</span> <span style={{ fontWeight: "bold" }}>14447</span>
                        </span>
                      </div>
                    </>
                  </div>
                )}
                {language === "hindi" && (
                  <div className="pmfby-description">
                    <>
                      प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई) एक फसल बीमा योजना है जो प्राकृतिक आपदाओं, कीटों और बीमारियों जैसी अप्रत्याशित घटनाओं के कारण फसल
                      के नुकसान या क्षति की स्थिति में किसानों को वित्तीय सहायता प्रदान करती है।
                      <br />
                      <br />
                      <br />
                      <div className="queries-txt">पीएमएफबीवाई से संबंधित सभी प्रश्नों, चिंताओं और शिकायतों के लिए, कृपया हमें यहां कॉल करें</div>
                      <div className="helpline">
                        <Headphones />
                        <span style={{ paddingTop: "3px" }}>
                          <span> कृषि रक्षक पोर्टल हेल्पलाइन -</span> <span style={{ fontWeight: "bold" }}>14447</span>
                        </span>
                      </div>
                    </>
                  </div>
                )}
              </div>
              <div className="btm-img-container">
                <img src={downImg} className="downImg" alt="img" />
                <img src={kissan} className="kissan" alt="img" />
              </div>
            </div>
          </>
          <div className="right-section">
            <a href="/krph" className="topbutton">
              <AiOutlineHome size={20} />
              Home
            </a>

            {!isForgotPassword && (
              <>
                <h2>Welcome to KRPH Portal</h2>
                {selectedOption === "Farmer-CLI" ? (
                  <>
                    <a className="sign-in-link">Sign in for Crop loss intimation</a>
                  </>
                ) : selectedOption === "Farmer-CS" ? (
                  <>
                    <a className="sign-in-link">Sign in for Complaint status</a>
                  </>
                ) : selectedOption === "Support-GOI" ? (
                  <>
                    <a className="sign-in-link">Sign in for GOI</a>
                  </>
                ) : selectedOption === "Support-IC" ? (
                  <>
                    <a className="sign-in-link">Sign in for Insurance Company</a>
                  </>
                ) : selectedOption === "Support-CSC" ? (
                  <>
                    <a className="sign-in-link">Sign in for CSC</a>
                  </>
                ) : selectedOption === "NCIP-ST" ? (
                  <>
                    <a className="sign-in-link">Sign in for State </a>
                  </>
                ) : selectedOption === "NCIP-BNK" ? (
                  <>
                    <a className="sign-in-link">Sign in for Bank</a>
                  </>
                ) : (
                  <>
                    <a className="sign-in-link">Sign in to continue</a>
                  </>
                )}

                <label style={{ color: "grey" }}>
                  {/* {!selectedOption ? "Choose Option from below" : selectedOption === "Farmer" ? "" : selectedOption === "Support" ? "" : ""} */}
                </label>
                <div className="user-options">
                  {[
                    { label: "Farmer", value: "Farmer", icon: farmerImage },
                    { label: "Support", value: "Support", icon: supportImage },
                    { label: "NCIP", value: "NCIP", icon: ncipImage },
                  ].map((option) => (
                    <Tooltip
                      key={option.value}
                      arrow
                      title={
                        option.value === "Farmer"
                          ? "Farmer's Login"
                          : option.value === "Support"
                            ? "KRPH Support's Login"
                            : option.value === "NCIP"
                              ? "NCIP Login"
                              : ""
                      }
                    >
                      <button
                        style={{ display: "none" }}
                        className={`user-option-btn ${selectedOption === option.value ? "selected" : ""}`}
                        onClick={() => setSelectedOption(option.value)}
                        disabled={isOtpSent && option.value !== "Farmer"}
                      >
                        <span className="option-icon">
                          <img src={option.icon} alt={option.label} style={{ width: "30px", height: "30px" }} />
                        </span>
                        {option.label}
                      </button>
                    </Tooltip>
                  ))}
                </div>

                <div className="user-input">{renderFormFields(selectedOption, captchaCode, enteredCaptcha, handleCaptchaChange, captchaError)}</div>
              </>
            )}

            {(selectedOption === "Support-CSC" || selectedOption === "Support-IC" || selectedOption === "Support-GOI") && !isForgotPassword && (
              <span
                className="sign-in-link"
                style={{ cursor: "pointer" }}
                aria-hidden="true"
                onClick={() => {
                  setIsForgotPassword(true);
                }}
              >
                Forgot Your Password?
              </span>
            )}

            {isForgotPassword && (
              <Suspense fallback={<Loader />}>
                <ForgotPasswordd selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
              </Suspense>
            )}

            {isForgotPassword && (selectedOption === "Support-CSC" || selectedOption === "Support-IC" || selectedOption === "Support-GOI") ? (
              <a
                type="button"
                style={{ cursor: "pointer" }}
                className={selectedOption === "Support-CSC" || selectedOption === "Support-IC" || selectedOption === "Support-GOI" ? "backForgot" : ""}
                onClick={handlebackOption}
              >
                Login from here
              </a>
            ) : (
              ""
            )}
            {isForgotPassword && selectedOption === "CHPass" ? (
              <a style={{ cursor: "pointer" }} className={selectedOption === "CHPass" ? "backtoLogin" : ""} onClick={handlebackOption}>
                Click here to Login
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
        <footer className="footer-farmerr">
          <div className="footer-contentt">
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/help">Help</a>
            <a href="/faq">FAQ</a>
            <a href="/feedback">Feedback</a>
            <a href="/rti">RTI</a>
            <a href="/t&c">Terms and Conditions</a>
            <a href="/copyrightPolicy">Copyright Policy</a>
            <a href="/hyperlinkingPolicy">Hyperlink Policy</a>
            <a href="/privacyPolicy">Privacy Policy</a>
            <a href="/statementWebsitePolicy">Website Policy</a>
            <a href="/contact">Contact Us</a>
            <a href="/sitemap">Sitemap</a>
          </div>
          <div className="footer-copyy">
            Copyright © For Department of Agriculture and Farmers Welfare, Ministry of Agriculture and Farmers Welfare, Government of India. All Rights
            Reserved.
          </div>
        </footer>

        {popup === true && (
          <>
            <Dialog
              style={{ display: "none" }}
              open={open}
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
              sx={{
                "& .MuiPaper-root": {
                  transition: "opacity 0.3s ease-in-out",
                },
              }}
            >
              <DialogTitle
                sx={{
                  padding: "0px 24px",
                  bgcolor: "#075307",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontFamily: "Quicksand, sans-serif",
                  fontSize: "17px",
                }}
              >
                Confirmation
                <IconButton onClick={handleClose} sx={{ color: "white" }}>
                  <Close />
                </IconButton>
              </DialogTitle>

              <DialogContent sx={{ textAlign: "center", padding: "40px !important" }}>
                <Typography variant="body1" sx={{ mb: 2, fontWeight: "bold", fontFamily: "Quicksand, sans-serif" }}>
                  This the farmer's login.
                  <br />
                  If you wish to login ,
                  <br />
                  Press "Yes" to continue or "No" to go back to the main page
                </Typography>
                <Tooltip title="Start the process" arrow>
                  <Button
                    // AonClick={handleCalculationButton}
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#d4f3af",
                      color: "black",
                      borderRadius: "10px",
                      px: 8,
                      fontFamily: "Quicksand, sans-serif",
                      mt: 3,
                    }}
                  >
                    Yes
                  </Button>
                </Tooltip>
                &nbsp; &nbsp;&nbsp;
                <Tooltip title="Cancel the process" arrow>
                  <Button
                    // AonClick={handleCancelCalc}
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#d4f3af",
                      color: "black",
                      borderRadius: "10px",
                      px: 8,
                      fontFamily: "Quicksand, sans-serif",
                      mt: 3,
                    }}
                  >
                    No
                  </Button>
                </Tooltip>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </>
  );
};

export default KRPHPortal;