import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import BizClass from "./Sidebar.module.scss";

import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Tooltip } from "@mui/material";
import { AiFillSetting } from "react-icons/ai";
import Dash from "../../../assets/sidebar_icons/Dashboard.svg";
import Ticket from "../../../assets/sidebar_icons/Ticket.svg";
import setup from "../../../assets/sidebar_icons/Setup.svg";
import enquiry from "../../../assets/sidebar_icons/Enquiry.svg";
import premCalc from "../../../assets/sidebar_icons/Premium Calculator.svg";
import faq from "../../../assets/sidebar_icons/faq.svg";
import report from "../../../assets/sidebar_icons/Report.svg";
import Notification from "../../../assets/sidebar_icons/notification.svg";
import { FaTicketAlt, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { MdOutlineDashboard, MdFeedback, MdAssignmentTurnedIn } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { logout } from "../../Common/Login/Services/Methods";
import { fetchCallingDashboardlogin, fetchCallingDashboardlogOut } from "./Services/Methods";
import { getUserRightData } from "../../Modules/Setup/MenuManagement/Services/Methods";
import { getSessionStorage, setSessionStorage } from "Components/Common/Login/Auth/auth";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box } from "@mui/system";

function Sidebar({ isCollapsed }) {
  debugger;
  const navigate = useNavigate();
  const userData = getSessionStorage("user");
  const [collapsed, setCollapsed] = useState(true);
  const [openMenus, setOpenMenus] = useState({});

  const [subMenuList, setSubMenuList] = useState([]);
  const [menuNodes, setMenuNodes] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeSubMenuId, setActiveSubMenuId] = useState(null);

  const setAlertMessage = AlertMessage();

  const getUserRightDataList = async (pUserID, pMenuMasterID, pMenu, pType) => {
    setSessionStorage("UserMenuId", pMenuMasterID);
    try {
      const formdata = {
        userID: pUserID,
        menuMasterID: pMenuMasterID,
      };
      const result = await getUserRightData(formdata);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.UserProfileRight.length > 0) {
          setSessionStorage("UserRights", result.response.responseData.UserProfileRight);
          if (pType === "Menu") {
            navigate(pMenu.url && pMenu.url);
          } else if (pType === "SubMenu") {
            navigate(pMenu.url);
          }
        } else {
          setSessionStorage("UserRights", []);
          if (pType === "Menu") {
            navigate(pMenu.url && pMenu.url);
          } else if (pType === "SubMenu") {
            navigate(pMenu.url);
          }
        }
      } else {
        setSessionStorage("UserRights", []);
        if (pType === "Menu") {
          navigate(pMenu.url && pMenu.url);
        } else if (pType === "SubMenu") {
          navigate(pMenu.url);
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getCallingdashboard = async () => {
    let fgmsDashboardUrl = "https://krph.csccloud.in/admin/dashboard";
    if (getSessionStorage("callingDashboard") === null) {
      const result = await fetchCallingDashboardlogin();
      if (result.responseCode === 1) {
        const validTillToken = new Date();
        validTillToken.setMinutes(validTillToken.getMinutes() + 60);
        setSessionStorage("callingDashboard", { resultToken: result.responseData.access_token, validTillToken: validTillToken });
        window.open(fgmsDashboardUrl + `?token=${result.responseData.access_token}`, "_blank");
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } else {
      const resultCallingDashboard = getSessionStorage("callingDashboard");
      if (resultCallingDashboard.validTillToken) {
        const date = new Date(resultCallingDashboard.validTillToken);
        const now = new Date();
        if (now > date) {
          sessionStorage.removeItem("callingDashboard");
          const result = await fetchCallingDashboardlogOut(resultCallingDashboard.resultToken);
          if (result.responseCode === 1) {
            getCallingdashboard();
          } else {
            setAlertMessage({
              type: "error",
              message: result.responseMessage,
            });
          }
        } else {
          window.open(fgmsDashboardUrl + `?token=${resultCallingDashboard.resultToken}`, "_blank");
        }
      }
    }
  };

  const onClickSubMenu = (submenu) => {
    debugger;
    setActiveSubMenuId(submenu.submenuid);

    if (submenu.name === "Calling Dashboard") {
      getCallingdashboard();
    } else if (submenu.name === "BI Dashboard") {
      const pathUrl = window.location.href;
      window.open(pathUrl + "/BIDashboard", "_blank");
    } else {
      getUserRightDataList(userData && userData.LoginID ? userData.LoginID : 0, submenu.menuMasterID, submenu, "SubMenu");
    }
  };

  const [menus, setMenues] = useState();
  useMemo(async () => {
    const user = getSessionStorage("user");
    setMenues(user.userMenuMaster);
  }, []);

  let menuNodesData = [];

  useEffect(() => {
    if (menus) {
      menuNodesData = [];
      const parent = menus.filter((x) => x.UnderMenuID === 0);
      console.log(parent, "parent");
      parent.forEach((m, i) => {
        const newView = { id: i + 1, name: m.MenuName, url: m.ReactURL, menuMasterID: m.MenuMasterID, submenu: [] };
        menus.forEach((menu, j) => {
          if (menu.UnderMenuID === m.MenuMasterID) {
            newView.submenu.push({
              id: `${i + 1}-${j + 1}`,
              name: menu.MenuName,
              url: menu.ReactURL,
              menuMasterID: menu.MenuMasterID,
            });
          }
        });
        menuNodesData.push(newView);
      });
      setMenuNodes(menuNodesData);
    }
    setCollapsed(false);
  }, [menus]);

  const menuIconWithSwitch = (parameter) => {
    const icon = getIconSource(parameter);
    return typeof icon === "string" ? <img src={icon} alt={`${parameter} Icon`} /> : icon;
  };

  const getIconSource = (parameter) => {
    switch (parameter) {
      case "Dashboard":
        return Dash;
      case "Ticket":
        return Ticket;
      case "Ticket Assignment":
        return <MdAssignmentTurnedIn />;
      case "Setup":
        return setup;
      case "Enquiry":
        return enquiry;
      case "Notification":
        return Notification;
      case "Crop Notification":
        return Notification;
      case "Premium Calculator":
        return premCalc;
      case "FAQ":
        return faq;
      case "Report":
        return report;
      case "Training Management":
        return <FaChalkboardTeacher style={{ color: "white" }} />;
      case "Trainee":
        return <FaUserGraduate style={{ color: "white" }} />;
      case "Settings":
        return <AiFillSetting style={{ color: "white" }} />;
      case "Offline Intimation":
        return <FaTicketAlt style={{ color: "white" }} />;
      case "Offline Grievance":
        return <FaTicketAlt style={{ color: "white" }} />;
      default:
        return null;
    }
  };
  const signOut = async () => {
    try {
      await logout(userData.LoginID ? userData.LoginID : 0, userData.SessionID ? userData.SessionID : 0);
      sessionStorage.clear();
      window.location = `${window.location.origin}${window.location.pathname}`;
      // A navigate("/");
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const toggleMenu = (menu) => {
    debugger;
    setActiveMenuId(menu.id);

    if (menu.submenu && menu.submenu.length > 0) {
      setSubMenuList(menu.submenu);
    } else {
      setSubMenuList([]);
      setActiveSubMenuId("0");
      getUserRightDataList(userData?.LoginID || 0, menu.menuMasterID, menu, "Menu");
    }
  };

  const handleMenuToggle2 = (id) => {
    debugger;
    // AsetActiveMenuId(id);

    setOpenMenus((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [id]: !prevState[id],
    }));

    if (openMenus[id] === true) {
      setActiveMenuId();
    }
  };

  return (
    <>
      <div
        style={{
          background: "linear-gradient(to bottom, #037503, #075307)",
          height: "100vh",
          width: isCollapsed ? 70 : 214,
          transition: "width 0.5s ease",
        }}
      >
        <Drawer
          sx={{
            width: isCollapsed ? 70 : 214,
            flexShrink: 0,
            transition: "width 0.5s ease",
            "& .MuiDrawer-paper": {
              width: isCollapsed ? 70 : 214,
              boxSizing: "border-box",
              background: "linear-gradient(to bottom, #037503, #075307)",
              overflowY: "auto",
              scrollbarWidth: "thin",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              "&::-webkit-scrollbar": { width: "8px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
                "&:hover": { backgroundColor: "#555" },
              },
            },
          }}
          variant="persistent"
          anchor="left"
          open={true}
        >
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Top Content */}
            <div
              style={{
                display: "flex",
                justifyContent: isCollapsed ? "flex-start" : "center",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <button style={{ border: "0", background: "transparent" }} type="button" onClick={() => navigate("/welcome")}>
                <img
                  src="https://pmfby.amnex.co.in/krph/public/img/favicon.svg"
                  alt="Client Logo"
                  style={{
                    width: isCollapsed ? 40 : 50,
                    transition: "width 0.3s ease",
                  }}
                />
              </button>
            </div>

            {/* Menu List */}
            <List>
              {menuNodes?.map((data) => (
                <div key={data.id}>
                  <Tooltip title={isCollapsed ? data.name : ""} placement="right" arrow>
                    <ListItem
                      sx={{
                        marginLeft: "7px",
                        width: "95%",
                        marginBottom: "9px",
                        borderRadius: "30px",
                        backgroundColor: activeMenuId === data.id ? "#E3F7B6" : "transparent",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#E3F7B6",
                          color: "#065C06",
                          "& .MuiListItemButton-root, & .MuiListItemIcon-root, & .MuiListItemText-primary, & .expand-icon": {
                            color: "#065C06",
                          },
                        },
                      }}
                      disablePadding
                    >
                      <ListItemButton
                        onClick={() => {
                          toggleMenu(data);
                          handleMenuToggle2(data.id);
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: "40px",
                            fontSize: isCollapsed ? "1.8rem" : "1.6rem",
                            transition: "font-size 0.3s ease",
                            "& img": {
                              filter:
                                activeMenuId === data.id
                                  ? "invert(67%) sepia(93%) saturate(1057%) hue-rotate(105deg) brightness(94%) contrast(102%)"
                                  : "#FFFFFF",
                              transition: "filter 0.3s ease",
                            },
                            "&:hover img": {
                              filter: "invert(67%) sepia(94%) saturate(758%) hue-rotate(80deg) brightness(94%) contrast(102%)",
                            },
                          }}
                        >
                          {menuIconWithSwitch(data.name)}
                        </ListItemIcon>

                        {!isCollapsed && (
                          <>
                            <ListItemText sx={{ color: activeMenuId === data.id ? "#065C06" : "white" }}>
                              <div style={{ fontSize: "0.79rem" }}>{data.name}</div>
                            </ListItemText>
                            {data.submenu &&
                              data.submenu.length > 0 &&
                              (openMenus[data.id] ? (
                                <ExpandLess className="expand-icon" sx={{ color: activeMenuId === data.id ? "#065C06" : "white" }} />
                              ) : (
                                <ExpandMore className="expand-icon" sx={{ color: activeMenuId === data.id ? "#065C06" : "white" }} />
                              ))}
                          </>
                        )}
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>

                  {!isCollapsed && data.submenu && data.submenu.length > 0 && (
                    <Collapse in={openMenus[data.id]} timeout="auto" unmountOnExit style={{ paddingLeft: "20px" }}>
                      <List className={collapsed === false ? BizClass.SubBox : classNames(BizClass.SubBox, BizClass.CollapsedBar)}>
                        {subMenuList.map((subData) => (
                          <List key={subData.id}>
                            <ListItem
                              sx={{
                                cursor: "pointer",
                                padding: "0px 0px 0px 18px !important",
                                background: activeSubMenuId === subData.id ? "#B0E57C" : "transparent",
                                borderRadius: "30px",
                                fontSize: "0.75rem",
                                color: activeSubMenuId === subData.id ? "#065C06" : "white",
                                "&:hover": {
                                  backgroundColor: "#E3F7B6",
                                  color: "#065C06",
                                  transition: "background-color 0.3s ease, color 0.3s ease",
                                },
                                transition: "background-color 0.3s ease, color 0.3s ease",
                              }}
                              type="button"
                              onClick={() => onClickSubMenu(subData)}
                            >
                              <ListItemText>
                                <div style={{ fontSize: "0.74rem" }}>➤ {subData.name}</div>
                              </ListItemText>
                            </ListItem>
                          </List>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </div>
              ))}
            </List>

            {/*      A  <ListItem
              button
              onClick={() => navigate("/sla-dashboard")}
              sx={{
                color: "white",
                borderRadius: "30px",
                transition: "0.4s",
                "&:hover": { backgroundColor: "#E3F7B6", color: "#065C06" },
                "&:hover .MuiListItemButton-root": { color: "#065C06" },
                "&:hover .MuiListItemIcon-root": { color: "#065C06" },
                "&:hover .MuiListItemText-primary": { color: "#065C06" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: "40px" }}>
                <MdOutlineDashboard
                  style={{
                    fontSize: collapsed ? "2.5rem" : "1.5rem",
                    transition: "font-size 0.3s ease",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="SLA V2" />}
            </ListItem>
           
            <ListItem
              button
              onClick={() => navigate("/feedbackForm")}
              sx={{
                color: "white",
                borderRadius: "30px",
                transition: "0.4s",
                "&:hover": { backgroundColor: "#E3F7B6", color: "#065C06" },
                "&:hover .MuiListItemButton-root": { color: "#065C06" },
                "&:hover .MuiListItemIcon-root": { color: "#065C06" },
                "&:hover .MuiListItemText-primary": { color: "#065C06" },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px", color: "white" }}>
                <MdFeedback
                  style={{
                    fontSize: collapsed ? "2.5rem" : "1.5rem",
                    transition: "font-size 0.3s ease",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="Feedback V2" />}
            </ListItem>
            <ListItem
              button
              onClick={() => navigate("/csc-main")}
              sx={{
                color: "white",
                borderRadius: "30px",
                transition: "0.4s",
                "&:hover": { backgroundColor: "#E3F7B6", color: "#065C06" },
                "&:hover .MuiListItemButton-root": { color: "#065C06" },
                "&:hover .MuiListItemIcon-root": { color: "#065C06" },
                "&:hover .MuiListItemText-primary": { color: "#065C06" },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px", color: "white" }}>
                <MdFeedback
                  style={{
                    fontSize: collapsed ? "2.5rem" : "1.5rem",
                    transition: "font-size 0.3s ease",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="CSC V2" />}
            </ListItem>

            <ListItem
              button
              onClick={() => navigate("/cscagentform")}
              sx={{
                color: "white",
                borderRadius: "30px",
                transition: "0.4s",
                "&:hover": { backgroundColor: "#E3F7B6", color: "#065C06" },
                "&:hover .MuiListItemButton-root": { color: "#065C06" },
                "&:hover .MuiListItemIcon-root": { color: "#065C06" },
                "&:hover .MuiListItemText-primary": { color: "#065C06" },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px", color: "white" }}>
                <MdFeedback
                  style={{
                    fontSize: collapsed ? "2.5rem" : "1.5rem",
                    transition: "font-size 0.3s ease",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="CSC V3" />}
            </ListItem>
 */}
            <Box sx={{ marginTop: "auto" }}>
              <Tooltip title={isCollapsed ? "Log Out" : ""} placement="right" arrow>
                <ListItem
                  disablePadding
                  sx={{
                    marginLeft: "7px",
                    width: "95%",
                    marginBottom: "10px",
                    backgroundColor: "transparent",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: "30px",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#E3F7B6",
                      color: "#065C06",
                      "& .list-item-icon": { color: "#065C06" },
                    },
                  }}
                >
                  <ListItemButton onClick={signOut}>
                    <ListItemIcon
                      sx={{
                        minWidth: "40px",
                        fontSize: isCollapsed ? "1.8rem" : "1.6rem",
                        color: "white",
                        transition: "font-size 0.3s ease",
                      }}
                    >
                      <FiLogOut />
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText>
                        <div style={{ fontSize: "0.79rem" }}>Log Out</div>
                      </ListItemText>
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </Box>
          </Box>
        </Drawer>
      </div>
    </>
  );
}

export default Sidebar;
