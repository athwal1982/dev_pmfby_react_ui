import React from "react";
import { Box, Typography } from "@mui/material";
import about_right from "../../assets/about-right.jpg";

const AboutSection = () => {
  return (
    <Box sx={{ padding: "30px 20px 0px 40px", fontFamily: "Open Sans" }}>
      <Typography variant="h4" align="left" fontWeight="bold">
        About <span style={{ color: "#086107" }}>PMFBY</span>
      </Typography>
      <div className="row">
        <div className="col-lg-6">
          <p style={{ fontSize: "14px", lineHeight: "22px", textAlign: "justify" }}>
            Crop Insurance is an integrated IT solution and a web-based ecosystem to speed up service delivery, unify fragmented databases, achieve a single
            view of data, and eliminate manual processes. Crop Insurance provides insurance services to farmers faster than before. The Government is
            endeavouring for the integration of all the stakeholders viz. farmers, insurance companies, financial institutions & Government agencies on single
            IT platform. This will ensure better administration, coordination & transparency for getting real time information and monitoring. Crop Insurance
            portal has enabled the digitization of notification of areas, crops, schemes for enabling information access to multiple stakeholders thereby
            facilitating ease of access to the farmers in availing crop insurance services. This automated solution has opened a window of opportunity to remote
            and economically weak farmers to benefit from crop insurance services. This is a stable, secure and seamlessly integrated ecosystem created with a
            comprehensive view of data in a secure environment thereby enabling information access to multiple stakeholders viz. Farmers, Govt. Functionaries,
            Insurance Companies, Intermediaries, Bankers and social & community bodies.
          </p>
        </div>

        <div className="col-lg-6">
          <img src={about_right} alt="" style={{ maxWidth: "100%", height: "330px", verticalAlign: "bottom" }} />
        </div>
      </div>
    </Box>
  );
};

export default AboutSection;
