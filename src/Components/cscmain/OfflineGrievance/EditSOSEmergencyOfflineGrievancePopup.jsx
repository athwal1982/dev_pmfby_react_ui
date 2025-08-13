import React from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const EditSOSEmergencyOfflineGrievancePopup = ({
  setShowMessage,
  setOpenSOS,
  open,
  onClose,
  formValuesGI,
  updateStateGI,
  setAlertMessage,
}) => {
  const handleSubmitEmergencyAlert = () => {

    if (formValuesGI.txtLegalDescription === "") {
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth style={{ zIndex: "999999999" }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2, borderBottom: "1px solid #ddd" }}>
        <RadioButtonCheckedIcon sx={{ color: "red", mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "red" }}>
         Legal Cases
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent>
        <Typography sx={{ mb: 2, color: "#555" }}>
          Legal cases involving court notices, FIRs, or ongoing litigation are flagged as high priority and require immediate escalation and resolution for Legal cases.
        </Typography>

        

        {/* Description Field */}
        <Typography sx={{ fontWeight: "bold", mb: 1 }}>Description <span className="asteriskCss">&#42;</span></Typography>
        <TextField
          value={formValuesGI.txtLegalDescription}
          onChange={(e) => updateStateGI("txtLegalDescription", e.target.value)}
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
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditSOSEmergencyOfflineGrievancePopup;
