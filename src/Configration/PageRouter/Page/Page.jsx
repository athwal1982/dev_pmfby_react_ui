import React, { useEffect, useState } from "react";
// A import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
// A import { getSessionStorage } from "Components/Common/Login/Auth/auth";
// A import { useNavigate } from "react-router-dom";
import Header from "Components/Layout/Header/Header";
import Sidebar from "Components/Layout/Sidebar/Sidebar";
import PropTypes from "prop-types";
import { SearchModal } from "Components/Layout/SearchModal";
// A import { logout } from "Components/Common/Login/Services/Methods";
import BizClass from "./Page.module.scss";

function Page(props) {
  const { title, component } = props;
  const [openSearchModal, setOpenSearchModal] = useState(false);
  // A const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [openMenus, setOpenMenus] = useState({}); // State to manage open menus

  // A const userData = getSessionStorage("user");
  // A const setAlertMessage = AlertMessage();

  const keyDownHander = (e) => {
    if (e.ctrlKey && e.code === "KeyI") {
      e.preventDefault();
      setOpenSearchModal(true);
    }

    if (e.keyCode === 27) {
      e.preventDefault();
      setOpenSearchModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHander, false);
  }, []);

  useEffect(() => {
    document.title = title ? `${title} | Pradhan Mantri Fasal Bima Yojana` : "Pradhan Mantri Fasal Bima Yojana";
  }, [title]);

  // A const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds
  // A const logoutTimerRef = useRef(null);

  // A useEffect(() => {
  // A  const signout = async () => {
  // A    // A Perform logout actions (e.g., clear session, redirect to login page)
  // A    console.log("User logged out due to inactivity");
  // A    // A Redirect to login page
  // A    try {
  // A      await logout(userData.LoginID ? userData.LoginID : 0, userData.SessionID ? userData.SessionID : 0);
  // A      sessionStorage.clear();
  // A      navigate("/");
  // A    } catch (error) {
  // A      console.log(error);
  // A      setAlertMessage({
  // A        type: "error",
  // A        message: error,
  // A      });
  // A    }
  // A  };

  // A  const resetLogoutTimer = () => {
  // A    clearTimeout(logoutTimerRef.current);
  // A    logoutTimerRef.current = setTimeout(signout, INACTIVITY_TIMEOUT);
  // A  };

  // A  const handleActivity = () => {
  // A    resetLogoutTimer();
  // A  };

  //   // A Event listeners for user activity
  // A  document.addEventListener("mousemove", handleActivity);
  // A  document.addEventListener("keypress", handleActivity);

  // A  // A Start the logout timer when the component mounts
  // A  resetLogoutTimer();

  // A  // A Clean up event listeners and timers on component unmount
  // A  return () => {
  // A    document.removeEventListener("mousemove", handleActivity);
  // A    document.removeEventListener("keypress", handleActivity);
  // A    clearTimeout(logoutTimerRef.current);
  // A  };
  // A }, []);
  const handleCollapse = () => {
    setOpenMenus(false);
  };
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <>
      {openSearchModal && <SearchModal setOpenSearchModal={setOpenSearchModal} />}
      <Header pagetitle={title} isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={toggleSidebar} />
      <div className={BizClass.Dash}>
        <Sidebar isCollapsed={isSidebarCollapsed} orCollapsed={setIsSidebarCollapsed} />
        <div className={BizClass.Box}>{component}</div>
      </div>
    </>
  );
}

export default Page;

Page.propTypes = {
  title: PropTypes.string.isRequired,
  component: PropTypes.node.isRequired,
};
