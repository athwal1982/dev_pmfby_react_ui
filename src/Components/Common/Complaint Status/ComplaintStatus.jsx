import { checkStatus } from "Components/Newhome/Services/Methods";
import { farmerTicketSummaryKRPH } from "../KrphAllActivitiesND/Services/Methods";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { AlertMessage } from "Framework/Components/Widgets";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSessionStorage,setSessionStorage } from "Components/Common/Login/Auth/auth";
import TicketItem from "../../../Components/Newhome/TicketHistory/Components/TicketItem";
import BizClass from "./ComplaintStatus.module.scss";
import Header from "./Layout/Header";
import { AppBar, Toolbar, Typography, Box, Button, Avatar } from "@mui/material";
import Footer from "./Layout/Footer";
import logo_croploss from "../../../assets/img_croploss.svg";
import { getSupportTicketReview } from "../../Modules/Support/MyTicket/Services/Services";

const ComplaintStatus = () => {
  const alertMessage = AlertMessage();
  const location = useLocation();
  const userData = getSessionStorage("user");
  const defaultLangData = getSessionStorage("DefaultLang");
  const mobileNum =
    userData && userData.data && userData.data.data && userData.data.data.result && userData.data.data.result.mobile ? userData.data.data.result.mobile : ""; // A userData && userData.UserMobileNumber ? userData.UserMobileNumber : "";

  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(true);
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  const navigate = useNavigate();

  const handleBackClick = () => {
    sessionStorage.clear();
    navigate("/");
  };
  const handleComplaintStatus = () => {
    navigate("/croploss", { state: { mobileNum } });
  };

  useEffect(() => {
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.height = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      document.body.style.overflowX = "";
    };
  }, []);

  const [expanded, setExpanded] = useState("");
  const handleOnExpand = (ticketId) => {
    debugger;
    if (expandedTicketId === ticketId) {
      setExpandedTicketId(null);
    } else {
      setExpandedTicketId(ticketId);
      setExpanded("");
      getChatListDetailsData(ticketId, 1, -1);
    }
  };
  const [chatListDetails, setChatListDetails] = useState([]);
  const [isLoadingchatListDetails, setIsLoadingchatListDetails] = useState(false);
  const getChatListDetailsData = async (pSupportTicketID, pPageIndex, pPageSize) => {
    try {
      setIsLoadingchatListDetails(true);
      const formdata = {
        supportTicketID: pSupportTicketID,
        pageIndex: pPageIndex,
        pageSize: pPageSize,
      };
      const result = await getSupportTicketReview(formdata);
      console.log(result, "chat List");
      setIsLoadingchatListDetails(false);
      if (result.responseCode === 1) {
        if (result.responseData.supportTicket && result.responseData.supportTicket.length > 0) {
          setChatListDetails(result.responseData.supportTicket);
        } else {
          setChatListDetails([]);
        }
      } else {
        alertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      alertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const updateTicketHistorytData = (addedData) => {
    if (addedData.IsNewlyAdded === true) {
      chatListDetails.unshift(addedData);
    }
    console.log(addedData);
    setChatListDetails([]);
    setChatListDetails(chatListDetails);
  };
  const fetchHistory = async () => {
    if (!mobileNum) return;
    try {
      const response = await checkStatus(mobileNum);
      if (response.responseData) {
        setData(response.responseData);
        setErrorMsg(true);
      } else {
        alertMessage({
          type: "error",
          message: response.responseMessage,
        });
        setErrorMsg(false);
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(false);
    }
  };

  useEffect(() => {
    //  A fetchHistory();
    getfarmersTicketData();
  }, []);

    useEffect(() => {
      if (window.__bhashiniLangAlreadySet) return;
      window.__bhashiniLangAlreadySet = true;
  
      const stateLanguageMap = {
        "Andhra Pradesh": "te",
        "Arunachal Pradesh": "as",
        Assam: "as",
        Bihar: "hi",
        Chhattisgarh: "hi",
        Goa: "gom",
        Gujarat: "gu",
        Haryana: "hi",
        "Himachal Pradesh": "hi",
        Jharkhand: "hi",
        Karnataka: "kn",
        Kerala: "ml",
        "Madhya Pradesh": "hi",
        Maharashtra: "mr",
        Manipur: "mni",
        Meghalaya: "as",
        Mizoram: "as",
        Nagaland: "as",
        Odisha: "or",
        Punjab: "pa",
        Rajasthan: "hi",
        Sikkim: "ne",
        "Tamil Nadu": "ta",
        Telangana: "te",
        Tripura: "bn",
        "Uttar Pradesh": "hi",
        Uttarakhand: "hi",
        "West Bengal": "bn",
        Delhi: "hi",
        "Jammu and Kashmir": "ks",
        Ladakh: "ks",
      };
  
      const toTitleCase = (str = "") =>
        str
          .toLowerCase()
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
  
      const userState = userData?.data?.data?.result?.state ? toTitleCase(userData.data.data.result.state) : "";
  
      const langCode = stateLanguageMap[userState] || "en";
  
      const trySetLanguage = () => {
        const dropdown = document.getElementById("bhashiniLanguageDropdown");
        const langOption = dropdown?.querySelector(`[data-value="${langCode}"]`);
        const btnText = document.querySelector(".bhashini-dropdown-btn-text");
        const bhashiniDiv = document.getElementById("bhashini-translation");
  
        if (bhashiniDiv) bhashiniDiv.style.display = "block";
  
        if (langOption) {
          setSessionStorage("DefaultLang", "ALLLANG");
          langOption.dispatchEvent(new Event("click", { bubbles: true }));
          if (btnText) btnText.textContent = langOption.textContent.trim();
          return true;
        }
        return false;
      };
      if (defaultLangData && defaultLangData === "DEFLANG") {
        trySetLanguage();
      }
    }, []);
    useEffect(() => {
      const interval = setInterval(() => {
        const bhashiniDiv = document.getElementById("bhashini-translation");
        if (bhashiniDiv) {
          bhashiniDiv.style.display = "block";
        }
      }, 500);
  
      return () => clearInterval(interval);
    }, []);

  const requestorDetails = useMemo(() => {
    // A if (data && data.responseDynamic) {
    // A  const item = data.responseDynamic.resolved?.[0];
    // A  if (item) {
    // A    return {
    // A      requestorMobileNo: item.RequestorMobileNo,
    // A      requestorName: item.RequestorName,
    // A      requestorDistrict: item.DistrictMasterName,
    // A      requestorState: item.StateMasterName,
    // A    };
    // A  } else {
    // A    const item = data.responseDynamic.unresolved?.[0];
    // A    if (item) {
    // A      return {
    // A        requestorMobileNo: item.RequestorMobileNo,
    // A        requestorName: item.RequestorName,
    // A        requestorDistrict: item.DistrictMasterName,
    // A        requestorState: item.StateMasterName,
    // A      };
    // A    }
    // A  }
    // A }
    return {
      requestorMobileNo:
        userData && userData.data && userData.data.data && userData.data.data.result && userData.data.data.result.mobile
          ? userData.data.data.result.mobile
          : "",
      requestorName:
        userData && userData.data && userData.data.data && userData.data.data.result && userData.data.data.result.farmerName
          ? userData.data.data.result.farmerName
          : "",
      requestorDistrict:
        userData && userData.data && userData.data.data && userData.data.data.result && userData.data.data.result.district
          ? userData.data.data.result.district
          : "",
      requestorState:
        userData && userData.data && userData.data.data && userData.data.data.result && userData.data.data.result.state ? userData.data.data.result.state : "",
    };
  }, [data]);

  function maskText(text) {
    if (!text) return;

    return text
      .split("")
      .map((char, i) => {
        if (i % 2 !== 0) return "*";
        return char;
      })
      .join("");
  }

  const getfarmersTicketData = async () => {
    debugger;
    try {
      let result = "";
      let formData = "";

      formData = {
        viewMode: "RQSTLST",
        ticketRequestorID:
          userData && userData.data && userData.data.data && userData.data.data.result && userData.data.data.result.farmerID
            ? userData.data.data.result.farmerID
            : "",
        mobilenumber: "",
        aadharNumber: "",
        accountNumber: "",
      };
      result = await farmerTicketSummaryKRPH(formData);
      if (result.response.responseCode.toString() === "1") {
        const farmersTicketData = Object.values(result.response.responseData.data.result);
        if (farmersTicketData && farmersTicketData.length > 0) {
          setData(farmersTicketData);
        } else {
          console.log(farmersTicketData);
        }
      } else {
        console.log("farmersTicketData");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="new-home">
      <Header
        title={requestorDetails?.requestorName || "Unknown Requestor"}
        onComplaintStatus={handleComplaintStatus}
        showClaimButton={true}
        handleBackClick={handleBackClick}
      />
      <div
        style={{
          position: "relative",
          background: "linear-gradient(to bottom, #21862d, #c3eb68)",
          minHeight: "fit-content",
        }}
      >
        {mobileNum ? (
          errorMsg ? (
            <div className={BizClass.container}>
              <div className={BizClass.toprightcontainer}></div>
              <Box
                sx={{
                  border: "3px solid transparent",
                  boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                }}
              >
                <div className={BizClass.farmerInfo}>
                  <Box
                    sx={{
                      backgroundColor: "#075307",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      variant="h8"
                      sx={{
                        color: "white",
                        textAlign: "flex-start",
                      }}
                    >
                      Complaint Status
                    </Typography>
                  </Box>

                  <br />

                  <span style={{ fontSize: "16px" }}>Farmer Information</span>
                  <div className={BizClass.infoFields}>
                    <div className={BizClass.infoField}>
                      <label>Name</label>
                      <input type="text" defaultValue={requestorDetails?.requestorName} readOnly />
                    </div>
                    <div className={BizClass.infoField}>
                      <label>Mobile No</label>
                      <input type="text" defaultValue={requestorDetails?.requestorMobileNo} readOnly />
                    </div>
                    <div className={BizClass.infoField}>
                      <label>District</label>
                      <input type="text" defaultValue={requestorDetails?.requestorDistrict} readOnly />
                    </div>
                  </div>
                </div>
              </Box>
              <Box
                sx={{
                  border: "3px solid transparent",
                  boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                  marginBottom: "30px",
                }}
              >
                <div className={BizClass.ticketInfo}>
                  <div>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      <h4 style={{ margin: 0, fontSize: "20px" }}>Ticket Information</h4> {/* Title aligned to the left */}
                    </Box>
                  </div>

                  <table className={BizClass.ticketTable} style={{ height: "10vh !important" }}>
                    <thead>
                      <tr style={{ color: "white" }}>
                        <th style={{ borderRadius: " 10px 0px 0 0" }}># Ticket Number</th>
                        <th>Policy Number</th>
                        <th>Scheme Name</th>
                        <th>Ticket Category</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "14px" }}>
                      {/* {data &&
                        data.responseDynamic?.resolved?.map((item) => (
                          <TicketItem
                            key={item.SupportTicketNo}
                            item={item}
                            isExpanded={expandedTicketId === item.SupportTicketNo}
                            onExpand={() => handleOnExpand(item.SupportTicketNo)}
                          />
                        ))}

                      {data &&
                        data.responseDynamic?.unresolved?.map((item) => (
                          <TicketItem
                            key={item.SupportTicketNo}
                            item={item}
                            isExpanded={expandedTicketId === item.SupportTicketNo}
                            onExpand={() => handleOnExpand(item.SupportTicketNo)}
                          />
                        ))} */}
                      {data &&
                        data?.map((item) => (
                          <TicketItem
                            key={item.SupportTicketNo}
                            item={item}
                            isExpanded={expandedTicketId === item.SupportTicketID}
                            onExpand={() => handleOnExpand(item.SupportTicketID)}
                            chatListDetails={chatListDetails}
                            isLoadingchatListDetails={isLoadingchatListDetails}
                            expanded={expanded}
                            setExpanded={setExpanded}
                            updateTicketHistorytData={updateTicketHistorytData}
                          />
                        ))}
                    </tbody>
                  </table>

                  {/* <TableContainer sx={{ borderRadius: "10px", overflow: "hidden", boxShadow: 0 }}>
                  <Table sx={{ width: "100%", borderCollapse: "separate" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "primary.main" }}>
                        <TableCell sx={{ borderRadius: "10px 0 0 0", color: "white" }}># Ticket Number</TableCell>
                        <TableCell sx={{ color: "white" }}>Policy Number</TableCell>
                        <TableCell sx={{ color: "white" }}>Scheme Name</TableCell>
                        <TableCell sx={{ color: "white" }}>Ticket Category</TableCell>
                        <TableCell sx={{ borderRadius: "0 10px 0 0", color: "white" }}>Status</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {data &&
                        data.responseDynamic?.resolved?.map((item) => (
                          <TicketItem
                          key={item.SupportTicketNo}
                          item={item}
                          isExpanded={expandedTicketId === item.SupportTicketNo}
                          onExpand={() => handleOnExpand(item.SupportTicketNo)}
                          />
                          ))}
                          {data &&
                          data.responseDynamic?.unresolved?.map((item) => (
                            <TicketItem
                            key={item.SupportTicketNo}
                            item={item}
                            isExpanded={expandedTicketId === item.SupportTicketNo}
                            onExpand={() => handleOnExpand(item.SupportTicketNo)}
                            />
                            ))}
                            </TableBody>
                            </Table>
                            </TableContainer> */}
                </div>
              </Box>
            </div>
          ) : (
            <div className={BizClass.NoDataFoundText}>
              <p>No data found.</p>
            </div>
          )
        ) : (
          <div className={BizClass.NoDataFoundText}>
            <p>Mobile number is missing.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ComplaintStatus;
