import React from "react";
import { Box, Typography, Link, Grid, TextField, Button, Divider, Tooltip } from "@mui/material";
import { Facebook, Instagram, YouTube, LinkedIn, WhatsApp, HeadsetMic, LocationOn } from "@mui/icons-material";
import bottom_yellow_grass from "../../assets/bottom_yellow_grass.jpg";
import "./Header.css";


const Footer = () => {
  debugger;
  const Mainlinks = [
    { text: "Privacy Policy", href: "/privacyPolicy" },
    { text: "Copyright Policy", href: "/copyrightPolicy" },
    { text: "Website Policy", href: "/statementWebsitePolicy" },
    { text: "Terms & Conditions", href: "/t&c" },
    { text: "Circulars", href: "/circulars" },
    { text: "Insurance Company & Broker Directory", href: "/insuranceCompanyDirectory" },
    { text: "Bank Branch Directory", href: "/bankBranchDirectory" },
    { text: "Contact Us", href: "/contact" },
  ];

  return (
    <>
    
    <footer className="footer-farmerr-page">
       <img
                  src={bottom_yellow_grass}
                  alt=""
                  style={{ maxWidth: "100%"}}
                />
          <div className="footer-contentt-page">
            {Mainlinks.map(({ text, href }) => (
             <a href={href} >{text}</a>
                ))}
          </div>
           <Box sx={{  fontFamily: "Open Sans",bgcolor: "#075307", padding: "10px 0 10px 0px" }} className="footer_box2">
            <Typography
              fontSize="13px"
              sx={{
                color: "white",
                fontFamily: "Quicksand, sans-serif",
                textAlign: "center",
              }}
            >
              Copyright © For Department of Agriculture and Farmers Welfare, Ministry of Agriculture and Farmers Welfare, Government of India. All Rights Reserved.
            </Typography>
          </Box>
        </footer>
          </>
  );
};

export default Footer;