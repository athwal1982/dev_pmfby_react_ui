import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import sidebar from "./sidebar";

const Dashboardsidebar = () => {
  const location = useLocation();

  const isActive = (item) => {
    if (item.link === location.pathname) return true;
    if (item.submenu?.some((subItem) => subItem.link === location.pathname)) return true;
    return false;
  };

  return (
    <div className="sidebar-main">
      <div className="menu-container">
        <ul className="sidebar-menu">
          {sidebar.map((item, index) => (
            <li key={index} className={`menu-item ${isActive(item) ? "active" : ""}`}>
              <Link href={item.link} className="menu-link">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-name">{item.name}</span>
              </Link>
              {/* Render submenu if it exists */}
              {item.submenu && item.submenu.length > 0 && (
                <ul className="submenu">
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex} className={`submenu-item ${subItem.link === location.pathname ? "active" : ""}`}>
                      <Link href={subItem.link} className="submenu-link">
                        <span className="submenu-icon">{subItem.icon}</span>
                        <span className="submenu-name">{subItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <ul className="sidebar-menu footer-bottom">
          <li className="menu-item">
            <Link className="menu-link">
              <span className="menu-icon">Logout</span>
              <span className="menu-name">
                <IoIosLogOut />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboardsidebar;
