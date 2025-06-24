import React, { useState, useEffect } from "react";
import { Loader } from "Framework/Components/Widgets";
import { ReactComponent as LogoPMFBY } from "../../../assets/img/Group 161806.svg";
import "./BIDashbaord.css";
import { Box, Typography } from "@mui/material";
const BIDashboard = () => {
  const [isLoadingBIDashboard, setisLoadingBIDashboard] = useState(false);
  useEffect(() => {
    setisLoadingBIDashboard(true);
    const timeOutHandler = setTimeout(() => {
      setisLoadingBIDashboard(false);
    }, 1000);
    return () => clearTimeout(timeOutHandler);
  }, []);
  return (
    <>
      <div className="csc_main_BI">
        {isLoadingBIDashboard ? <Loader /> : null}
        <Box style={{ padding: "15px 15px 0px 15px" }}>
          <iframe src="https://demo_iframe.htm" width="100%" height="620px" allowFullScreen="true" frameBorder="1"></iframe>
        </Box>
        <Box style={{ padding: "0px 15px 0px 15px" }}>
          <Box sx={{ bgcolor: "#075307", padding: "10px 0 10px 0px" }}>
            <Typography
              fontSize="14px"
              sx={{
                color: "white",
                fontFamily: "Quicksand, sans-serif",
                textAlign: "center",
              }}
            >
              Copyright @ For Department of Agriculture and Farmers Welfare, Ministry of Agriculture and Farmers Welfare, Government of India. All Rights
              Reserved.
            </Typography>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default BIDashboard;
