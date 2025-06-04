import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { HiOutlineDotsVertical } from "react-icons/hi";
import exporticon from "./../../../../assets/img/sla/export-icon.png";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Averagegraph = () => {
  const [chartData, setChartData] = useState({
    labels: ["Jan 24", "Feb 24", "Mar 24", "Apr 24", "May 24", "Jun 24", "Jul 24", "Aug 24", "Sep 24", "Oct 24", "Nov 24", "Dec 24"],
    datasets: [
      {
        label: null,
        data: [71, 55, 50, 65, 71, 68, 38, 92, 54, 60, 21, 49],
        backgroundColor: "#29CB97",
        borderRadius: 10,
        borderWidth: 1,
        barThickness: 8,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: "Average Speed to Answer (ASA)",
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        enabled: true,
        backgroundColor: "#ffffff",
        borderColor: "#44444F2E",
        borderWidth: 2,
        textAlign: "center",
        titleFont: {
          size: 16,
          weight: "bold",
          textAlign: "center",
        },
        bodyFont: {
          size: 14,
          weight: "normal",
        },

        titleColor: "#333333",
        bodyColor: "#333333",
        footerColor: "#ff6347",
        padding: 10,
        cornerRadius: 5,
        displayColors: false,
        caretSize: 8,
        callbacks: {
          title: (tooltipItems) => {
            const year = tooltipItems[0].label;
            return `${year}`;
          },
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label || "";
            const value = tooltipItem.raw;
            return `${value} Total ASA`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Month",
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: false,
          text: "ASA",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div className="graph-container">
        <div className="graph-header">
          <div>
            <p className="name">Average Speed to Answer (ASA)</p>
            <div className="value-container">
              <div className="value-item">
                <div className="dot-green"></div> Online
              </div>
            </div>
          </div>
          <div className="left-container">
            <button className="export-btn">
              {" "}
              <img src={exporticon} /> Export
            </button>
            <select className="form-select">
              <option value="">Last 12 Months</option>
            </select>
            <div className="dot-icon">
              <HiOutlineDotsVertical />
            </div>
          </div>
        </div>
        <div>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Averagegraph;
