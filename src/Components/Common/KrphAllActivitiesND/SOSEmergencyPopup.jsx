import React from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const SOSEmergencyPopup = ({
  openSOS,
  showMessage,
  setShowMessage,
  setOpenSOS,
  open,
  onClose,
  formValuesTicketCreation,
  setFormValuesTicketCreation,
  updateStateTicketCreation,
  setAlertMessage,
}) => {
  const handleSubmitEmergencyAlert = () => {
    // Aif(showMessage === )

    if (formValuesTicketCreation.txtSosDescription === "") {
      setAlertMessage({
        type: "warning",
        message: "Please enter the message",
      });
      return;
    }
    setShowMessage(true);
    setOpenSOS(false);
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2, borderBottom: "1px solid #ddd" }}>
        <RadioButtonCheckedIcon sx={{ color: "red", mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "red" }}>
          SOS Emergency Call
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent>
        <Typography sx={{ mb: 2, color: "#555" }}>
          The SOS Emergency Call button allows an agent to instantly trigger an alert during a call, ensuring immediate assistance in critical situations.
        </Typography>

        <Typography sx={{ fontWeight: "bold", mb: 2 }}>Cases like suicides, bribery, and hunger strikes are flagged as high priority.</Typography>

        {/* Description Field */}
        <Typography sx={{ fontWeight: "bold", mb: 1 }}>Description *</Typography>
        <TextField
          value={formValuesTicketCreation.txtSosDescription}
          onChange={(e) => updateStateTicketCreation("txtSosDescription", e.target.value)}
          fullWidth
          multiline
          rows={4}
          placeholder="Enter your message"
          variant="outlined"
        />

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            onClick={handleSubmitEmergencyAlert}
            variant="contained"
            sx={{
              backgroundColor: "red",
              color: "#fff",
              px: 5,
              "&:hover": { backgroundColor: "#c62828" },
            }}
          >
            Submit Alert
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SOSEmergencyPopup;
