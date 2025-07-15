import React, { useEffect } from "react";
import { useState } from "react";
import resetPass from "../../../assets/resetPass.svg";
import "./KRPHPortal.css";
import { generateCaptcha } from "./utils/capthcaUtils";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { MdOutlineRefresh } from "react-icons/md";
import ForgotPasswordLogics from "./ForgotPassword/Logic/Logic";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { AlertMessage } from "Framework/Components/Widgets";
import { forgetData, otpValidateData, resetForgetPasswordData } from "../MobileNumberInput/ForgotPassword/Servcie/Methods";
import { encryptStringData } from "../../Common/Login/Auth/auth";
import { sha256 } from "crypto-hash";

const ForgotPasswordd = ({ showfunc, setSelectedOption, selectedOption }) => {
  const setAlertMessage = AlertMessage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [invisible, setInvisible] = useState(true);
  const [revealConfirmPassword, setRevealConfirmPassword] = useState(false);
  const [revealNewPassword, setRevealNewPassword] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [getappAccessID, setgetappAccessID] = useState(0);
  const [confirmationMessage, setConfirmationMessage] = useState(false);

  const { formValues, updateState, createNewPasswordForGotPassword, verifyOTPForForGotPassword, checkUserNameForForGotPassword } = ForgotPasswordLogics();

  useEffect(() => {
    generateCaptcha();
    setCaptchaCode(generateCaptcha());
  }, []);

  const toggleNewPassword = () => {
    setRevealNewPassword(!revealNewPassword);
  };
  const handleGetOTP1 = async () => {
    setOtpVisible(true);
  };
  const handleSubmitOtp1 = async () => {
    setInvisible(false);
    setPasswordField(true);
    setSelectedOption("");
  };
  const handleConfirm1 = async () => {
    setIsProcessing(true);
    setSelectedOption("CHPass");
    setConfirmationMessage(true);
    setIsFormVisible(false);
  };

  const toggleConfirmPassword = () => {
    setRevealConfirmPassword(!revealConfirmPassword);
  };
  const handleCaptchaChange = (e) => {
    setEnteredCaptcha(e.target.value);
  };

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
  };

  const handleGetOTP = async () => {
    setLoading(true);

    try {
      if (!formValues.txtUsername.trim()) {
        return setAlertMessage({ type: "error", message: "Username is required !!" });
      }

      if (enteredCaptcha !== captchaCode) {
        setAlertMessage({ type: "error", message: "Incorrect CAPTCHA, please try again." });
        setCaptchaCode(generateCaptcha());
        setEnteredCaptcha("");
        return;
      }

      const encryptUserName = encryptStringData(formValues.txtUsername);
      const formData = { appAccessUserName: encryptUserName };
      const result = await forgetData(formData);

      if (result.responseCode === 1) {
        setAlertMessage({ type: "success", message: "6-digit OTP sent on your registered mobile number." });
        setOtpVisible(true);
      } else {
        setCaptchaCode(generateCaptcha());
        setAlertMessage({ type: "error", message: result.responseMessage });
      }
    } catch (error) {
      console.error("Error during OTP request:", error);
      setAlertMessage({ type: "error", message: "An unexpected error occurred, please try again." });
      setCaptchaCode(generateCaptcha());
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async () => {
    setLoading(true);

    if (!/^\d{6}$/.test(formValues?.txtOTP)) {
      setAlertMessage({ type: "error", message: "Enter a valid 6-digit OTP to proceed" });
      setLoading(false);
      return;
    }

    try {
      const encryptUserName = encryptStringData(formValues?.txtUsername || "");
      const formData = {
        appAccessUserName: encryptUserName,
        otp: Number(formValues?.txtOTP) || 0,
      };

      const result = await otpValidateData(formData);

      if (result.responseCode === 1) {
        setAlertMessage({ type: "success", message: "Username verified." });
        setgetappAccessID(result.responseData.appAccessID);
        setInvisible(false);
        setPasswordField(true);
        setSelectedOption("");
      } else {
        setAlertMessage({ type: "error", message: result.responseMessage });
      }
    } catch (error) {
      console.error("Error during OTP validation:", error);
      setAlertMessage({ type: "error", message: error.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      if (!formValues.txtNewPassword.trim() || !formValues.txtConfirmPassword.trim()) {
        setAlertMessage({
          type: "error",
          message: "Password fields cannot be empty or contain only spaces.",
        });
      } else if (/\s/.test(formValues.txtNewPassword)) {
        setAlertMessage({
          type: "error",
          message: "Password should not contain spaces.",
        });
      } else if (formValues.txtNewPassword !== formValues.txtConfirmPassword) {
        setAlertMessage({
          type: "error",
          message: "Passwords do not match.",
        });
      } else if (
        !/[a-z]/.test(formValues.txtNewPassword) ||
        !/[A-Z]/.test(formValues.txtNewPassword) ||
        !/[0-9]/.test(formValues.txtNewPassword) ||
        !/[@]/.test(formValues.txtNewPassword)
      ) {
        setAlertMessage({
          type: "error",
          message: "Password must contain at least one capital letter, one number, and the @ symbol.",
        });
      } else {
        const hashPass = await sha256(formValues.txtNewPassword);
        const formData = {
          appAccessID: getappAccessID,
          newPassword: hashPass,
        };
        const result = await resetForgetPasswordData(formData);
        console.log(result);
        if (result.responseCode === 1) {
          setAlertMessage({
            type: "success",
            message: result.responseMessage,
          });
          setIsProcessing(true);
          setSelectedOption("CHPass");
          setConfirmationMessage(true);
          setIsFormVisible(false);
        } else {
          setAlertMessage({
            type: "error",
            message: result.responseMessage,
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

  return (
    <>
      {isFormVisible && (
        <>
          {/* <motion.div className="mobile-input" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, ease: "easeOut" }}> */}
          <>
            <div className="mobile-input">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <img src={resetPass} alt="logo" />
                <h2 className="title">Forgot your password?</h2>
              </div>
              <p>Enter your username and we will send a 6-digit OTP to your registered mobile number to reset your password.</p>
              {invisible && (
                <>
                  <>
                    <label htmlFor="username" className="label">
                      Username
                    </label>
                    <div className="input-container">
                      <input
                        type="text"
                        name="txtUsername"
                        maxLength="20"
                        value={formValues.txtUsername}
                        onChange={(e) => updateState(e.target.name, e.target.value)}
                        placeholder="Enter your User Name"
                        autoComplete="off"
                        disabled={otpVisible === true}
                      />
                    </div>
                  </>
                  {!otpVisible && (
                    <>
                      <div className="captcha">
                        <label htmlFor="captcha">Security Check</label>
                        <div className="captcha-container">
                          <div className="captchafield">
                            <span>{captchaCode}</span>
                            <MdOutlineRefresh style={{ cursor: "pointer", color: "#4CAF50" }} onClick={() => refreshCaptcha()} />
                          </div>
                          <input
                            type="text"
                            name="txtCaptchaValForgotPass"
                            maxLength="6"
                            value={enteredCaptcha}
                            onChange={handleCaptchaChange}
                            placeholder="Enter Captcha Code"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <button onClick={handleGetOTP} className="get-otp" disabled={loading}>
                        {loading && <ClipLoader size={20} color="#fff" loading={loading} style={{ marginRight: "10px" }} />}
                        GET OTP
                      </button>
                    </>
                  )}
                  {otpVisible && (
                    <div style={{ marginTop: "10px" }}>
                      <label htmlFor="captcha">Enter OTP</label>

                      <input
                        type="text"
                        name="txtOTP"
                        value={formValues.txtOTP}
                        onChange={(e) => updateState(e.target.name, e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter OTP"
                        autoComplete="off"
                        maxLength={6}
                      />

                      <button onClick={handleSubmitOtp} className="get-otp">
                        Submit OTP{" "}
                      </button>
                    </div>
                  )}
                </>
              )}
              <>
                {passwordField && (
                  <div>
                    <div className="password-input">
                      <label>Enter Password</label>
                      <div className="input-container">
                        <input
                          type={revealNewPassword ? "text" : "password"}
                          name="txtNewPassword"
                          value={formValues.txtNewPassword}
                          onChange={(e) => updateState(e.target.name, e.target.value)}
                          placeholder="Enter New Password"
                          autoComplete="off"
                          disabled={isProcessing}
                        />
                        {revealNewPassword ? (
                          <VscEyeClosed className="password-icon" onClick={() => toggleNewPassword()} />
                        ) : (
                          <VscEye className="password-icon" onClick={() => toggleNewPassword()} />
                        )}
                      </div>
                    </div>
                    <div className="password-input">
                      <label>Confirm Password</label>
                      <div className="input-container">
                        <input
                          type={revealConfirmPassword ? "text" : "password"}
                          name="txtConfirmPassword"
                          value={formValues.txtConfirmPassword}
                          onChange={(e) => updateState(e.target.name, e.target.value)}
                          placeholder="Enter Confirm Password"
                          autoComplete="off"
                          disabled={isProcessing}
                        />
                        {revealConfirmPassword ? (
                          <VscEyeClosed className="password-icon" onClick={() => toggleConfirmPassword()} />
                        ) : (
                          <VscEye className="password-icon" onClick={() => toggleConfirmPassword()} />
                        )}
                      </div>
                    </div>
                    <button type="button" className="get-otp" onClick={handleConfirm} disabled={isProcessing}>
                      {" "}
                      Submit{" "}
                    </button>
                  </div>
                )}
              </>
            </div>
          </>
          {/* </motion.div> */}
        </>
      )}
      {confirmationMessage && (
        <p style={{ color: "green", marginTop: "1rem" }}>
          {confirmationMessage === true ? "Your Password has been changed successfully, now you can log in with the newly created password" : ""}
        </p>
      )}
    </>
  );
};

export default ForgotPasswordd;
