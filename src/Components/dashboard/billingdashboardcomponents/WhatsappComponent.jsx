import React, { useEffect, useState } from "react";
import Calculationdetails from "../Partials/Calculationdetails";
import Tabledata from "../Partials/Tabledata";
import Calculationdetailsbootom from "../Partials/Calculationdetailsbootom";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { Code } from "@mui/icons-material";

const WhatsappComponent = ({
  activeKey,
  currentcarddetails,
  numberWithCommas,
  billingDashBoardList,
  whatsapp,
  totalICWhatsappGSTAmount,
  totalICWhatsappTotalBillableAmount,
  tempmessagelist,
  downloadpdfdata,
  sumColumn,
}) => {
  console.log(billingDashBoardList);
  const userData = getSessionStorage("user");
  const [onlygst, setOnlygst] = useState(0);
  const [detailscards, setDetailscards] = useState([]);
  const columns = [
    "Sr. No",
    "Insurance Company",
    "% Share of IBTC Pulses (B1)",

    "Whatsapp count to be Billed(U*= B1 * Total Whatsapp sent)",
    // "Marketing Conv.", "Service Conv.", "Conversation Utility Conv."
  ];

  const tabledata =
    billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0]
      ? billingDashBoardList[0]?.ic_data.map((item, index) => ({
          index: index + 1,
          id: item["_id"],
          tagedPulses: item?.pulse_percentage ? `${numberWithCommas(parseFloat(item?.pulse_percentage).toFixed(2))}%` : "0%",
          percentagePulse: item.total_conv_qty ? numberWithCommas(parseFloat(item.total_conv_qty).toFixed(2)) : "0.00",
          /* AA untagedPulses: item.srv_conv_qty ? numberWithCommas(parseFloat(item.srv_conv_qty).toFixed(2)) : "0.00",
          totalBillingPulses: item.util_conv_qty ? numberWithCommas(parseFloat(item.util_conv_qty).toFixed(2)) : "0.00", */
          checkvalue: item?.pulse_percentage,
        }))
      : [];
  const sumData =
    billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0]
      ? billingDashBoardList[0]?.ic_data.reduce(
          (sums, item) => {
            sums.tagedPulses += item.pulse_percentage ? parseFloat(item.pulse_percentage) : 0;
            sums.percentagePulse += item.total_conv_qty ? parseFloat(item.total_conv_qty) : 0;
            /* AA sums.untagedPulses += item.srv_conv_qty ? parseFloat(item.srv_conv_qty) : 0;
            sums.totalBillingPulses += item.util_conv_qty ? parseFloat(item.util_conv_qty) : 0; */
            return sums;
          },
          {
            tagedPulses: 0,
            percentagePulse: 0,
            /* AA untagedPulses: 0,
            totalBillingPulses: 0, */
          },
        )
      : {
          tagedPulses: 0,
          percentagePulse: 0,
          /* AA untagedPulses: 0,
          totalBillingPulses: 0, */
        };

  const grandtotal = [
    sumData.tagedPulses ? `${numberWithCommas(parseFloat(sumData.tagedPulses).toFixed(2))}%` : "0%",
    numberWithCommas(sumData.percentagePulse.toFixed(2)),
    /* AA numberWithCommas(sumData.untagedPulses.toFixed(2)), */
    /* AA numberWithCommas(sumData.totalBillingPulses.toFixed(2)), */
  ];

  useEffect(() => {
    if (totalICWhatsappTotalBillableAmount && totalICWhatsappGSTAmount) {
      let onlygstdata = parseFloat(totalICWhatsappGSTAmount - totalICWhatsappTotalBillableAmount);
      setOnlygst(onlygstdata);
    }
  }, [totalICWhatsappTotalBillableAmount, totalICWhatsappGSTAmount]);
  let customStyle = [
    { textAlign: "left", textWrap: "nowrap" },
    { textAlign: "left" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
  ];

  useEffect(() => {
    if (billingDashBoardList && billingDashBoardList?.[0]?.ic_data.length > 0) {
      setDetailscards([
        {
          show: true,
          name: "Total WhatsApp Message Count.",
          value: billingDashBoardList?.[0]?.t_mkt_qty ? numberWithCommas(billingDashBoardList?.[0]?.t_conv_qty) : "0.00",
        },

        {
          show: false,
          name: "Total Marketing Conv. Qty.",
          value: billingDashBoardList?.[0]?.t_mkt_qty ? numberWithCommas(billingDashBoardList?.[0]?.t_mkt_qty) : "0.00",
        },
        {
          show: false,
          name: "Total Service Conv. Qty.",
          value: billingDashBoardList?.[0]?.t_srv_qty ? numberWithCommas(billingDashBoardList?.[0]?.t_srv_qty) : "0.00",
        },
        {
          show: false,
          name: "Total Conversation Utility Conv. Qty.",
          value: billingDashBoardList?.[0]?.t_util_qty ? numberWithCommas(billingDashBoardList?.[0]?.t_util_qty) : "0.00",
        },
      ]);
    }
  }, [billingDashBoardList]);

  return (
    <>
      {whatsapp === "0.00" ? (
        <>
          <div>No Data Uploaded Yet</div>
        </>
      ) : (
        <div>
          <Calculationdetails
            activeKey={activeKey}
            currentcarddetails={currentcarddetails}
            showcal={false}
            total={false}
            name={"Whatsapp Details"}
            detailscards={detailscards}
          />
          <div className="mt-4"></div>
          <Tabledata
            columns={columns}
            tabledata={tabledata}
            grandtotal={grandtotal}
            customStyle={customStyle}
            downloadpdfdata={downloadpdfdata}
            showdownload={true}
          />
          {userData?.UserCompanyType == "CSC" && (
            <Calculationdetailsbootom
              name={"Whatsapp Billing Total of Insurance Company"}
              currentcarddetails={currentcarddetails}
              tabonename={["Amount for WhatsApp message"]}
              inboundpulse={
                billingDashBoardList?.[0]?.t_conv_cost ? `Rs. ${numberWithCommas(parseFloat(billingDashBoardList?.[0]?.t_conv_cost).toFixed(2))}` : 0
              }
              tabtwoname={["Taxes (GST 18%)"]}
              taxes={onlygst ? `Rs. ${numberWithCommas(parseFloat(onlygst).toFixed(2))}` : 0}
              tabthree={["Total Bill for WhatsApp message"]}
              total={
                billingDashBoardList?.[0]?.t_conv_cost_gst ? `Rs. ${numberWithCommas(parseFloat(billingDashBoardList?.[0]?.t_conv_cost_gst).toFixed(2))}` : 0
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default WhatsappComponent;

/* AA old Code
older 

import React, { useEffect, useState } from "react";
import Calculationdetails from "../Partials/Calculationdetails";
import Tabledata from "../Partials/Tabledata";
import Calculationdetailsbootom from "../Partials/Calculationdetailsbootom";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";

const WhatsappComponent = ({
  activeKey,
  currentcarddetails,
  numberWithCommas,
  billingDashBoardList,
  whatsapp,
  totalICWhatsappGSTAmount,
  totalICWhatsappTotalBillableAmount,
  tempmessagelist,
  downloadpdfdata,
  sumColumn,
}) => {
  console.log(billingDashBoardList);
  const userData = getSessionStorage("user");
  const [onlygst, setOnlygst] = useState(0);
  const [detailscards, setDetailscards] = useState([]);
  const columns = ["Sr. No", "Insurance Company", "% Share of IBTC Pulses (B1)", 
    
      "Whatsapp count to be Billed(U*= B1 * Total Whatsapp sent)"
    // "Marketing Conv.", "Service Conv.", "Conversation Utility Conv."
  
  ];

  const tabledata =
    billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0]
      ? billingDashBoardList[0]?.ic_data.map((item, index) => ({
          index: index + 1,
          id: item["_id"],
          tagedPulses: item?.pulse_percentage ? `${numberWithCommas(parseFloat(item?.pulse_percentage).toFixed(2))}%` : "0%",
          percentagePulse: item.mkt_conv_qty ? numberWithCommas(parseFloat(item.mkt_conv_qty).toFixed(2)) : "0.00",
          untagedPulses: item.srv_conv_qty ? numberWithCommas(parseFloat(item.srv_conv_qty).toFixed(2)) : "0.00",
          totalBillingPulses: item.util_conv_qty ? numberWithCommas(parseFloat(item.util_conv_qty).toFixed(2)) : "0.00",
          checkvalue: item?.pulse_percentage,
        }))
      : [];

  const sumData =
    billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0]
      ? billingDashBoardList[0]?.ic_data.reduce(
          (sums, item) => {
            sums.tagedPulses += item.pulse_percentage ? parseFloat(item.pulse_percentage) : 0;
            sums.percentagePulse += item.mkt_conv_qty ? parseFloat(item.mkt_conv_qty) : 0;
            sums.untagedPulses += item.srv_conv_qty ? parseFloat(item.srv_conv_qty) : 0;
            sums.totalBillingPulses += item.util_conv_qty ? parseFloat(item.util_conv_qty) : 0;
            return sums;
          },
          {
            tagedPulses: 0,
            percentagePulse: 0,
            untagedPulses: 0,
            totalBillingPulses: 0,
          },
        )
      : {
          tagedPulses: 0,
          percentagePulse: 0,
          untagedPulses: 0,
          totalBillingPulses: 0,
        };

  const grandtotal = [
    sumData.tagedPulses ? `${numberWithCommas(parseFloat(sumData.tagedPulses).toFixed(2))}%` : "0%",
    numberWithCommas(sumData.percentagePulse.toFixed(2)),
    numberWithCommas(sumData.untagedPulses.toFixed(2)),
    numberWithCommas(sumData.totalBillingPulses.toFixed(2)),
  ];

  useEffect(() => {
    if (totalICWhatsappTotalBillableAmount && totalICWhatsappGSTAmount) {
      let onlygstdata = parseFloat(totalICWhatsappGSTAmount - totalICWhatsappTotalBillableAmount);
      setOnlygst(onlygstdata);
    }
  }, [totalICWhatsappTotalBillableAmount, totalICWhatsappGSTAmount]);
  let customStyle = [
    { textAlign: "left", textWrap: "nowrap" },
    { textAlign: "left" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
  ];

  useEffect(() => {
    if (billingDashBoardList && billingDashBoardList?.[0]?.ic_data.length > 0) {
      setDetailscards([
        {
          show: true,
          name: "Total Marketing Conv. Qty.",
          value: billingDashBoardList?.[0]?.t_mkt_qty ? numberWithCommas(billingDashBoardList?.[0]?.t_mkt_qty) : "0.00",
        },
        {
          show: true,
          name: "Total Service Conv. Qty.",
          value: billingDashBoardList?.[0]?.t_srv_qty ? numberWithCommas(billingDashBoardList?.[0]?.t_srv_qty) : "0.00",
        },
        {
          show: true,
          name: "Total Conversation Utility Conv. Qty.",
          value: billingDashBoardList?.[0]?.t_util_qty ? numberWithCommas(billingDashBoardList?.[0]?.t_util_qty) : "0.00",
        },
      ]);
    }
  }, [billingDashBoardList]);
  return (
    <>
      {whatsapp === "0.00" ? (
        <>
          <div>No Data Uploaded Yet</div>
        </>
      ) : (
        <div>
          <Calculationdetails
            activeKey={activeKey}
            currentcarddetails={currentcarddetails}
            showcal={false}
            total={false}
            name={"Whatsapp Details"}
            detailscards={detailscards}
          />
          <div className="mt-4"></div>
          <Tabledata
            columns={columns}
            tabledata={tabledata}
            grandtotal={grandtotal}
            customStyle={customStyle}
            downloadpdfdata={downloadpdfdata}
            showdownload={true}
          />
          {userData?.UserCompanyType == "CSC" && (
            <Calculationdetailsbootom
              name={"Whatsapp Billing Total of Insurance Company"}
              currentcarddetails={currentcarddetails}
              tabonename={["Amount for WhatsApp message"]}
              inboundpulse={
                billingDashBoardList?.[0]?.t_conv_cost ? `Rs. ${numberWithCommas(parseFloat(billingDashBoardList?.[0]?.t_conv_cost).toFixed(2))}` : 0
              }
              tabtwoname={["Taxes (GST 18%)"]}
              taxes={onlygst ? `Rs. ${numberWithCommas(parseFloat(onlygst).toFixed(2))}` : 0}
              tabthree={["Total Bill for WhatsApp message"]}
              total={
                billingDashBoardList?.[0]?.t_conv_cost_gst ? `Rs. ${numberWithCommas(parseFloat(billingDashBoardList?.[0]?.t_conv_cost_gst).toFixed(2))}` : 0
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default WhatsappComponent;
 */
