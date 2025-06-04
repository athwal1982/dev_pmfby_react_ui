import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CanvasJSReact from "@canvasjs/react-charts";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Systemuptimegraph = () => {
  const options = {
    theme: "light2",
    animationEnabled: true,
    axisX: {
      title: "",
      interval: 1,
      intervalType: "month",
      valueFormatString: "MMM",
      gridThickness: 1,
      gridColor: "#D3D3D3",
    },
    axisY: {
      title: "",
      titleFontColor: "#6D78AD",
      includeZero: true,
      lineColor: "#6D78AD",
      labelFontColor: "#6D78AD",
      tickColor: "#6D78AD",
      gridThickness: 0,
    },
    toolTip: {
      shared: true,
      backgroundColor: "#ffffff",
      borderColor: "#ffffff",
      contentFormatter: function (e) {
        let content = "";
        let total = 0;
        for (let i = 0; i < e.entries.length; i++) {
          const entry = e.entries[i];
          const color = entry.dataSeries.color;
          const name = entry.dataSeries.name;
          const value = entry.dataPoint.y;
          total += value;

          content += `
       
       
            <div style="margin-bottom: 5px; font-size:12px; display:flex; align-items:center; gap:3px; justify-content:center;">
              <div style="background:${color}; width:10px; height:10px; border-radius:50%" ></div> ${value} <span style="color:#7E84A3"> ${name}</span>
            </div>
          `;
        }
        const date = e.entries[0].dataPoint.x;
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();

        return `<div style="min-width: 120px; text-align:center">
         <div><strong>${month} ${year}</strong></div>
      <div>${content}</div>
        </div>`;
      },
    },
    legend: false,
    data: [
      {
        type: "spline",
        name: "Online",
        showInLegend: false,
        yValueFormatString: "#,##0 Units",
        lineColor: "#21D59B",
        markerColor: "#21D59B",
        markerSize: 0,
        dataPoints: [
          { x: new Date(2024, 0, 1), y: 655 },
          { x: new Date(2024, 1, 1), y: 555 },
          { x: new Date(2024, 2, 1), y: 455 },
          { x: new Date(2024, 3, 1), y: 455 },
          { x: new Date(2024, 4, 1), y: 693 },
          { x: new Date(2024, 5, 1), y: 855 },
          { x: new Date(2024, 6, 1), y: 755 },
          { x: new Date(2024, 7, 1), y: 450 },
          { x: new Date(2024, 8, 1), y: 550 },
          { x: new Date(2024, 9, 1), y: 480 },
          { x: new Date(2024, 10, 1), y: 480 },
          { x: new Date(2024, 11, 1), y: 560 },
        ],
      },
      {
        type: "spline",
        name: "Offline",
        showInLegend: false,
        yValueFormatString: "$#,##0.##",
        lineColor: "#0058FF",
        markerColor: "#0058FF",
        markerSize: 0,
        dataPoints: [
          { x: new Date(2024, 0, 1), y: 755 },
          { x: new Date(2024, 1, 1), y: 455 },
          { x: new Date(2024, 2, 1), y: 721 },
          { x: new Date(2024, 3, 1), y: 530 },
          { x: new Date(2024, 4, 1), y: 210 },
          { x: new Date(2024, 5, 1), y: 245 },
          { x: new Date(2024, 6, 1), y: 850 },
          { x: new Date(2024, 7, 1), y: 650 },
          { x: new Date(2024, 8, 1), y: 780 },
          { x: new Date(2024, 9, 1), y: 452 },
          { x: new Date(2024, 10, 1), y: 250 },
          { x: new Date(2024, 11, 1), y: 700 },
        ],
      },
    ],
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="graph-container">
            <div className="graph-header">
              <div>
                <p className="name">System Uptime</p>
                <div className="value-container">
                  <div className="value-item">
                    {" "}
                    <div className="dot-green"></div> Online
                  </div>
                  <div className="value-item">
                    {" "}
                    <div className="dot-blue"></div> Offline
                  </div>
                </div>
              </div>
              <div className="left-container">
                <select name="" id="" className="form-select">
                  <option value="">Last 12 Months</option>
                </select>
                <div className="dot-icon">
                  <HiOutlineDotsVertical />
                </div>
              </div>
            </div>
            <div>
              <CanvasJSChart options={options} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Systemuptimegraph;
