import React, { useState, useEffect } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button, TextField } from "@mui/material";
import { fetchFeedbackQuestions, submitFeedback } from "./Services/Services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Reusable AnyOtherTextField component
const AnyOtherTextField = ({ id, value, onChange, placeholder }) => (
  <TextField
    fullWidth
    variant="outlined"
    value={value || ""}
    onChange={(e) => onChange(id, e.target.value)}
    placeholder={placeholder || "Please specify"}
    sx={{ mt: 2 }}
    id={`any-other-${id}`}
  />
);

const FeedbackQuestions = ({ feedbackResponses, onFeedbackChange, setfeedbackSubmit,dcryptUNQEID,farmerName,farmerMobileNumber,dcryptUID,pStateName,pDistrictName }) => {
  const [questions, setQuestions] = useState([]);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const questionBoxStyle = (id) => ({
    border: hoveredBox === id ? "2px solid #007AFF" : "2px solid #D9D9D2",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "20px",
    position: "relative",
    transition: "box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease",
  });

  const handleMouseEnter = (id) => {
    setHoveredBox(id);
  };

  const handleMouseLeave = () => {
    setHoveredBox(null);
  };


  const handleSubmit = async () => {
    debugger;
    const errors = {};

    // Validate questions and sub-questions
    questions.forEach((q) => {
      if (!feedbackResponses[q.id]) {
        errors[q.id] = "This question must be answered";
      }

      q.subQuestions?.forEach((subQ) => {
        if (feedbackResponses[q.id] === subQ.condition && !feedbackResponses[subQ.id]) {
          errors[subQ.id] = "This sub-question must be answered";
        }
      });
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("All fields are required to submit");
      return;
    }

    // Prepare feedback data dynamically
    const feedbackData = questions.map((q) => {
      const questionResponse = {
        questionId: q.id,
        response: feedbackResponses[q.id] === "Any other" ? "Any other" : feedbackResponses[q.id] || "",
        subAnswers: [],
      };

      const processedSubResponses = new Set(); // Ensure unique subresponses for the current question

      // Add sub-questions dynamically
      q.subQuestions?.forEach((subQ) => {
        if (feedbackResponses[q.id] === subQ.condition) {
          const subResponse = feedbackResponses[subQ.id] === "Any other" ? feedbackResponses[`${subQ.id}_other`] || "" : feedbackResponses[subQ.id] || "";

          // Only add unique subResponses
          if (subResponse && !processedSubResponses.has(subResponse)) {
            questionResponse.subAnswers.push({
              order: subQ.order,
              subResponse,
            });
            processedSubResponses.add(subResponse);
          }
        }
      });

      // Handle main question's "Any other" dynamically
      if (feedbackResponses[q.id] === "Any other" && feedbackResponses[`${q.id}_other`]) {
        const mainOtherResponse = feedbackResponses[`${q.id}_other`];

        // Ensure "Any other" for the main question is unique
        if (mainOtherResponse && !processedSubResponses.has(mainOtherResponse)) {
          questionResponse.subAnswers.push({
            order: 0, // Adjust order dynamically if needed
            subResponse: mainOtherResponse,
          });
          processedSubResponses.add(mainOtherResponse);
        }
      }

      return questionResponse;
    });

    const payload = {
      answers: feedbackData,
      farmer_name: farmerName,
      farmer_mobile_number: farmerMobileNumber,
      CallingUniqueID: dcryptUNQEID,
      agent_id: dcryptUID,
      StateName: pStateName ? pStateName.trim() : "",
      DistrictName: pDistrictName ? pDistrictName.trim() : "",
    };

    debugger;
    try {
      const response = await submitFeedback(payload);
      if(response && response.responseCode === 1) {
        toast.success("Form submitted successfully!");
        setfeedbackSubmit(true);
      } else {
        toast.error("Error submitting feedback!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback. Please try again.");
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetchFeedbackQuestions();
        if (response && response.responseCode === 1) {
          setQuestions(response.responseDynamic);
        }
      } catch (error) {
        console.error("Error fetching or processing feedback questions:", error);
      }
    };

    loadQuestions();
  }, []);

  const renderSubQuestions = (subQuestions, parentId, parentHasAnyOther) =>
    subQuestions.map((subQ) => {
      // Skip rendering the sub-question and input field if the parent has "Any other" option
      if (parentHasAnyOther) return null;

      if (feedbackResponses[parentId] === subQ.condition) {
        return (
          <div key={subQ.id} style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <Typography>{subQ.question}</Typography>
            {subQ.options.includes("Any other") ? (
              <>
                <RadioGroup row value={feedbackResponses[subQ.id] || ""} onChange={(e) => onFeedbackChange(subQ.id, e.target.value)}>
                  {subQ.options.map((option, idx) => (
                    <FormControlLabel key={idx} value={option} control={<Radio />} label={option} />
                  ))}
                </RadioGroup>
                {feedbackResponses[subQ.id] === "Any other" && (
                  <AnyOtherTextField
                    id={`${subQ.id}_other`} // Make sure this ID is unique for each sub-question
                    value={feedbackResponses[`${subQ.id}_other`] || ""}
                    onChange={onFeedbackChange}
                    placeholder="Please specify"
                  />
                )}
              </>
            ) : (
              <RadioGroup row value={feedbackResponses[subQ.id] || ""} onChange={(e) => onFeedbackChange(subQ.id, e.target.value)}>
                {subQ.options.map((option, idx) => (
                  <FormControlLabel key={idx} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            )}

            {validationErrors[subQ.id] && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {validationErrors[subQ.id]}
              </Typography>
            )}
          </div>
        );
      }
      return null;
    });

  return (
    <>
      {questions.map((q, index) => {
        const hasAnyOtherOption = q.options.includes("Any other");

        // Check for the special question "What are the reasons for not buying other insurance products?"
        const isSpecialQuestion = q.options.includes("If No, What are the reasons for not buying other insurance products?");

        return (
          <Box key={q.id} id={q.id} onMouseEnter={() => handleMouseEnter(q.id)} onMouseLeave={handleMouseLeave} sx={questionBoxStyle(q.id)}>
            <Typography>{`Q${index + 1}. ${q.question}`}</Typography>
            {q.options.length > 0 ? (
              <>
                <RadioGroup row value={feedbackResponses[q.id] || ""} onChange={(e) => onFeedbackChange(q.id, e.target.value)}>
                  {q.options.map((option, idx) => (
                    <FormControlLabel key={idx} value={option} control={<Radio />} label={option} />
                  ))}
                </RadioGroup>
                {hasAnyOtherOption && feedbackResponses[q.id] === "Any other" && (
                  <AnyOtherTextField id={`${q.id}_other`} value={feedbackResponses[`${q.id}_other`]} onChange={onFeedbackChange} placeholder="Please specify" />
                )}
                {/* Check if it's the special question */}
                {isSpecialQuestion && feedbackResponses[q.id] === "If No, What are the reasons for not buying other insurance products?" && (
                  <AnyOtherTextField
                    id={`${q.id}_reason`}
                    value={feedbackResponses[`${q.id}_reason`]}
                    onChange={onFeedbackChange}
                    placeholder="Please specify the reason"
                  />
                )}
              </>
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                value={feedbackResponses[q.id] || ""}
                onChange={(e) => onFeedbackChange(q.id, e.target.value)}
                placeholder="Your answer here"
                autoComplete="off"
                sx={{ mt: 2 }}
              />
            )}

            {q.subQuestions?.length > 0 && renderSubQuestions(q.subQuestions, q.id, hasAnyOtherOption)}
          </Box>
        );
      })}

      <Box textAlign="center" mt={1}>
        <Button
          variant="contained"
          size="large"
          sx={{
            textTransform: "none",
            backgroundColor: "#075307",
            borderRadius: "15px",
          }}
          onClick={handleSubmit}
        >
          Submit Feedback
        </Button>
      </Box>

      <ToastContainer />
    </>
  );
};

export default FeedbackQuestions;