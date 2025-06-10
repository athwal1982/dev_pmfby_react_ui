import React from "react";
import { Box, Typography, Link, Grid, TextField, Button, Divider, Tooltip } from "@mui/material";
import { Facebook, Instagram, YouTube, LinkedIn, WhatsApp, HeadsetMic, LocationOn } from "@mui/icons-material";
import { ReactComponent as LogoPMFBY } from "../../assets/img/Group 161806.svg";
import "./Header.css";

const Footer = ({ handleWhatsAppClick, language }) => {
  debugger;
  const Mainlinks = [
    { text: "Main Site", href: "/" },
    { text: "Copyright Policy", href: "/copyrightPolicy" },
    { text: "Hyperlink Policy", href: "/hyperlinkingPolicy" },
    { text: "FAQ", href: "/faq" },
    { text: "Privacy Policy", href: "/privacyPolicy" },
    { text: "Feedback", href: "/feedback" },
    { text: "Terms & Conditions", href: "/t&c" },
    { text: "Website Policy", href: "/statementWebsitePolicy" },
    { text: "Contact Us", href: "/contact" },
    { text: "Sitemap", href: "/sitemap" },
  ];
  const MainlinksHindi = [
    { text: "मुख्य साइट", href: "/" },
    { text: "कॉपीराइट नीति", href: "/copyrightPolicy" },
    { text: "हाइपरलिंक नीति", href: "/hyperlinkingPolicy" },
    { text: "सामान्य प्रश्न", href: "/faq" },
    { text: "गोपनीयता नीति", href: "/privacyPolicy" },
    { text: "प्रतिक्रिया", href: "/feedback" },
    { text: "नियम और शर्तें", href: "/t&c" },
    { text: "वेबसाइट नीति", href: "/statementWebsitePolicy" },
    { text: "हमसे संपर्क करें", href: "/contact" },
    { text: "साइटमैप", href: "/sitemap" },
  ];
  const QuickLinks = [
    { text: "Tutorials", href: "/tutorials" },
    { text: "Circulars", href: "/circulars" },
    { text: "Insurance Company & Broker Directory", href: "/insuranceCompanyDirectory" },
    { text: "Bank Branch Directory", href: "/bankBranchDirectory" },
  ];
  const QuickLinksHindi = [
    { text: "ट्यूटोरियल्स", href: "/tutorials" },
    { text: "परिपत्र", href: "/circulars" },
    { text: "बीमा कंपनी और ब्रोकर निर्देशिका", href: "/insuranceCompanyDirectory" },
    { text: "बैंक शाखा निर्देशिका", href: "/bankBranchDirectory" },
  ];
  const socialLinks = [
    { Icon: Facebook, name: "Facebook", href: "https://rb.gy/x2ut5p" },
    { Icon: Instagram, name: "Instagram", href: "https://rb.gy/ny4uqm" },
    { Icon: YouTube, name: "YouTube", href: "https://rb.gy/kie9ew" },
    { Icon: LinkedIn, name: "LinkedIn", href: "https://rb.gy/3agsy0" },
  ];

  return (
    <Box sx={{ fontFamily: "Quicksand, sans-serif" }}>
      {language === "English" ? (
        <>
          <Box
            className="footer_box"
            sx={{
              bgcolor: "#FFF7F1",
              borderTop: "3px solid #4CAF50",
              fontFamily: "Quicksand, sans-serif",
            }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                fontFamily: "Quicksand, sans-serif",
              }}
            >
              <Box width="80%">
                <a href="https://pmfby.gov.in/" target="_blank">
                  <LogoPMFBY style={{ height: "50px" }} />
                </a>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Quicksand, sans-serif", // Apply font family to Typography
                    margin: "20px 0 0 0",
                    maxWidth: "85%",
                  }}
                >
                  The Pradhan Mantri Fasal Bima Yojana (PMFBY) is a crop insurance scheme that provides financial assistance to farmers in the event of crop
                  loss or damage due to unforeseen events like natural calamities, pests, and diseases.
                </Typography>
              </Box>
              {/* <Box width="30%">
            <Grid item xs={12} md={3}>
              <Typography variant="h6" fontWeight="bold">
                Subscribe Our Newsletter
              </Typography>
              <Box display="flex" mt={1}>
                <TextField size="small" placeholder="Enter your email id" variant="outlined" fullWidth sx={{ bgcolor: "#fff" }} />
                <Button variant="contained" sx={{ ml: 1, bgcolor: "#FF9800" }}>
                  Submit
                </Button>
              </Box>
            </Grid>
          </Box> */}
            </Box>

            <Divider sx={{ width: "100%", my: 2 }} />

            <Grid container spacing={4} sx={{ padding: "10px 0 15px 0", fontFamily: "Quicksand, sans-serif" }}>
              <Grid item lg={4} xs={12} md={4}>
                <Typography variant="h6" fontWeight="bold" fontFamily="Quicksand, sans-serif">
                  Contact Us
                </Typography>
                <Typography lg={6} xs={6} md={6} variant="body2" display="flex" alignItems="center" gutterBottom fontFamily="Quicksand, sans-serif">
                  <LocationOn fontSize="small" sx={{ mr: 1 }} /> Department of Agriculture & Farmers Welfare, MoA & FW, Krishi Bhawan, Dr Rajendra Prasad Road,
                  New Delhi - 110001
                </Typography>
                <Typography variant="body2" display="flex" alignItems="center" gutterBottom fontFamily="Quicksand, sans-serif">
                  <HeadsetMic fontSize="small" sx={{ mr: 1 }} /> Helpline No.:{" "}
                  <Link
                    sx={{
                      ml: 1,
                      textDecoration: "none",
                      fontWeight: "bold",
                      color: "#4CAF50",
                      fontFamily: "Quicksand, sans-serif",
                    }}
                  >
                    14447
                  </Link>
                </Typography>
                <Typography
                  onClick={handleWhatsAppClick}
                  variant="body2"
                  display="flex"
                  alignItems="center"
                  fontFamily="Quicksand, sans-serif"
                  sx={{ cursor: "pointer" }}
                >
                  <WhatsApp fontSize="small" sx={{ mr: 1 }} /> WhatsApp Number:
                  <Link
                    fontFamily="Quicksand, sans-serif"
                    sx={{
                      ml: 1,
                      textDecoration: "none",
                      fontWeight: "bold",
                      color: "#4CAF50",
                    }}
                  >
                    +91 7065514447
                  </Link>
                </Typography>
              </Grid>

              <Grid item lg={3} xs={12} md={3}>
                <Typography variant="h6" fontWeight="bold" fontFamily="Quicksand, sans-serif">
                  Main Links
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    mt: 1,
                    fontFamily: "Quicksand, sans-serif",
                  }}
                >
                  {Mainlinks.map(({ text, href }) => (
                    <Link
                      className="list_items_footer"
                      key={text}
                      href={href}
                      sx={{
                        color: "inherit",
                        textDecoration: "none",
                        width: "50%",
                        mb: 1,
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      {text}
                    </Link>
                  ))}
                </Box>
              </Grid>

              <Grid item lg={3} xs={12} md={3}>
                <Typography variant="h6" fontWeight="bold" fontFamily="Quicksand, sans-serif">
                  Quick Links
                </Typography>
                {QuickLinks.map(({ text, href }) => (
                  <Link
                    className="list_items_footer"
                    key={text}
                    href={href}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      color: "inherit",
                      textDecoration: "none",
                      marginRight: 2,
                      mt: 1,
                      fontFamily: "Quicksand, sans-serif", // Ensure font family is applied here
                    }}
                  >
                    {text}
                  </Link>
                ))}
              </Grid>

              <Grid item lg={2} xs={12} md={2}>
                <Typography variant="h6" fontWeight="bold" fontFamily="Quicksand, sans-serif">
                  Follow Us
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {socialLinks.map(({ Icon, name, href }, index) => (
                    <Tooltip key={index} title={name} arrow>
                      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <Icon fontSize="medium" sx={{ color: "#4CAF50", cursor: "pointer" }} />
                      </a>
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ bgcolor: "#075307", padding: "10px 0 10px 0px" }} className="footer_box2">
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
        </>
      ) : language === "Hindi" ? (
        <>
          <Box
            className="footer_box"
            sx={{
              bgcolor: "#FFF7F1",
              borderTop: "3px solid #4CAF50",
              fontFamily: "Quicksand, sans-serif",
            }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                fontFamily: "Quicksand, sans-serif",
              }}
            >
              <Box width="80%">
                <img
                  src={logo_pmfby}
                  alt="पीएमएफबीवाई लोगो"
                  style={{
                    height: 50,
                    background: "#FFF7F1",
                    opacity: 1,
                    mixBlendMode: "multiply",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    margin: "20px 0 0 0",
                    maxWidth: "85%",
                  }}
                >
                  प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई) एक फसल बीमा योजना है जो प्राकृतिक आपदाओं, कीटों और बीमारियों जैसी अनिश्चित घटनाओं के कारण फसल नुकसान
                  या क्षति की स्थिति में किसानों को वित्तीय सहायता प्रदान करती है।
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ width: "100%", my: 2 }} />

            <Grid container spacing={4} sx={{ padding: "10px 0 15px 0", fontFamily: "Quicksand, sans-serif" }}>
              <Grid item lg={4} xs={12} md={4}>
                <Typography variant="h6" fontWeight="bold">
                  संपर्क करें
                </Typography>
                <Typography variant="body2" display="flex" alignItems="center" gutterBottom>
                  <LocationOn fontSize="small" sx={{ mr: 1 }} /> कृषि और किसान कल्याण विभाग, कृषि भवन, डॉ. राजेंद्र प्रसाद रोड, नई दिल्ली - 110001
                </Typography>
                <Typography variant="body2" display="flex" alignItems="center" gutterBottom>
                  <HeadsetMic fontSize="small" sx={{ mr: 1 }} /> हेल्पलाइन नंबर:
                  <Link sx={{ ml: 1, textDecoration: "none", fontWeight: "bold", color: "#4CAF50" }}>14447</Link>
                </Typography>
                <Typography onClick={handleWhatsAppClick} variant="body2" display="flex" alignItems="center" sx={{ cursor: "pointer" }}>
                  <WhatsApp fontSize="small" sx={{ mr: 1 }} /> व्हाट्सएप नंबर:
                  <Link sx={{ ml: 1, textDecoration: "none", fontWeight: "bold", color: "#4CAF50" }}>+91 7065514447</Link>
                </Typography>
              </Grid>

              <Grid item lg={3} xs={12} md={3}>
                <Typography variant="h6" fontWeight="bold">
                  मुख्य लिंक
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
                  {MainlinksHindi.map(({ text, href }) => (
                    <Link className="list_items_footer" key={text} href={href} sx={{ color: "inherit", textDecoration: "none", width: "50%", mb: 1 }}>
                      {text}
                    </Link>
                  ))}
                </Box>
              </Grid>

              <Grid item lg={3} xs={12} md={3}>
                <Typography variant="h6" fontWeight="bold">
                  त्वरित लिंक
                </Typography>
                {QuickLinksHindi.map(({ text, href }) => (
                  <Link
                    className="list_items_footer"
                    key={text}
                    href={href}
                    sx={{ cursor: "pointer", display: "flex", color: "inherit", textDecoration: "none", marginRight: 2, mt: 1 }}
                  >
                    {text}
                  </Link>
                ))}
              </Grid>

              <Grid item lg={2} xs={12} md={2}>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  हमें फॉलो करें
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {socialLinks.map(({ Icon, name, href }, index) => (
                    <Tooltip key={index} title={name} arrow>
                      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <Icon fontSize="medium" sx={{ color: "#4CAF50", cursor: "pointer" }} />
                      </a>
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ bgcolor: "#075307", padding: "10px 0" }}>
            <Typography fontSize="14px" sx={{ color: "white", textAlign: "center" }}>
              कॉपीराइट @ कृषि और किसान कल्याण विभाग, कृषि और किसान कल्याण मंत्रालय, भारत सरकार के लिए। सर्वाधिकार सुरक्षित।
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Box
            className="footer_box"
            sx={{
              bgcolor: "#FFF7F1",
              borderTop: "3px solid #4CAF50",
              fontFamily: "Quicksand, sans-serif",
            }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                fontFamily: "Quicksand, sans-serif",
              }}
            >
              <Box width="80%">
                <img
                  src={logo_pmfby}
                  alt="PMFBY Logo"
                  style={{
                    height: 50,
                    background: "#FFF7F1",
                    opacity: 1,
                    mixBlendMode: "multiply",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Quicksand, sans-serif", // Apply font family to Typography
                    margin: "20px 0 0 0",
                    maxWidth: "85%",
                  }}
                >
                  The Pradhan Mantri Fasal Bima Yojana (PMFBY) is a crop insurance scheme that provides financial assistance to farmers in the event of crop
                  loss or damage due to unforeseen events like natural calamities, pests, and diseases.
                </Typography>
              </Box>
              {/* <Box width="30%">
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold">
              Subscribe Our Newsletter
            </Typography>
            <Box display="flex" mt={1}>
              <TextField size="small" placeholder="Enter your email id" variant="outlined" fullWidth sx={{ bgcolor: "#fff" }} />
              <Button variant="contained" sx={{ ml: 1, bgcolor: "#FF9800" }}>
                Submit
              </Button>
            </Box>
          </Grid>
        </Box> */}
            </Box>

            <Divider sx={{ width: "100%", my: 2 }} />

            <Grid container spacing={4} sx={{ padding: "10px 0 15px 0", fontFamily: "Quicksand, sans-serif" }}>
              <Grid item lg={4} xs={12} md={4}>
                <Typography variant="h6" fontWeight="bold" fontFamily="Quicksand, sans-serif">
                  Contact Us
                </Typography>
                <Typography lg={6} xs={6} md={6} variant="body2" display="flex" alignItems="center" gutterBottom fontFamily="Quicksand, sans-serif">
                  <LocationOn fontSize="small" sx={{ mr: 1 }} /> Department of Agriculture & Farmers Welfare, MoA & FW, Krishi Bhawan, Dr Rajendra Prasad Road,
                  New Delhi - 110001
                </Typography>
                <Typography variant="body2" display="flex" alignItems="center" gutterBottom fontFamily="Quicksand, sans-serif">
                  <HeadsetMic fontSize="small" sx={{ mr: 1 }} /> Helpline No.:{" "}
                  <Link
                    sx={{
                      ml: 1,
                      textDecoration: "none",
                      fontWeight: "bold",
                      color: "#4CAF50",
                      fontFamily: "Quicksand, sans-serif",
                    }}
                  >
                    14447
                  </Link>
                </Typography>
                <Typography
                  onClick={handleWhatsAppClick}
                  variant="body2"
                  display="flex"
                  alignItems="center"
                  fontFamily="Quicksand, sans-serif"
                  sx={{ cursor: "pointer" }}
                >
                  <WhatsApp fontSize="small" sx={{ mr: 1 }} /> WhatsApp Number:{" "}
                  <Link
                    fontFamily="Quicksand, sans-serif"
                    sx={{
                      ml: 1,
                      textDecoration: "none",
                      fontWeight: "bold",
                      color: "#4CAF50",
                    }}
                  >
                    +91 7065514447
                  </Link>
                </Typography>
              </Grid>

              <Grid item lg={3} xs={12} md={3}>
                <Typography variant="h6" fontWeight="bold" fontFamily="Quicksand, sans-serif">
                  Main Links
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    mt: 1,
                    fontFamily: "Quicksand, sans-serif",
                  }}
                >
                  {Mainlinks.map(({ text, href }) => (
                    <Link
                      className="list_items_footer"
                      key={text}
                      href={href}
                      sx={{
                        color: "inherit",
                        textDecoration: "none",
                        width: "50%",
                        mb: 1,
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      {text}
                    </Link>
                  ))}
                </Box>
              </Grid>

              <Grid item lg={3} xs={12} md={3}>
                <Typography variant="h6" fontWeight="bold" fontFamily="Quicksand, sans-serif">
                  Quick Links
                </Typography>
                {QuickLinks.map(({ text, href }) => (
                  <Link
                    className="list_items_footer"
                    key={text}
                    href={href}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      color: "inherit",
                      textDecoration: "none",
                      marginRight: 2,
                      mt: 1,
                      fontFamily: "Quicksand, sans-serif",
                    }}
                  >
                    {text}
                  </Link>
                ))}
              </Grid>

              <Grid item lg={2} xs={12} md={2}>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, fontFamily: "Quicksand, sans-serif" }}>
                  Follow Us
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {socialLinks.map(({ Icon, name, href }, index) => (
                    <Tooltip key={index} title={name} arrow>
                      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <Icon fontSize="medium" sx={{ color: "#4CAF50", cursor: "pointer" }} />
                      </a>
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ bgcolor: "#075307", padding: "10px 0 10px 0px" }} className="footer_box2">
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
        </>
      )}
    </Box>
  );
};

export default Footer;
