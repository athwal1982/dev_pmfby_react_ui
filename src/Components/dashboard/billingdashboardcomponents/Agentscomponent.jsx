import React, { useState } from "react";
import Calculationdetails from "../Partials/Calculationdetails";
import Tabledata from "../Partials/Tabledata";
import Calculationdetailsbootom from "../Partials/Calculationdetailsbootom";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";

const Agentscomponent = ({
  activeKey,
  currentcarddetails,
  billingDashBoardList = [],
  numberWithCommas,
  agents,
  grandTotalIBTCAgentPercntShare,
  grandTotalAgentCost,
  billingDashBoardAgentICList = [],
  noOfWorkingDays,
  totalICAgentTotalAmount,
  totalICAgentGSTAmount,
  totalICAgentTotalBillableAmount,
  billingDashBoardAgentWorkingDetailsList,
  downloadpdfdata,
  agentbillingdata,
}) => {
  const [show, setShow] = useState(false);
  const detailscards = [
    // A{
    //  A show: true,
    //  A name: "No. Of Active Agentaas",
    //   Avalue:
    //    A billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].active_agent
    //     A  ? `${numberWithCommas(billingDashBoardList[0].active_agent)}`
    //      A : "0",
    // A },
    {
      show: true,
      name: "No. Of Working Days",
      value: agentbillingdata?.t_working_days ? `${numberWithCommas(agentbillingdata?.t_working_days)}` : "0",
    },
    {
      show: false,
      name: "No. Of Calls Attended",
      value:
        billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].call_attended
          ? `${numberWithCommas(billingDashBoardList[0].call_attended)}`
          : "0",
    },
    {
      show: false,
      name: "No. Of Training Hours",
      value: billingDashBoardList && billingDashBoardList.length > 0 ? `${numberWithCommas(billingDashBoardList[0].total_training_hr)}` : "0",
    },
  ];
  const columns = ["Sr. No", "Insurance Company", "% Share of IBTC Pulses (B1)", "Share of Working Days", "Working Cost with GST"];
  const tabledata =
    agentbillingdata?.ic_data && agentbillingdata.ic_data.length > 0
      ? agentbillingdata.ic_data.map((item, index) => ({
          index: index + 1,
          id: item["_id"],
          tagedPulses: item.percentage_pulse ? `${numberWithCommas(parseFloat(item.percentage_pulse).toFixed(2))}%` : "0%",
          percentagePulse: item.working_days ? numberWithCommas(parseFloat(item.working_days).toFixed(2)) : "0.00",
          untagedPulses: item.working_cost_gst ? numberWithCommas(parseFloat(item.working_cost_gst).toFixed(2)) : "0.00",
          checkvalue: item.percentage_pulse,
        }))
      : [];

  const sumData =
    agentbillingdata && agentbillingdata?.ic_data && agentbillingdata?.ic_data.length > 0
      ? agentbillingdata.ic_data.reduce(
          (sums, item) => {
            sums.percentage_pulse += item?.percentage_pulse ? parseFloat(item.percentage_pulse) : 0;
            sums.working_days += item?.working_days ? parseFloat(item.working_days) : 0;
            sums.working_cost_gst += item?.working_cost_gst ? parseFloat(item.working_cost_gst) : 0;
            return sums;
          },
          {
            percentage_pulse: 0,
            working_days: 0,
            working_cost_gst: 0,
          },
        )
      : {
          percentage_pulse: 0,
          working_days: 0,
          working_cost_gst: 0,
        };

  const grandTotal = [
    sumData.percentage_pulse ? `${numberWithCommas(parseFloat(sumData.percentage_pulse).toFixed(2))}%` : "0%",
    numberWithCommas(sumData.working_days.toFixed(2)),
    numberWithCommas(sumData.working_cost_gst.toFixed(2)),
  ];

  const columns2 = ["Sr. No", "Agent Id", "Working Days (Including Training)", "Weekly Off And Holidays (In Days)", "Total No. Of Working Days"];
  const tabledata2 =
    billingDashBoardAgentWorkingDetailsList && billingDashBoardAgentWorkingDetailsList.length > 0
      ? billingDashBoardAgentWorkingDetailsList.map((item, index) => ({
          index: index + 1,
          id: item.user || "0",
          tagedPulses: item.working_days ? numberWithCommas(parseFloat(item.working_days).toFixed(2)) : "0",
          percentagePulse: item.holidays && item.holidays.total_holidays ? numberWithCommas(parseFloat(item.holidays.total_holidays).toFixed(2)) : "0",
          untagedPulses: item.total_working_days ? numberWithCommas(parseFloat(item.total_working_days).toFixed(2)) : "0",
          checkvalue: item.total_working_days,
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
      {agents === "0.00" ? (
        <div>No Data Uploaded Yet</div>
      ) : (
        <>
          <div>
            <Calculationdetails
              activeKey={activeKey}
              currentcarddetails={currentcarddetails}
              showcal={false}
              total={false}
              name={"Agents Details"}
              detailscards={detailscards}
            />

            <Tabledata
              columns={columns}
              tabledata={tabledata}
              grandtotal={grandTotal}
              customStyle={customStyle}
              downloadpdfdata={downloadpdfdata}
              showdownload={true}
            />
            <div className="py-3 calculationdetails">
              <div className="d-flex align-items-center justify-content-between">
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
              tabonename={["Agents Share of Working Days IC wise", "X1 = (S1 * 122)/No. Of Days In Month"]}
              inboundpulse={agentbillingdata?.t_working_cost ? `Rs. ${numberWithCommas(parseFloat(agentbillingdata?.t_working_cost).toFixed(2))}` : 0}
              tabtwoname={["Taxes (GST)", "Y1 = X1 * 18%"]}
              taxes={
                agentbillingdata?.t_working_cost_gst
                  ? `Rs. ${numberWithCommas(parseFloat(parseFloat(agentbillingdata?.t_working_cost_gst) - parseFloat(agentbillingdata?.t_working_cost)).toFixed(2))}`
                  : 0
              }
              tabthree={["Total Bill for IB Pulses", "Z1 = X1 + Y1"]}
              total={agentbillingdata?.t_working_cost_gst ? `Rs. ${numberWithCommas(parseFloat(agentbillingdata?.t_working_cost_gst).toFixed(2))}` : 0}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Agentscomponent;
