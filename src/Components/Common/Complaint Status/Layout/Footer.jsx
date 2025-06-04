import React from "react";
import "./Footer.css";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#075307",
        color: "#fff",
        padding: "10px 20px",
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        Copyright @ For Department of Agriculture and Farmers Welfare, Ministry of Agriculture and Farmers Welfare, Government of India. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
