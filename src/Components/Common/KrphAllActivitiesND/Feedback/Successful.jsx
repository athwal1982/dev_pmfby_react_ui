import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Feedback from "../Feedback/img/Feedback.png";
import Bg_Logo from "../Feedback/img/Bg_Logo.png";

const Successfull = () => {
  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(to bottom, #21862d, #c3eb68)",
        minHeight: "fit-content",
      }}
    >
      <Box
        sx={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px",
        }}
      >
        <Box
          sx={{
            maxWidth: "900px",
            minHeight: "fit-content",
            margin: "0px",
            padding: "30px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            backgroundColor: "#fff",
            width: "100%",
            position: "relative",
          }}
        >
          <img
            className="fdk-img"
            src={Feedback}
            alt="Feedback Icon"
            width="170"
            height="170"
            style={{
              display: "block",
              margin: "0 auto",
              zIndex: 5,
            }}
          />
          <img
            src={Bg_Logo}
            alt="Watermark"
            style={{
              display: "block",
              width: "30%",
              zIndex: 0,
              position: "absolute",
              top: "50%",
              opacity: "1",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <Typography
            style={{
              fontSize: "30px",
              fontWeight: "700",
              lineHeight: "36px",
              textAlign: "center",
              zIndex: 5,
            }}
          >
            Thank you for your feedback!
            <br />
            <br />
          </Typography>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "20px",
              textAlign: "center",
              zIndex: 5,
            }}
          >
            Thank you for taking the time to provide feedback. <br /> We appreciate hearing from you.
            <br />
            <br />
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Successfull;
