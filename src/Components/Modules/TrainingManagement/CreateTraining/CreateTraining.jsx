import React, { useEffect, useState } from "react";
import "./CreateTraining.scss";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { getTrainingTypeData, createTrainingData, getUpcomingTrainings } from "../Services/Methods";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useLocation } from "react-router-dom";

const CreateTraining = () => {
  const setAlertMessage = AlertMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const trainingData = location.state || {};
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [durations, setDurations] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [selectedModule, setSelectedModule] = useState("");
  const [trainingDate, setTrainingDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [existingTrainingDates, setExistingTrainingDates] = useState([]);
  const [trainingLink, setTrainingLink] = useState("");
  const [trainingTitelErrorMsg, settrainingTitleErrorMsg] = useState("");
  const [trainingTypeErrorMsg, settrainingTypeErrorMsg] = useState("");
  const [trainingLinkErrorMsg, settrainingLinkErrorMsg] = useState("");
  const [trainingDateErrorMsg, settrainingDateErrorMsg] = useState("");
  const [trainingStartDateErrorMsg, settrainingStartDateErrorMsg] = useState("");
  const [trainingEndDateErrorMsg, settrainingEndDateErrorMsg] = useState("");
  const [trainingDurationErrorMsg, settrainingDurationErrorMsg] = useState("");
  const [totalMinutes, setTotalMinutes] = useState(null);


  const handleDateChange = (newDate) => {
    if (newDate) {
      const adjustedDate = new Date(newDate.getTime() + 5.5 * 60 * 60 * 1000);

      setTrainingDate(adjustedDate);
    } else {
      setTrainingDate(null);
    }
  };

  const fetchTrainingTypes = async () => {
    try {
      const data = await getTrainingTypeData({ MODE: "#ALL", TrainingID: null });
      if (data.response.responseCode === 1) {
        const responseData = data.response.responseData;
        if (Array.isArray(responseData)) {
          setTrainingTypes(responseData);
        } else {
          setTrainingTypes([]);
        }
      }
    } catch (error) {
      setTrainingTypes([]);
    }
  };

  const fetchExistingTrainingDates = async () => {
    debugger;
    try {
      const data = await getUpcomingTrainings();
      if (data.response.responseCode === 1) {
        const currentTimeIST = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const currentTimeInIST = new Date(currentTimeIST.getTime() + istOffset);

        const filteredData = data.response.responseData.filter((training) => {
          const trainingDate = new Date(training.TrainingDate);
          const startTimeParts = training.StartTime.split(":");
          const endTimeParts = training.EndTime.split(":");

          const startDate = new Date(trainingDate);
          startDate.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]), 0, 0);
          const startDateInIST = new Date(startDate.getTime() + istOffset);

          const endDate = new Date(trainingDate);
          endDate.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0, 0);
          const endDateInIST = new Date(endDate.getTime() + istOffset);

          return startDateInIST >= currentTimeInIST;
        });

        const sortedData = filteredData.sort((a, b) => {
          const startTimeA = new Date(new Date(a.TrainingDate).setHours(...a.StartTime.split(":").map(Number)));
          const startTimeB = new Date(new Date(b.TrainingDate).setHours(...b.StartTime.split(":").map(Number)));
          return startTimeA - startTimeB;
        });

        setExistingTrainingDates(sortedData);
      } else {
        setExistingTrainingDates([]);
      }
    } catch (error) {
      console.error("Error fetching existing training dates", error);
    }
  };

  const updateEndTime = (duration, startTime) => {
    if (!startTime) return;
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    start.setHours(start.getHours() + parseInt(duration));
    const end = start.toISOString().substr(11, 5);
    setEndTime(end);
  };

  const handleDurationChange = (e) => {
    const selectedDuration = e.target.value;
    setDuration(selectedDuration);
    updateEndTime(selectedDuration, startTime);
  };

  const handleStartTimeChange = (e) => {
    const selectedStartTime = e.target.value;
    setStartTime(selectedStartTime);

    calculateDuration(e.target.value, endTime);
  };

  const handleEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;
    setEndTime(selectedEndTime);
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${selectedEndTime}:00Z`);
    const timeDifference = (end - start) / (1000 * 60 * 60);
    if (timeDifference < duration) {
      setAlertMessage({
        type: "error",
        message: "End time must be greater than start time by the selected duration.",
      });
    }
    calculateDuration(startTime, e.target.value);
  };


  const handleSubmit = async (e) => {
    debugger;

    
    const startDate = new Date(`1970-01-01T${startTime}`);
    const endDate = new Date(`1970-01-01T${endTime}`);

    if (endDate <= startDate) {
        setAlertMessage({ type: "error", message: "Enter a valid time. End time cannot be before start time." });

  
    }
    e.preventDefault();
    if (trainingTitle === "") {
      settrainingTitleErrorMsg("Training title is required!");
      return;
    } else {
         settrainingTitleErrorMsg("");
    }
    if (selectedModule === "") {
      settrainingTypeErrorMsg("Training type is required!");
      return;
    } else {
         settrainingTypeErrorMsg("");
      }

    if (trainingLink === "") {
      settrainingLinkErrorMsg("Meet/VC Link is required!");
      return;
    } else {
         settrainingLinkErrorMsg("");
      }

    if (trainingLink !== "") {
      const meetRegex = /^https:\/\/meet\.google\.com\/([a-z]{3}-[a-z]{4}-[a-z]{3}|lookup\/[a-zA-Z0-9]+)(\?.*)?$/;

      if (!meetRegex.test(trainingLink)) {
       settrainingLinkErrorMsg("Meet/VC Link is not valid!");
       return;
      } else {
         settrainingLinkErrorMsg("");
      }
    }

    if (trainingDate === null) {
      settrainingDateErrorMsg("Training schedule date is required!");
      return;
    } else {
         settrainingDateErrorMsg("");
      }

    if (startTime === "") {
      settrainingStartDateErrorMsg("Start time is required!");
      return;
    } else {
         settrainingStartDateErrorMsg("");
      }

    if (endTime === "") {
      settrainingEndDateErrorMsg("End time is required!");
      return;
    }  else {
         settrainingEndDateErrorMsg("");
      }

    if (duration === "") {
      settrainingDurationErrorMsg("Duration is required!");
      return;
    } else {
         settrainingDurationErrorMsg("");
      }

    const trainingData = {
      TrainingTypeID: selectedModule,
      TrainingDate: trainingDate,
      StartTime: startTime,
      EndTime: endTime,
      Duration: totalMinutes,
      TrainingTitle: trainingTitle,
      TrainingLink: trainingLink,
    };

    setIsSubmitting(true);
    setSubmissionStatus("");

    try {
      const response = await createTrainingData(trainingData);
      if (response.response.responseCode === 1) {
        navigate("/TrainingList");
      } else {
        setAlertMessage({
          type: "error",
          message: response.response.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const capitalizeText = (text) => {
    if (!text) return text;
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  const getDateOnly = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const convertToAMPM = (time) => {
    if (!time || !/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      throw new Error("Invalid time format. Please use 'hh:mm:ss' format.");
    }

    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;

    if (hours === 0) {
      hours = 12;
    }

    minutes = minutes.padStart(2, "0");

    return `${hours}:${minutes} ${period}`;
  };

 

  useEffect(() => {
    fetchTrainingTypes();
    fetchExistingTrainingDates();
  }, []);

  useEffect(() => {
    debugger;
    if (trainingData?.TrainingMasterId) {
      setTrainingTitle(trainingData.TrainingName || "");
      setSelectedModule(trainingData.TrainingTypeID || "");
      setTrainingLink(trainingData.TrainingLink || "");
      setTrainingDate(
        dateToSpecificFormat(
          `${trainingData.TrainingDate.split("T")[0]} ${Convert24FourHourAndMinute(trainingData.TrainingDate.split("T")[1])}`,
          "MM/DD/YYYY",
        ) || "",
      );
      setStartTime(trainingData.StartTime || "");
      setEndTime(trainingData.EndTime || "");

      if (trainingData.StartTime && trainingData.EndTime) {
        const start = new Date(`1970-01-01T${trainingData.StartTime}`);
        const end = new Date(`1970-01-01T${trainingData.EndTime}`);
        const durationInHours = (end - start) / (1000 * 60 * 60);
        setDuration(durationInHours);
      }
    }
       if (trainingTitle !== "") settrainingTitleErrorMsg("");
       if (selectedModule !== "") settrainingTypeErrorMsg("");
       // A if (trainingLink !== "") settrainingLinkErrorMsg("");
       // A if (trainingDate !== null) settrainingDateErrorMsg("");
       if (startTime !== "") settrainingStartDateErrorMsg("");
       if (endTime !== "") settrainingEndDateErrorMsg("");
       if (duration !== "") settrainingDurationErrorMsg("");
  }, [trainingData]);



const calculateDuration = (start, end) => {
  if (!start || !end) {
    setDuration("");
    setTotalMinutes(null);
    return;
  }

  const startDate = new Date(`1970-01-01T${start}`);
  const endDate = new Date(`1970-01-01T${end}`);

  if (endDate <= startDate) {
    setDuration("Invalid Time Range");
    setTotalMinutes(null);
    return;
  }

  const diffInMinutes = Math.floor((endDate - startDate) / (1000 * 60));
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  setDuration(`${hours}h ${minutes}m`);
  setTotalMinutes(diffInMinutes); // Store total minutes separately
};




  return (
    <div className="form-wrapper">
      <div className="form-container_CT">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="CreateTraining-form-label" htmlFor="training-title">
                Training Title <span className="asteriskCss">&#42;</span>
              </label>
              <input
                type="text"
                id="training-title"
                placeholder="Enter Training Title"
                value={trainingTitle}
                onChange={(e) => setTrainingTitle(e.target.value)}
                autoComplete="off"
              />
              <span className="login_ErrorTxt">{trainingTitelErrorMsg}</span>
            </div>
            <div className="form-group">
              <label className="CreateTraining-form-label" htmlFor="training-module">
                Training Type <span className="asteriskCss">&#42;</span>
              </label>
              <select id="training-module" value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
                <option value="">Choose Training Type</option>
                {Array.isArray(trainingTypes) && trainingTypes.length === 0 ? (
                  <option disabled>No training types available</option>
                ) : (
                  Array.isArray(trainingTypes) &&
                  trainingTypes.map((type) => (
                    <option key={type.TrainingID} value={type.TrainingID}>
                      {type.TrainingName}
                    </option>
                  ))
                )}
              </select>
              <span className="login_ErrorTxt">{trainingTypeErrorMsg}</span>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="CreateTraining-form-label" htmlFor="training-link">
                Meet/VC Link <span className="asteriskCss">&#42;</span>
              </label>
              <input
                type="text"
                id="training-link"
                placeholder="Enter Meet/VC Link "
                value={trainingLink}
                onChange={(e) => setTrainingLink(e.target.value)}
                autoComplete="off"
              />
              <span className="login_ErrorTxt">{trainingLinkErrorMsg}</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="CreateTraining-form-label" htmlFor="training-date">
                Training Scheduled Date <span className="asteriskCss">&#42;</span>
              </label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  id="training-date"
                  value={trainingDate}
                  onChange={handleDateChange}
                  minDate={new Date().setMonth(new Date().getMonth() - 1)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <span className="login_ErrorTxt">{trainingDateErrorMsg}</span>
            </div>
            <div className="form-group time-group" style={{ display: "flex", flexDirection: "row", gap: "20px", marginRight: "0px" }}>
              <div>
                <label className="CreateTraining-form-label" htmlFor="training-start-time">
                  Training Start Time <span className="asteriskCss">&#42;</span>
                </label>
                <input style={{ width: "200px" }} type="time" id="training-start-time" value={startTime} onChange={handleStartTimeChange} />
                <span className="login_ErrorTxt">{trainingStartDateErrorMsg}</span>
              </div>
              <div>
                <label className="CreateTraining-form-label" htmlFor="training-end-time">
                  Training End Time <span className="asteriskCss">&#42;</span>
                </label>
                <input style={{ width: "200px" }} type="time" id="training-end-time" value={endTime} onChange={handleEndTimeChange}/>
                <span className="login_ErrorTxt">{trainingEndDateErrorMsg}</span>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="CreateTraining-form-label" htmlFor="training-duration">
                Duration <span className="asteriskCss">&#42;</span>
              </label>
              <input 
  style={{ width: "300px" }} 
  type="text" 
  value={duration} 
  disabled
/>

          
              <span className="login_ErrorTxt">{trainingDurationErrorMsg}</span>
            </div>
          </div>
          <div className="form-row">
            <div className="scheduled-training-box">
              <h5>Training Booked Slot</h5>
              <table className="training-timetable">
                <thead>
                  <tr>
                    <th>Training Name</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {existingTrainingDates.map((training, index) => (
                    <tr key={index} className={training.isUpcoming ? "highlight-upcoming-training" : ""}>
                      <td>{capitalizeText(training.TrainingTitle)}</td>
                      <td>{getDateOnly(training.TrainingDate)}</td>
                      <td>{convertToAMPM(training.StartTime)}</td>
                      <td>{convertToAMPM(training.EndTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn save-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                Save
                </>
              )}
            </button>

            <button type="button" className="cancel-btn" onClick={() => navigate("/TrainingList")}>
              Cancel
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setSelectedModule("");
                setTrainingDate("");
                setStartTime("");
                setEndTime("");
                setDuration("");
                setTrainingTitle("");
                setTrainingLink("");
                settrainingTitleErrorMsg("");
                settrainingTypeErrorMsg("");
                settrainingTitleErrorMsg("");
                settrainingDateErrorMsg("");
                settrainingStartDateErrorMsg("");
                settrainingEndDateErrorMsg("");
                settrainingDurationErrorMsg("");
              }}
            >
              Clear
            </button>
          </div>
        </form>

        {submissionStatus && <div className={`status-message ${submissionStatus.includes("success") ? "success" : "error"}`}>{submissionStatus}</div>}
      </div>
    </div>
  );
};

export default CreateTraining;
