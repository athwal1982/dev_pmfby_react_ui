import React, { useState, useEffect } from "react";
import { Loader } from "Framework/Components/Widgets";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { convertTotalMinutesToFormatedHours } from "Configration/Utilities/dateformat";
import "./TrainingDashboard.scss";
import Chart from "react-apexcharts";
import icon from "../../../../../src/assets/icon1.svg";
import icon1 from "../../../../../src/assets/icon2.svg";
import icon2 from "../../../../../src/assets/icon3.svg";
import training2 from "../../../../../src/assets/training2.svg";
import training3 from "../../../../../src/assets/training3.svg";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { gettraineeDashboradData } from "../../TrainingManagement/Services/Methods";
import { useNavigate } from "react-router-dom";

const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear().toString();
    return { month, year };

};

const TrainingDashboard = () => {
  const setAlertMessage = AlertMessage();
    const { month, year } = getCurrentMonthAndYear();
    const [barChartData, setBarChartData] = useState([]);
    const [moduleTrainingData, setModuleTrainingData] = useState([]);

    const [trainingStatus, setTrainingStatus] = useState({
        CompletedTrainings: 0,
        UpcomingTrainings: 0,
    });
    const [isLoadingTrainingDashboardData, setIsLoadingTrainingDashboardData] = useState(false);
    const navigate = useNavigate();
    const [cardData, setCardData] = useState([
        { value: "0", label: "Total Agents", icon: icon, color: "#E08E3C" },
        { value: "0", label: "On-Boarded Agent", icon: icon1, color: "#E0D6D8" },
        { value: "0", label: "De-Boarded Agent", icon: icon2, color: "#D5B8F3" },
    ]);
    const userData = getSessionStorage("user");
    const [selectedMonth, setSelectedMonth] = useState(month);
    const [selectedYear, setSelectedYear] = useState(year);
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
    const size = {
        width: 200,
        height: 200,
      };
    const fetchTotalAgentDetails = async () => {
        debugger;
        try {
            const formData = {
                SPViewMode: "SUPERADMINDASHBAORD",
                SPUserID: userData.CscUserID,
                SPYear: 0,
                SPMonth: 0
            };

            const response = await gettraineeDashboradData(formData);

            if (response?.response?.responseCode === 1) {
                const data = response.response.responseData[0] || {};

                setCardData([
                    { value: data.TotalAgent || "0", label: "Total Agents", icon: icon, color: "#E08E3C" },
                    { value: data.OnBoardedAgent || "0", label: "On-Boarded Agent", icon: icon1, color: "#E0D6D8" },
                    { value: data.DeboardedAgent || "0", label: "De-Boarded Agent", icon: icon2, color: "#D5B8F3" },
                ]);
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
    const [state3, setstate3] = useState({});
    const fetchTotalTraineeChart = async () => {
        try {
            const formData = {
                SPViewMode: "CENTERWISETRAINEE",
                SPUserID: userData.CscUserID,
                SPYear: 0,
                SPMonth: 0,
            };
             setIsLoadingTrainingDashboardData(true);
            const response = await gettraineeDashboradData(formData);
             setIsLoadingTrainingDashboardData(false);
            if (response?.response?.responseCode === 1) {
                const data = response.response.responseData || [];


                // A const formattedData = data.map((item) => ({
                // A    state: item.Center.trim(),
                // A    traineeCount: item.TraineeCount,
                // A}));

            // A setBarChartData(formattedData);
            const pcategories = [];
            const popenData = [];
            data.forEach((v) => {
              pcategories.push(v.Center);
              popenData.push(v.TraineeCount);
            });
            const josnstate3 = {
              series: [
                {
                  name: "Number of Trainees",
                  data: popenData,
                },
              ],
              options: {
                chart: {
                  type: "bar",
                  height: 420,
                  stacked: true,
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    dataLabels: {
                      position: "top",
                    },
                  },
                },
                dataLabels: {
                  enabled: true,
                  offsetX: -10,
                  style: {
                    fontSize: "12px",
                    colors: ["#fff"],
                  },
                },
                stroke: {
                  show: true,
                  width: 0,
                  colors: ["#fff"],
                },
                tooltip: {
                  shared: true,
                  intersect: false,
                },
                xaxis: {
                  categories: pcategories,
                },
              },
            };
            setstate3(josnstate3);
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
     
     const [moduleHeaderColumn, setmoduleHeaderColumn] = useState([]);
     const [countAndHoursByModule, setcountAndHoursByModule] = useState([]);
     const [state5, setstate5] = useState({});
    const fetchTotalTraineeModules = async () => {
        debugger;
        debugger;
        try {
            const formData = {
                SPViewMode: "MODULEWISETRAINING",
                SPUserID: userData.CscUserID,
                SPYear: selectedYear,
                SPMonth: selectedMonth,
            };
            setIsLoadingTrainingDashboardData(true);
            const response = await gettraineeDashboradData(formData);
            setIsLoadingTrainingDashboardData(false);
            if (response?.response?.responseCode === 1) {
                const data = response.response.responseData || [];

            const pCategoryWise = [];
            const pcategories = [];
            data.forEach((v) => {
              pcategories.push(v.TrainingName);
              pCategoryWise.push(v.TrainingCount);
            });
            const jsonstate5 = {
              series: pCategoryWise,
              options: {
                chart: {
                  type: "pie",
                },
                labels: pcategories,
                stroke: {
                  colors: ["#fff"],
                },
                fill: {
                  opacity: 0.8,
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: "bottom",
                      },
                    },
                  },
                ],
              },
            };
            setstate5(jsonstate5);

                 const columns = ["#", ...data.map(item => item.TrainingName)];
                 setmoduleHeaderColumn(columns);

  const trainingCountRow = data.reduce((row, item) => {
    row[item.TrainingName] = item.TrainingCount;
    return row;
  }, { ["#"]: "Training Count" });

  const trainingHoursRow = data.reduce((row, item) => {
    row[item.TrainingName] = item.TotalTrainingHours ? convertTotalMinutesToFormatedHours(item.TotalTrainingHours) : "0 hr";
    return row;
  }, { ["#"]: "Training Hours" });

  const rows = [trainingCountRow, trainingHoursRow];
  setcountAndHoursByModule(rows);
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

    
    const fetchTotalTrainingModules = async () => {
        try {
            const formData = {
                SPViewMode: "TRAININGSTATUS",
                SPUserID: userData.CscUserID,
                SPYear: selectedYear,
                SPMonth: selectedMonth,
            };
             setIsLoadingTrainingDashboardData(true);
            const response = await gettraineeDashboradData(formData);
            setIsLoadingTrainingDashboardData(false);
            if (response?.response?.responseCode === 1) {
                const data = response.response.responseData[0] || {
                    CompletedTrainings: 0,
                    UpcomingTrainings: 0,
                };
    
                setTrainingStatus(data);
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
       const currentYear = new Date().getFullYear();
       const yearArray = [];
       for (let i = 2023; i <= currentYear; i += 1) {
        yearArray.push(i.toString());
       }
        setyears(yearArray.sort().reverse());
        fetchTotalAgentDetails(); 
    }, []);
    
    useEffect(() => {
        fetchTotalTraineeChart();
        fetchTotalTraineeModules();
        fetchTotalTrainingModules(); 
    }, [selectedMonth, selectedYear]); 
    

    return (
      <>{isLoadingTrainingDashboardData ? <Loader /> : null}
        <div className="dashboard-container">
            <div className="header">
                {cardData.map((card, index) => (
                    <div
                        className="card"
                        key={index}
                        style={{ "--card-hover-color": card.color }}
                    >
                        <img
                            src={card.icon}
                            alt="icon"
                            className="card-icon"
                            style={{ backgroundColor: card.color + "30" }}
                        />
                        <strong>  {card.value} </strong><span>{card.label}</span>
                    </div>
                ))}
            </div>

            <div className="training-status">
                <div className="month">
                    <div className="month-info">
                        <p className="month-status">Current Month Training Status</p>
                        <div className="dropdown-container">

                            <select
                                className="month-dropdown"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {months.map((month, index) => (
                                    <option key={index} value={month.value}>
                                        {month.name}
                                    </option>
                                ))}
                            </select>
                            <select className="month-dropdown-year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* <button className="export-btn">
                        <img src={cloud} style={{ backgroundColor: "white" }} />
                        &nbsp;Export
                    </button> */}
                </div>
                <div className="training-cards">

                <div className="training-card2">
      <div className="icon">
        <img src={training2} alt="Training Icon" />
      </div>
      <h4>Training Status</h4>

      <div>
        <p className="subtext">Trainings Completed</p>
        <p
          className="number"
     onClick={() => navigate("/TrainingList")}
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        >
          {trainingStatus.CompletedTrainings}
        </p>
      </div>

      <div>
        <p className="subtext">Trainings Scheduled</p>
        <p
          className="number"
 onClick={() => navigate("/TrainingList")}
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        >
          {trainingStatus.UpcomingTrainings}
        </p>
      </div>
    </div>



                    <div className="training-card3">
                        <div className="icon">
                            <img src={training3} />
                        </div>
                        <h4>Module Wise Training</h4>
                        <div className="number-container">
                             <table className="table_bordered table_Height_module_wise_training">
               <thead>
          <tr>
            {moduleHeaderColumn.map(col => (
              <th key={col} >{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {countAndHoursByModule.map((row, idx) => (
            <tr key={idx}>
              {moduleHeaderColumn.map(col => (
                <td key={col} >{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
            </table>
                        </div>
                    </div>
                </div>
            </div>


            <div className="charts-container">
                <div className="chart-box">
                    <div className="chart-header">
                        <h3>Center Wise Trainee Details</h3>

                    </div>
 {Object.keys(state3).length === 0 ? null : <Chart options={state3.options} series={state3.series} type="bar" height={420} />}


                </div>

                <div className="chart-box-PieChart">
                    <div className="chart-header">
                        <h3>Training Module</h3><br />
                    </div>
 {Object.keys(state5).length === 0 ? null : <Chart options={state5.options} series={state5.series} type="pie" height={420} />}

                </div>

            </div>
        </div>
     </>
    );
};

export default TrainingDashboard;