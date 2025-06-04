import classNames from "classnames";
import Header from "Components/Newhome/Layout/Header";
import { Form } from "Framework/Components/Layout";
import { AlertMessage, Button } from "Framework/Components/Widgets";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BizClass from "./OTPInput.module.scss";
import { FiChevronRight } from "react-icons/fi";
import Footer from "../Layout/Footer";

function OTPInput() {
  const inputRef = useRef(null);
  const alertMessage = AlertMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const { mobileNum } = location.state;

  const [otp, setOtp] = useState(["", "", "", ""]);

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

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (value.match(/^[0-9]$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1 && value) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        if (index > 0) {
          document.getElementById(`otp-${index - 1}`).focus();
        }
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.join("") == 2024) {
      alertMessage({
        type: "success",
        message: "OTP Verified",
      });
      navigate("/ticket-history", { state: { mobileNum } });
    } else {
      alertMessage({
        type: "error",
        message: "OTP is not Correct",
      });
    }
  };

  return (
    <div className="new-home">
      <Header />
      <div className={BizClass.Container}>
        <div className={BizClass.Box}>
          <div className={BizClass.FormHeading}>
            <h4>Enter OTP</h4>
          </div>
          <p className={BizClass.Info}>A 4 Digit Code Has Been Sent To {mobileNum}</p>
          <Form.InputGroup label="Mobile No" column={1}>
            <Form.InputControl
              disabled
              ref={inputRef}
              className={classNames(BizClass.Input)}
              control="input"
              placeholder="98XXXXXXX"
              name="txtMobileNumber"
              autoComplete="off"
              defaultValue={mobileNum}
              minLength={10}
              maxLength={10}
            />
          </Form.InputGroup>
          <div className={BizClass.Row}>
            <div className={BizClass.OtpInputGroup}>
              <h6>OTP</h6>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  className={BizClass.OtpInput}
                />
              ))}
              <Button varient="green" className={classNames(BizClass.Button)} onClick={handleOtpSubmit}>
                VERIFY
                <FiChevronRight size={20} />
              </Button>
            </div>
          </div>
          <p className={BizClass.ResendText}>
            Didn't Receive The Code? <span className={BizClass.ResendLink}>RESEND</span>
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default OTPInput;
