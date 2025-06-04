import React from "react";
import logoicon from "../../../assets/img/logo-icon.png";
import logoname from "../../../assets/img/logo-name.png";
import { CiTextAlignRight, CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaRegEnvelope } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const Dashboardheader = () => {
  return (
    <div className="dashboard-header">
      <div className="header-sidebar">
        <div className="image-container">
          <img src={logoicon} alt="" className="logo-icon" />
        </div>
        <div className="icon">
          <CiTextAlignRight />
        </div>
      </div>
      <div className="header-right">
        <div className="header-main-container">
          <div className="right-sidelogo">
            <img src={logoname} alt="" className="logo-name" />
          </div>
          <div className="left-sideheader">
            <div className="icon-container">
              <div className="icon">
                <CiSearch />
              </div>
              <div className="icon">
                <IoIosNotificationsOutline />
                <span className="notification-number">2</span>
              </div>
              <div className="icon">
                <FaRegEnvelope />
                <span className="notification-number-2">2</span>
              </div>
              <div className="icon">
                <FiUser />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardheader;
