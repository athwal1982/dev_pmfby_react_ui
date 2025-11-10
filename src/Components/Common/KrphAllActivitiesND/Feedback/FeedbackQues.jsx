import React, { useState, useEffect } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button, TextField } from "@mui/material";
import { InputControl, InputGroup } from "Framework/OldFramework/FormComponents/FormComponents";
import { fetchFeedbackQuestions, submitFeedback } from "./Services/Services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeedbackQuestions = ({
  feedbackResponses,
  onFeedbackChange,
  setfeedbackSubmit,
  dcryptUNQEID,
  farmerName,
  farmerMobileNumber,
  dcryptUID,
  pStateName,
  pDistrictName,
}) => {
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

    questions.forEach((q) => {
      if (!feedbackResponses[q.id] || !feedbackResponses[q.id].toString().trim()) {
        errors[q.id] = "This question must be answered";
      }

      q.subQuestions?.forEach((subQ) => {
        if (feedbackResponses[q.id] === subQ.conditionId && (!feedbackResponses[subQ.id] || !feedbackResponses[subQ.id].toString().trim())) {
          errors[subQ.id] = "This sub-question must be answered";
        }
      });
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("All fields are required to submit");
      return;
    }

    const feedbackData = questions.map((q) => {
      let responseText = "";

      if (q.options?.length > 0) {
        const selectedOption = q.options.find((opt) => opt.id === feedbackResponses[q.id]);
        responseText = selectedOption ? selectedOption.option : feedbackResponses[q.id] || "";
      } else {
        responseText = feedbackResponses[q.id] || "";
      }

      const questionResponse = {
        questionId: q.id,
        questionText: q.question,
        response: responseText.trim(),
        subAnswers: [],
      };

      const processedSubResponses = new Set();

      q.subQuestions?.forEach((subQ) => {
        if (feedbackResponses[q.id] === subQ.conditionId) {
          const selectedSubOption = subQ.options?.find((opt) => opt.id === feedbackResponses[subQ.id]);
          let subResponse = selectedSubOption ? selectedSubOption.option : feedbackResponses[subQ.id] || "";

          if (selectedSubOption?.option?.toLowerCase().includes("other")) {
            subResponse = feedbackResponses[`${subQ.id}_other`] || "";
          }

          if (subResponse && !processedSubResponses.has(subResponse)) {
            questionResponse.subAnswers.push({
              subQuestionId: subQ.id,
              subQuestionText: subQ.question,
              order: subQ.order,
              subResponse: subResponse.trim(),
            });
            processedSubResponses.add(subResponse);
          }
        }
      });

      const mainOption = q.options?.find((opt) => opt.id === feedbackResponses[q.id]);
      if (mainOption?.option?.toLowerCase().includes("other") && feedbackResponses[`${q.id}_other`]) {
        const mainOtherResponse = feedbackResponses[`${q.id}_other`];
        if (mainOtherResponse && !processedSubResponses.has(mainOtherResponse)) {
          questionResponse.subAnswers.push({
            subQuestionId: `${q.id}_other`,
            subQuestionText: "Other (Specify)",
            order: 0,
            subResponse: mainOtherResponse.trim(),
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
      ReasonWithFeedback:
        formValuesWithoutFeedBackReason &&
        formValuesWithoutFeedBackReason.txtWithoutFeedBackReason &&
        formValuesWithoutFeedBackReason.txtWithoutFeedBackReason.value
          ? formValuesWithoutFeedBackReason.txtWithoutFeedBackReason.value
          : "",
    };

    try {
      const response = await submitFeedback(payload);
      if (response && response.responseCode === 1) {
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

  const handleWithoutSubmit = async () => {
    debugger;
    if (!handleWithoutFeedBackReasonInfoValidation()) {
      return;
    }

    const feedbackData = questions.map((q) => {
      let responseText = "";

      if (q.options?.length > 0) {
        const selectedOption = q.options.find((opt) => opt.id === feedbackResponses[q.id]);
        responseText = selectedOption ? selectedOption.option : feedbackResponses[q.id] || "";
      } else {
        responseText = feedbackResponses[q.id] || "";
      }

      const questionResponse = {
        questionId: q.id,
        questionText: q.question,
        response: responseText.trim(),
        subAnswers: [],
      };

      const processedSubResponses = new Set();

      q.subQuestions?.forEach((subQ) => {
        if (feedbackResponses[q.id] === subQ.conditionId) {
          const selectedSubOption = subQ.options?.find((opt) => opt.id === feedbackResponses[subQ.id]);
          let subResponse = selectedSubOption ? selectedSubOption.option : feedbackResponses[subQ.id] || "";

          if (selectedSubOption?.option?.toLowerCase().includes("other")) {
            subResponse = feedbackResponses[`${subQ.id}_other`] || "";
          }

          if (subResponse && !processedSubResponses.has(subResponse)) {
            questionResponse.subAnswers.push({
              subQuestionId: subQ.id,
              subQuestionText: subQ.question,
              order: subQ.order,
              subResponse: subResponse.trim(),
            });
            processedSubResponses.add(subResponse);
          }
        }
      });

      const mainOption = q.options?.find((opt) => opt.id === feedbackResponses[q.id]);
      if (mainOption?.option?.toLowerCase().includes("other") && feedbackResponses[`${q.id}_other`]) {
        const mainOtherResponse = feedbackResponses[`${q.id}_other`];
        if (mainOtherResponse && !processedSubResponses.has(mainOtherResponse)) {
          questionResponse.subAnswers.push({
            subQuestionId: `${q.id}_other`,
            subQuestionText: "Other (Specify)",
            order: 0,
            subResponse: mainOtherResponse.trim(),
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
      ReasonWithFeedback:
        formValuesWithoutFeedBackReason &&
        formValuesWithoutFeedBackReason.txtWithoutFeedBackReason &&
        formValuesWithoutFeedBackReason.txtWithoutFeedBackReason.value
          ? formValuesWithoutFeedBackReason.txtWithoutFeedBackReason.value
          : "",
    };

    try {
      const response = await submitFeedback(payload);
      if (response && response.responseCode === 1) {
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

  const [formValidationWithoutFeedBackReasonError, setFormValidationWithoutFeedBackReasonError] = useState({});
  const validateWithoutFeedBackReasonInfoField = (name, value) => {
    let errorsMsg = "";
    if (name === "txtWithoutFeedBackReason") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Reason is required!";
      }
    }

    return errorsMsg;
  };

  const handleWithoutFeedBackReasonInfoValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtWithoutFeedBackReason"] = validateWithoutFeedBackReasonInfoField(
        "txtWithoutFeedBackReason",
        formValuesWithoutFeedBackReason.txtWithoutFeedBackReason,
      );

      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationWithoutFeedBackReasonError(errors);
      return formIsValid;
    } catch (error) {
      toast.error("Something Went Wrong");
      return false;
    }
  };

  const updateStateWithoutFeedBackReason = (name, value) => {
    setFormValuesWithoutFeedBackReason({ ...formValuesWithoutFeedBackReason, [name]: value });
    setFormValidationWithoutFeedBackReasonError[name] = validateWithoutFeedBackReasonInfoField(name, value);
  };

  const [formValuesWithoutFeedBackReason, setFormValuesWithoutFeedBackReason] = useState({
    txtWithoutFeedBackReason: null,
  });

  const [withoutFeedbackddlList] = useState([
    { value: "Call Not Answered", label: "Call Not Answered" },
    { value: "Farmer Denied To Provide Feedback", label: "Farmer Denied To Provide Feedback" },
    { value: "Call Disconnected", label: "Call Disconnected" },
  ]);

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

  const renderSubQuestions = (subQuestions, parentId) =>
    subQuestions.map((subQ) => {
      const showSubQ = feedbackResponses[parentId] === subQ.conditionId;
      if (!showSubQ) return null;

      const hasAnyOtherOption = subQ.options?.some((opt) => opt.option === "Any other");
      const anyOtherOptionId = subQ.options?.find((opt) => opt.option === "Any other")?.id;

      return (
        <Box
          key={subQ.id}
          id={subQ.id}
          sx={{
            ml: 4,
            mt: 2,
            pl: 2,
            pb: 2,
          }}
        >
          {subQ.options.length > 0 ? (
            <>
              <RadioGroup row value={feedbackResponses[subQ.id] || ""} onChange={(e) => onFeedbackChange(subQ.id, e.target.value)}>
                {subQ.options.map((opt) => (
                  <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.option} />
                ))}
              </RadioGroup>

              {hasAnyOtherOption && feedbackResponses[subQ.id] === anyOtherOptionId && (
                <TextField
                  fullWidth
                  variant="outlined"
                  value={feedbackResponses[`${subQ.id}_other`] || ""}
                  onChange={(e) => onFeedbackChange(`${subQ.id}_other`, e.target.value)}
                  placeholder="Please specify"
                  autoComplete="off"
                  sx={{ mt: 1 }}
                />
              )}
            </>
          ) : (
            <TextField
              fullWidth
              variant="outlined"
              value={feedbackResponses[subQ.id] || ""}
              onChange={(e) => onFeedbackChange(subQ.id, e.target.value)}
              placeholder="Your answer here"
              autoComplete="off"
              sx={{ mt: 1 }}
            />
          )}

          {subQ.subQuestions?.length > 0 && renderSubQuestions(subQ.subQuestions, subQ.id)}
        </Box>
      );
    });

  return (
    <>
      {questions.map((q, index) => {
        const hasAnyOtherOption = q.options?.some((opt) => opt.option === "Any other");
        const anyOtherOptionId = q.options?.find((opt) => opt.option === "Any other")?.id;
        const hasSubQForAnyOther = q.subQuestions?.some((subQ) => subQ.conditionId === anyOtherOptionId);

        return (
          <Box key={q.id} id={q.id} onMouseEnter={() => handleMouseEnter(q.id)} onMouseLeave={handleMouseLeave} sx={questionBoxStyle(q.id)}>
            <Typography>{`Q${index + 1}. ${q.question}`}</Typography>

            {q.options.length > 0 ? (
              <>
                <RadioGroup row value={feedbackResponses[q.id] || ""} onChange={(e) => onFeedbackChange(q.id, e.target.value)}>
                  {q.options.map((option) => (
                    <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.option} />
                  ))}
                </RadioGroup>

                {hasAnyOtherOption && feedbackResponses[q.id] === anyOtherOptionId && !hasSubQForAnyOther && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={feedbackResponses[`${q.id}_other`] || ""}
                    onChange={(e) => onFeedbackChange(`${q.id}_other`, e.target.value)}
                    placeholder="Please specify"
                    autoComplete="off"
                    sx={{ mt: 1 }}
                  />
                )}

                {q.subQuestions?.length > 0 && renderSubQuestions(q.subQuestions, q.id)}
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
          </Box>
        );
      })}

      <Box display="flex" alignItems="center" justifyContent="center" gap={2} mt={3} flexWrap="wrap">
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
        <Button
          variant="contained"
          size="large"
          sx={{
            textTransform: "none",
            backgroundColor: "#075307",
            borderRadius: "15px",
          }}
          onClick={handleWithoutSubmit}
        >
          Submit Without Feedback
        </Button>
        <InputGroup ErrorMsg={formValidationWithoutFeedBackReasonError["txtWithoutFeedBackReason"]}>
          <InputControl
            Input_type="select"
            name="txtWithoutFeedBackReason"
            getOptionLabel={(option) => `${option.label}`}
            value={formValuesWithoutFeedBackReason.txtWithoutFeedBackReason}
            getOptionValue={(option) => `${option}`}
            options={withoutFeedbackddlList}
            ControlTxt="Reason"
            onChange={(e) => updateStateWithoutFeedBackReason("txtWithoutFeedBackReason", e)}
          />
        </InputGroup>
      </Box>

      <ToastContainer />
    </>
  );
};

export default FeedbackQuestions;
