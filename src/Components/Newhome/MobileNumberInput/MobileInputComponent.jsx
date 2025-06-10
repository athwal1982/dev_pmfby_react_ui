import classNames from "classnames";
import Header from "Components/Newhome/Layout/Header";
import { Form } from "Framework/Components/Layout";
import { AlertMessage, Button } from "Framework/Components/Widgets";
import { useEffect, useRef, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import BizClass from "./MobileNumberInput.module.scss";
import { MdOutlineRefresh } from "react-icons/md";
import { authenticatefarmerLogin } from "../../Common/Login/Services/Methods";
import { setSessionStorage, getSessionStorage } from "../../Common/Login/Auth/auth";
import publicIp from "public-ip";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../Layout/Footer";
import { smsotpsend, verifyOtp } from "Components/Common/Login/ForgotPasswordModal/Servcie/Methods";
import clock from "../../../assets/img/clock.png";
function MobileInputComponent() {
  const inputRef = useRef(null);
  const setAlertMessage = AlertMessage();
  const [alertMessagee, setAlertMessagee] = useState(null);
  const navigate = useNavigate();
  const [mobileNum, setMobileNum] = useState("");
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  const [otp, setOtp] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [captchaCode, setCaptchaCode] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState(null);

  const authToken = "3509AA77-1ABA-410F-9CB2-51D59AAEC0383509AA77-1ABA-410F-9CB2-51D59AAEC038";

  const handleOtpSubmit1 = async (e) => {
    e.preventDefault();
    if (otp.join("") === "2024") {
      try {
        const result = await authenticatefarmerLogin(mobileNum, otp.join(""));

        if (result.responseCode === "1") {
          if (!(result.responseData.token && result.responseData.token.expirationTime)) {
            setAlertMessage({
              type: "error",
              message: result.responseMessage,
            });
            return;
          }
          const user = {
            ...result.responseData,
          };
          setSessionStorage("user", user);
          setShowPopup(true);
        } else {
          setAlertMessage({
            type: "error",
            message: "Mobile number is not registered.",
          });
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error verifying mobile number:", error);
        setAlertMessage({
          type: "error",
          message: "An error occurred. Please try again.",
        });
      }
    } else {
      setAlertMessage({
        type: "error",
        message: "OTP is not correct.",
      });
    }
  };
  const handleOtpSubmit2 = async (e) => {
    e.preventDefault();
    const ip = await publicIp.v4();
    const enteredOtp = otp.join("");

    if (!enteredOtp) {
      setAlertMessage({
        type: "error",
        message: "Please enter the OTP.",
      });
      return;
    }

    try {
      const result = await verifyOtp(mobileNum, enteredOtp, ip);

      if (result?.responseCode == "1") {
        console.log("resulttt", result);
        const { responseData } = result;

        if (!(responseData?.token && responseData.token.expirationTime)) {
          setAlertMessage({
            type: "error",
            message: "Token is missing in the response.",
          });
          return;
        }

        const user = { ...responseData };
        setSessionStorage("user", user);

        setAlertMessage({
          type: "success",
          message: "Mobile number is registered.",
        });
        setShowPopup(() => () => handlePopupAction());
      } else {
        setAlertMessage({
          type: "error",
          message: "This number is not registered. Kindly contact the admin.",
        });
        setShowPopup(() => () => {
          sessionStorage.clear();
          window.location.href = "/";
        });
      }
    } catch (error) {
      console.error("Error verifying mobile number:", error);

      setAlertMessage({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.fontWeight = "bold";
    }
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

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleMobileInputSubmission = async (e) => {
    const ip = await publicIp.v4();

    if (mobileNum === "") {
      setAlertMessage({
        type: "error",
        message: "Please enter mobile number",
      });
    } else if (mobileNum.length !== 10) {
      setAlertMessage({
        type: "error",
        message: "Please enter a 10 digit mobile number",
      });
    } else {
      try {
        const result = await smsotpsend(mobileNum, ip);

        if (result.data.responseCode === "1") {
          setOtpFieldVisible(true);
          setAlertMessage({
            type: "success",
            message: "OTP sent successfully",
          });
          setIsResendDisabled(true);
          startTimer();
          setIsButtonVisible(false);
          setOtpFieldVisible(true);
          generateCaptcha();
        } else {
          setAlertMessage({
            type: "error",
            message: result.data.responseMessage,
          });
        }
      } catch (error) {
        setAlertMessage({
          type: "error",
          message: "An error occurred while sending OTP. Please try again.",
        });
      }
    }
  };

  const handleButtonClick = (e) => {
    if (!mobileNum || mobileNum.length !== 10) {
      setAlertMessage({
        type: "error",
        message: mobileNum ? "Please enter a valid 10-digit mobile number" : "Please enter your mobile number",
      });
    } else {
      handleMobileInputSubmission(e);
    }
  };

  const handleOtpChange = (e) => {
    const otpArray = e.target.value;
    setOtp(otpArray);
  };

  const startTimer = () => {
    setCountdown(60);
    const timerInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatCountdown = (countdown) => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();

    if (isResendDisabled) {
      setAlertMessage({
        type: "error",
        message: `You can resend the OTP after ${countdown} seconds.`,
      });
      return;
    }
    try {
      if (!otpFieldVisible) {
        setAlertMessage({
          type: "error",
          message: "Please validate your mobile number first.",
        });
        return;
      }

      const ip = await publicIp.v4();
      const result = await smsotpsend(mobileNum, ip);

      if (result.data.responseCode === "1") {
        setAlertMessage({
          type: "success",
          message: "OTP resent successfully",
        });
        setIsResendDisabled(true);
        startTimer(); // Restart the countdown timer
      } else {
        setAlertMessage({
          type: "error",
          message: result.data.responseMessage || "Failed to resend OTP",
        });
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setAlertMessage({
        type: "error",
        message: "An error occurred while resending OTP. Please try again.",
      });
    }
  };

  const handleOtpSubmit = async (e) => {
    if (otp.length == 0) {
      setAlertMessage({
        type: "error",
        message: "Please enter the OTP.",
      });
      return;
    } else if (otp[0].trim().length === 0) {
      setAlertMessage({
        type: "error",
        message: "Otp cannot be only spaces!",
      });
      return;
    }

    const ip = await publicIp.v4();
    const enteredOtp = otp;

    if (enteredCaptcha !== captchaCode) {
      setAlertMessage({
        type: "error",
        message: "Incorrect CAPTCHA, please try again.",
      });
      return;
    }

    try {
      const verifyResult = await verifyOtp(mobileNum, enteredOtp, ip);
      console.log("verifyResult:", verifyResult);

      if (verifyResult.responseCode == 1 || verifyResult.responseCode === "1") {
        const { responseData } = verifyResult;

        if (!(responseData.token && responseData.token.expirationTime)) {
          setAlertMessage({
            type: "error",
            message: "Enter the correct OTP.",
          });
          return;
        }

        const user = { ...responseData };
        setSessionStorage("user", user);

        setAlertMessage({
          type: "success",
          message: "Mobile number is registered.",
        });

        setShowPopup(() => () => handlePopupAction());
      } else {
        console.error("Unexpected responseCode:", verifyResult.responseCode);
        setAlertMessage({
          type: "error",
          message: "This number is not registered. Kindly contact the admin.",
        });
      }
    } catch (error) {
      console.error("Error verifying mobile number:", error);
      setAlertMessage({
        type: "error",
        message: error?.message || "An error occurred. Please try again.",
      });
    }
  };

  const handlePopupAction = async (action) => {
    setShowPopup(false);
    if (action === "complaintStatus") {
      navigate("/complaint-status", { state: { mobileNum } });
    } else if (action === "claimintimat") {
      navigate("/croploss", { state: { mobileNum } });
    } else {
      console.warn("Unknown action:", action);
    }
  };

  const handleLoginfarmer = async () => {
    if (mobileNum === "") {
      setAlertMessage({
        type: "error",
        message: "Mobile Number is required!",
      });
      return;
    }
    if (mobileNum.length < 10) {
      setAlertMessage({
        type: "error",
        message: "Please enter 10 digit Mobile Number!",
      });
      return;
    }

    setIsLoading(true);
    const result = await smsotpsend(mobileNum);
    setIsLoading(false);

    if (result.responseCode === 1) {
      // A setAlertMessage({
      //    Atype: "success",
      //  A message: "Login successful!",
      // });
      // }A else {
      //   AsetAlertMessage({
      //    A type: "error",
      //  A message: "Login failed. Please try again.",
      //   });
    }
  };

  const handleClosePopup = async () => {
    sessionStorage.clear();
    navigate("/");
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

  return (
    <div>
      <div className="BizClass.Box" style={{ margin: "0px", padding: "0px", display: "flex", flexDirection: "column" }}>
        <div className="BizClass.FormHeading">
          <h5>Enter Farmer Registered Mobile Number</h5>
        </div>

        <Form.InputGroup label="Mobile No" column={1}>
          <div className="BizClass.Row" style={{ display: "flex", gap: "20px" }}>
            <Form.InputControl
              ref={inputRef}
              control="input"
              placeholder="98XXXXXXX"
              name="txtMobileNumber"
              autoComplete="off"
              value={mobileNum}
              minLength={10}
              maxLength={10}
              onChange={(e) => setMobileNum(e.target.value.replace(/\D/g, ""))}
              disabled={otpFieldVisible}
              style={{ height: "44px" }}
            />

            {isButtonVisible && !otpFieldVisible && (
              <Button varient="green" trigger={isLoading} disabled={isLoading || otpFieldVisible} className="BizClass.Button" onClick={handleButtonClick}>
                Continue
              </Button>
            )}

            {otpFieldVisible && (
              <Form.InputControl
                control="input"
                placeholder="Enter OTP"
                name="txtOtp"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numeric input
                  if (/^\d*$/.test(value)) {
                    handleOtpChange(e);
                  }
                }}
                maxLength={6}
                style={{ height: "44px" }}
                autoComplete="off"
              />
            )}

            {alertMessagee && <div style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>{alertMessagee.message}</div>}
          </div>
        </Form.InputGroup>

        <p className="BizClass.Info">A 6 Digit OTP Will Be Sent Via SMS To Verify Your Mobile Number</p>

        {otpFieldVisible && (
          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Form.InputGroup column={1}>
              <div className="BizClass.Row" style={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "inline-block",
                    height: "44px",
                    width: "100%",
                  }}
                >
                  <span variant="body1">
                    {captchaCode} <MdOutlineRefresh className={BizClass.RefreshCaptchaBoxIcon} onClick={() => generateCaptcha()} />
                  </span>
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Form.InputControl
                  control="input"
                  name="txtOtp"
                  maxLength={6}
                  style={{ height: "44px" }}
                  autoComplete="off"
                  placeholder="Enter Captcha"
                  value={enteredCaptcha}
                  onChange={handleCaptchaChange}
                />
              </div>
            </Form.InputGroup>

            {/* {captchaError && (
              <div
                style={{
                  color: "red",
                  marginTop: "10px",
                  fontWeight: "bold",
                  fontFamily: "Courier New, monospace",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#3e8ed0",
                  textShadow: "1px 1px 2px #888",
                }}
              >
                {captchaError}
              </div>
            )} */}
            <div className="BizClass.Row" style={{ display: "flex", flexDirection: "row", gap: "125px" }}>
              <Form.InputGroup column={1}>
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                  <Button varient="green" trigger={isLoading} className="BizClass.Button" onClick={handleOtpSubmit} type="button">
                    Verify OTP
                  </Button>
                </div>
              </Form.InputGroup>
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                <Button
                  varient="green"
                  className="BizClass.Button"
                  onClick={handleResendOtp}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    padding: "10px 20px",
                    fontSize: "16px",
                  }}
                >
                  {countdown > 0 ? (
                    <>
                      <img src={clock} style={{ width: "20px", marginRight: "8px" }} alt="timer" />
                      <span style={{ fontSize: "15px" }}>{formatCountdown(countdown)}</span>
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className={BizClass.PopupContainer}>
          <div className={BizClass.Popup}>
            <button type="button" className={BizClass.CloseButton} onClick={() => handleClosePopup()}>
              <img src={Close} alt="Close" className={BizClass.CloseIcon} />
            </button>
            <h3>OTP Verified!</h3>
            <p>Select an action:</p>
            <div className={BizClass.PopupButtons}>
              <button type="button" style={{ width: "40%" }} onClick={() => handlePopupAction("complaintStatus")}>
                Complaint Status
              </button>
              <button
                type="button"
                style={{ width: "40%" }}
                onClick={async () => {
                  // A await handleLoginfarmer();
                  await handlePopupAction("claimintimat");
                }}
              >
                Claim Intimation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileInputComponent;
