import React, { useEffect, useState } from "react";
import Calculationdetails from "../Partials/Calculationdetails";
import Tabledata from "../Partials/Tabledata";
import Calculationdetailsbootom from "../Partials/Calculationdetailsbootom";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Collapse } from "@mui/material";
import Config from "Configration/Config.json";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import pako from "pako";

const AibotComponent = ({
  activeKey,
  fromDate,
  toDate,
  aibot,
  currentcarddetails,
  numberWithCommas,
  billingDashBoardList,
  totalICAiTotalAmount,
  totalICAiGSTAmount,
  totalICAiTotalBillableAmount,
  grandTotalAiPercntShare,
  grandTotalAi,
  downloadpdfdata,
  sumColumn,
}) => {
  const [detailscards, setDetailscards] = useState([]);
  const [show, setShow] = useState(false);
  const columns = ["Sr. No", "Insurance Company", "% Share of IBTC Pulses (B1)", "Pulse count to be Billed(U*= B1 * Total Pulse)"];
  const tabledata =
    billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0]
      ? billingDashBoardList[0].map((item, index) => ({
          index: index + 1,
          id: item["_id"],
          tagedPulses: item.perentage_pulses ? `${numberWithCommas(parseFloat(item.perentage_pulses).toFixed(2))}%` : "0%",
          percentagePulse: item.aiBot_submission ? numberWithCommas(parseFloat(item.aiBot_submission).toFixed(2)) : "0.00",
          checkvalue: item.aiBot_submission,
        }))
      : [];

  const grandtotal = [
    grandTotalAiPercntShare ? `${numberWithCommas(parseFloat(grandTotalAiPercntShare).toFixed(2))}%` : "0%",
    grandTotalAi ? numberWithCommas(parseFloat(grandTotalAi).toFixed(2)) : "0",
  ];
  let customStyle = [
    { textAlign: "left", textWrap: "nowrap" },
    { textAlign: "left" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
    { textAlign: "center" },
  ];
  useEffect(() => {
    if (billingDashBoardList && billingDashBoardList?.[0]?.length > 0) {
      // A console.log(billingDashBoardList);
      setDetailscards([
        {
          show: true,
          name: "Total Pulse Count",
          value: sumColumn(billingDashBoardList[0], "aiBot_submission") ? numberWithCommas(sumColumn(billingDashBoardList[0], "aiBot_submission")) : "0.00",
        },
      ]);
    }
  }, [billingDashBoardList]);

  const [aiBotData, setAiBotData] = useState([]);
  const [loading, setLoading] = useState(true);
  const setAlertMessage = AlertMessage();

  const handleGetData = async () => {
    debugger;

    const user = getSessionStorage("user");

    const options = {
      method: "POST",
      url: `${Config.BaseUrl}FGMS/aiBotDetailRawData`,

      headers: {
        cookie: "my_cookie=value",
        accept: "application/json",
        "content-type": "application/json",
        authorization: user?.token?.Token,
      },
      data: { from: fromDate, to: toDate },
    };

    try {
      const response = await axios.request(options);
      if (response.data?.responseDynamic) {
        const compressedData = response.data.responseDynamic;
        const byteArray = Uint8Array.from(atob(compressedData), (c) => c.charCodeAt(0));
        const decompressedData = new TextDecoder("utf-8").decode(pako.inflate(byteArray));
        setAiBotData(JSON.parse(decompressedData));
      } else {
        setAlertMessage({ type: "error", message: "No Data" });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const headerCellStyle = {
    padding: "5px",
    textAlign: "left",
    fontSize: "16px",
    position: "sticky",
    textAlign: "center",
    top: "0",
    backgroundColor: "#075307",
    color: "white",
  };

  const cellStyle = {
    textAlign: "center",
    padding: "5px",
    fontSize: "16px",
  };
  return (
    <>
      {aibot === "0.00" ? (
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
            name={"Ai Bot Details"}
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
          <div className="py-3 calculationdetails">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center justify-content-start custom-gap">
                <p className="title">Ai Bot Data Details</p>
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            show && (
              <Collapse in={show}>
                <div style={{ marginTop: "16px", overflowX: "auto" }}>
                  <div style={{ maxHeight: "300px", overflowY: "auto", borderRadius: "10px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead style={{ backgroundColor: "#075307" }}>
                        <tr style={{ backgroundColor: "#075307", position: "sticky", top: "0" }}>
                          <th style={headerCellStyle}>S.No</th>
                          <th style={headerCellStyle}>Date</th>
                          <th style={headerCellStyle}>Pulse Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aiBotData.length > 0 ? (
                          aiBotData.map((row, index) => (
                            <tr
                              key={index}
                              style={{
                                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0",
                              }}
                            >
                              <td style={cellStyle}>{index + 1}</td>
                              <td style={cellStyle}>{row.Date}</td>
                              <td style={cellStyle}>{row["Pulse Count"]}</td>
                            </tr>
                          ))
                        ) : (
                          <tr style={{ backgroundColor: "#f5f5f5" }}>
                            <td colSpan={3} style={{ textAlign: "center", padding: "5px" }}>
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Collapse>
            )
          )}

          <Calculationdetailsbootom
            name={"AI Bot Billing Total of Insurance Company"}
            currentcarddetails={currentcarddetails}
            tabonename={["Amount for Pulse", "X4 = U1 * 0.125"]}
            inboundpulse={totalICAiTotalAmount ? `Rs. ${numberWithCommas(parseFloat(totalICAiTotalAmount).toFixed(2))}` : 0}
            tabtwoname={["Taxes (GST)", "Y4 = X4 * 18%"]}
            taxes={totalICAiGSTAmount ? `Rs. ${numberWithCommas(parseFloat(totalICAiGSTAmount).toFixed(2))}` : 0}
            tabthree={["Total Bill for Pulse", "Z4 = X4 + Y4"]}
            total={totalICAiTotalBillableAmount ? `Rs. ${numberWithCommas(parseFloat(totalICAiTotalBillableAmount).toFixed(2))}` : 0}
          />
        </div>
      )}
    </>
  );
};

export default AibotComponent;