import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { HiOutlineDotsVertical } from "react-icons/hi";
import exporticon from "./../../../../assets/img/sla/export-icon.png";
import "./SLAchart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SLA2Chart = ({ asaData, ahtData, agenttrainingReportData, seatUtlizationData, callQualtiyData, systemUptimeData }) => {
  const [chartData1, setChartData1] = useState({
    labels: [],
    datasets: [
      {
        label: "ASA Value",
        data: [],
        backgroundColor: "#29CB97",
        borderRadius: 10,
        borderWidth: 1,
        barThickness: 8,
      },
    ],
  });

  const [chartData2, setChartData2] = useState({
    labels: [],
    datasets: [
      {
        label: "ASA Value",
        data: [],
        backgroundColor: "#29CB97",
        borderRadius: 10,
        borderWidth: 1,
        barThickness: 8,
      },
    ],
  });
  const [chartData3, setChartData3] = useState({
    labels: [],
    datasets: [
      {
        label: "ASA Value",
        data: [],
        backgroundColor: "#29CB97",
        borderRadius: 10,
        borderWidth: 1,
        barThickness: 8,
      },
    ],
  });
  const [chartData4, setChartData4] = useState({
    labels: [],
    datasets: [
      {
        label: "Call Qualtiy Score",
        data: [],
        backgroundColor: "#29CB97",
        borderRadius: 10,
        borderWidth: 1,
        barThickness: 8,
      },
    ],
  });
  const [chartData5, setChartData5] = useState({
    labels: [],
    datasets: [
      {
        label: "ASA Value",
        data: [],
        backgroundColor: "#29CB97",
        borderRadius: 10,
        borderWidth: 1,
        barThickness: 8,
      },
    ],
  });

  const [chartData6, setChartData6] = useState({
    labels: [],
    datasets: [
      {
        label: "ASA Value",
        data: [],
        backgroundColor: "#29CB97",
        borderRadius: 10,
        borderWidth: 1,
        barThickness: 8,
      },
    ],
  });

  useEffect(() => {
    if (asaData && asaData.length > 0) {
      const labels = asaData.map((item) => item.month); // Extract months
      const values = asaData.map((item) => Number(item.value)); // Extract ASA values

      setChartData1({
        labels,
        datasets: [
          {
            label: "ASA Value",
            data: values,
            backgroundColor: "#29CB97",
            borderRadius: 10,
            borderWidth: 1,
            barThickness: 8,
          },
        ],
      });
    }
    if (ahtData && ahtData.length > 0) {
      const labels = ahtData.map((item) => item.month);
      const values = ahtData.map((item) => Number(item.value));

      setChartData2({
        labels,
        datasets: [
          {
            label: "AHT Value",
            data: values,
            backgroundColor: "#29CB97",
            borderRadius: 10,
            borderWidth: 1,
            barThickness: 8,
          },
        ],
      });
    }
    if (seatUtlizationData && seatUtlizationData?.length > 0) {
      const labels = seatUtlizationData.map((item) => item.month);
      const values = seatUtlizationData.map((item) => Number(item.value));

      setChartData3({
        labels,
        datasets: [
          {
            label: "Seat Ultilization",
            data: values,
            backgroundColor: "#29CB97",
            borderRadius: 10,
            borderWidth: 1,
            barThickness: 8,
          },
        ],
      });
    }
    if (callQualtiyData && callQualtiyData.length > 0) {
      const labels = callQualtiyData.map((item) => item.month);
      const values = callQualtiyData.map((item) => Number(item.percentage));

      setChartData4({
        labels,
        datasets: [
          {
            label: "Call Quality Data",
            data: values,
            backgroundColor: "#29CB97",
            borderRadius: 10,
            borderWidth: 1,
            barThickness: 8,
          },
        ],
      });
    }

    if (agenttrainingReportData && agenttrainingReportData.length > 0) {
      const labels = agenttrainingReportData.map((item) => item.month);
      const values = agenttrainingReportData.map((item) => Number(item.averageHours));
      setChartData5({
        labels,
        datasets: [
          {
            label: "Agent Training",
            data: values,
            backgroundColor: "#29CB97",
            borderRadius: 10,
            borderWidth: 1,
            barThickness: 8,
          },
        ],
      });
    }
    if (systemUptimeData && systemUptimeData.month && systemUptimeData.uptime) {
      const labels = [systemUptimeData.month];
      const values = [Number(systemUptimeData.uptime)];
      console.log("Labels:", labels);
      console.log("Values:", values);

      setChartData6({
        labels,
        datasets: [
          {
            label: "System Uptime",
            data: values,
            backgroundColor: "#29CB97",
            borderRadius: 10,
            borderWidth: 1,
            barThickness: 8,
          },
        ],
      });
    }
  }, [systemUptimeData, asaData, ahtData, seatUtlizationData, callQualtiyData, agenttrainingReportData]);

  const options1 = {
    responsive: true,
    plugins: {
      title: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        borderColor: "#44444F2E",
        borderWidth: 2,
        textAlign: "center",
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 14 },
        titleColor: "#333333",
        bodyColor: "#333333",
        padding: 10,
        cornerRadius: 5,
        displayColors: false,
        caretSize: 8,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => `${tooltipItem.raw} Total ASA`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  const options2 = {
    responsive: true,
    plugins: {
      title: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        borderColor: "#44444F2E",
        borderWidth: 2,
        textAlign: "center",
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 14 },
        titleColor: "#333333",
        bodyColor: "#333333",
        padding: 10,
        cornerRadius: 5,
        displayColors: false,
        caretSize: 8,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => `${tooltipItem.raw} Total AHT`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };
  const options3 = {
    responsive: true,
    plugins: {
      title: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        borderColor: "#44444F2E",
        borderWidth: 2,
        textAlign: "center",
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 14 },
        titleColor: "#333333",
        bodyColor: "#333333",
        padding: 10,
        cornerRadius: 5,
        displayColors: false,
        caretSize: 8,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => `${tooltipItem.raw} Total Seat Utilization`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };
  const options4 = {
    responsive: true,
    plugins: {
      title: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        borderColor: "#44444F2E",
        borderWidth: 2,
        textAlign: "center",
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 14 },
        titleColor: "#333333",
        bodyColor: "#333333",
        padding: 10,
        cornerRadius: 5,
        displayColors: false,
        caretSize: 8,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => `${tooltipItem.raw} Total Call Quality`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  const options5 = {
    responsive: true,
    plugins: {
      title: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        borderColor: "#44444F2E",
        borderWidth: 2,
        textAlign: "center",
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 14 },
        titleColor: "#333333",
        bodyColor: "#333333",
        padding: 10,
        cornerRadius: 5,
        displayColors: false,
        caretSize: 8,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => `${tooltipItem.raw} Average Hours`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };
  const options6 = {
    responsive: true,
    plugins: {
      title: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        borderColor: "#44444F2E",
        borderWidth: 2,
        textAlign: "center",
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 14 },
        titleColor: "#333333",
        bodyColor: "#333333",
        padding: 10,
        cornerRadius: 5,
        displayColors: false,
        caretSize: 8,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => `${tooltipItem.raw}% System Uptime`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="All-graphs-container-sla">
      {/* First Chart Container */}
      <div className="graph-container-sla">
        <div className="graph-header-sla">
          <div>
            <p className="name-sla">Average Speed to Answer (ASA)</p>
            <div className="value-container-sla">
              <div className="value-item-sla">
                <div className="dot-green-sla"></div> Online
              </div>
            </div>
          </div>
          <div className="left-container-sla">
            <button className="export-btn-sla">
              <img src={exporticon} alt="Export" /> Export
            </button>

            <div className="dot-icon-sla" style={{ display: "none" }}>
              <HiOutlineDotsVertical />
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <Bar data={chartData1} options={options1} />
        </div>
      </div>

      {/* Second Chart Container */}
      <div className="graph-container-sla">
        <div className="graph-header-sla">
          <div>
            <p className="name-sla">Average Handle Time (AHT)</p>
            <div className="value-container-sla">
              <div className="value-item-sla">
                <div className="dot-green-sla"></div> Online
              </div>
            </div>
          </div>
          <div className="left-container-sla">
            <button className="export-btn-sla">
              <img src={exporticon} alt="Export" /> Export
            </button>

            <div className="dot-icon-sla" style={{ display: "none" }}>
              <HiOutlineDotsVertical />
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <Bar data={chartData2} options={options2} />
        </div>
      </div>

      {/* Third Chart Container */}
      <div className="graph-container-sla">
        <div className="graph-header-sla">
          <div>
            <p className="name-sla">Seat Ultilization</p>
            <div className="value-container-sla">
              <div className="value-item-sla">
                <div className="dot-green-sla"></div> Online
              </div>
            </div>
          </div>
          <div className="left-container-sla">
            <button className="export-btn-sla">
              <img src={exporticon} alt="Export" /> Export
            </button>

            <div className="dot-icon-sla" style={{ display: "none" }}>
              <HiOutlineDotsVertical />
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <Bar data={chartData3} options={options3} />
        </div>
      </div>

      {/* Fourth Chart Container */}
      <div className="graph-container-sla">
        <div className="graph-header-sla">
          <div>
            <p className="name-sla">Call Quality Score</p>
            <div className="value-container-sla">
              <div className="value-item-sla">
                <div className="dot-green-sla"></div> Online
              </div>
            </div>
          </div>
          <div className="left-container-sla">
            <button className="export-btn-sla">
              <img src={exporticon} alt="Export" /> Export
            </button>

            <div className="dot-icon-sla" style={{ display: "none" }}>
              <HiOutlineDotsVertical />
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <Bar data={chartData4} options={options4} />
        </div>
      </div>

      {/* Fifth Chart Container */}
      <div className="graph-container-sla">
        <div className="graph-header-sla">
          <div>
            <p className="name-sla">Agent Training</p>
            <div className="value-container-sla">
              <div className="value-item-sla">
                <div className="dot-green-sla"></div> Online
              </div>
            </div>
          </div>
          <div className="left-container-sla">
            <button className="export-btn-sla">
              <img src={exporticon} alt="Export" /> Export
            </button>

            <div className="dot-icon-sla" style={{ display: "none" }}>
              <HiOutlineDotsVertical />
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <Bar data={chartData5} options={options5} />
        </div>
      </div>

      {/* Sixth Chart Container */}
      <div className="graph-container-sla">
        <div className="graph-header-sla">
          <div>
            <p className="name-sla">System Uptime</p>
            <div className="value-container-sla">
              <div className="value-item-sla">
                <div className="dot-green-sla"></div> Online
              </div>
            </div>
          </div>
          <div className="left-container-sla">
            <button className="export-btn-sla">
              <img src={exporticon} alt="Export" /> Export
            </button>

            <div className="dot-icon-sla" style={{ display: "none" }}>
              <HiOutlineDotsVertical />
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <Bar data={chartData6} options={options6} />
        </div>
      </div>
    </div>
  );
};

export default SLA2Chart;
