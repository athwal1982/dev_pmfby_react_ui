import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import Feedback from "../Feedback/img/Feedback.png";

const FeedbackHeader = () => {
  return (
    <Box textAlign="center" mb={1}>
      <img className="fdk-img" src={Feedback} alt="Feedback Icon" width="100" />
      <Typography className="heading" variant="h4" mt={1}>
        Farmer Feedback Form
      </Typography>
      <Typography className="heading-desc" mt={1}>
        Thank you for taking time to provide feedback. We appreciate hearing from you and will review your comments carefully.
      </Typography>
      <Divider sx={{ my: 1 }} />
    </Box>
  );
};

export default FeedbackHeader;
