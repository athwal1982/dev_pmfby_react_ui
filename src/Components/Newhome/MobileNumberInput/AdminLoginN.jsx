import { React, useEffect, useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { MdOutlineRefresh } from "react-icons/md";
import { generateCaptcha } from "./utils/capthcaUtils";
import "./KRPHPortalN.css";
import { motion } from "framer-motion";
import AddLoginLogics from "./utils/Logic";
import { CircularProgress } from "@mui/material";

function AdminLoginN({ handleOtpSent, setSelectedOption }) {
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
      <div className="mobile-inputN">
        {invisble && (
          <>
            {/* Username Field */}
            <label htmlFor="Username">User Name</label>
            <div className="input-containerN">
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
            <div className="password-inputN">
              <label>Password</label>
              <div className="input-containerN">
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
                  <VscEyeClosed className="password-iconN" onClick={togglePassword} />
                ) : (
                  <VscEye className="password-iconN" onClick={togglePassword} />
                )}
              </div>
            </div>
            {loginBtnClick && formValues.txtPassword === "" ? <p className="error-text-adminLogin">Password is required</p> : " "}

            {/* Captcha Field */}
            <div className="captchaN" style={{ marginTop: "0px" }}>
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
                  required
                />
              </div>
            </div>
            {loginBtnClick && enteredCaptcha === "" ? <p className="error-text-adminLoginN">Captcha is required</p> : ""}

            {/* Login Button */}
            <button
              className="get-otpN"
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

export default AdminLoginN;
