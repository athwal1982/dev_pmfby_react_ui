import React, { useState } from "react";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import whitebgimage from "../../../assets/img/background-white-image.png";
import { Close } from "@mui/icons-material";
import { Box } from "@mui/system";
import excelLogo from "../../../assets/img/excelLogo.png";
import download_btn from "../../../assets/img/download_btn.svg";
import ExportReportLogics from "./ExportReportLogics";

const Contentcardcenter = ({ activeKey, yearMonth, insuranceCompanyReport, name, value, icon, color, show }) => {
  const { handlePopupUntagged, handleDownloadReportUnTagged, handleClose, popup, isLoading, isHovered, setIsHovered, email, setEmail } = ExportReportLogics({
    activeKey,
    yearMonth,
    insuranceCompanyReport,
  });
  return (
    <>
      {isLoading && (
        <div className="overlay_exp_rep">
          <CircularProgress className="loader_exp_rep" />
        </div>
      )}
      <div
        className="card card-custom"
        style={{
          backgroundImage: `url(${whitebgimage})`,
          backgroundPosition: "center center",
          backgroundSize: "100% 100%",
          backgroundRepeat: "repeat",
          minWidth: "180px",
          minHeight: "110px",
        }}
      >
        <div className="content d-flex align-ite  ms-center justify-content-between">
          <div>
            <p className="card-name">{name}</p>
            <p className="card-value">{value}</p>
          </div>
          {show && (
            <div className="icon" style={{ background: color }}>
              {icon}
            </div>
          )}
        </div>
        <>
          {activeKey === "INBNDCL" && name === "Total Untagged Calls" ? (
            <div
              // AclassName="report_container"
              style={{ display: "flex", flexDirection: "row", alignItems: "normal", padding: " 0px 0px 0px 10px" }}
              type="button"
              onClick={handlePopupUntagged}
            >
              <img
                src={download_btn}
                style={{ background: "#075307", padding: " 5px 5px 5px 5px", borderRadius: "3px" }}
                alt=""
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
              <a
                style={{
                  margin: "0px 0px 0 5px",
                  fontSize: "15px",
                  fontWeight: "400",
                  cursor: "pointer",
                  lineHeight: "1.6",
                  fontFamily: "'Poppins', sans-serif",
                  textDecoration: "none",
                  color: "#075307",
                  textDecoration: isHovered ? "underline" : "none",
                }}
                className="report-txt"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Export Report
              </a>
            </div>
          ) : (
            ""
          )}
        </>
        <>
          {activeKey === "OTBNDCL" && name === "Total Untagged Calls" ? (
            <>
              <div
                // AclassName="report_container"
                style={{ display: "flex", flexDirection: "row", alignItems: "normal", padding: " 0px 0px 0px 10px" }}
                type="button"
                onClick={handlePopupUntagged}
              >
                <img
                  src={download_btn}
                  style={{ background: "#075307", padding: " 5px 5px 5px 5px", borderRadius: "3px" }}
                  alt=""
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                />
                <a
                  style={{
                    margin: "0px 0px 0 5px",
                    fontSize: "15px",
                    fontWeight: "400",
                    cursor: "pointer",
                    lineHeight: "1.6",
                    fontFamily: "'Poppins', sans-serif",
                    textDecoration: "none",
                    color: "#075307",
                    textDecoration: isHovered ? "underline" : "none",
                  }}
                  className="report-txt"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Export Report
                </a>
              </div>
            </>
          ) : (
            ""
          )}
        </>

        {popup === true && (
          <Dialog
            style={{ zIndex: "988988" }}
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            sx={{
              "& .MuiPaper-root": {
                // AborderRadius: "10px",
                transition: "opacity 0.3s ease-in-out",
              },
            }}
          >
            <DialogTitle
              sx={{
                padding: "0px 24px 0px 24px",
                bgcolor: "#075307",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "bold",
                fontFamily: "Quicksand, sans-serif",
                fontSize: "17px",
              }}
            >
              Export Report
              <IconButton onClick={handleClose} sx={{ color: "white" }}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ textAlign: "center", p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <div style={{ border: "1px solid #EFF0F1", borderRadius: "5px", padding: "10px" }}>
                  <img src={excelLogo} alt="Excel" width={50} />
                </div>
              </Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: "bold", fontFamily: "Quicksand, sans-serif" }}>
                A password protected file will be sent to your Email
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    sx: {
                      fontFamily: "Quicksand, sans-serif",
                      bgcolor: "#f3f3f3",
                      borderRadius: "20px",
                      textAlign: "center",
                    },
                  }}
                  sx={{ width: "70%", mb: 3 }}
                />
              </Box>

              <Button
                onClick={handleDownloadReportUnTagged}
                variant="contained"
                sx={{ fontWeight: "bold", bgcolor: "#d4f3af", color: "black", borderRadius: "10px", px: 8, fontFamily: "Quicksand, sans-serif" }}
              >
                Send
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default Contentcardcenter;
