import React, { useState, useEffect } from "react";
import { Loader } from "Framework/Components/Widgets";
import "./BIDashbaord.css";
import { Box, Typography } from "@mui/material";
const BIDashboard1 = () => {
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
    <div className="csc_main_BI_1">
            {isLoadingBIDashboard ? <Loader /> : null}
             <Box style={{padding: "15px 15px 0px 15px"}}>
                <iframe src="https://demo_iframe.htm"  width="100%" height="620px"  allowFullScreen="true" frameBorder="1">
                </iframe> 
             </Box>
            </div>
    </>
  );
};

export default BIDashboard1;
