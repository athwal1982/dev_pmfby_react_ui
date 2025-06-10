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

const Textmessagecomponent = ({
  activeKey,
  fromDate,
  toDate,
  textmessage,
  currentcarddetails,
  numberWithCommas,
  billingDashBoardList,
  totalICTxtMsgTotalAmount,
  totalICTxtMsgGSTAmount,
  totalICTxtMsgTotalBillableAmount,
  grandTotalTextMsgPercntShare,
  grandTotalTextMsg,
  downloadpdfdata,
  sumColumn,
}) => {
  const [detailscards, setDetailscards] = useState([]);
  const [show, setShow] = useState(false);
  const columns = ["Sr. No", "Insurance Company", "% Share of IBTC Pulses (B1)", "SMS count to be Billed(U*= B1 * Total SMS sent)"];
  const tabledata =
    billingDashBoardList && billingDashBoardList.length > 0 && billingDashBoardList[0]
      ? billingDashBoardList[0].map((item, index) => ({
          index: index + 1,
          id: item["_id"],
          tagedPulses: item.perentage_pulses ? `${numberWithCommas(parseFloat(item.perentage_pulses).toFixed(2))}%` : "0%",
          percentagePulse: item.sms_submission ? numberWithCommas(parseFloat(item.sms_submission).toFixed(2)) : "0.00",
          checkvalue: item.sms_submission,
        }))
      : [];

  const grandtotal = [
    grandTotalTextMsgPercntShare ? `${numberWithCommas(parseFloat(grandTotalTextMsgPercntShare).toFixed(2))}%` : "0%",
    grandTotalTextMsg ? numberWithCommas(parseFloat(grandTotalTextMsg).toFixed(2)) : "0",
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
          name: "Total Text Messages Count",
          value: sumColumn(billingDashBoardList[0], "sms_submission") ? numberWithCommas(sumColumn(billingDashBoardList[0], "sms_submission")) : "0.00",
        },
      ]);
    }
  }, [billingDashBoardList]);

  const [smsData, setSmsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const setAlertMessage = AlertMessage();

  const handleGetData = async () => {
    const user = getSessionStorage("user");

    const options = {
      method: "POST",
      url: `${Config.BaseUrl}FGMS/smsDetailRawData`,

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
        setSmsData(JSON.parse(decompressedData));
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
      {textmessage === "0.00" ? (
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
            name={"Text Messages Details"}
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
                <p className="title">SMS Data Details</p>
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
                          <th style={headerCellStyle}>SMS Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {smsData.length > 0 ? (
                          smsData.map((row, index) => (
                            <tr
                              key={index}
                              style={{
                                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0",
                              }}
                            >
                              <td style={cellStyle}>{index + 1}</td>
                              <td style={cellStyle}>{row.Date}</td>
                              <td style={cellStyle}>{row["SMS Count"]}</td>
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
            name={"SMS Billing Total of Insurance Company"}
            currentcarddetails={currentcarddetails}
            tabonename={["Amount for SMS Sent", "X4 = U1 * 0.125"]}
            inboundpulse={totalICTxtMsgTotalAmount ? `Rs. ${numberWithCommas(parseFloat(totalICTxtMsgTotalAmount).toFixed(2))}` : 0}
            tabtwoname={["Taxes (GST)", "Y4 = X4 * 18%"]}
            taxes={totalICTxtMsgGSTAmount ? `Rs. ${numberWithCommas(parseFloat(totalICTxtMsgGSTAmount).toFixed(2))}` : 0}
            tabthree={["Total Bill for SMS Sent", "Z4 = X4 + Y4"]}
            total={totalICTxtMsgTotalBillableAmount ? `Rs. ${numberWithCommas(parseFloat(totalICTxtMsgTotalBillableAmount).toFixed(2))}` : 0}
          />
        </div>
      )}
    </>
  );
};

export default Textmessagecomponent;
