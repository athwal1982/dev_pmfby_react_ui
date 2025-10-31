import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import cs_img from "../../../../assets/img_cs.svg";
// A import logo from "../../../../assets/logo3.svg";
import { ReactComponent as LogoPMFBY } from "../../../../assets/img/Group 161806.svg";
import { getSessionStorage, setSessionStorage } from "Components/Common/Login/Auth/auth";
import { logout } from "../../../Common/Login/Services/Methods";
const Header = ({ title, showComplaintButton, onComplaintClick, showClaimButton, onComplaintStatus }) => {
  const navigate = useNavigate();
  const userData = getSessionStorage("user");

  const handleLogout = async () => {
    debugger;
    try {
      await logout(userData.LoginID ? userData.LoginID : 0, userData.SessionID ? userData.SessionID : 0);
      sessionStorage.clear();
      navigate("/");
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const handleHome = () => {
    sessionStorage.clear();
    navigate("/krph");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#ffffff" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: 0 }}>
        <Box sx={{ display: "flex", marginLeft: "30px", alignItems: "center" }}>
          {/* <img src={logo} alt="Logo" style={{ height: "45px", marginRight: 2 }} /> */}
          <a href="https://pmfby.gov.in/" target="_blank">
            <LogoPMFBY style={{ width: "85%" }} />
          </a>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginRight: "30px" }}>
            <h1 style={{ color: "#425364", fontSize: "15px", marginTop: "0px", marginBottom: 0 }}>
              Welcome , <span style={{ color: "#075307" }}>{title}</span>
            </h1>
            &nbsp;&nbsp;
            {/* <Button
              sx={{
                backgroundColor: "transparent",
                color: "#000000",
                textTransform: "none",
                boxShadow: "none",
                border: "1px solid #E9ECEF",
                padding: "4px 8px",
                height: "30px",
                "&:hover": {
                  border: "1px solid #7ED321",
                  color: "#7ED321",
                  backgroundColor: "transparent",
                },
              }}
              onClick={handleHome}
            >
              🏠 Home
            </Button> */}
            {showComplaintButton && (
              <>
                <Button
                  onClick={onComplaintClick}
                  sx={{
                    backgroundColor: "transparent",
                    color: "#000000",
                    textTransform: "none",
                    boxShadow: "none",
                    border: "1px solid #E9ECEF",
                    padding: "4px 8px",
                    height: "30px",
                    "&:hover": {
                      border: "1px solid #7ED321",
                      color: "#7ED321",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <img src={cs_img} alt="Complaint Status Icon" style={{ width: "20px", height: "20px", marginRight: "8px" }} />
                  Complaint Status
                </Button>
              </>
            )}
            {showClaimButton && (
              <>
                <Button
                  onClick={onComplaintStatus}
                  sx={{
                    backgroundColor: "transparent",
                    color: "#000000",
                    textTransform: "none",
                    boxShadow: "none",
                    border: "1px solid #E9ECEF",
                    padding: "4px 8px",
                    height: "30px",
                    "&:hover": {
                      border: "1px solid #7ED321",
                      color: "#7ED321",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  🌿 Crop Loss Intimation
                </Button>
              </>
            )}
            <Button
              onClick={handleLogout}
              sx={{
                boxShadow: "none",
                border: "1px solid #E9ECEF",
                backgroundColor: "transparent",
                color: "#000000",
                textTransform: "none",
                padding: "4px 8px",
                height: "30px",
                "&:hover": {
                  border: "1px solid red",
                  color: "red",
                  backgroundColor: "transparent",
                },
              }}
            >
              🚪 Logout
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
