import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import helpline_img from "../../assets/img/headphones_solid.svg";
import whatsapp_img from "../../assets/img/logo-whatsapp.svg";
import download_img from "../../assets/img/Download Our Mobile App.svg";
import address_img from "../../assets/img/Path 32178.svg";
import { Close } from "@mui/icons-material";
import qr_app from "../../assets/img/qr_app.jpg";

const infoItems = [
  {
    icon: helpline_img,
    label: "Helpline Number",
    labelHindi: "हेल्पलाइन नंबर",
    value: "14447",
    valueHindi: "14447",
  },
  {
    icon: whatsapp_img,
    label: "Whatsapp Number",
    labelHindi: "व्हाट्सएप नंबर",
    valueHindi: "+91 7065514447",
    value: "+91 7065514447",
    link: "https://api.whatsapp.com/send/?phone=917065514447&text&type=phone_number&app_absent=0",
  },
  {
    icon: download_img,
    label: "Download Our Mobile App",
    labelHindi: "हमारा मोबाइल ऐप डाउनलोड करें",
    value: "Crop Insurance",
    valueHindi: "फसल बीमा",
    // Alink: "https://play.google.com/store/apps/details?id=in.farmguide.farmerapp.central&hl=en_IN",
  },
  {
    icon: address_img,
    label: "Address",
    labelHindi: "पता",
    valueHindi: "कृषि एवं किसान कल्याण विभाग, कृषि एवं किसान कल्याण मंत्रालय, कृषि भवन, डॉ. राजेंद्र प्रसाद रोड, नई दिल्ली - 110001",
    value: "Department of Agriculture & Farmers Welfare, MoA & FW, Krishi Bhawan, Dr Rajendra Prasad Road, New Delhi - 110001",
  },
];

