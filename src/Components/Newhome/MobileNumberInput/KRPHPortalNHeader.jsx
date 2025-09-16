import React, { useState } from "react";
import { Typography, Button, Box, Grid, IconButton, Stack, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MdHome } from "react-icons/md";
import { ReactComponent as LogoPMFBY } from "../../../assets/img/Group 161806.svg";
import whatsapp_orig from "../../../assets/img/whatsapp_original.svg";
import { Headphones, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import qr_app from "../../../assets/img/qr_app.jpg";
import "../../LandingPage/Header.css";

const KRPHPortalNHeader = ({ handleWhatsAppClick }) => {
  const navigate = useNavigate();

  const menuItems = [{ value: "home", icon: MdHome, label: "Home", path: "/LandingPage" }];

  const [open, setOpen] = useState(false);

  const handleClickFarmerApp = () => {
    setOpen(true);
  };

  const handleCloseFarmerApp = () => {
    setOpen(false); // A Close the popup
  };

  const handleGotoKrph = (path) => {
    if (path === "/LandingPage") {
      navigate("/LandingPage");
    }
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
                  <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
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
          <Box className="menu-container-landing-login">
            {menuItems.map(({ icon, label, path }, index) => {
              return (
                <Box key={index} className="menu-dropdown-landing">
                  <Button sx={{ textTransform: "none" }} onClick={() => handleGotoKrph(path)}>
                    <Box className="icon-container-landing-page">
                      <MdHome style={{ fontSize: "20px", cursor: "pointer", color: "#000000" }} />
                    </Box>
                    <span style={{ color: "#000000" }}>{label}</span>
                  </Button>
                </Box>
              );
            })}
          </Box>
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

export default KRPHPortalNHeader;
