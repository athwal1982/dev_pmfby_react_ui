import React, { useState } from "react";
import { Typography, Button, Box, Menu, MenuItem, IconButton, Grid, Stack, Dialog, DialogContent, DialogTitle } from "@mui/material";
import "./Header.css";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactComponent as LogoPMFBY } from "../../assets/img/Group 161806.svg";
import whatsapp_orig from "../../assets/img/whatsapp_original.svg";
import farmer from "../../assets/img/farmer_login.svg";
import agent from "../../assets/img/agent_login.svg";
import ncip from "../../assets/img/ncip_login.svg";
import official from "../../assets/img/official_login.svg";
import contact from "../../assets/img/contact_login.svg";
import { useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import download_app from "../../assets/Download_Farmer_App.svg";
import { setSessionStorage } from "../Common/Login/Auth/auth";
import { Headphones, Close } from "@mui/icons-material";
import qr_app from "../../assets/img/qr_app.jpg";

const Header = ({ handleWhatsAppClick }) => {
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

  const [open, setOpen] = useState(false);

  const handleClickFarmerApp = () => {
    setOpen(true);
  };

  const handleCloseFarmerApp = () => {
    setOpen(false); // A Close the popup
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
      navigate("/krphloginN");
    } */
    if (path === "/csc-support") {
      setSessionStorage("Links", "CSC");
      navigate("/krphloginN");
    } else if (path === "/ic-support") {
      setSessionStorage("Links", "IC");
      navigate("/krphloginN");
    } else if (path === "/goi-support") {
      setSessionStorage("Links", "GOI");
      navigate("/krphloginN");
    } else if (path === "/bank-ncip") {
      setSessionStorage("Links", "BNK");
      navigate("/krphloginN");
    } else if (path === "/state-ncip") {
      setSessionStorage("Links", "ST");
      navigate("/krphloginN");
    } else if (path === "/cs") {
      setSessionStorage("Links", "CS");
      navigate("/krphloginN");
    } else if (path === "/cli") {
      setSessionStorage("Links", "CLI");
      navigate("/krphloginN");
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
      <Box className="header_top_fix">
        <Grid
          className="gridContainer_Header"
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            background: "#086107",
            borderBottom: "0.5px solid #E9ECEF",
            flexWrap: "wrap",
            gap: "0",
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
            <div className="newHeader__upperHeaderLogo___2oRzJ col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <img
                src="https://pmfby.amnex.co.in/pmfby/public/img/Emblem.svg"
                alt="Govt. of India National Emblem"
                title="Govt. of India National Emblem"
                class="newHeader__upperHeaderLogoH___3uufO"
              />
              <ul>
                <li>
                  <span>भारत सरकार</span>
                  <span>GOVERNMENT OF INDIA</span>
                </li>
                <li>
                  <span>कृषि एवं किसान कल्याण मंत्रालय</span>
                  <span>MINISTRY OF AGRICULTURE &amp; FARMERS WELFARE</span>
                </li>
              </ul>
            </div>

            {/* <img src={ministry_logo} alt="PMFBY Logo" className="img_mininstry_header" style={{}} /> */}
          </Grid>

          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "left",
              gap: { xs: 2, md: 4 },
              flexWrap: "wrap",
              justifyContent: { xs: "left", md: "flex-end" },
              width: { xs: "100%", md: "auto" },
              marginTop: { xs: 2, md: 0 },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              {/* <img src={download_app} alt=" Download Farmer App" onClick={handleClickFarmerApp} style={{ cursor: "pointer", height: "40px" }} />{" "} */}
              <Typography
                onClick={handleClickFarmerApp}
                sx={{
                  cursor: "pointer",
                  fontFamily: "Open Sans",
                  color: "white",
                  paddingBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <a class="download-button">
                  <svg class="icon-download" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5V13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6a.5.5 0 0 1 1 0V13a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.6a.5.5 0 0 1 .5-.5z" />
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 1 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                  </svg>
                  <span> Download Farmer App</span>
                </a>
              </Typography>

              <span style={{ color: "white" }}> | </span>
              <Typography
                onClick={handleWhatsAppClick}
                sx={{
                  cursor: "pointer",
                  fontFamily: "Open Sans",
                  color: "white",
                  fontSize: { xs: "11px", md: "12px" },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <img src={whatsapp_orig} alt="" style={{ height: "18px", cursor: "pointer" }} />
                <span>PMFBY WhatsApp - 7065514447 </span>
              </Typography>
              <span style={{ color: "white" }}> | </span>
              <Typography
                sx={{
                  fontFamily: "Open Sans",
                  color: "white",
                  fontSize: { xs: "11px", md: "12px" },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Headphones />
                <span className="blink_krph_helpline">KRPH Helpline - 14447</span>
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        {/* Navigation Menu */}
        <Box className="navbar-container-landing">
          <Box className="logo-container-landing">
            <a href="https://pmfby.gov.in/" target="_blank">
              <LogoPMFBY style={{ width: "85%" }} />
            </a>
          </Box>

          {/* Desktop Menu */}
          <Box className="menu-container-landing-page" style={{ paddingRight: "54px" }}>
            {menuItems.map(({ icon, label, path, isDropdown, submenu, value }, index) => {
              const isActive = location.pathname === path;

              return (
                <Box key={index} className="menu-dropdown-landing">
                  <Button
                    sx={{ textTransform: "none" }}
                    onClick={isDropdown ? (e) => handleClick(e, label) : () => handleGotoKrph(path)}
                    className={isActive ? "custom-button-login-landing-page active" : "custom-button-login-landing-page"}
                  >
                    <Box className="icon-container-landing-page">
                      <img src={icon} alt={label} />
                    </Box>
                    <span style={{ color: "#686E74" }}>
                      {label}
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
                          minWidth: value === "ncip" ? "70px" : value === "agent" ? "70px" : value === "farmer" ? "140px" : "",
                          display: "flex",
                        },
                      }}
                    >
                      {submenu.map((subItem, subIndex) => (
                        <MenuItem
                          key={subIndex}
                          onClick={() => handleGotoKrph(subItem.path)}
                          className="menu-item-landing-page"
                          sx={{
                            color: "#fff",
                            textAlign: "left",
                            fontSize: "14px",
                            backgroundColor: "#086107",
                            zIndex: "9999999",
                          }}
                        >
                          {subItem.label}
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
                  <Box className="icon-container-landing-page">
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
                      <MenuItem
                        key={subIndex}
                        onClick={() => handleGotoKrph(subItem.path)}
                        sx={{
                          color: "#fff",
                          textAlign: "left",
                          fontSize: "14px",
                          backgroundColor: "#086107",
                        }}
                        className="menu-item-landing-page"
                      >
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
      <Dialog
        open={open}
        onClose={handleCloseFarmerApp}
        maxWidth="sm"
        fullWidth
        className="dialog_WhatsappQR"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "30px",
            borderColor: "none",
            boxShadow: "none",
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: " rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "18px",
            padding: "5px 24px 5px 24px",
            bgcolor: "#075307",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Open Sans",
            fontSize: { xs: "14px", md: "14px" },
          }}
        >
          <span>Download Farmer App</span>
          <IconButton
            onClick={handleCloseFarmerApp}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "#075307",
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "justify", padding: "0px 40px 20px 40px", fontFamily: "Open Sans", fontSize: "14px", lineHeight: "22px" }}>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <div style={{ border: "1px solid #EFF0F1", borderRadius: "5px", padding: "10px" }}>
              <img src={qr_app} alt="QR" width="100%" />
            </div>
          </Box>
          <div>
            Crop Insurance App comes under Pradhan Mantri Fasal Bima Yojana. It is owned by the Department of Agriculture & Farmer Welfare, Govt. of India. The
            application provides services related to agriculture insurance to farmers. Through this digital platform, a farmer can register him/herself and get
            insurance for crop(s) being cultivated for Kharif and Rabi in a hassle-free manner.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
