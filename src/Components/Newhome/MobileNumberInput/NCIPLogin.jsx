import { React, useEffect, useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { MdOutlineRefresh } from "react-icons/md";
import { AlertMessage } from "Framework/Components/Widgets";
import AddLoginLogics from "./utils/Logic";
import { motion } from "framer-motion";

import "./KRPHPortal.css";
import { generateCaptcha } from "./utils/capthcaUtils";

function NCIPLogin() {
  const { formValuesNcip, updateStateNcip, handleLoginNcip, SearchByHandleKeyDownNclip } = AddLoginLogics();
  const [revealPasswordNclip, setRevealPasswordNclip] = useState(false);

  const togglePasswordNclip = () => {
    setRevealPasswordNclip(!revealPasswordNclip);
  };

  const [captchaCode, setCaptchaCode] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const setAlertMessage = AlertMessage();

  useEffect(() => {
    setCaptchaCode(generateCaptcha());
  }, []);

  const handleCaptchaChange = (e) => {
    setEnteredCaptcha(e.target.value);
  };

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
  };

  const handleLogin = async () => {
    try {
      await handleLoginNcip(formValuesNcip, enteredCaptcha, captchaCode, setCaptchaCode, setAlertMessage);
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Login failed. Please try again.",
      });
    }
  };

  return (
    <>
      {/* <motion.div
        className="mobile-input"
        initial={{ opacity: 0, y: 80 }} // Start from below
        animate={{ opacity: 1, y: 0 }} // Move to its normal position
        transition={{ duration: 2, ease: "easeOut" }}
      > */}
      <>
        <div className="mobile-input">
          <>
            <label htmlFor="Username">Mobile Number</label>
            <div className="input-container">
              <input
                type="text"
                control="input"
                name="txtmobileno"
                maxLength="10"
                value={formValuesNcip.txtmobileno}
                onChange={(e) => updateStateNcip(e.target.name, e.target.value.replace(/\D/g, ""))}
                placeholder="Mobile Number"
                autoComplete="off"
              />
            </div>
            <div className="password-input">
              <label>Password</label>
              <div className="input-container">
                <input
                  type={revealPasswordNclip ? "text" : "password"}
                  name="txtPasswordNcip"
                  value={formValuesNcip.txtPasswordNcip}
                  onKeyDown={(e) => SearchByHandleKeyDownNclip(e)}
                  onChange={(e) => updateStateNcip(e.target.name, e.target.value)}
                  placeholder="Enter Password"
                  autoComplete="off"
                />
                {revealPasswordNclip ? (
                  <VscEyeClosed className="password-icon" onClick={() => togglePasswordNclip()} />
                ) : (
                  <VscEye className="password-icon" onClick={() => togglePasswordNclip()} />
                )}
              </div>
            </div>

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

            <button
              type="button"
              className="get-otp"
              onClick={handleLogin}
              style={{
                height: "44px",
                width: "100%",
                marginTop: "10px",
              }}
            >
              Login
              <span />
            </button>
          </>
        </div>
      </>

      {/* </motion.div> */}
    </>
  );
}

export default NCIPLogin;
