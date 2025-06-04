import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Grid } from "@mui/system";
import farmer from "../../assets/img/Mask Group 15.jpg";

const AboutSection = ({ language, setLanguage }) => {
  return (
    <>
      {language === "English" ? (
        <Box sx={{ padding: "30px 100px 30px 100px" }} className="aboutSec_box">
          <Typography variant="h4" align="center" gutterBottom>
            About PMFBY
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                }}
              >
                Crop Insurance is an integrated IT solution and a web-based ecosystem to speed up service delivery, unify fragmented databases, achieve a single
                view of data, and eliminate manual processes. Crop Insurance provides insurance services to farmers faster than before.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={farmer}
                alt="Farmers"
                width="100%"
                style={{
                  borderRadius: "40px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)", // Slightly more prominent shadow
                }}
              />
            </Grid>
            <Grid
              style={{
                display: "flex",
                flexDirection: "column",
                // AalignItems: "flex-start",
                // SjustifyContent: "flex-start",
              }}
            >
              <Grid
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  lineHeight: "1.5",
                }}
              >
                The Government is endeavouring for the integration of all the stakeholders viz. farmers, insurance companies, financial institutions &
                Government agencies on single IT platform. This will ensure better administration, coordination & transparency for getting real time information
                and monitoring.
              </Grid>
              <Grid
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  lineHeight: "1.5",
                }}
              >
                Crop Insurance portal has enabled the digitization of notification of areas, crops, schemes for enabling information access to multiple
                stakeholders thereby facilitating ease of access to the farmers in availing crop insurance services. This automated solution has opened a window
                of opportunity to remote and economically-weak farmers to benefit from crop insurance services.
              </Grid>{" "}
            </Grid>
            <Grid
              sx={{
                fontFamily: "Quicksand, sans-serif",
                display: "flex",
                flexDirection: "column",
                //  AalignItems: "flex-start",
                //   AjustifyContent: "flex-start",
              }}
            >
              <Grid
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  // Awidth: "45%",
                  lineHeight: "1.5",
                }}
              >
                This is a stable, secure and seamlessly integrated ecosystem created with a comprehensive view of data in a secure environment thereby enabling
                information access to multiple stakeholders viz. Farmers, Govt. Functionaries, Insurance Companies, Intermediaries, Bankers and social &
                community bodies.{" "}
              </Grid>
              {/* <Button
                href="https://pmfby.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderRadius: "5px",
                  background: "#075307",
                  mt: 2,
                  fontFamily: "Quicksand, sans-serif",
                  width: "201px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                }}
                variant="contained"
                color="success"
              >
                <span style={{ fontFamily: "Quicksand, sans-serif" }}>Visit Official Website</span>
              </Button> */}
            </Grid>
          </Grid>
        </Box>
      ) : language === "Hindi" ? (
        <Box sx={{ padding: "30px 100px 30px 100px" }} className="aboutSec_box">
          <Typography variant="h4" align="center" gutterBottom>
            पीएमएफबीवाई के बारे में
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6} lg={12}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                }}
              >
                फसल बीमा एक एकीकृत आईटी समाधान और वेब-आधारित इकोसिस्टम है, जो सेवा वितरण को तेज करता है, बिखरे हुए डेटा को एकीकृत करता है, डेटा का एकल दृश्य
                प्राप्त करता है, और मैनुअल प्रक्रियाओं को समाप्त करता है। फसल बीमा किसानों को पहले से तेज़ गति से बीमा सेवाएं प्रदान करता है।
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ width: "100%" }}>
              <img
                src={farmer}
                alt="किसान"
                width="100%"
                style={{
                  borderRadius: "40px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                }}
              />
            </Grid>
            <Grid
              style={{
                display: "flex",
                flexDirection: "column",
                /*  A alignItems: "flex-start",
                justifyContent: "flex-start", */
              }}
            >
              <Grid
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  lineHeight: "1.5",
                }}
              >
                सरकार सभी हितधारकों जैसे किसान, बीमा कंपनियां, वित्तीय संस्थान और सरकारी एजेंसियों को एक एकल आईटी प्लेटफॉर्म पर एकीकृत करने के प्रयास कर रही है।
                इससे बेहतर प्रशासन, समन्वय और पारदर्शिता सुनिश्चित होगी, जिससे वास्तविक समय की जानकारी और निगरानी प्राप्त होगी।
              </Grid>
              <Grid
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  lineHeight: "1.5",
                }}
              >
                <br />
                फसल बीमा पोर्टल ने क्षेत्रों, फसलों और योजनाओं की अधिसूचना को डिजिटाइज़ करने की सुविधा प्रदान की है, जिससे कई हितधारकों को जानकारी तक पहुंच
                मिलती है और किसानों के लिए फसल बीमा सेवाओं का लाभ उठाना आसान हो जाता है। यह स्वचालित समाधान दूर-दराज और आर्थिक रूप से कमजोर किसानों के लिए फसल
                बीमा सेवाओं से लाभान्वित होने के अवसर खोलता है।
              </Grid>{" "}
            </Grid>
            <Grid
              sx={{
                fontFamily: "Quicksand, sans-serif",
                display: "flex",
                flexDirection: "column",
                /*             A    alignItems: "flex-start",
                justifyContent: "flex-start",
 */
              }}
            >
              <Grid
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  lineHeight: "1.5",
                }}
              >
                यह एक स्थिर, सुरक्षित और सहज रूप से एकीकृत इकोसिस्टम है, जो एक सुरक्षित वातावरण में डेटा का व्यापक दृश्य प्रदान करता है, जिससे किसानों, सरकारी
                अधिकारियों, बीमा कंपनियों, बिचौलियों, बैंकरों और सामाजिक एवं सामुदायिक निकायों सहित कई हितधारकों को सूचना तक पहुंच प्राप्त होती है।
              </Grid>
              {/* <Button
                href="https://pmfby.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderRadius: "5px",
                  background: "#075307",
                  mt: 2,
                  fontFamily: "Quicksand, sans-serif",
                  width: "201px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25)",
                }}
                variant="contained"
                color="success"
              >
                <span style={{ fontFamily: "Quicksand, sans-serif" }}>आधिकारिक वेबसाइट पर जाएं</span>
              </Button> */}
            </Grid>
          </Grid>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export default AboutSection;
