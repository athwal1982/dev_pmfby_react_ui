import React, { useState } from "react";
import { Box } from "@mui/material";
import FeedbackHeader from "./FeedbackHeader";
import FeedbackQuestions from "./FeedbackQues";
import Successfull  from "./Successful";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FarmerFeedback = ({dcryptUNQEID, farmerName,farmerMobileNumber,dcryptUID}) => {
  const [feedbackResponses, setFeedbackResponses] = useState({});
  const [feedbackSubmit, setfeedbackSubmit] = useState(false);

  const handleFeedbackChange = (id, value) => {
    setFeedbackResponses((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <>
    {feedbackSubmit === true ? <Successfull /> :
    <div
      style={{
        position: "relative",
        background: "linear-gradient(to bottom, #21862d, #c3eb68)",
        minHeight: "fit-content",
      }}
    >
      <Box
        sx={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            maxWidth: "1100px",
            margin: "0px",
            padding: "30px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            backgroundColor: "#fff",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <FeedbackHeader />
          <FeedbackQuestions feedbackResponses={feedbackResponses} onFeedbackChange={handleFeedbackChange} setfeedbackSubmit={setfeedbackSubmit} dcryptUNQEID={dcryptUNQEID} farmerName={farmerName} farmerMobileNumber={farmerMobileNumber} dcryptUID={dcryptUID} />
        </Box>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div> }
     </>
  );
};

export default FarmerFeedback;
