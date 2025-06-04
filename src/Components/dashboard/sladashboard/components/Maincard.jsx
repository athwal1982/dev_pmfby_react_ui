import React, { useState } from "react";
import Customcard from "../partials/Customcard";
import svgicon from "../../../../assets/img/sla/systemuptime.svg";
import setting from "../../../../assets/img/sla/settings.png";
import callicon from "../../../../assets/img/sla/call.png";
import callquality from "../../../../assets/img/sla/call-quality.png";
import agenticon from "../../../../assets/img/sla/agent-icon.png";
import seaticon from "../../../../assets/img/sla/seat.png";
import Sidebardrawer from "./Sidebardrawer";

const Maincard = ({ slaReportData }) => {
  const [open, setOpen] = useState(false);
  const [currentCard, setCurentcard] = useState({});
  const handleopen = (data) => {
    setOpen(true);
    setCurentcard(data);
  };
  const handleclose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="row align-items-stretch py-4">
        <div className="col-md-4">
          <Customcard
            color={"#378c77"}
            name={"System Uptime"}
            value={slaReportData && slaReportData.uptime ? `${slaReportData.uptime.toFixed(2)}%` : "0.00"}
            list={[]}
            icon={svgicon}
            handleopen={handleopen}
          />
        </div>
        <div className="col-md-4">
          <Customcard
            color={"#CD6A65"}
            name={"ASA < 30 Seconds"}
            value={slaReportData && slaReportData.percentQuedCallsASA ? `${slaReportData.percentQuedCallsASA.toFixed(2)}%` : "0.00"}
            list={[`Total Call Answered (A): ${slaReportData.totalAnsweredCallASA}`, `Call Answered within 30 seconds (B): ${slaReportData.totalQuedCallsASA}`]}
            icon={setting}
            handleopen={handleopen}
          />
        </div>
        <div className="col-md-4">
          <Customcard
            color={"#D38135"}
            name={"AHT >= 300 Seconds"}
            value={slaReportData && slaReportData.percentAHT_300_seconds ? `${slaReportData.percentAHT_300_seconds.toFixed(2)}%` : "0.00"}
            list={[
              `Total Call Answered (A): ${slaReportData.totalAnsweredCallAHT}`,
              `Call having AHT of 300 seconds (B): ${slaReportData.callAHT_300_seconds}`,
            ]}
            icon={callicon}
            handleopen={handleopen}
          />
        </div>
        <div className="col-md-4">
          <Customcard
            color={"#D46FA9"}
            name={"Call Quality Score"}
            value={slaReportData && slaReportData.qualityPercentage ? `${slaReportData.qualityPercentage.toFixed(2)}%` : "0.00%"}
            list={[
              `No. of calls Audited (A): ${slaReportData.totalAuditCalls}`,
              `No. of Agents (B): ${slaReportData.totalAgents}`,
              // A `Total Score of all Agents (C): ${slaReportData.totalScoreAllAgents}`,
            ]}
            icon={callquality}
            handleopen={handleopen}
          />
        </div>
        <div className="col-md-4">
          <Customcard
            color={"#5A79D6"}
            name={"Agents Training"}
            value={slaReportData && slaReportData.averageHours ? `${slaReportData.averageHours}Hr` : "0Hr"}
            list={[
              `No. of Agents completed 6/12 months (A):${slaReportData.agentCompletedSixTwelveMonth}`,
              `Total hours of Training:${slaReportData.totalHoursOfTraining}`,
            ]}
            icon={agenticon}
            handleopen={handleopen}
          />
        </div>

        <div className="col-md-4">
          <Customcard
            color={"#8C68C8"}
            name={"Seat Utilization"}
            value={slaReportData && slaReportData.callsPerActiveAgent ? `${slaReportData.callsPerActiveAgent.toFixed(2)}%` : "0.00"}
            list={[
              `Total Inbound Calls: ${slaReportData.totalInboundCalls}`,
              `Total Outbound Calls: ${slaReportData.totalOutboundCalls}`,
              `Total Landed Calls: ${slaReportData.totalCallsLanded}`,
              `Active Agents: ${slaReportData.totalActiveAgent}`,
            ]}
            icon={seaticon}
            handleopen={handleopen}
          />
        </div>
      </div>
      {open && <Sidebardrawer open={open} currentCard={currentCard} handleclose={handleclose} />}
    </>
  );
};

export default Maincard;