const ImportantInfo = ({ language, setLanguage }) => {
  const [open, setOpen] = useState(false);

  const handleClick = (item) => {
    if (item.label === "Download Our Mobile App") {
      setOpen(true);
    } else if (item.link) {
      window.open(item.link, "_blank");
    }
  };

  const handleClose = () => {
    setOpen(false); // Close the popup
  };
  return (
    <Box
      sx={{
        background: " linear-gradient(to bottom, rgb(11, 104, 2), rgb(15, 144, 8))",
        // Abackground: "#075307",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        color: "white",
        width: "100%",
      }}
      className="box_ImportantInfo"
    >
      {language === "English" ? (
        <span
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontSize: "25px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          Important Information
        </span>
      ) : language === "Hindi" ? (
        <span
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontSize: "25px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          महत्वपूर्ण जानकारी
        </span>
      ) : (
        <span
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontSize: "25px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          Important Information
        </span>
      )}

      <Grid container spacing={3} justifyContent="center" className="gridContainer_ImportantInfo">
        {infoItems.map((item, index) => (
          <Grid item key={index} xs={12} sm={4}>
            <Paper
              sx={{
                // Amargin: item.label === "Whatsapp Number" ? "20px 0 0 0" : "",
                textAlign: "center",
                bgcolor: "transparent",
                color: "white",
                // Apadding: item.label === "Whatsapp Number" ? "0" : "paper_importantInfo",
                cursor: item.link ? "pointer" : "default",
              }}
              className="paper_importantInfo"
              elevation={0}
              onClick={() => handleClick(item)}
            >
              <img src={item.icon} alt="" style={{ marginBottom: "10px", cursor: "pointer" }} />
              {language === "Hindi" ? (
                <Typography style={{ fontSize: "14px", marginBottom: "10px", cursor: "pointer" }}>{item.labelHindi}</Typography>
              ) : language === "English" ? (
                <Typography style={{ fontSize: "14px", marginBottom: "10px", cursor: "pointer" }}>{item.label}</Typography>
              ) : (
                <Typography style={{ fontSize: "14px", marginBottom: "10px", cursor: "pointer" }}>{item.label}</Typography>
              )}

              {item.label === "Address" ? (
                <Tooltip
                  sx={{
                    fontSize: "16px",
                  }}
                  placement="right"
                  arrow
                  title={
                    language === "English" ? (
                      <span
                        style={{
                          fontSize: "15px",
                          fontFamily: "Quicksand, sans-serif",
                        }}
                      >
                        Department of Agriculture & Farmers
                        <br /> Welfare, MoA & FW, Krishi Bhawan,
                        <br /> Dr Rajendra Prasad Road, New Delhi - 110001
                      </span>
                    ) : (
                      <>
                        <span
                          style={{
                            fontSize: "15px",
                            fontFamily: "Quicksand, sans-serif",
                          }}
                        >
                          कृषि एवं किसान कल्याण विभाग,
                          <br /> कृषि एवं किसान कल्याण मंत्रालय, कृषि भवन,
                          <br /> डॉ. राजेंद्र प्रसाद रोड, नई दिल्ली - 110001,
                        </span>
                      </>
                    )
                  }
                >
                  <Typography style={{ fontSize: "14px", cursor: "pointer" }}> {language === "English" ? "View" : "देखें"} </Typography>
                </Tooltip>
              ) : (
                <Typography style={{ fontSize: "14px", cursor: "pointer" }}>
                  {
                    item.label === "Officers Login" || item.label === "Complaint Status" ? null : item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "white", cursor: "pointer" }}>
                        {language === "English" ? item.value : language === "Hindi" ? item.valueHindi : item.value}
                        {/* {item.value} */}
                      </a>
                    ) : language === "English" ? (
                      item.value
                    ) : language === "Hindi" ? (
                      item.valueHindi
                    ) : (
                      item.value
                    )

                    // Aitem.value
                  }
                </Typography>
              )}
            </Paper>

            <Dialog
              open={open}
              onClose={handleClose}
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
                  fontFamily: "Quicksand, sans-serif",
                }}
              >
                {language === "English" ? "Download Farmer App " : language === "Hindi" ? "किसान ऐप डाउनलोड करें" : "Download Farmer App "}
                <IconButton
                  onClick={handleClose}
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
              <DialogContent sx={{ textAlign: "center", padding: "0px 40px 0px 40px" }}>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                  <div style={{ border: "1px solid #EFF0F1", borderRadius: "5px", padding: "10px" }}>
                    <img src={qr_app} alt="QR" width="100%" />
                  </div>
                </Box>
                {language === "English" ? (
                  <Typography
                    variant="body1"
                    style={{
                      margin: "20px 0 20px 0 ",
                      fontFamily: "Quicksand, sans-serif",
                    }}
                  >
                    Crop Insurance App comes under Pradhan Mantri Fasal Bima Yojana. It is owned by the Department of Agriculture & Farmer Welfare, Govt. of
                    India. The application provides services related to agriculture insurance to farmers. Through this digital platform, a farmer can register
                    him/herself and get insurance for crop(s) being cultivated for Kharif and Rabi in a hassle-free manner.
                  </Typography>
                ) : language === "Hindi" ? (
                  <Typography
                    variant="body1"
                    style={{
                      margin: "20px 0 20px 0 ",
                      fontFamily: "Quicksand, sans-serif",
                    }}
                  >
                    फसल बीमा ऐप प्रधानमंत्री फसल बीमा योजना के तहत आता है। यह भारत सरकार के कृषि एवं किसान कल्याण विभाग द्वारा संचालित है। यह एप्लिकेशन किसानों
                    को कृषि बीमा से जुड़ी सेवाएँ प्रदान करता है। इस डिजिटल प्लेटफ़ॉर्म के माध्यम से किसान आसानी से अपना पंजीकरण कर सकते हैं और खरीफ एवं रबी
                    फसलों के लिए बिना किसी परेशानी के बीमा प्राप्त कर सकते हैं।
                  </Typography>
                ) : (
                  <Typography
                    variant="body1"
                    style={{
                      margin: "20px 0 20px 0 ",
                      fontFamily: "Quicksand, sans-serif",
                    }}
                  >
                    फसल बीमा ऐप प्रधानमंत्री फसल बीमा योजना के तहत आता है। यह भारत सरकार के कृषि एवं किसान कल्याण विभाग द्वारा संचालित है। यह एप्लिकेशन किसानों
                    को कृषि बीमा से जुड़ी सेवाएँ प्रदान करता है। इस डिजिटल प्लेटफ़ॉर्म के माध्यम से किसान आसानी से अपना पंजीकरण कर सकते हैं और खरीफ एवं रबी
                    फसलों के लिए बिना किसी परेशानी के बीमा प्राप्त कर सकते हैं।
                  </Typography>
                )}
              </DialogContent>
            </Dialog>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImportantInfo;
