import React from "react";
import Calculationdetails from "../Partials/Calculationdetails";
import Tabledata from "../Partials/Tabledata";
import Calculationdetailsbootom from "../Partials/Calculationdetailsbootom";

const Inboundcomponent = ({
  yearMonth,
  insuranceCompanyReport,
  activeKey,
  currentcarddetails,
  billingDashBoardList = [],
  inbaundcall,
  numberWithCommas,
  grandTotalICIBPercntShare,
  grandTotalICIBTaggedCalls,
  grandTotalICIBUnTaggedCalls,
  grandTotalICIBPulses,
  totalICTotalAmount,
  totalICGSTAmount,
  totalICTotalBillableAmount,
  downloadpdfdata,
  userLoggedInData
}) => {
  const detailscards = [
    {
      show: userLoggedInData && userLoggedInData.UserCompanyType === "Insurance Company" ? false : true,
      name: "Tagging With Tickets",
      value:
        billingDashBoardList.length > 0 && billingDashBoardList[0].total_matched_with_ticket
          ? `${numberWithCommas(billingDashBoardList[0].total_matched_with_ticket)}`
          : "0",
    },
    {
      show: userLoggedInData && userLoggedInData.UserCompanyType === "Insurance Company" ? false : true,
      name: "Tagging Without Tickets",
      value:
        billingDashBoardList.length > 0 && billingDashBoardList[0].total_matched_without_ticket
          ? `${numberWithCommas(billingDashBoardList[0].total_matched_without_ticket)}`
          : "0",
    },
    {
      show: true,
      name: "Total Untagged Calls",
      value:
        billingDashBoardList.length > 0 && billingDashBoardList[0].total_unmatched_pulses
          ? `${numberWithCommas(billingDashBoardList[0].total_unmatched_pulses)}`
          : "0",
    },
  ];
  const columns = [
    "Sr. No",
    "Insurance Company",
    "No. of In Bound Tagged Calls (IBTC) Pulses (A1)",
    "% Share of IBTC Pulses(B1)",
    "No. of IB Untagged Calls (C1 = B1 * Total Untagged Calls)",
    "Total Billable Pulses (R*= A1 + C1)",
  ];
  let customStyle = [
    { textAlign: "left", textWrap: "nowrap" },
    { textAlign: "left" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
  ];
  const tabledata =
    billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0].IC_data
      ? billingDashBoardList[0].IC_data.map((item, index) => ({
          index: index + 1,
          id: item["_id"],
          tagedPulses: item.taged_pulses ? numberWithCommas(parseFloat(item.taged_pulses).toFixed(2)) : "0.00",
          percentagePulse: item.percentagePulse ? `${numberWithCommas(parseFloat(item.percentagePulse).toFixed(2))}%` : "0%",
          untagedPulses: item.untaged_pulses ? numberWithCommas(parseFloat(item.untaged_pulses).toFixed(2)) : "0.00",
          totalBillingPulses: item.total_billing_pulses ? numberWithCommas(parseFloat(item.total_billing_pulses).toFixed(2)) : "0.00",
          checkvalue: item.taged_pulses,
        }))
      : [];

  const grandtotal = [
    grandTotalICIBTaggedCalls ? numberWithCommas(parseFloat(grandTotalICIBTaggedCalls).toFixed(2)) : 0,
    grandTotalICIBPercntShare ? `${numberWithCommas(parseFloat(grandTotalICIBPercntShare).toFixed(2))}%` : "0%",
    grandTotalICIBUnTaggedCalls ? numberWithCommas(parseFloat(grandTotalICIBUnTaggedCalls).toFixed(2)) : 0,
    grandTotalICIBPulses ? numberWithCommas(parseFloat(grandTotalICIBPulses).toFixed(2)) : 0,
  ];

  return (
    <>
      {inbaundcall === "0.00" ? (
        <>
          <div>No Data Uploaded Yet</div>
        </>
      ) : (
        <>
          <div>
            <Calculationdetails
              yearMonth={yearMonth}
              insuranceCompanyReport={insuranceCompanyReport}
              activeKey={activeKey}
              currentcarddetails={currentcarddetails}
              showcal={false}
              total={false}
              name={"Inbound Calls Details"}
              detailscards={detailscards}
            />

            <Tabledata
              columns={columns}
              tabledata={tabledata}
              grandtotal={grandtotal}
              customStyle={customStyle}
              downloadpdfdata={downloadpdfdata}
              showdownload={true}
            />

            <Calculationdetailsbootom
              name={"Inbound Pulses Billing Details of Insurance Company"}
              currentcarddetails={currentcarddetails}
              tabonename={["Amount for Inbound Pulses", "X1 = R1 * 1.25"]}
              inboundpulse={totalICTotalAmount ? `Rs. ${numberWithCommas(parseFloat(totalICTotalAmount).toFixed(2))}` : "0"}
              tabtwoname={["Taxes (GST)", "Y1 = X1 * 18%"]}
              taxes={totalICGSTAmount ? `Rs. ${numberWithCommas(parseFloat(totalICGSTAmount).toFixed(2))}` : "0"}
              tabthree={["Total Bill for IB Pulses", "Z1 = X1 + Y1"]}
              total={totalICTotalBillableAmount ? `Rs. ${numberWithCommas(parseFloat(totalICTotalBillableAmount).toFixed(2))}` : "0"}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Inboundcomponent;
