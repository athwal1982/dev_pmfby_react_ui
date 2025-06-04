import React, { useState } from "react";
import Calculationdetails from "../Partials/Calculationdetails";
import Tabledata from "../Partials/Tabledata";
import Calculationdetailsbootom from "../Partials/Calculationdetailsbootom";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";

const Agentovertimecomponent = ({
  activeKey,
  currentcarddetails,
  agentovertime,
  numberWithCommas,
  billingDashBoardAgentOverTimeList,
  billingDashBoardAgentOverTimeICList,
  grandTotalIBTCAgentPercntShareOverTime,
  grandTotalAgentCostOverTime,
  noOfWorkingDaysOverTime,
  totalICAgentTotalAmountOverTime,
  totalICAgentGSTAmountOverTime,
  totalICAgentTotalBillableAmountOverTime,
  billingDashBoardAgentWorkingOverTimeDetailsList,
  downloadpdfdata,
  overtimenewbilling,
}) => {
  const [show, setShow] = useState(false);
  const detailscards = [
    {
      show: true,
      name: "No. Of Working Over Time",
      value: overtimenewbilling?.t_overtime_hours ? `${numberWithCommas(parseFloat(overtimenewbilling?.t_overtime_hours).toFixed(2))} Hours` : "0",
    },
  ];
  const columns = ["Sr. No", "Insurance Company", "% Share of IBTC Pulses (B1)", "Share of Working Over Time", "Over Time Cost with GST"];
  const tableData =
    overtimenewbilling?.ic_data && overtimenewbilling.ic_data.length > 0
      ? overtimenewbilling.ic_data.map((item, index) => ({
          index: index + 1,
          id: item["_id"] || null, // Default to null if no ID
          tagedPulses: item.percentage_pulse ? `${numberWithCommas(parseFloat(item.percentage_pulse).toFixed(2))}%` : "0%",
          percentagePulse: item.overtime_hours ? numberWithCommas(parseFloat(item.overtime_hours).toFixed(2)) : "0.00",
          untagedPulses: item.overtime_cost_gst ? numberWithCommas(parseFloat(item.overtime_cost_gst).toFixed(2)) : "0.00",
          checkvalue: item.percentage_pulse ? parseFloat(item.percentage_pulse).toFixed(2) : "0.00",
        }))
      : [];

  const sumData =
    overtimenewbilling?.ic_data && overtimenewbilling.ic_data.length > 0
      ? overtimenewbilling.ic_data.reduce(
          (sums, item) => {
            sums.percentage_pulse += item?.percentage_pulse ? parseFloat(item.percentage_pulse) : 0;
            sums.overtime_hours += item?.overtime_hours ? parseFloat(item.overtime_hours) : 0;
            sums.overtime_cost_gst += item?.overtime_cost_gst ? parseFloat(item.overtime_cost_gst) : 0;
            return sums;
          },
          {
            percentage_pulse: 0,
            overtime_hours: 0,
            overtime_cost_gst: 0,
          },
        )
      : {
          percentage_pulse: 0,
          overtime_hours: 0,
          overtime_cost_gst: 0,
        };

  const grandTotal = [
    sumData.percentage_pulse ? `${numberWithCommas(parseFloat(sumData.percentage_pulse).toFixed(2))}%` : "0%",
    numberWithCommas(sumData.overtime_hours.toFixed(2)),
    numberWithCommas(sumData.overtime_cost_gst.toFixed(2)),
  ];

  const columns2 = ["Sr. No", "Agent Id", "Over Time (In Hours)"];
  const tabledata2 =
    billingDashBoardAgentWorkingOverTimeDetailsList && billingDashBoardAgentWorkingOverTimeDetailsList.length > 0
      ? billingDashBoardAgentWorkingOverTimeDetailsList.map((item, index) => ({
          index: index + 1,
          id: item.user || "0",
          tagedPulses: item.overtime_hours ? numberWithCommas(parseFloat(item.overtime_hours).toFixed(2)) : "0",
          checkvalue: item.overtime_hours,
        }))
      : [];

  const grandtotal2 = [];

  let customStyle = [
    { textAlign: "left", textWrap: "nowrap" },
    { textAlign: "left" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
  ];
  let customStyle2 = [
    { textAlign: "left", textWrap: "nowrap" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
  ];
  return (
    <>
      {agentovertime === "0.00" ? (
        <div>No Data Uploaded Yet</div>
      ) : (
        <div>
          <Calculationdetails
            activeKey={activeKey}
            currentcarddetails={currentcarddetails}
            showcal={false}
            total={false}
            name={"Agents Overtime Details"}
            detailscards={detailscards}
          />

          <Tabledata
            columns={columns}
            tabledata={tableData}
            grandtotal={grandTotal}
            customStyle={customStyle}
            downloadpdfdata={downloadpdfdata}
            showdownload={true}
          />
          <div className="py-3 calculationdetails">
            <div className="d-flex align-items-center justify-content-between custom-gap">
              <div className="d-flex align-items-center justify-content-start custom-gap">
                <p className="title">Agent Working Details</p>
                <div className="green-line"></div>
              </div>
              <button
                className="btn btn-primary btn-sm bg-orange"
                onClick={() => {
                  setShow(!show);
                }}
              >
                {show ? <FaAngleUp /> : <FaAngleDown />}
              </button>
            </div>
          </div>
          {show && <Tabledata columns={columns2} tabledata={tabledata2} grandtotal={grandtotal2} customStyle={customStyle2} showdownload={false} />}

          <Calculationdetailsbootom
            name={"Call Center Agents Billing Total of Insurance Company"}
            currentcarddetails={currentcarddetails}
            tabonename={["Agents Share of Working Days IC wise", "X2 = (S1 * 122)/No. Of Days In Month"]}
            inboundpulse={overtimenewbilling?.t_overtime_cost ? `Rs. ${numberWithCommas(parseFloat(overtimenewbilling?.t_overtime_cost).toFixed(2))}` : 0}
            tabtwoname={["Taxes (GST)", "Y2 = X2 * 18 %"]}
            taxes={
              overtimenewbilling?.t_overtime_cost
                ? `Rs. ${numberWithCommas(parseFloat(parseFloat(overtimenewbilling?.t_overtime_cost_gst) - parseFloat(overtimenewbilling?.t_overtime_cost)).toFixed(2))}`
                : 0
            }
            tabthree={["Total Bill Agents", "Z2 = X2 + Y2"]}
            total={overtimenewbilling?.t_overtime_cost_gst ? `Rs. ${numberWithCommas(parseFloat(overtimenewbilling?.t_overtime_cost_gst).toFixed(2))}` : 0}
          />
        </div>
      )}
    </>
  );
};

export default Agentovertimecomponent;
