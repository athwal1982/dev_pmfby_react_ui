import React, { useEffect, useState } from "react";
import { Loader } from "Framework/Components/Widgets";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { convertTotalMinutesToFormatedHours } from "Configration/Utilities/dateformat";
import "./TraineeDashboard.scss";
import icon from "../../../../assets/icon1.svg";
import icon4 from "../../../../assets/icon5.svg";
import training3 from "../../../../assets/training3.svg";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { gettraineeDashboradData } from "../../TrainingManagement/Services/Methods";

const getCurrentMonthAndYear = () => {
  const currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString();
  return { month, year };
};

const TraineeDashboard = () => {
  const setAlertMessage = AlertMessage();
  const { month, year } = getCurrentMonthAndYear();
  const userData = getSessionStorage("user");

  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [totalTrainingHours, setTotalTrainingHours] = useState("0 hr");
  const [totalTrainings, setTotalTrainings] = useState("0");
  const [moduleTraining, setModuleTraining] = useState({});
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [trainingSixMonthWise, settrainingSixMonthWise] = useState([]);

  const months = [
    { name: "January", value: "01" },
    { name: "February", value: "02" },
    { name: "March", value: "03" },
    { name: "April", value: "04" },
    { name: "May", value: "05" },
    { name: "June", value: "06" },
    { name: "July", value: "07" },
    { name: "August", value: "08" },
    { name: "September", value: "09" },
    { name: "October", value: "10" },
    { name: "November", value: "11" },
    { name: "December", value: "12" },
  ];
  const [years, setyears] = useState([]);
  const [moduleHeaderColumn, setmoduleHeaderColumn] = useState([]);
  const [countAndHoursByModule, setcountAndHoursByModule] = useState([]);
  const [isLoadingTraineeDashboardData, setIsLoadingTraineeDashboardData] = useState(false);
  const fetchAllTrainer = async () => {
    debugger;
    try {
      const formData = {
        SPViewMode: "TRAINEEDASHBOARD",
        SPUserID: userData.CscUserID,
        SPYear: selectedYear,
        SPMonth: selectedMonth,
      };
      setIsLoadingTraineeDashboardData(true);
      const response = await gettraineeDashboradData(formData);
      setIsLoadingTraineeDashboardData(false);

      if (response?.response?.responseCode === 1) {
        const data = response.response.responseData || {};
        let pTotalTrainingHours = 0;
        let pTotalTrainingCount = 0;
        data.forEach((v) => {
          pTotalTrainingHours += parseFloat(v.TotalTrainingHours);
          pTotalTrainingCount += parseFloat(v.TrainingCount);
        });

        const formattedHours = pTotalTrainingHours ? convertTotalMinutesToFormatedHours(pTotalTrainingHours) : "0 hr";
        const columns = ["#", ...data.map((item) => item.TrainingName)];
        setmoduleHeaderColumn(columns);

        const trainingCountRow = data.reduce(
          (row, item) => {
            row[item.TrainingName] = item.TrainingCount;
            return row;
          },
          { ["#"]: "Training Count" },
        );

        const trainingHoursRow = data.reduce(
          (row, item) => {
            row[item.TrainingName] = item.TotalTrainingHours ? convertTotalMinutesToFormatedHours(item.TotalTrainingHours) : "0 hr";
            return row;
          },
          { ["#"]: "Training Hours" },
        );

        const rows = [trainingCountRow, trainingHoursRow];
        setcountAndHoursByModule(rows);

        setTotalTrainingHours(formattedHours);
        setTotalTrainings(pTotalTrainingCount);
        setModuleTraining(data.moduleTraining || {});
        // A setProgressPercentage(data.progressPrecentage || 0);
      } else {
        setTotalTrainingHours("0 hr");
        setTotalTrainings("0");
        setModuleTraining({});
        setAlertMessage({
          type: "error",
          message: response.response.responseMessage,
        });
      }
    } catch (error) {
      setTotalTrainingHours("0 hr");
      setTotalTrainings("0");
      setModuleTraining({});
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [trainingSixMonthWiseVal, settrainingSixMonthWiseVal] = useState();
  const handletrainingSixMonthWise = (e) => {
    debugger;
    settrainingSixMonthWiseVal(e.target.value);
    fetchAllTrainerProgressBar("No", e.target.value);
  };

  const fetchAllTrainerProgressBar = async (pFromPageLoad, pmonthDuration) => {
    debugger;
    try {
      const formData = {
        SPViewMode: "TRAINEEDASHBOARDPROGRESS",
        SPUserID: userData.CscUserID,
        SPYear: 0,
        SPMonth: 0,
      };

      const response = await gettraineeDashboradData(formData);

      if (response?.response?.responseCode === 1) {
        let filterdata = [];
        if (pFromPageLoad === "Yes") {
          filterdata = response.response.responseData.filter((x) => x.isLatest === true);
          settrainingSixMonthWiseVal(filterdata[0].duration);
        } else {
          filterdata = response.response.responseData.filter((x) => x.duration === pmonthDuration);
        }
        setProgressPercentage(filterdata[0] && filterdata[0].progressPrecentage ? filterdata[0].progressPrecentage : 0);
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
    }
  };

  const fetchtrainingSixMonthWiseData = async () => {
    debugger;
    try {
      const formData = {
        SPViewMode: "TRAINEEDASHBOARDPROGRESS",
        SPUserID: userData.CscUserID,
        SPYear: 0,
        SPMonth: 0,
      };

      const response = await gettraineeDashboradData(formData);

      if (response?.response?.responseCode === 1) {
        let jsonarraytrainingSixMonthWise = [];
        jsonarraytrainingSixMonthWise.push({ lable: "--Select--", value: -1 });
        response.response.responseData.forEach((v, i) => {
          jsonarraytrainingSixMonthWise.push({ lable: v.duration, value: v.duration });
        });
        settrainingSixMonthWise(jsonarraytrainingSixMonthWise);
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
    }
  };

  useEffect(() => {
    fetchtrainingSixMonthWiseData();
    fetchAllTrainerProgressBar("Yes");
  }, []);

  useEffect(() => {
    debugger;
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let i = 2023; i <= currentYear; i += 1) {
      yearArray.push(i.toString());
    }
    setyears(yearArray.sort().reverse());
    fetchAllTrainer();
  }, [selectedMonth, selectedYear]);

  return (
    <>
      {isLoadingTraineeDashboardData ? <Loader /> : null}
      <div className="dashboard-container-header">
        <div className="progress-bar-section">
          <div className="progress-container">
            <div className="progress-header">
              <span className="progress-label">
                Overall Training Progress{" "}
                <select className="month-dropdown" value={trainingSixMonthWiseVal} onChange={(e) => handletrainingSixMonthWise(e)}>
                  {trainingSixMonthWise && trainingSixMonthWise.length > 0
                    ? trainingSixMonthWise.map((val, i) => (
                        <option key={i} value={val.value}>
                          {val.lable}
                        </option>
                      ))
                    : null}
                </select>
              </span>

              <div className="color-legend-inline">
                <span className="legend-item dark-red">1 - 50%</span>
                <span className="legend-item orange">51% - 80%</span>
                <span className="legend-item dark-green">81% - 120%</span>
                <span className="legend-item orange">121% - 151%</span>
                <span className="legend-item dark-red">151 & More</span>
              </div>
            </div>

            <div className="progress-bar-wrapper">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor:
                    parseFloat(progressPercentage) >= 1 && parseFloat(progressPercentage) <= 50
                      ? "#DC143C"
                      : parseFloat(progressPercentage) >= 51 && parseFloat(progressPercentage) <= 80
                        ? "#FFA500"
                        : parseFloat(progressPercentage) >= 81 && parseFloat(progressPercentage) <= 120
                          ? "#008000"
                          : parseFloat(progressPercentage) >= 121 && parseFloat(progressPercentage) <= 151
                            ? "#FFA500"
                            : parseFloat(progressPercentage) > 151
                              ? "#DC143C"
                              : "#ffffff",
                }}
              />
            </div>
            <div className="progress-percent-text">{progressPercentage}%</div>
          </div>
        </div>

        <div className="common-header">
          <div className="dropdown-container">
            <select className="month-dropdown" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {months.map((month, index) => (
                <option key={index} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
            <select className="month-dropdown-year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="header-trainee">
          <div className="card" style={{ "--card-hover-color": "#E08E3C" }}>
            <img src={icon} alt="icon" className="card-icon" style={{ backgroundColor: "#E08E3C30" }} />
            <span style={{ fontSize: "22px", fontWeight: "bold", color: "black" }}>{totalTrainingHours}</span>
            <span className="card-label" style={{ fontSize: "18px", fontWeight: "600", color: "#E08E3C" }}>
              Total Training Hours
            </span>
          </div>
          <div className="card" style={{ "--card-hover-color": "#747DE8" }}>
            <img src={icon4} alt="icon" className="card-icon" style={{ backgroundColor: "#747DE830" }} />
            <span style={{ fontSize: "22px", fontWeight: "bold", color: "black" }}>{totalTrainings}</span>
            <span className="card-label" style={{ fontSize: "18px", fontWeight: "600", color: "#747DE8" }}>
              Total Number Of Trainings
            </span>
          </div>
        </div>

        <div className="training-status">
          <div className="month">
            <div className="month-info">
              <p className="month-status">Training Status Module Wise</p>
            </div>
            {/* <button className="export-btn">
            <img src={cloud} alt="Export" style={{ backgroundColor: "white" }} />
            &nbsp;Export
          </button> */}
          </div>

          <div className="training-cards">
            <div className="training-card3-header">
              <div className="icon">
                <img src={training3} alt="training" />
              </div>
              <h4>Module Wise Training</h4>
              <div className="number-container">
                <table className="table_bordered table_Height_module_wise_training">
                  <thead>
                    <tr>
                      {moduleHeaderColumn.map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {countAndHoursByModule.map((row, idx) => (
                      <tr key={idx}>
                        {moduleHeaderColumn.map((col) => (
                          <td key={col}>{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TraineeDashboard;
