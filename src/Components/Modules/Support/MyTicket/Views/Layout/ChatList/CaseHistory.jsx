import React, { useState } from "react";
import { Box, IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Close } from "@mui/icons-material";
const CaseHistory = ({open, handleCloseCaseHistory ,selectedData}) => {

    return (
   <Dialog
              open={open}
              onClose={handleCloseCaseHistory}
              maxWidth="lg"
              fullWidth
              sx={{
    "& .MuiDialog-container": {
      alignItems: "flex-start",   
    },
    "& .MuiPaper-root": {
      borderRadius: "20px",
      boxShadow: "none",
      mt: 2,          
    },
  }}
              style={{ zIndex: "999999999" }}
            >
              <DialogTitle
                sx={{
                  padding: "5px 24px 5px 24px",
                  bgcolor: "#31af40ff",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "Open Sans",
                  fontSize: { xs: "14px", md: "14px" },
                }}
              >
                <Box sx={{ flexGrow: 1, textAlign: "center", fontSize: "20px" }}>
<span>KRPH Ticket No. : {selectedData && selectedData.SupportTicketNo  ? selectedData.SupportTicketNo  : null} - Case History</span>
                </Box>
                
                <IconButton
                  onClick={handleCloseCaseHistory}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "#31af40ff",
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ textAlign: "justify", padding: "0px 40px 20px 40px", fontFamily: "Open Sans", fontSize: "14px", lineHeight: "22px" }}>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                 
                </Box>
                
              </DialogContent>
            </Dialog>
    );
};

export default CaseHistory;