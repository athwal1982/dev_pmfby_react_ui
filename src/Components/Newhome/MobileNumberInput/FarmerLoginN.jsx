import { useEffect, useState } from "react";
import { smsotpsend, verifyOtp } from "Components/Common/Login/ForgotPasswordModal/Servcie/Methods";
import publicIp from "public-ip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { generateCaptcha } from "./utils/capthcaUtils";
import FormLabel from "@mui/material/FormLabel";
import { motion } from "framer-motion";
import { AlertMessage } from "Framework/Components/Widgets";
import { MdOutlineRefresh } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getSessionStorage, setSessionStorage } from "../../Common/Login/Auth/auth";
import cs_img from "../../../assets/img_cs.svg";
import "./KRPHPortal.css";

const FarmerLoginN = ({ handleOtpSent }) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const [isdisabled, setDisabled] = useState(false);
  const [isComplaintStatusDisabled, setComplaintStatusDisabled] = useState(false);
  const [mobileNum, setMobileNum] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const setAlertMessage = AlertMessage();

  useEffect(() => {
    if (otpFieldVisible) {
      setOtp("");
      setEnteredCaptcha("");
    }
    setCaptchaCode(generateCaptcha());
  }, [otpFieldVisible]);

  const handleMobileInputSubmission = async () => {
    debugger;
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

    try {
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
    debugger;
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

    // A if (enteredCaptcha !== captchaCode) {
    // A  setAlertMessage({
    // A    type: "error",
    // A    message: "Incorrect CAPTCHA, please try again.",
    // A  });
    // A  setCaptchaCode(generateCaptcha());
    // A  return;
    // A }

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
          setDisabled(true);
        } else if (getSessionStorage("Links") === "CS") {
          setValue("ComplaintStatus");
          setDisabled(true);
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

  return (
    <>
      {/* <motion.div
        className="mobile-input"
        initial={{ opacity: 0, y: 80 }} // Start from below
        animate={{ opacity: 1, y: 0 }} // Move to its normal position
        transition={{ duration: 2, ease: "easeOut" }}
      > */}
      <div className="mobile-inputN">
        <>
          {!isVerificationComplete ? (
            <>
              <label htmlFor="mobile-number">Enter Mobile Number</label>
              <div className="input-containerN">
                <input
                  control="input"
                  type="text"
                  id="mobile-number"
                  autoComplete="off"
                  placeholder="98XXXXXXXX"
                  value={mobileNum}
                  minLength={10}
                  disabled={otpFieldVisible === true}
                  maxLength={10}
                  onChange={(e) => setMobileNum(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <span style={{ fontSize: "12px", color: "grey" }}>A 6 Digit OTP Will Be Sent Via SMS To Verify Your Mobile Number</span>
              {isButtonVisible && !otpFieldVisible && (
                <>
                  <div className="captchaN">
                    <label htmlFor="captcha" >
                      Security Check
                    </label>
                    <div className="captcha-containerN">
                      <div className="captchafieldN">
                        <span className="bhashini-skip-translation">{captchaCode}</span>
                        <MdOutlineRefresh style={{ cursor: "pointer", color: "#4CAF50" }} onClick={refreshCaptcha} />
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
                </>
              )}

              {isButtonVisible && !otpFieldVisible && (
                <button
                  className="get-otpN"
                  onClick={handleMobileInputSubmission}
                >
                  Send OTP
                </button>
              )}

              {otpFieldVisible && (
                <div className="otp-captcha-fieldsN">
                  <label htmlFor="otp" style={{ paddingTop: "7px" }}>
                    Enter OTP
                  </label>
                  <input maxLength={6} type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
                  <div style={{ display: "flex", justifyContent: "flex-end", margin: "0px" }}>
                    <a
                      tooltip="Resend the otp"
                      varient="green"
                      onClick={handleResendOtp}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        fontSize: "12px",
                        color: "grey",
                        cursor: "pointer",
                        margin: "0",
                        padding: "0",
                        textDecoration: "underline",
                      }}
                    >
                      Resend OTP
                    </a>
                  </div>
                  {/* <>
                    <div className="captcha" style={{ marginTop: "0px" }}>
                      <label htmlFor="captcha" style={{ color: "#6c757d", fontSize: "14px" }}>
                        Security Check
                      </label>
                      <div className="captcha-container">
                        <div className="captchafield">
                          <span className="bhashini-skip-translation">{captchaCode}</span>
                          <MdOutlineRefresh style={{ cursor: "pointer", color: "#4CAF50" }} onClick={refreshCaptcha} />
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
                  </> */}
                  <br />
                  <button
                    className="get-otpN"
                    onClick={handleOtpSubmit}
                  >
                    Verify OTP
                  </button>
                </div>
              )}
            </>
          ) : (
            <FormControl className="form-containerN">
              <FormLabel id="demo-controlled-radio-buttons-group" className="form-labelN">
                Select module
              </FormLabel>

              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
                className="radio-groupN"
                style={{ flexWrap: "nowrap" }}
                row
              >
                <FormControlLabel
                  style={{ width: "250px" }}
                  value="ComplaintStatus"
                  disabled={isdisabled}
                  control={<Radio />}
                  label={
                    <>
                      <img src={cs_img} alt="Complaint Status Icon" style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                      Complaint Status
                    </>
                  }
                  className={`radio-buttonN ${value === "ComplaintStatus" ? "selected" : ""}`}
                />

                <FormControlLabel
                  disabled={isdisabled}
                  style={{ width: "272px" }}
                  value="CropLossIntimation"
                  control={<Radio />}
                  label="🌿 Crop Loss Intimation"
                  className={`radio-buttonN ${value === "ClaimIntimation" ? "selected" : ""}`}
                />
              </RadioGroup>
              <button
                className="get-otpN"
                onClick={() => handleSubmit5(value)}
              >
                Submit
              </button>
            </FormControl>
          )}
        </>
      </div>
      {/* </motion.div> */}
    </>
  );
};

export default FarmerLoginN;
