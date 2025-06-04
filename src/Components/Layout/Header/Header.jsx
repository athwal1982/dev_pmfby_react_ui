import { React, useState, useEffect } from "react";
import { RiPagesLine, RiLockPasswordLine } from "react-icons/ri";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import PropTypes from "prop-types";
import BizClass from "./Header.module.scss";
import ResetPasswordModal from "../../Modules/Setup/UserManagement/Views/Modals/ResetPasswordModal/ResetPasswordModal";
import { IconButton } from "@mui/material";
import { TfiAlignJustify } from "react-icons/tfi";

function Header({ pagetitle, onToggleSidebar, isSidebarCollapsed }) {
  const userData = getSessionStorage("user");
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleResetPasswordModal = () => {
    setResetPasswordModal(!resetPasswordModal);
    setSelectedUserData({ AppAccessID: userData.LoginID });
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getHeaderMargin = () => {
    return isSidebarCollapsed ? 70 : 214;
  };

  return (
    <>
      {resetPasswordModal ? <ResetPasswordModal showfunc={toggleResetPasswordModal} selectedUserData={selectedUserData} /> : null}
      <div
        className={BizClass.Box}
        style={{
          marginLeft: getHeaderMargin(),
          transition: "margin-left 0.3s ease-in-out",
          width: `calc(100% - ${getHeaderMargin()})`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <IconButton style={{ padding: "15px" }} onClick={onToggleSidebar}>
            <TfiAlignJustify />
          </IconButton>
          &nbsp;&nbsp;
          <div className={BizClass.PageTitle}>
            {pagetitle === "Home" ? (
              <>
                <RiPagesLine />
                <p>KRPH Portal</p>
              </>
            ) : pagetitle === "Faq" ? (
              <>
                <RiPagesLine />
                <p>FAQ</p>
              </>
            ) : (
              <>
                <RiPagesLine />
                <p>{pagetitle}</p>
              </>
            )}
          </div>
        </div>
        <div className={BizClass.SubBoxDiv}>
          {(pagetitle === "Home" || pagetitle === "Billing Dashboard") && (
            <div className={BizClass.UserInfo}>
              <p>
                {userData?.CompanyName || ""} : {userData?.UserDisplayName || ""}
                {userData.BRHeadTypeID !== 124004 && userData.BRHeadTypeID !== 124005 && (
                  <RiLockPasswordLine title="Change Password" style={{ cursor: "pointer" }} onClick={toggleResetPasswordModal} />
                )}
              </p>
            </div>
          )}
          <div className={BizClass.TicketTabBox} id="BizHeaderPortal" />
        </div>
      </div>
      {userData.BRHeadTypeID !== 124004 && userData.BRHeadTypeID !== 124005 && userData?.ActivationDays >= 40 && userData?.ActivationDays <= 45 && (
        <div className={BizClass.popup}>Your password is going to expire, please reset the password.</div>
      )}
    </>
  );
}

Header.propTypes = {
  pagetitle: PropTypes.string.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired,
};

export default Header;
