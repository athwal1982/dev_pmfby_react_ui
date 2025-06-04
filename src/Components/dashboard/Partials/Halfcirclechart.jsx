import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import FutureGeneraliLogo from "assets/ICLogo/FutureGen.jpeg";
import Aic from "assets/ICLogo/Aic.png";
import BajajAl from "assets/ICLogo/BajajAllianza.jpeg";
import CholaMS from "assets/ICLogo/CholaMS.png";
import HdfcErgo from "assets/ICLogo/HdfcErgo.jpeg";
import IciciLom from "assets/ICLogo/IciciLomb.png";
import IfcoTokia from "assets/ICLogo/IfcoTokio.jpeg";
import download_btn from "assets/img/download_btn.svg";
import { Box } from "@mui/system";
import { Tooltip as MuiTooltip } from "@mui/material";

import excelLogo from "assets/img/excelLogo.png";

import kShema from "assets/ICLogo/kshema.jpeg";
import NationInsur from "assets/ICLogo/NationalInsur.jpeg";
import NewIndia from "assets/ICLogo/NewIndiaAssur.jpeg";
import RelGen from "assets/ICLogo/RelGeneral.png";
import RoyalSund from "assets/ICLogo/RoyalSund.png";
import SbiGen from "assets/ICLogo/SbiGen.png";
import TataAig from "assets/ICLogo/TataAig.jpeg";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

import UnitedIndia from "assets/ICLogo/Unitedindia.jpeg";
import UnivSompo from "assets/ICLogo/UnivSompo.png";
import Orient from "assets/ICLogo/OrientalInsur.png";
import { Grid } from "@mui/material";
import ExportReportLogics from "./ExportReportLogics";

Chart.register(ArcElement, Tooltip);

const Halfcirclechart = ({ yearMonth, fromDate, toDate, data, total, logo, setlogo }) => {
  const { handleDownloadFullReport, isLoading } = ExportReportLogics({
    fromDate,
    toDate,
    yearMonth,
  });
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredlable, setHoverlabled] = useState(null);

  const readydata = {
    labels: data.map((card) => card.name),
    datasets: [
      {
        data: data.map((card) => parseFloat(card.value.replace(/,/g, ""))),
        backgroundColor: data.map((card) => card.color),
        borderColor: data.map((card) => card.color),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        position: "nearest",
        backgroundColor: "rgba(0, 0, 0, 1)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            const label = tooltipItem.label || "";
            return `${value}`;
          },
        },
      },
    },
    rotation: -90,
    circumference: 180,
    cutout: "85%",
    maintainAspectRatio: true,
    responsive: true,
    onHover: (event, chartElements) => {
      if (chartElements.length > 0) {
        const { index } = chartElements[0];
        const hoveredData = readydata.datasets[0].data[index];
        const hoveredLabel = readydata.labels[index];
        setHoveredValue(hoveredData);
        setHoverlabled(hoveredLabel);
      } else {
        setHoveredValue(null);
        setHoverlabled(null);
      }
    },
  };

  const normalizeKey = (name) => {
    return name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  };

  const insuranceLogos = {
    [normalizeKey("NATIONAL INSURANCE COMPANY LIMITED")]: NationInsur,
    [normalizeKey("ROYAL SUNDARAM GENERAL INSURANCE CO. LIMITED")]: RoyalSund,
    [normalizeKey("NEW INDIA ASSURANCE COMPANY")]: NewIndia,
    [normalizeKey("AGRICULTURE INSURANCE COMPANY")]: Aic,
    [normalizeKey("BAJAJ ALLIANZ GENERAL INSURANCE CO. LTD")]: BajajAl,
    [normalizeKey("CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LIMITED")]: CholaMS,
    [normalizeKey("FUTURE GENERALI INDIA INSURANCE CO. LTD.")]: FutureGeneraliLogo,
    [normalizeKey("HDFC ERGO GENERAL INSURANCE CO. LTD.")]: HdfcErgo,
    [normalizeKey("ICICI LOMBARD GENERAL INSURANCE CO. LTD.")]: IciciLom,
    [normalizeKey("IFFCO TOKIO GENERAL INSURANCE CO. LTD.")]: IfcoTokia,
    [normalizeKey("KSHEMA GENERAL INSURANCE LIMITED")]: kShema,
    [normalizeKey("ORIENTAL INSURANCE")]: Orient,
    [normalizeKey("RELIANCE GENERAL INSURANCE CO. LTD.")]: RelGen,
    [normalizeKey("SBI GENERAL INSURANCE")]: SbiGen,
    [normalizeKey("TATA AIG GENERAL INSURANCE CO. LTD.")]: TataAig,
    [normalizeKey("UNITED INDIA INSURANCE CO.")]: UnitedIndia,
    [normalizeKey("UNIVERSAL SOMPO GENERAL INSURANCE COMPANY")]: UnivSompo,
  };

  return (
    <>
      {isLoading && (
        <div className="overlay_exp_rep">
          <CircularProgress className="loader_exp_rep" />
        </div>
      )}
      <div className="card card-custom graph-circle position-relative">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Grid sx={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "16px" }}>Total Billing</span>
            <MuiTooltip title="Download" arrow>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "5px 0px 0px 2px",
                  width: "35%",
                }}
                type="button"
                onClick={handleDownloadFullReport}
              >
                <img
                  src={download_btn}
                  style={{
                    background: "#075307",
                    padding: "5px",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                  type="button"
                  alt="Export Report"
                />
              </div>
            </MuiTooltip>
          </Grid>

          {logo && <img src={insuranceLogos[normalizeKey(logo)]} alt={logo} style={{ maxWidth: "170px", height: "67px", flex: "0 0 65%" }} />}
        </div>

        <>
          <Doughnut data={readydata} options={options} />
          <div className="table-data">
            <p
              style={{
                fontSize: "12px",
              }}
            >
              {hoveredlable !== null ? `${hoveredlable}` : "Total"}{" "}
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {hoveredValue !== null ? `Rs. ${hoveredValue}` : total}
            </p>
          </div>
        </>
        <ul className="item-data">
          {data.map((item, index) => (
            <li key={index} className="list-item" title={`${item.name}: ${item.value}`}>
              <div
                style={{
                  background: item.color,
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              ></div>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Halfcirclechart;
