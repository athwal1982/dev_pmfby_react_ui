import React, { useRef, useState, useEffect } from "react";
import billinginfo from "../billinginfo";
import moment from "moment";
import notification from "../../../assets/icons_new/icons8-notification.svg";
import { getSessionStorage, getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import refresh from "../../../assets/icons_new/icons8-refresh.svg";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import ICTablePopup from "../billingdashboardcomponents/ICTablePopup";
import ExportReportLogics from "./ExportReportLogics";
import { Tooltip } from "@mui/material";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Box } from "@mui/system";

const Breadcrumb = ({ insuranceCompanyReport, yearMonth, toDate, fromDate, setCurrentdaterange, handlesubmit, insuranceCompanyoptions, currentdaterange }) => {
  const userData = getSessionStorage("user");

  const { handleCalculationButton, handleNotificationButton, iCMail_Notification, isCalculating, calcConfirmation, setCalcConfirmation, handleClose } =
    ExportReportLogics({
      insuranceCompanyReport,
      yearMonth,
      toDate,
      fromDate,
    });
  const [icmailData, setIcMailData] = useState([]);
  const year_Month = yearMonth;

  useEffect(() => {
    if (Array.isArray(iCMail_Notification)) {
      setIcMailData(iCMail_Notification);
    }
  }, [iCMail_Notification]);

  const ImportReportBtnRight = getUserRightCodeAccess("BWM9");
  const [isoverlayICPopup, setIsOverlayICPopup] = useState(false);
  const [templatePopup, setTemplatePopUp] = useState(false);
  const setAlertMessage = AlertMessage();
  const { yearlist, monthlist } = billinginfo();
  const [selecteddate, setSelecteddate] = useState({
    year: "",
    month: "",
    ic: "all",
  });
  const [alert, setAlert] = useState(false);
  const dateRef = useRef();

  // Set the current year as default
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setSelecteddate((prev) => ({
      ...prev,
      year: currentYear.toString(),
    }));
  }, []);

  const handleYearChange = (e) => {
    setSelecteddate((prev) => ({
      ...prev,
      year: e.target.value,
      month: "",
    }));
  };
  const handlecompanychange = (e) => {
    setSelecteddate((prev) => ({
      ...prev,
      ic: e.target.value,
    }));
  };
  const handleMonthChange = (e) => {
    setSelecteddate((prev) => ({
      ...prev,
      month: e.target.value,
    }));
  };
  const handleCancelCalc = () => {
    setCalcConfirmation(false);
    setAlertMessage({ type: "success", message: "Process Cancelled" });
  };

  const onsubmitdate = () => {
    if (!selecteddate?.month) {
      setAlert(true);
      dateRef.current?.focus();
      return;
    } else {
      convertToDateRange(selecteddate);
    }
    setAlert(false);
  };
  const convertToDateRange = ({ year, month }) => {
    const monthNumber = parseInt(month, 10);
    const from = moment(`${year}-${monthNumber}-01`, "YYYY-MM-DD").startOf("month").format("YYYY-MM-DD");
    const to = moment(`${year}-${monthNumber}-01`, "YYYY-MM-DD").endOf("month").format("YYYY-MM-DD");
    const tempdate = {
      from: from,
      to: to,
      ic: selecteddate.ic == "all" ? "" : selecteddate.ic,
    };
    setCurrentdaterange(tempdate);
  };
  const handleReset = () => {
    const currentYear = new Date().getFullYear();
    setSelecteddate({ year: currentYear.toString(), month: "", ic: "all" });
    setCurrentdaterange({
      from: "",
      to: "",
      ic: "all",
    });

    setAlert(false);
  };

  const isMonthDisabled = (monthValue) => {
    if (userData?.UserCompanyType == "CSC") {
      return parseInt(selecteddate.year, 10) === 2024 && parseInt(monthValue, 10) < 9;
    } else {
      return parseInt(selecteddate.year, 10) === 2024 && !(parseInt(monthValue, 10) === 9 || parseInt(monthValue, 10) === 10);
    }
  };
  useEffect(() => {
    if (currentdaterange?.to) {
      handlesubmit("SMDTLS");
    }
  }, [currentdaterange]);

  // AhandleCalculationButton(e);

  const handleCalculationBillingDashboard = async (e) => {
    setCalcConfirmation(true);
  };

  const handleNotificationBillingDashboard = async (e) => {
    if (yearMonth === "") {
      setAlertMessage({
        type: "error",
        message: "Please select year & month and then click submit.",
      });
    } else {
      await handleNotificationButton(e);
      setIcMailData(iCMail_Notification);
    }
  };

  useEffect(() => {
    if (icmailData.length > 0) {
      setIsOverlayICPopup(true);
    }
  }, [icmailData]);

  const handleIcPopUpclose = () => {
    setIsOverlayICPopup(false);
    setTemplatePopUp(false);
  };

  return (
    <div>
      <div className="breadcrumb">
        <div className="left_name">
          {/* <p className="span-text">
            <span>Dashboards - </span>
            <span className="green-text">Billing</span>
          </p> */}
          {/* <p className="dashboard-name">Billing Dashboard</p> */}
        </div>
        <div className="right_content">
          <div className="date-time-main">
            <div className="daterange-container">
              {userData?.UserCompanyType == "CSC" && (
                <select className="form-select" value={selecteddate.ic} onChange={handlecompanychange}>
                  <option value={"all"}>ALL</option>
                  {insuranceCompanyoptions.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              )}

              <select className="form-select" value={selecteddate.year} onChange={handleYearChange}>
                {yearlist.map((item, index) => (
                  <option key={index} value={item.toString()}>
                    {item}
                  </option>
                ))}
              </select>
              <select ref={dateRef} className="form-select" value={selecteddate.month} onChange={handleMonthChange}>
                <option value="">Select Month</option>
                {monthlist.map((item, index) => (
                  <option key={index} value={item.value} disabled={isMonthDisabled(item.value)}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn btn-primary bg-green custom-btn-size" onClick={onsubmitdate}>
            Submit
          </button>
          <button className="btn btn-primary bg-orange custom-btn-size" onClick={handleReset}>
            Reset
          </button>

          {ImportReportBtnRight ? (
            <>
              <Tooltip title="To start the calculation" arrow>
                <button
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  className="btn btn-primary bg-blue custom-btn-size"
                  // AonClick={handleCalculationButton}
                  onClick={handleCalculationBillingDashboard}
                  disabled={isCalculating}
                >
                  <img src={refresh} alt="Notification" width="20" height="20" style={{ display: "inline-block" }} />
                  {isCalculating ? "Calculating" : "Calculate"}
                </button>
              </Tooltip>

              <Tooltip arrow title="Send Notification to IC's">
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  className="btn btn-primary bg-red custom-btn-size"
                  onClick={handleNotificationBillingDashboard}
                >
                  <img src={notification} alt="Notification" width="20" height="20" style={{ display: "inline-block" }} />
                  Notification
                </button>
              </Tooltip>
            </>
          ) : (
            ""
          )}
        </div>

        {isoverlayICPopup === true && (
          <ICTablePopup
            isoverlayICPopup={isoverlayICPopup}
            setIsOverlayICPopup={setIsOverlayICPopup}
            year_Month={year_Month}
            icmailData={icmailData}
            yearMonth={yearMonth}
            setIcMailData={setIcMailData}
            templatePopup={templatePopup}
            setTemplatePopUp={setTemplatePopUp}
            handleIcPopUpclose={handleIcPopUpclose}
          />
        )}
      </div>

      {calcConfirmation && (
        <>
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            sx={{
              "& .MuiPaper-root": {
                transition: "opacity 0.3s ease-in-out",
              },
            }}
          >
            <DialogTitle
              sx={{
                padding: "0px 24px",
                bgcolor: "#075307",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "bold",
                fontFamily: "Quicksand, sans-serif",
                fontSize: "17px",
              }}
            >
              Confirmation
              <IconButton onClick={handleClose} sx={{ color: "white" }}>
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ textAlign: "center", padding: "40px !important" }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: "bold", fontFamily: "Quicksand, sans-serif" }}>
                Do you want to continue and start the calculation?
                <br /> Once started,
                <br />
                This process will take few hours.
              </Typography>
              <Tooltip title="Start the process" arrow>
                <Button
                  onClick={handleCalculationButton}
                  variant="contained"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#d4f3af",
                    color: "black",
                    borderRadius: "10px",
                    px: 8,
                    fontFamily: "Quicksand, sans-serif",
                    mt: 3,
                  }}
                >
                  Yes
                </Button>
              </Tooltip>
              &nbsp; &nbsp;&nbsp;
              <Tooltip title="Cancel the process" arrow>
                <Button
                  onClick={handleCancelCalc}
                  variant="contained"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "#d4f3af",
                    color: "black",
                    borderRadius: "10px",
                    px: 8,
                    fontFamily: "Quicksand, sans-serif",
                    mt: 3,
                  }}
                >
                  No
                </Button>
              </Tooltip>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
