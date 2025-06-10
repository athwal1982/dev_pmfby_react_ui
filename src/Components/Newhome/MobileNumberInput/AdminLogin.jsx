import { React, useEffect, useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { MdOutlineRefresh } from "react-icons/md";
import { generateCaptcha } from "./utils/capthcaUtils";
import "./KRPHPortal.css";
import { motion } from "framer-motion";
import AddLoginLogics from "./utils/Logic";
import { CircularProgress } from "@mui/material";

function AdminLogin({ handleOtpSent, setSelectedOption }) {
  const { formValues, updateState, handleLogin, SearchByHandleKeyDown } = AddLoginLogics();
  const [revealPassword, setRevealPassword] = useState(false);
  const [invisble, setInvisible] = useState(true);
  const [captchaCode, setCaptchaCode] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const setAlertMessage = AlertMessage();
  const [loader, setLoader] = useState(false);
  const [loginBtnClick, setLoginBtnClick] = useState(false);
  const togglePassword = () => {
    setRevealPassword(!revealPassword);
  };

  useEffect(() => {
    setCaptchaCode(generateCaptcha());
  }, []);

  const handleCaptchaChange = (e) => {
    setEnteredCaptcha(e.target.value);
  };

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
  };

  const handleClick = async () => {
    setLoader(true);

    try {
      await handleLogin(formValues, enteredCaptcha, captchaCode, setCaptchaCode, setAlertMessage);
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Login failed. Please try again.",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {/* {loader && (
        <div className="overlay_admin_login">
          <CircularProgress className="loader_admin_login" />
        </div>
      )} */}

      {/* <motion.div className="mobile-input" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, ease: "easeOut" }}> */}
      <div className="mobile-input">
        {invisble && (
          <>
            {/* Username Field */}
            <label htmlFor="Username">Username</label>
            <div className="input-container">
              <input
                type="text"
                name="txtLoginId"
                maxLength="10"
                value={formValues.txtLoginId}
                onChange={(e) => updateState(e.target.name, e.target.value)}
                placeholder="Enter your User Name"
                autoComplete="off"
                required
              />
            </div>
            {loginBtnClick === true && formValues.txtLoginId === "" ? <p className="error-text-adminLogin">Username is required</p> : ""}

            {/* Password Field */}
            <div className="password-input">
              <label>Password</label>
              <div className="input-container">
                <input
                  type={revealPassword ? "text" : "password"}
                  name="txtPassword"
                  value={formValues.txtPassword}
                  onKeyDown={(e) => SearchByHandleKeyDown(e)}
                  onChange={(e) => updateState(e.target.name, e.target.value)}
                  placeholder="Enter Password"
                  autoComplete="off"
                  required
                />
                {revealPassword ? (
                  <VscEyeClosed className="password-icon" onClick={togglePassword} />
                ) : (
                  <VscEye className="password-icon" onClick={togglePassword} />
                )}
              </div>
            </div>
            {loginBtnClick && formValues.txtPassword === "" ? <p className="error-text-adminLogin">Password is required</p> : " "}

            {/* Captcha Field */}
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
                  required
                />
              </div>
            </div>
            {loginBtnClick && enteredCaptcha === "" ? <p className="error-text-adminLogin">Captcha is required</p> : ""}

            {/* Login Button */}
            <button
              className="get-otp"
              style={{
                height: "44px",
                width: "100%",
                marginTop: "10px",
              }}
              onClick={handleClick}
            >
              Login
            </button>
          </>
        )}
      </div>
      {/* </motion.div> */}
    </>
  );
}

export default AdminLogin;
