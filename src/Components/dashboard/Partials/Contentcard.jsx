import React, { useState } from "react";
import whitebgimage from "../../../assets/img/background-white-image.png";
import download_btn from "../../../assets/img/download_btn.svg";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Box } from "@mui/system";
import excelLogo from "../../../assets/img/excelLogo.png";
import ExportReportLogics from "./ExportReportLogics";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";

const Contentcard = ({ name, value, icon, color, currentmenu, keyvalue, handlechange, yearMonth, insuranceCompanyReport }) => {
  const {
    handledemoImportReport,
    isHovered2,
    setIsHovered2,
    handleDownloadReportTagged,
    handlePopupTagged,
    handleClose,
    popup,
    setPopup,
    isLoading,
    isHovered,
    setIsHovered,
    email,
    setEmail,
    ImportReportBtnRight,
    popUpImport,
    setPopUpImport,
    selectedFile,
    setSelectedFile,
    handleFileChange,
    handleUploadRawDatasms_whatsapp,
  } = ExportReportLogics({
    keyvalue,
    value,
    yearMonth,
    insuranceCompanyReport,
  });

  const handlePopupImportReport = (e) => {
    e.stopPropagation();
    setPopUpImport(true);
  };

  return (
    <>
      {isLoading && (
        <div className="overlay_exp_rep">
          <CircularProgress className="loader_exp_rep" />
        </div>
      )}

      <div
        className={`card card-custom ${currentmenu === keyvalue ? "active" : ""}`}
        style={
          currentmenu !== keyvalue
            ? {
                backgroundImage: `url(${whitebgimage})`,
                backgroundPosition: "center center",
                backgroundSize: "100% 100%",
                backgroundRepeat: "repeat",
              }
            : {}
        }
        onClick={() => handlechange(keyvalue)}
      >
        <div className="content">
          <div>
            <p className="card-name">{name}</p>
            <p className="card-value">Rs. {value}</p>
          </div>
          <div className="icon" style={{ background: color }}>
            {icon}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="report_container" type="button" onClick={handlePopupTagged}>
            <img src={download_btn} className="report-img" alt="" onMouseEnter={() => setIsHovered2(true)} onMouseLeave={() => setIsHovered2(false)} />
            <a
              className="report-txt"
              onMouseEnter={() => setIsHovered2(true)}
              onMouseLeave={() => setIsHovered2(false)}
              style={{ textDecoration: isHovered2 ? "underline" : "none" }}
            >
              Export Report
            </a>
          </div>

          {keyvalue === "TXTMSG" || keyvalue === "WHAPP" || keyvalue === "AIBT" ? (
            <>
              {ImportReportBtnRight ? (
                <>
                  <div className="report_container" type="button" onClick={handlePopupImportReport}>
                    <img src={download_btn} className="report-img" alt="" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} />
                    <a
                      className="report-txt"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      style={{ textDecoration: isHovered ? "underline" : "none" }}
                    >
                      Import Report
                    </a>
                  </div>
                </>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      {popup === true && (
        <Dialog
          open={open}
          close={handleClose}
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
              onClick={handleDownloadReportTagged}
              variant="contained"
              sx={{ fontWeight: "bold", bgcolor: "#d4f3af", color: "black", borderRadius: "10px", px: 8, fontFamily: "Quicksand, sans-serif" }}
            >
              Send
            </Button>
          </DialogContent>
        </Dialog>
      )}
      {popUpImport === true && (
        <Dialog
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
              padding: "0px 24px",
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
            Upload File
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ textAlign: "center", p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
              <div style={{ border: "1px solid #EFF0F1", borderRadius: "5px", padding: "10px" }}>
                <img src={excelLogo} alt="Excel" width={50} />
              </div>
            </Box>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: "bold", fontFamily: "Quicksand, sans-serif" }}>
              Select an Excel file to upload
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
            </Box>
            <Button
              onClick={handledemoImportReport}
              variant="contained"
              sx={{
                fontWeight: "bold",
                bgcolor: "#d4f3af",
                color: "black",
                borderRadius: "10px",
                px: 8,
                fontFamily: "Quicksand, sans-serif",
                mt: 3,
              }}
            >
              Demo File
            </Button>
            &nbsp; &nbsp;&nbsp;
            <Button
              onClick={handleUploadRawDatasms_whatsapp}
              variant="contained"
              sx={{
                fontWeight: "bold",
                bgcolor: "#d4f3af",
                color: "black",
                borderRadius: "10px",
                px: 8,
                fontFamily: "Quicksand, sans-serif",
                mt: 3,
              }}
            >
              Upload
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Contentcard;
