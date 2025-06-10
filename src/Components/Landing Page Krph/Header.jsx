import React, { useState } from "react";
import { Typography, Button, Box, Menu, MenuItem, Select, IconButton, Grid, Stack } from "@mui/material";
import "./Header.css";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactComponent as LogoPMFBY } from "../../assets/img/Group 161806.svg";
import { ReactComponent as LogoPMFBYHindi } from "../../assets/icons_new/pmfby_logo_hindi.svg";
import whatsapp_orig from "../../assets/img/whatsapp_original.svg";
import farmer from "../../assets/img/farmer_login.svg";
import agent from "../../assets/img/agent_login.svg";
import ncip from "../../assets/img/ncip_login.svg";
import official from "../../assets/img/official_login.svg";
import contact from "../../assets/img/contact_login.svg";
import { useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ministry_logo from "../../assets/img/goi-krph.svg";
import { setSessionStorage } from "../Common/Login/Auth/auth";
import { Headphones } from "@mui/icons-material";

const Header = ({ language, handleLanguageChange, handleWhatsAppClick }) => {
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);

  const handleMobileDropdownClick = (event, label) => {
    setMobileAnchorEl(event.currentTarget);
    setOpenDropdown(label);
  };

  const handleMobileDropdownClose = () => {
    setMobileAnchorEl(null);
    setOpenDropdown(null);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDropdown, setOpenDropdown] = React.useState(null);

  const handleClick = (event, label) => {
    setAnchorEl(event.currentTarget);
    setOpenDropdown(label);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenDropdown(null);
  };

  const menuItems = [
    {
      value: "farmer",
      icon: farmer,
      label: "Farmer Corner",
      labelHindi: "किसान कॉर्नर",
      path: "/farmer",
      isDropdown: true,
      submenu: [
        { labelHindi: "शिकायत स्थिति", label: "Complaint Status", path: "/cs" },
        { label: "Crop Loss Intimation", path: "/cli", labelHindi: "फसल हानि सूचना" },
      ],
    },
    {
      value: "support",
      icon: agent,
      label: "KRPH Official's",
      labelHindi: "के-आर-पी-एच आधिकारिक",

      path: "/support",
      isDropdown: true,
      submenu: [
        { label: "GOI Login", path: "/goi-support", labelHindi: "जी-ओ-आई लॉगिन" },
        { label: "Insurance Company", path: "/ic-support", labelHindi: "आई-सी लॉगिन" },
        { label: "CSC Login", path: "/csc-support", labelHindi: "सी-एस-सी लॉगिन" },
      ],
    },
    {
      value: "ncip",
      icon: ncip,
      label: "NCIP User's",
      labelHindi: "एन-सी-आई-पी",

      path: "/ncip",
      isDropdown: true,
      submenu: [
        { labelHindi: "राज्य लॉगिन", label: "State Login", path: "/state-ncip" },
        { label: "Bank Login", path: "/bank-ncip", labelHindi: "बैंक लॉगिन" },
      ],
    },
    { value: "official", icon: official, label: "PMFBY Website", labelHindi: "पीएमएफबीवाई वेबसाइट", path: "/officialpmfby" },
    { value: "contact", icon: contact, label: "Contact Us", labelHindi: "संपर्क करें", path: "/contact" },
  ];
  const handleGotoKrph = (path) => {
    /*  A if (path === "/support") {
      setSessionStorage("Links", "SUP");
      navigate("/krphlogin2");
    } */
    if (path === "/csc-support") {
      setSessionStorage("Links", "CSC");
      navigate("/krphlogin2");
    } else if (path === "/ic-support") {
      setSessionStorage("Links", "IC");
      navigate("/krphlogin2");
    } else if (path === "/goi-support") {
      setSessionStorage("Links", "GOI");
      navigate("/krphlogin2");
    } else if (path === "/bank-ncip") {
      setSessionStorage("Links", "BNK");
      navigate("/krphlogin2");
    } else if (path === "/state-ncip") {
      setSessionStorage("Links", "ST");
      navigate("/krphlogin2");
    } else if (path === "/cs") {
      setSessionStorage("Links", "CS");
      navigate("/krphlogin2");
    } else if (path === "/cli") {
      setSessionStorage("Links", "CLI");
      navigate("/krphlogin2");
    } else if (path === "/officialpmfby") {
      const link = document.createElement("a");
      link.href = "https://pmfby.gov.in";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (path === "/contact") {
      const link = document.createElement("a");
      link.href = "/contact";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return;
  };
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [fontSize, setFontSize] = useState(16);

  const decreaseFontSize = () => setFontSize((size) => Math.max(12, size - 2));
  const increaseFontSize = () => setFontSize((size) => Math.min(24, size + 2));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMenuOpen);

  const handleMobileMenuClick = (event) => {
    setMobileMenuOpen(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(null);
  };

  return (
    <>
      <Box>
        <Grid
          className="gridContainer_Header"
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            background: "black",
            borderBottom: "0.5px solid #E9ECEF",
            flexWrap: "wrap",
          }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              flex: { xs: "100%", md: "auto" },
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <img src={ministry_logo} alt="PMFBY Logo" className="img_mininstry_header" style={{}} />
          </Grid>

          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 2, md: 4 },
              flexWrap: "wrap",
              justifyContent: { xs: "center", md: "flex-end" },
              width: { xs: "100%", md: "auto" },
              marginTop: { xs: 2, md: 0 },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
              {language === "Hindi" ? (
                <>
                  <Typography
                    onClick={handleWhatsAppClick}
                    sx={{
                      cursor: "pointer",
                      fontFamily: "Quicksand, sans-serif",
                      color: "white",
                      fontSize: { xs: "12px", md: "14px" },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <img src={whatsapp_orig} alt="" style={{ height: "24px" }} />
                    पीएमएफबीवाई व्हाट्सएप - <span style={{ color: "#7ED321" }}>7065514447</span>
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Quicksand, sans-serif",
                      color: "white",
                      fontSize: { xs: "12px", md: "14px" },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Headphones />
                    हेल्पलाइन - <span style={{ color: "#7ED321" }}>14447</span>
                  </Typography>
                </>
              ) : language === "English" ? (
                <>
                  <Typography
                    onClick={handleWhatsAppClick}
                    sx={{
                      cursor: "pointer",
                      fontFamily: "Quicksand, sans-serif",
                      color: "white",
                      fontSize: { xs: "12px", md: "14px" },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <img src={whatsapp_orig} alt="" style={{ height: "24px" }} />
                    PMFBY WhatsApp - <span style={{ color: "#7ED321" }}>7065514447</span>
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Quicksand, sans-serif",
                      color: "white",
                      fontSize: { xs: "12px", md: "14px" },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Headphones />
                    Helpline - <span style={{ color: "#7ED321" }}>14447</span>
                  </Typography>
                </>
              ) : (
                ""
              )}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1} style={{ display: "none" }}>
              {language === "English" ? (
                <Typography sx={{ color: "white", fontFamily: "Quicksand, sans-serif", fontSize: { xs: "12px", md: "14px" } }}>Change Language:</Typography>
              ) : language === "Hindi" ? (
                <Typography sx={{ color: "white", fontFamily: "Quicksand, sans-serif", fontSize: { xs: "12px", md: "14px" } }}>भाषा बदलें :</Typography>
              ) : (
                <Typography sx={{ color: "white", fontFamily: "Quicksand, sans-serif", fontSize: { xs: "12px", md: "14px" } }}>Change Language:</Typography>
              )}
              <Select
                value={language}
                onChange={handleLanguageChange}
                variant="standard"
                IconComponent={ExpandMoreIcon}
                sx={{
                  fontWeight: "bold",
                  minWidth: "80px",
                  fontFamily: "Quicksand, sans-serif",
                  color: "white",
                  fontSize: { xs: "12px", md: "14px" },
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                <MenuItem
                  value="English"
                  sx={{
                    color: "rgb(104, 110, 116)",
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#F2FEDA", color: "black" },
                    "&.Mui-selected": { backgroundColor: "white" },
                    "&.Mui-selected:hover": { backgroundColor: "#F2FEDA", color: "black" },
                  }}
                >
                  English
                </MenuItem>
                <MenuItem
                  value="Hindi"
                  sx={{
                    color: "rgb(104, 110, 116)",
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#F2FEDA", color: "black" },
                    "&.Mui-selected": { backgroundColor: "white" },
                    "&.Mui-selected:hover": { backgroundColor: "#F2FEDA", color: "black" },
                  }}
                >
                  हिंदी
                </MenuItem>
              </Select>
            </Stack>
          </Grid>
        </Grid>

        {/* Right Side - Contact Info */}
        {/* <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1" sx={{ color: "gray" }}>
                Text
              </Typography>
              <Button onClick={decreaseFontSize} size="small">
                A-
              </Button>
              <Typography sx={{ fontSize: `${fontSize}px`, fontWeight: "bold" }}>A</Typography>
              <Button onClick={increaseFontSize} size="small">
                A+
              </Button>
            </Box> */}

        {/* Navigation Menu */}
        <Box className="navbar-container-landing">
          <Box className="logo-container-landing">
            {language === "English" ? (
              <a href="https://pmfby.gov.in/" target="_blank">
                <LogoPMFBY style={{ width: "85%" }} />
              </a>
            ) : language === "Hindi" ? (
              <a href="https://pmfby.gov.in/" target="_blank">
                <LogoPMFBYHindi style={{ width: "85%" }} />
              </a>
            ) : (
              <a href="https://pmfby.gov.in/" target="_blank">
                <LogoPMFBY style={{ width: "85%" }} />
              </a>
            )}
          </Box>

          {/* Desktop Menu */}
          <Box className="menu-container-landing">
            {menuItems.map(({ icon, label, path, isDropdown, submenu, labelHindi, value }, index) => {
              const isActive = location.pathname === path;

              return (
                <Box
                  key={index}
                  className="menu-dropdown-landing"
                  style={{ display: "inline-block", borderRight: index < menuItems.length - 1 ? "1px solid #ccc" : "none", paddingRight: "10px" }}
                >
                  <Button
                    sx={{ textTransform: "none" }}
                    onClick={isDropdown ? (e) => handleClick(e, label) : () => handleGotoKrph(path)}
                    className={isActive ? "custom-button-login-landing active" : "custom-button-login-landing"}
                  >
                    <Box className="icon-container-landing">
                      <img src={icon} alt={label} style={{ width: "90%", height: "90%" }} />
                    </Box>
                    <span style={{ color: "#686E74" }}>
                      {language === "Hindi" ? labelHindi : language === "English" ? label : ""}
                      {isDropdown && (openDropdown === label ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                    </span>
                  </Button>

                  {isDropdown && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && openDropdown === label}
                      onClose={handleClose}
                      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                      transformOrigin={{ vertical: "top", horizontal: "left" }}
                      PaperProps={{
                        sx: {
                          minWidth: value === "ncip" ? "130px" : value === "agent" ? "70px" : value === "farmer" ? "140px" : "",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: value === "agent" ? "0px 10px 0 10px" : value === "farmer" ? "0px 10px 0 10px" : "",
                        },
                      }}
                    >
                      {submenu.map((subItem, subIndex) => (
                        <MenuItem
                          key={subIndex}
                          onClick={() => handleGotoKrph(subItem.path)}
                          className="menu-item-landing"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "rgb(104, 110, 116)",
                            textAlign: "left",
                            fontSize: "14px",
                          }}
                        >
                          {language === "English" ? subItem.label : language === "Hindi" ? subItem.labelHindi : subItem.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </Box>
              );
            })}
          </Box>
          <IconButton className="hamburger-icon-landing" onClick={handleMobileMenuClick}>
            <MenuIcon />
          </IconButton>

          {/* Mobile Drawer */}
          <Menu
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            className="mobile-dropdown-menu"
          >
            {/* Close Button */}
            <MenuItem onClick={handleMobileMenuClose} className="close-menu-item">
              <CloseIcon />
            </MenuItem>

            {menuItems.map(({ icon, label, path, isDropdown, submenu }, index) => (
              <Box key={index}>
                <MenuItem onClick={isDropdown ? (e) => handleMobileDropdownClick(e, label) : () => handleGotoKrph(path)} className="menu-item-landing">
                  <Box className="icon-container-landing">
                    <img src={icon} alt={label} width={24} height={24} />
                  </Box>
                  <span>{label}</span>
                  {isDropdown && (openDropdown === label ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                </MenuItem>

                {/* Dropdown menu */}
                {isDropdown && (
                  <Menu
                    anchorEl={mobileAnchorEl}
                    open={Boolean(mobileAnchorEl) && openDropdown === label}
                    onClose={handleMobileDropdownClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    {submenu.map((subItem, subIndex) => (
                      <MenuItem key={subIndex} onClick={() => handleGotoKrph(subItem.path)} className="menu-item-landing">
                        {subItem.label}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </Box>
            ))}
          </Menu>
        </Box>
      </Box>
    </>
  );
};

export default Header;
