import React, { useEffect, useState, Suspense } from "react";
import { Loader } from "Framework/Components/Widgets";
import farmer_login_inner from "assets/farmer_login_inner.jpg";
import farmerImage from "assets/img/farmer_img.svg";
import supportImage from "assets/img/support_img.svg";
import ncipImage from "assets/img/ncip_img.svg";
import { Tooltip } from "@mui/material";
import { Headphones } from "@mui/icons-material";
import { getSessionStorage } from "../../Common/Login/Auth/auth.jsx";
import "./KRPHPortalN.css";

// Lazy load components
const AdminLoginN = React.lazy(() => import("./AdminLoginN.jsx"));
const NCIPLoginN = React.lazy(() => import("./NCIPLoginN.jsx"));
const ForgotPassworddN = React.lazy(() => import("./ForgotPassworddN.jsx"));
const FarmerLoginN = React.lazy(() => import("./FarmerLoginN.jsx"));
const KRPHPortalNHeader = React.lazy(() => import("./KRPHPortalNHeader.jsx"));
const Footer = React.lazy(() => import("../../LandingPage/Footer.jsx"));

const KRPHPortalN = () => {
  const [popup, setPopup] = useState(false);
  const [showOTPFields, setShowOTPFields] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [currentselectedOption, setCurrentSelectedOption] = useState();

  const handleWhatsAppClick = () => {
    window.open("https://api.whatsapp.com/send/?phone=917065514447&text&type=phone_number&app_absent=0", "_blank", "noopener,noreferrer");
  };
  

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
        return <FarmerLoginN handleOtpSent={handleOtpSent} />;
      case "Farmer-CLI":
        return <FarmerLoginN handleOtpSent={handleOtpSent} />;
      case "Support-GOI":
        return (
          <Suspense fallback={<Loader />}>
            <AdminLoginN
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
            <AdminLoginN
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
            <AdminLoginN
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
            <NCIPLoginN />
          </Suspense>
        );
      case "NCIP-ST":
        return (
          <Suspense fallback={<Loader />}>
            <NCIPLoginN />
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

  return (
    <>
      <div className="landing-container_login">
        <Suspense fallback={<Loader />}>
          <KRPHPortalNHeader handleWhatsAppClick={handleWhatsAppClick} />
          <div className="main_container_portalN">
            <div className="portal-containerN">
              <div className="left-sectionN">
                <div className="box_loginSectionN">
                  <img className="main-imageN" src={farmer_login_inner} alt="Login Inner Image" />
                </div>
                 <div className="content-left-sectionN">
                               
                                <div className="pmfby-descriptionN">
                                    <>
                                      Pradhan Mantri Fasal Bima Yojana (PMFBY) is a crop insurance scheme that provides financial assistance to farmers in the event of crop
                                      loss or damage due to unforeseen events like natural calamities, pests, and diseases.
                                      <br />
                                      <br />
                                      <br />
                                      <div className="queries-txtN">For all queries, concerns, and grievances related to PMFBY, Please call us at</div>
                                      <div className="helplineN">
                                        <Headphones />
                                        <span style={{ paddingTop: "3px" }}>
                                          <span> Krishi Rakshak Portal Helpline -</span> <span style={{ fontWeight: "bold" }}>14447</span>
                                        </span>
                                      </div>
                                      <br/>
                                    </>
                                  </div>
                              </div>
              </div>
              <div className="right-sectionN">
                {!isForgotPassword && (
                  <>
                    <h2>Welcome to <span style={{color:"#ffac12", fontWeight:"600"}}>KRPH</span> Portal</h2>
                    {selectedOption === "Farmer-CLI" ? (
                      <>
                        <a className="sign-in-linkN">Sign in for Crop loss intimation</a>
                      </>
                    ) : selectedOption === "Farmer-CS" ? (
                      <>
                        <a className="sign-in-linkN">Sign in for Complaint status</a>
                      </>
                    ) : selectedOption === "Support-GOI" ? (
                      <>
                        <a className="sign-in-linkN">Sign in for GOI</a>
                      </>
                    ) : selectedOption === "Support-IC" ? (
                      <>
                        <a className="sign-in-linkN">Sign in for Insurance Company</a>
                      </>
                    ) : selectedOption === "Support-CSC" ? (
                      <>
                        <a className="sign-in-linkN">Sign in for CSC</a>
                      </>
                    ) : selectedOption === "NCIP-ST" ? (
                      <>
                        <a className="sign-in-linkN">Sign in for State </a>
                      </>
                    ) : selectedOption === "NCIP-BNK" ? (
                      <>
                        <a className="sign-in-linkN">Sign in for Bank</a>
                      </>
                    ) : (
                      <>
                        <a className="sign-in-linkN">Sign in to continue</a>
                      </>
                    )}

                    <label style={{ color: "grey" }}>
                      {/* {!selectedOption ? "Choose Option from below" : selectedOption === "Farmer" ? "" : selectedOption === "Support" ? "" : ""} */}
                    </label>
                    <div className="user-optionsN">
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
                    className="forgotpassN"
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
                    <ForgotPassworddN selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
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
          </div>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default KRPHPortalN;