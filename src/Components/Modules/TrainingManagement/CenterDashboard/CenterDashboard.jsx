import React, { useState, useEffect } from "react";
import "./CenterDashboard.scss";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import icon from "../../../../../src/assets/icon1.svg";
import icon1 from "../../../../../src/assets/icon2.svg";
import icon2 from "../../../../../src/assets/icon3.svg";
import training2 from "../../../../../src/assets/training2.svg";
import training3 from "../../../../../src/assets/training3.svg";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
// A import { getCenterDashboardData } from "../../CenterManagement/Services/Methods";
import { pieArcLabelClasses } from "@mui/x-charts/PieChart";

const chartSettingBar = {
  width: 500,
  height: 400,
};

const getCurrentMonthAndYear = () => {
  const currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString();
  return { month, year };
};

const CenterDashboard = () => {
  const { month, year } = getCurrentMonthAndYear();
  const [barChartData, setBarChartData] = useState([]);

  const [centerStats, setCenterStats] = useState({
    ActiveCenters: 0,
    InactiveCenters: 0,
  });

  const [cardData, setCardData] = useState([
    { value: "0", label: "Total Center Trainee", icon: icon, color: "#E08E3C" },
    { value: "0", label: "On-Boarded Trainee", icon: icon1, color: "#E0D6D8" },
    { value: "0", label: "De-Boarded Trainee", icon: icon2, color: "#D5B8F3" },
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

  const years = ["2025"];
  const moduleCenterData = [
    { CenterCount: 0, ModuleName: "Onboarding" },
    { CenterCount: 0, ModuleName: "Technical" },
    { CenterCount: 0, ModuleName: "Referesher" },
    { CenterCount: 0, ModuleName: "LMS" },
    { CenterCount: 0, ModuleName: "Soft Skill" },
    { CenterCount: 0, ModuleName: "Re-Join" },
    { CenterCount: 0, ModuleName: "Other" },
  ];

  useEffect(() => {
    // A     fetchCenterStats();
  }, []);

  useEffect(() => {
    // A   fetchCenterChart();
    // A   fetchModuleWiseCenterData();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="center-dashboard-container">
      <div className="header">
        {cardData.map((card, index) => (
          <div className="card" key={index} style={{ "--card-hover-color": card.color }}>
            <img src={card.icon} alt="icon" className="card-icon" style={{ backgroundColor: card.color + "30" }} />
            <strong>{card.value}</strong>
            <span>{card.label}</span>
          </div>
        ))}
      </div>

      <div className="center-status">
        <div className="month">
          <div className="month-info">
            <p className="month-status">Current Month Center Stats</p>
            <div className="dropdown-container">
              <select className="month-dropdown-year-center" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select className="month-dropdown-center" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {months.map((month, index) => (
                  <option key={index} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="center-cards">
          <div className="center-card2">
            <div className="icon">
              <img src={training2} />
            </div>
            <h4>Center Trainings</h4>
            <p className="number">{centerStats.ActiveCenters}</p>
            <p className="subtext">Completed Training</p>
            <p className="number">{centerStats.InactiveCenters}</p>
            <p className="subtext">In-Completed Training</p>
          </div>

          <div className="center-card3">
            <div className="icon">
              <img src={training3} />
            </div>
            <h4>Module Wise Center Trainings</h4>
            <div className="number-container">
              {moduleCenterData.map((module, index) => (
                <p key={index} className="number">
                  {module.CenterCount} <br />
                  <span className="subtext">{module.ModuleName}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterDashboard;
