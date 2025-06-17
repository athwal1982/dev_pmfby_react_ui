import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const TicketSuccess = () => {
  
  const location = useLocation();
  const navigate = useNavigate();

  const ticketNumber = location.state?.ticketNo || "N/A";

  const handleCreateMore = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #a8e063, #56ab2f)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          maxWidth: 700,
          borderRadius: 4,
        }}
      >
        <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 60 }} />
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            mb: 1,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {ticketNumber}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, color: "#888" }}>
          Ticket Created Successfully
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#555" }}>
          Congratulations! A ticket with a reference number above has been generated. Click the "create more" button if you wish to create more tickets, or else
          you can ask for the farmer's feedback.
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleCreateMore}
          sx={{
            mt: 2,
            textTransform: "none",
          }}
        >
          Create More Ticket
        </Button>
      </Paper>
    </Box>
  );
};

export default TicketSuccess;
