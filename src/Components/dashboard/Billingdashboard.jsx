import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Accordion } from "react-bootstrap";
import "./dashboard.css";
import { PageBar } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { FaUserFriends, FaCalendarAlt, FaPhoneAlt, FaChalkboardTeacher, FaFileExcel, FaInfoCircle } from "react-icons/fa";
import { numberWithCommas, formatYear_MonthName } from "Configration/Utilities/utils";
import * as XLSX from "xlsx";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding } from "../../Components/Modules/Support/ManageTicket/Services/Methods";
import {
  billingAgentDashboardData,
  billingObCallDetailsData,
  billingIbCompanyShareDetailsData,
  billingAgentWorkingDayDetailsData,
  billingSmsCompanyDetailsData,
  billingobcompanyShareDetailsData,
  agentOvertimeDetailsData,
  whatsappdetailsDataAPI,
  getInsuranceCompanyListAPI,
  totalReportSummaryAPI,
  icAgentOvertimeDetailsAPI,
  icAgentWorkingDetailsAPI,
} from "./../../Components/Common/BillingDashboard/Services/Services";
import Breadcrumb from "./Partials/Breadcrumb";
import Secondsection from "./Partials/Secondsection";
import Calculationdetails from "./Partials/Calculationdetails";
import Tabledata from "./Partials/Tabledata";
import Calculationdetailsbootom from "./Partials/Calculationdetailsbootom";
import billinginfo from "./billinginfo";
import Inboundcomponent from "./billingdashboardcomponents/Inboundcomponent";
import Agentscomponent from "./billingdashboardcomponents/Agentscomponent";
import Outboundcomponent from "./billingdashboardcomponents/Outboundcomponent";
import Agentovertimecomponent from "./billingdashboardcomponents/Agentovertimecomponent";
import Textmessagecomponent from "./billingdashboardcomponents/Textmessagecomponent";
import WhatsappComponent from "./billingdashboardcomponents/WhatsappComponent";

const Billingdashboard = () => {
  const { cards, yearlist, monthlist, columns } = billinginfo();
  const [currentdaterange, setCurrentdaterange] = useState({
    from: "",
    to: "",
    ic: "",
  });
  const [monthList] = useState([
    // A { label: "Jan", value: 1 },
    // A { label: "Feb", value: 2 },
    // A { label: "Mar", value: 3 },
    // A { label: "Apr", value: 4 },
    // A { label: "May", value: 5 },
    // A { label: "Jun", value: 6 },
    // A { label: "Jul", value: 7 },
    // A { label: "Aug", value: 8 },
    { label: "Sep", value: 9 },
    { label: "Oct", value: 10 },
    // A { label: "Nov", value: 11 },
    // A { label: "Dec", value: 12 },
  ]);
  const [currentmenu, setCurrentmenu] = useState("");
  const [currentcarddetails, setCurrentcarddetails] = useState({});
  const setAlertMessage = AlertMessage();
  const [activeKey, setActiveKey] = useState("");
  const [activeKeyAgentWorking, setActiveKeyAgentWorking] = useState("");
  const [tempmessagelist, setTempmessagelist] = useState([]);
  const [overtimenewbilling, setOvertimenewbilling] = useState([]);
  const [agentbillingdata, setAgentbillingdata] = useState([]);

  const [yearList, setYearList] = useState([]);

  const [searchFormValues, setSearchFormValues] = useState({
    txtInsuranceCompany: null,
    txtYearFilter: null,
    txtMonthFilter: null,
  });
  const updateSearchFormState = (name, value) => {
    setSearchFormValues({ ...searchFormValues, [name]: value });
  };

  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [insuranceCompanyoptions, setInsuranceCompanyoption] = useState([]);
  const getInsuranceCompanyListData = async () => {
    try {
      setInsuranceCompanyList([]);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "INSURASIGN",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setInsuranceCompanyList(result.response.responseData.masterdatabinding);
        } else {
          setInsuranceCompanyList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const rsetOnClick = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    setSearchFormValues({
      ...searchFormValues,
      txtYearFilter: { label: currentYear.toString(), value: currentYear.toString() },
      txtMonthFilter: { label: monthList[0].label, value: monthList[0].value },
    });
    setheader({
      year: currentYear.toString(),
      month: monthList[0].label,
    });
    setActiveKey("");
    setbillingDashBoardListList([]);
    setbillingDashBoardObICDetailsList([]);
    setbillingDashBoardAgentWorkingDetailsList([]);
    setbillingDashBoardAgentICListList([]);
    setnoOfActiveAgents(0);
    settotalICTotalAmount(0);
    settotalICGSTAmount(0);
    settotalICTotalBillableAmount(0);
    settotalICAgentTotalAmount(0);
    settotalICAgentGSTAmount(0);
    settotalICAgentTotalBillableAmount(0);
    settotalICOBTotalAmount(0);
    settotalICOBGSTAmount(0);
    settotalICOBTotalBillableAmount(0);
    settotalICTxtMsgTotalAmount(0);
    settotalICTxtMsgGSTAmount(0);
    settotalICTxtMsgTotalBillableAmount(0);
    setgrandTotalICIBPercntShare(0);
    setgrandTotalICIBTaggedCalls(0);
    setgrandTotalICIBUnTaggedCalls(0);
    setgrandTotalIBTCAgentPercntShare(0);
    setgrandTotalOBTCPercntShare(0);
    setgrandTotalTextMsgPercntShare(0);
    settotalICAgentTotalAmountOverTime(0);
    settotalICAgentGSTAmountOverTime(0);
    setnoOfWorkingDaysOverTime(0);
    setTotalworking_days_overtime(0);
    setTotalweekly_off__holidays_overtime(0);
    setTotaltotal_no_of_working_days_overtime(0);
    setTotalovertime_hours_overtime(0);
    setbillingDashBoardAgentWorkingOverTimeDetailsList([]);
    setbillingDashBoardAgentOverTimeList([]);
    setbillingDashBoardAgentOverTimeICListList([]);
    setgrandTotalAgentCostOverTime(0);
    setgrandTotalIBTCAgentPercntShareOverTime(0);
    settotalICAgentTotalBillableAmountOverTime(0);
    setIsLoadingBillingDashBoardList(false);
  };

  const [billingDashBoardList, setbillingDashBoardListList] = useState([]);
  const [billingDashBoardAgentOverTimeList, setbillingDashBoardAgentOverTimeList] = useState([]);
  const [billingDashBoardObICDetailsList, setbillingDashBoardObICDetailsList] = useState([]);
  const [billingDashBoardAgentWorkingDetailsList, setbillingDashBoardAgentWorkingDetailsList] = useState([]);
  const [billingDashBoardAgentWorkingOverTimeDetailsList, setbillingDashBoardAgentWorkingOverTimeDetailsList] = useState([]);
  const [noOfActiveAgents, setnoOfActiveAgents] = useState();
  const [billingDashBoardAgentICList, setbillingDashBoardAgentICListList] = useState([]);
  const [billingDashBoardAgentOverTimeICList, setbillingDashBoardAgentOverTimeICListList] = useState([]);
  const [isLoadingBillingDashBoardList, setIsLoadingBillingDashBoardList] = useState(false);
  const [grandTotalICIBPulses, setgrandTotalICIBPulses] = useState(0);
  const [grandTotalICIBPercntShare, setgrandTotalICIBPercntShare] = useState(0);
  const [grandTotalICIBTaggedCalls, setgrandTotalICIBTaggedCalls] = useState(0);
  const [grandTotalICIBUnTaggedCalls, setgrandTotalICIBUnTaggedCalls] = useState(0);
  const [grandTotalAgentCost, setgrandTotalAgentCost] = useState(0);
  const [grandTotalIBTCAgentPercntShare, setgrandTotalIBTCAgentPercntShare] = useState(0);
  const [grandTotalAgentCostOverTime, setgrandTotalAgentCostOverTime] = useState(0);
  const [grandTotalIBTCAgentPercntShareOverTime, setgrandTotalIBTCAgentPercntShareOverTime] = useState(0);
  const [grandTotalOBPulses, setgrandTotalOBPulses] = useState(0);
  const [grandTotalOBTCPercntShare, setgrandTotalOBTCPercntShare] = useState(0);
  const [grandTotalTextMsg, setgrandTotalTextMsg] = useState(0);
  const [grandTotalTextMsgPercntShare, setgrandTotalTextMsgPercntShare] = useState(0);
  const [totalICTotalAmount, settotalICTotalAmount] = useState(0);
  const [totalICGSTAmount, settotalICGSTAmount] = useState(0);
  const [totalICTotalBillableAmount, settotalICTotalBillableAmount] = useState(0);

  const [totalICAgentTotalAmount, settotalICAgentTotalAmount] = useState(0);
  const [totalICAgentGSTAmount, settotalICAgentGSTAmount] = useState(0);
  const [totalICAgentTotalBillableAmount, settotalICAgentTotalBillableAmount] = useState(0);

  const [totalICAgentTotalAmountOverTime, settotalICAgentTotalAmountOverTime] = useState(0);
  const [totalICAgentGSTAmountOverTime, settotalICAgentGSTAmountOverTime] = useState(0);
  const [totalICAgentTotalBillableAmountOverTime, settotalICAgentTotalBillableAmountOverTime] = useState(0);

  const [totalICOBTotalAmount, settotalICOBTotalAmount] = useState(0);
  const [totalICOBGSTAmount, settotalICOBGSTAmount] = useState(0);
  const [totalICOBTotalBillableAmount, settotalICOBTotalBillableAmount] = useState(0);

  const [totalICTxtMsgTotalAmount, settotalICTxtMsgTotalAmount] = useState(0);
  const [totalICTxtMsgGSTAmount, settotalICTxtMsgGSTAmount] = useState(0);
  const [totalICTxtMsgTotalBillableAmount, settotalICTxtMsgTotalBillableAmount] = useState(0);

  const [totalICWhatsappTotalAmount, settotalICWhatsappTotalAmount] = useState(0);
  const [totalICWhatsappGSTAmount, settotalICWhatsappGSTAmount] = useState(0);
  const [totalICWhatsappTotalBillableAmount, settotalICWhatsappTotalBillableAmount] = useState(0);

  const [Totalno_of_working_hours, setTotalno_of_working_hours] = useState(0);
  const [Totalno_of_training_hours, setTotalno_of_training_hours] = useState(0);
  const [Totalworking_days, setTotalworking_days] = useState(0);
  const [Totalweekly_off__holidays, setTotalweekly_off__holidays] = useState(0);
  const [Totaltotal_no_of_working_days, setTotaltotal_no_of_working_days] = useState(0);
  const [Totalovertime_hours, setTotalovertime_hours] = useState(0);

  const [Totalworking_days_overtime, setTotalworking_days_overtime] = useState(0);
  const [Totalweekly_off__holidays_overtime, setTotalweekly_off__holidays_overtime] = useState(0);
  const [Totaltotal_no_of_working_days_overtime, setTotaltotal_no_of_working_days_overtime] = useState(0);
  const [Totalovertime_hours_overtime, setTotalovertime_hours_overtime] = useState(0);

  const [noOfWorkingDays, setnoOfWorkingDays] = useState();
  const [noOfWorkingDaysOverTime, setnoOfWorkingDaysOverTime] = useState();

  const [grandTotalWhatsapp, setgrandTotalWhatsapp] = useState(0);
  const [grandTotalWhatsappPercntShare, setgrandTotalWhatsappPercntShare] = useState(0);
  const [totalbillingsummary, setTotalbillingsummary] = useState({});

  const [total, setTotal] = useState("0.00");
  const [inboundCall, setInboundCall] = useState("0.00");
  const [outboundCall, setOutboundCall] = useState("0.00");
  const [agents, setAgents] = useState("0.00");
  const [agentOvertime, setAgentOvertime] = useState("0.00");
  const [textMessage, setTextMessage] = useState("0.00");
  const [whatsapp, setWhatsapp] = useState("0.00");

  const [icLogo, setIcLogo] = useState("");
  const [insuranceCompanyReport, setInsuranceCompanyReport] = useState("");
  const [yearMonth, setYearMonth] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getbillingAgentDashboardList = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingAgentDashboardData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardListList(result.responseData);

          // A setnoOfActiveAgents(result.responseData[0].active_agent);
          setnoOfWorkingDays(result.responseData[0].total_working_days_in_month);
          getbillingDashBoardAgentICDataList(formattedStartDate, formattedEndDate, result.responseData[0].total_working_days_in_month);
        } else {
          setbillingDashBoardListList([]);
        }
      } else {
        setbillingDashBoardListList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingAgentOverTimeDashboardList = async (formattedStartDate, formattedEndDate) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: currentdaterange.ic
          ? currentdaterange.ic
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingAgentDashboardData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardAgentOverTimeList(result.responseData);
          setIsLoadingBillingDashBoardList(false);
        } else {
          setbillingDashBoardAgentOverTimeList([]);
          setIsLoadingBillingDashBoardList(false);
        }
      } else {
        setbillingDashBoardAgentOverTimeList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingObCallDetailsList = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingObCallDetailsData(formData);
      setIsLoadingBillingDashBoardList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardListList(result.responseData);
          getbillingobcompanyShareDetailsDataList(formattedStartDate, formattedEndDate);
        } else {
          setbillingDashBoardListList([]);
        }
      } else {
        setbillingDashBoardListList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingSmsCompanyDetailsList = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        active_agent: "",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingSmsCompanyDetailsData(formData);
      setIsLoadingBillingDashBoardList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardListList(result.responseData);
          let pTotalTextMsg = 0;
          let pTotalTextMsgPercntShare = 0;
          let ptotalICTxtMsgTotalAmount = 0;
          let ptotalICTxtMsgGSTAmount = 0;
          let ptotalICTxtMsgTotalBillableAmount = 0;
          if (result.responseData[0].length > 0) {
            result.responseData[0].forEach((v) => {
              pTotalTextMsg += parseFloat(v.sms_submission);
              pTotalTextMsgPercntShare += parseFloat(v.perentage_pulses);
              ptotalICTxtMsgTotalAmount += parseFloat(v.total_amount);
              ptotalICTxtMsgGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          setgrandTotalTextMsg(pTotalTextMsg);
          setgrandTotalTextMsgPercntShare(pTotalTextMsgPercntShare);
          settotalICTxtMsgTotalAmount(ptotalICTxtMsgTotalAmount);
          settotalICTxtMsgGSTAmount(ptotalICTxtMsgGSTAmount);
          ptotalICTxtMsgTotalBillableAmount = parseFloat(ptotalICTxtMsgTotalAmount + ptotalICTxtMsgGSTAmount);
          settotalICTxtMsgTotalBillableAmount(ptotalICTxtMsgTotalBillableAmount);
        } else {
          setbillingDashBoardListList([]);
          setIsLoadingBillingDashBoardList(false);
          setAlertMessage({
            type: "error",
            message: result.responseMessage,
          });
        }
      } else {
        setbillingDashBoardListList([]);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const getbillingWhatsappCompanyDetailsList = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        active_agent: "",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const tempresult = await billingSmsCompanyDetailsData(formData);
      if (tempresult.responseCode === 1) {
        setTempmessagelist(tempresult.responseData);
      }
      const result = await whatsappdetailsDataAPI(formData);
      setIsLoadingBillingDashBoardList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardListList(result.responseData);
          let ptotalICTxtMsgTotalAmount = 0;
          let ptotalICTxtMsgGSTAmount = 0;
          let ptotalICTxtMsgTotalBillableAmount = 0;
          let marketingTotal = 0;
          let srvconvQty = 0;
          let utilityQty = 0;
          let marketGsttotal = 0;
          let serviceGsttotal = 0;
          let utilityGsttotal = 0;
          if (result.responseData[0].ic_data.length > 0) {
            result.responseData[0]?.ic_data.forEach((v) => {
              marketGsttotal += parseFloat(v.mkt_conv_with_gst);
              serviceGsttotal += parseFloat(v.srv_conv_with_gst);
              utilityGsttotal += parseFloat(v.util_conv_with_gst);
              marketingTotal += parseFloat(v.mkt_conv_costing);
              srvconvQty += parseFloat(v.srv_conv_costing);
              utilityQty += parseFloat(v.util_conv_costing);
            });
          }
          ptotalICTxtMsgGSTAmount = parseFloat(marketGsttotal + serviceGsttotal + utilityGsttotal);
          settotalICWhatsappGSTAmount(ptotalICTxtMsgGSTAmount);
          ptotalICTxtMsgTotalBillableAmount = parseFloat(marketingTotal + srvconvQty + utilityQty);
          settotalICWhatsappTotalBillableAmount(ptotalICTxtMsgTotalBillableAmount);
        } else {
          setbillingDashBoardListList([]);
          setIsLoadingBillingDashBoardList(false);
          setAlertMessage({
            type: "error",
            message: result.responseMessage,
          });
        }
      } else {
        setbillingDashBoardListList([]);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const getbillingIbCompanyShareDetailsList = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      setIsLoadingBillingDashBoardList(true);
      const formattedYearMonth = `${formattedStartDate.split("-")[0]}-${formattedStartDate.split("-")[1]}`;
      const formData = {
        year_month: formattedYearMonth,
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingIbCompanyShareDetailsData(formData);
      setIsLoadingBillingDashBoardList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardListList(result.responseData);
          let ptotalbillingpulses = 0;
          let ptotalICPercntShare = 0;
          let pTotalICIBTaggedCalls = 0;
          let pTotalICIBUnTaggedCalls = 0;
          let ptotalICTotalAmount = 0;
          let ptotalICGSTAmount = 0;
          let ptotalICTotalBillableAmount = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalbillingpulses += parseFloat(v.total_billing_pulses);
              ptotalICPercntShare += parseFloat(v.percentagePulse);
              pTotalICIBTaggedCalls += parseFloat(v.taged_pulses);
              pTotalICIBUnTaggedCalls += parseFloat(v.untaged_pulses);
              ptotalICTotalAmount += parseFloat(v.total_amount);
              ptotalICGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          setgrandTotalICIBPulses(ptotalbillingpulses);
          setgrandTotalICIBPercntShare(ptotalICPercntShare);
          setgrandTotalICIBTaggedCalls(pTotalICIBTaggedCalls);
          setgrandTotalICIBUnTaggedCalls(pTotalICIBUnTaggedCalls);
          settotalICTotalAmount(ptotalICTotalAmount);
          settotalICGSTAmount(ptotalICGSTAmount);
          ptotalICTotalBillableAmount = parseFloat(ptotalICTotalAmount + ptotalICGSTAmount);
          settotalICTotalBillableAmount(ptotalICTotalBillableAmount);
        } else {
          setbillingDashBoardListList([]);
          setIsLoadingBillingDashBoardList(false);
          setAlertMessage({
            type: "error",
            message: result.responseMessage,
          });
        }
      } else {
        setbillingDashBoardListList([]);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingAgentWorkingDayDetailsDataList = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      setbillingDashBoardAgentWorkingDetailsList([]);
      // A setTotalno_of_working_hours(0);
      // A setTotalno_of_training_hours(0);
      setTotalworking_days(0);
      setTotalweekly_off__holidays(0);
      setTotaltotal_no_of_working_days(0);
      setTotalovertime_hours(0);
      const formData = {
        active_agent: "0",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingAgentWorkingDayDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardAgentWorkingDetailsList(result.responseData);
          // A let pTotalno_of_working_hours = 0;
          // A let pTotalno_of_training_hours = 0;
          let pTotalworking_days = 0;
          let pTotalweekly_off__holidays = 0;
          let pTotaltotal_no_of_working_days = 0;
          let pTotalovertime_hours = 0;
          result.responseData.forEach((v) => {
            // A pTotalno_of_working_hours += parseFloat(v.no_of_working_hours);
            // A pTotalno_of_training_hours += parseFloat(v.no_of_training_hours);
            pTotalworking_days += parseFloat(v.working_days);
            pTotalweekly_off__holidays += parseFloat(v.holidays && v.holidays.total_holidays ? v.holidays.total_holidays : 0);
            pTotaltotal_no_of_working_days += parseFloat(v.total_working_days);
            pTotalovertime_hours += parseFloat(v.overtime_hours);
          });
          // A setTotalno_of_working_hours(pTotalno_of_working_hours);
          // A setTotalno_of_training_hours(pTotalno_of_training_hours);
          setTotalworking_days(pTotalworking_days);
          setTotalweekly_off__holidays(pTotalweekly_off__holidays);
          setTotaltotal_no_of_working_days(pTotaltotal_no_of_working_days);
          setTotalovertime_hours(pTotalovertime_hours);
        } else {
          setbillingDashBoardAgentWorkingDetailsList([]);
          // A setTotalno_of_working_hours(0);
          // A setTotalno_of_training_hours(0);
          setTotalworking_days(0);
          setTotalweekly_off__holidays(0);
          setTotaltotal_no_of_working_days(0);
          setTotalovertime_hours(0);
        }
      } else {
        setbillingDashBoardAgentWorkingDetailsList([]);
        // A setTotalno_of_working_hours(0);
        // A setTotalno_of_training_hours(0);
        setTotalworking_days(0);
        setTotalweekly_off__holidays(0);
        setTotaltotal_no_of_working_days(0);
        setTotalovertime_hours(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingAgentWorkingOverTimeDetailsDataList = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      setbillingDashBoardAgentWorkingOverTimeDetailsList([]);
      setTotalworking_days_overtime(0);
      setTotalweekly_off__holidays_overtime(0);
      setTotaltotal_no_of_working_days_overtime(0);
      setTotalovertime_hours_overtime(0);
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        active_agent: "0",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: currentdaterange?.ic
          ? currentdaterange?.ic
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };

      const result = await agentOvertimeDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.agents.length > 0) {
          setbillingDashBoardAgentWorkingOverTimeDetailsList(result.responseData.agents);
          let pTotalworking_days_overtime = 0;
          let pTotalweekly_off__holidays_overtime = 0;
          let pTotaltotal_no_of_working_days_overtime = 0;
          let pTotalovertime_hours_overtime = 0;
          result.responseData.agents.forEach((v) => {
            pTotalworking_days_overtime += parseFloat(v.working_days);
            pTotalweekly_off__holidays_overtime += parseFloat(v.holidays && v.holidays.total_holidays ? v.holidays.total_holidays : 0);
            pTotaltotal_no_of_working_days_overtime += parseFloat(v.total_working_days);
            pTotalovertime_hours_overtime += parseFloat(v.overtime_hours);
          });
          setTotalworking_days_overtime(pTotalworking_days_overtime);
          setTotalweekly_off__holidays_overtime(pTotalweekly_off__holidays_overtime);
          setTotaltotal_no_of_working_days_overtime(pTotaltotal_no_of_working_days_overtime);
          setTotalovertime_hours_overtime(pTotalovertime_hours_overtime);
          setnoOfWorkingDaysOverTime(result.responseData.total_overtime_hour);
          getbillingDashBoardAgentOverTimeICDataList(formattedStartDate, formattedEndDate, result.responseData.total_overtime_hour);
        } else {
          setbillingDashBoardAgentWorkingOverTimeDetailsList([]);
          setTotalworking_days_overtime(0);
          setTotalweekly_off__holidays_overtime(0);
          setTotaltotal_no_of_working_days_overtime(0);
          setTotalovertime_hours_overtime(0);
        }
      } else {
        setbillingDashBoardAgentWorkingOverTimeDetailsList([]);
        setTotalworking_days_overtime(0);
        setTotalweekly_off__holidays_overtime(0);
        setTotaltotal_no_of_working_days_overtime(0);
        setTotalovertime_hours_overtime(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [untaggedData, setUntaggedData] = useState(0);
  const [obBillableData, setObBillableData] = useState(0);

  const getbillingobcompanyShareDetailsDataList = async (formattedStartDate, formattedEndDate) => {
    try {
      setbillingDashBoardObICDetailsList([]);
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: currentdaterange?.ic
          ? currentdaterange?.ic
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingobcompanyShareDetailsData(formData);
      setIsLoadingBillingDashBoardList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardObICDetailsList(result.responseData);
          console.log("Data2:", result.responseData);
          setUntaggedData(
            result.responseData &&
              result.responseData.length > 0 &&
              result.responseData[0].ic_data &&
              result.responseData[0].ic_data.length > 0 &&
              result.responseData[0].ic_data[0].total_untagged_pulses
              ? result.responseData[0].ic_data[0].total_untagged_pulses
              : 0,
          );
          setObBillableData(
            result.responseData &&
              result.responseData.length > 0 &&
              result.responseData[0].ic_data &&
              result.responseData[0].ic_data.length > 0 &&
              result.responseData[0].ic_data[0].total_pulses
              ? result.responseData[0].ic_data[0].total_pulses
              : 0,
          );
          let pTotalOBPulses = 0;
          let pTotalOBTCPercntShare = 0;
          let ptotalICOBTotalAmount = 0;
          let ptotalICOBGSTAmount = 0;
          let ptotalICOBTotalBillableAmount = 0;
          if (result.responseData[0].ic_data.length > 0) {
            result.responseData[0].ic_data.forEach((v) => {
              pTotalOBPulses += parseFloat(v.total_pulses);
              pTotalOBTCPercntShare += parseFloat(v.tagged_pulse_percentage);
              ptotalICOBTotalAmount += parseFloat(v.total_amount);
              ptotalICOBGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          setgrandTotalOBPulses(pTotalOBPulses);
          setgrandTotalOBTCPercntShare(pTotalOBTCPercntShare);
          settotalICOBTotalAmount(ptotalICOBTotalAmount);
          settotalICOBGSTAmount(ptotalICOBGSTAmount);
          ptotalICOBTotalBillableAmount = parseFloat(ptotalICOBTotalAmount + ptotalICOBGSTAmount);
          settotalICOBTotalBillableAmount(ptotalICOBTotalBillableAmount);
        } else {
          setbillingDashBoardObICDetailsList([]);
        }
      } else {
        setbillingDashBoardObICDetailsList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingDashBoardAgentICDataList = async (formattedStartDate, formattedEndDate, pnoOfWorkingDays) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: currentdaterange?.ic
          ? currentdaterange?.ic
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingIbCompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardAgentICListList(result.responseData);
          // A let ptotalAgentCost = 0;
          let ptotalShareOfWorkingDays = 0;
          let ptotalIBTCAgentPercntShare = 0;
          let ptotalICAgentTotalAmount = 0;
          let ptotalICAgentGSTAmount = 0;
          let ptotalICAgentTotalBillableAmount = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalShareOfWorkingDays += parseFloat(parseFloat(v.percentagePulse * pnoOfWorkingDays) / 100);
              ptotalIBTCAgentPercntShare += parseFloat(v.percentagePulse);
            });
          }
          const totalDaysInMonth = daysInMonth(searchFormValues.txtMonthFilter.value, searchFormValues.txtYearFilter.value);
          ptotalICAgentTotalAmount = parseFloat(parseFloat(ptotalShareOfWorkingDays * 31000)) / totalDaysInMonth;
          ptotalICAgentGSTAmount = parseFloat((parseFloat(ptotalICAgentTotalAmount) * 87) / 100);

          setgrandTotalAgentCost(ptotalShareOfWorkingDays);
          setgrandTotalIBTCAgentPercntShare(ptotalIBTCAgentPercntShare);
          settotalICAgentTotalAmount(ptotalICAgentTotalAmount);
          settotalICAgentGSTAmount(ptotalICAgentGSTAmount);
          ptotalICAgentTotalBillableAmount = parseFloat(ptotalICAgentTotalAmount + ptotalICAgentGSTAmount);
          settotalICAgentTotalBillableAmount(ptotalICAgentTotalBillableAmount);
        } else {
          setbillingDashBoardAgentICListList([]);
        }
      } else {
        setbillingDashBoardObICDetailsList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
      setIsLoadingBillingDashBoardList(false);
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingDashBoardAgentOverTimeICDataList = async (formattedStartDate, formattedEndDate, pnoOfWorkingOverTime) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: currentdaterange?.ic
          ? currentdaterange?.ic
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingIbCompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          setbillingDashBoardAgentOverTimeICListList(result.responseData);

          // A let ptotalAgentCost = 0;
          let ptotalShareOfWorkingDaysOverTime = 0;
          let ptotalIBTCAgentPercntShareOverTime = 0;
          let ptotalICAgentTotalAmountOverTime = 0;
          let ptotalICAgentGSTAmountOverTime = 0;
          let ptotalICAgentTotalBillableAmountOverTime = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalShareOfWorkingDaysOverTime += parseFloat(parseFloat(v.percentagePulse * pnoOfWorkingOverTime) / 100);
              ptotalIBTCAgentPercntShareOverTime += parseFloat(v.percentagePulse);
            });
          }
          const totalDaysInMonth = daysInMonth(searchFormValues.txtMonthFilter.value, searchFormValues.txtYearFilter.value);
          ptotalICAgentTotalAmountOverTime = parseFloat(parseFloat(parseFloat(parseFloat(pnoOfWorkingOverTime * 31000)) / totalDaysInMonth / 8) * 2);
          ptotalICAgentGSTAmountOverTime = parseFloat((parseFloat(ptotalICAgentTotalAmountOverTime) * 11) / 100);

          setgrandTotalAgentCostOverTime(ptotalShareOfWorkingDaysOverTime);
          setgrandTotalIBTCAgentPercntShareOverTime(ptotalIBTCAgentPercntShareOverTime);
          settotalICAgentTotalAmountOverTime(ptotalICAgentTotalAmountOverTime);
          settotalICAgentGSTAmountOverTime(ptotalICAgentGSTAmountOverTime);
          ptotalICAgentTotalBillableAmountOverTime = parseFloat(ptotalICAgentTotalAmountOverTime + ptotalICAgentGSTAmountOverTime);
          settotalICAgentTotalBillableAmountOverTime(ptotalICAgentTotalBillableAmountOverTime);
          getbillingAgentOverTimeDashboardList(formattedStartDate, formattedEndDate);
        } else {
          setbillingDashBoardAgentOverTimeICListList([]);
        }
      } else {
        setbillingDashBoardAgentOverTimeICListList([]);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingIbCompanyShareDetailsForSummary = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      settotalICTotalAmount(0);
      settotalICGSTAmount(0);
      settotalICTotalBillableAmount(0);
      setIsLoadingBillingDashBoardList(true);
      const result = await billingIbCompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          let ptotalICTotalAmount = 0;
          let ptotalICGSTAmount = 0;
          let ptotalICTotalBillableAmount = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalICTotalAmount += parseFloat(v.total_amount);
              ptotalICGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          settotalICTotalAmount(ptotalICTotalAmount);
          settotalICGSTAmount(ptotalICGSTAmount);
          ptotalICTotalBillableAmount = parseFloat(ptotalICTotalAmount + ptotalICGSTAmount);
          settotalICTotalBillableAmount(ptotalICTotalBillableAmount);
        } else {
          settotalICTotalAmount(0);
          settotalICGSTAmount(0);
          settotalICTotalBillableAmount(0);
        }
      } else {
        settotalICTotalAmount(0);
        settotalICGSTAmount(0);
        settotalICTotalBillableAmount(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const getbillingAgentDashboardForSummary = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingAgentDashboardData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          getbillingDashBoardAgentICDataForSummary(formattedStartDate, formattedEndDate, result.responseData[0].total_working_days_in_month);
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingDashBoardAgentICDataForSummary = async (formattedStartDate, formattedEndDate, pnoOfWorkingDays) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: currentdaterange?.ic
          ? currentdaterange?.ic
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      settotalICAgentTotalAmount(0);
      settotalICAgentGSTAmount(0);
      settotalICAgentTotalBillableAmount(0);
      const result = await billingIbCompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          // A let ptotalAgentCost = 0;
          let ptotalShareOfWorkingDays = 0;
          let ptotalIBTCAgentPercntShare = 0;
          let ptotalICAgentTotalAmount = 0;
          let ptotalICAgentGSTAmount = 0;
          let ptotalICAgentTotalBillableAmount = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalShareOfWorkingDays += parseFloat(parseFloat(v.percentagePulse * pnoOfWorkingDays) / 100);
            });
          }
          const totalDaysInMonth = daysInMonth(searchFormValues.txtMonthFilter.value, searchFormValues.txtYearFilter.value);
          ptotalICAgentTotalAmount = parseFloat(parseFloat(ptotalShareOfWorkingDays * 31000)) / totalDaysInMonth;
          ptotalICAgentGSTAmount = parseFloat((parseFloat(ptotalICAgentTotalAmount) * 18) / 100);
          settotalICAgentTotalAmount(ptotalICAgentTotalAmount);
          settotalICAgentGSTAmount(ptotalICAgentGSTAmount);
          ptotalICAgentTotalBillableAmount = parseFloat(ptotalICAgentTotalAmount + ptotalICAgentGSTAmount);
          settotalICAgentTotalBillableAmount(ptotalICAgentTotalBillableAmount);
        } else {
          settotalICAgentTotalAmount(0);
          settotalICAgentGSTAmount(0);
          settotalICAgentTotalBillableAmount(0);
        }
      } else {
        settotalICAgentTotalAmount(0);
        settotalICAgentGSTAmount(0);
        settotalICAgentTotalBillableAmount(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingObCallDetailsForSummary = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      settotalICOBTotalAmount(0);
      settotalICOBGSTAmount(0);
      settotalICOBTotalBillableAmount(0);
      const result = await billingobcompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          let ptotalICOBTotalAmount = 0;
          let ptotalICOBGSTAmount = 0;
          let ptotalICOBTotalBillableAmount = 0;
          if (result.responseData[0].ic_data.length > 0) {
            result.responseData[0].ic_data.forEach((v) => {
              ptotalICOBTotalAmount += parseFloat(v.total_amount);
              ptotalICOBGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          settotalICOBTotalAmount(ptotalICOBTotalAmount);
          settotalICOBGSTAmount(ptotalICOBGSTAmount);
          ptotalICOBTotalBillableAmount = parseFloat(ptotalICOBTotalAmount + ptotalICOBGSTAmount);
          settotalICOBTotalBillableAmount(ptotalICOBTotalBillableAmount);
        } else {
          settotalICOBTotalAmount(0);
          settotalICOBGSTAmount(0);
          settotalICOBTotalBillableAmount(0);
        }
      } else {
        settotalICOBTotalAmount(0);
        settotalICOBGSTAmount(0);
        settotalICOBTotalBillableAmount(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingSmsCompanyDetailsSummary = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      const formData = {
        active_agent: "",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      settotalICTxtMsgTotalAmount(0);
      settotalICTxtMsgGSTAmount(0);
      settotalICTxtMsgTotalBillableAmount(0);
      const result = await billingSmsCompanyDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          let ptotalICTxtMsgTotalAmount = 0;
          let ptotalICTxtMsgGSTAmount = 0;
          let ptotalICTxtMsgTotalBillableAmount = 0;
          if (result.responseData[0].length > 0) {
            result.responseData[0].forEach((v) => {
              ptotalICTxtMsgTotalAmount += parseFloat(v.total_amount);
              ptotalICTxtMsgGSTAmount += parseFloat((parseFloat(v.total_amount) * 18) / 100);
            });
          }
          settotalICTxtMsgTotalAmount(ptotalICTxtMsgTotalAmount);
          settotalICTxtMsgGSTAmount(ptotalICTxtMsgGSTAmount);
          ptotalICTxtMsgTotalBillableAmount = parseFloat(ptotalICTxtMsgTotalAmount + ptotalICTxtMsgGSTAmount);
          settotalICTxtMsgTotalBillableAmount(ptotalICTxtMsgTotalBillableAmount);
        } else {
          settotalICTxtMsgTotalAmount(0);
          settotalICTxtMsgGSTAmount(0);
          settotalICTxtMsgTotalBillableAmount(0);
        }
      } else {
        settotalICTxtMsgTotalAmount(0);
        settotalICTxtMsgGSTAmount(0);
        settotalICTxtMsgTotalBillableAmount(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
      setIsLoadingBillingDashBoardList(false);
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const getbillingWhatsappDetailsSummary = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      const formData = {
        active_agent: "",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: companylist
          ? companylist
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      settotalICWhatsappTotalAmount(0);
      settotalICWhatsappGSTAmount(0);
      settotalICWhatsappTotalBillableAmount(0);
      const result = await whatsappdetailsDataAPI(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          let ptotalICTxtMsgTotalAmount = 0;
          let ptotalICTxtMsgGSTAmount = 0;
          let ptotalICTxtMsgTotalBillableAmount = 0;
          let marketingTotal = 0;
          let srvconvQty = 0;
          let utilityQty = 0;
          let marketGsttotal = 0;
          let serviceGsttotal = 0;
          let utilityGsttotal = 0;
          if (result.responseData[0].ic_data.length > 0) {
            result.responseData[0]?.ic_data.forEach((v) => {
              marketGsttotal += parseFloat(v.mkt_conv_with_gst);
              serviceGsttotal += parseFloat(v.srv_conv_with_gst);
              utilityGsttotal += parseFloat(v.util_conv_with_gst);
              marketingTotal += parseFloat(v.mkt_conv_costing);
              srvconvQty += parseFloat(v.srv_conv_costing);
              utilityQty += parseFloat(v.util_conv_costing);
            });
          }
          ptotalICTxtMsgGSTAmount = parseFloat(marketGsttotal + serviceGsttotal + utilityGsttotal);
          settotalICWhatsappGSTAmount(ptotalICTxtMsgGSTAmount);
          ptotalICTxtMsgTotalBillableAmount = parseFloat(marketingTotal + srvconvQty + utilityQty);
          settotalICWhatsappTotalBillableAmount(ptotalICTxtMsgTotalBillableAmount);
        } else {
          settotalICWhatsappTotalAmount(0);
          settotalICWhatsappGSTAmount(0);
          settotalICWhatsappTotalBillableAmount(0);
        }
      } else {
        settotalICWhatsappTotalAmount(0);
        settotalICWhatsappGSTAmount(0);
        settotalICWhatsappTotalBillableAmount(0);
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
      setIsLoadingBillingDashBoardList(false);
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingAgentWorkingOverTimeDetailsDataListForSummary = async (formattedStartDate, formattedEndDate, companylist) => {
    try {
      setIsLoadingBillingDashBoardList(true);
      const formData = {
        active_agent: "0",
        from: formattedStartDate,
        to: formattedEndDate,
        ic: currentdaterange?.ic
          ? currentdaterange?.ic
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await agentOvertimeDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.agents.length > 0) {
          getbillingDashBoardAgentOverTimeICDataListForSummary(formattedStartDate, formattedEndDate, result.responseData.total_overtime_hour);
        }
      } else {
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getbillingDashBoardAgentOverTimeICDataListForSummary = async (formattedStartDate, formattedEndDate, pnoOfWorkingOverTime) => {
    try {
      const formData = {
        from: formattedStartDate,
        to: formattedEndDate,
        ic: currentdaterange.ic
          ? currentdaterange.ic
          : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
            ? insuranceCompanyList[0].CompanyName
            : "",
      };
      const result = await billingIbCompanyShareDetailsData(formData);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          let ptotalShareOfWorkingDaysOverTime = 0;
          let ptotalICAgentTotalAmountOverTime = 0;
          let ptotalICAgentGSTAmountOverTime = 0;
          let ptotalICAgentTotalBillableAmountOverTime = 0;
          if (result.responseData[0].IC_data.length > 0) {
            result.responseData[0].IC_data.forEach((v) => {
              ptotalShareOfWorkingDaysOverTime += parseFloat(parseFloat(v.percentagePulse * pnoOfWorkingOverTime) / 100);
            });
          }
          const totalDaysInMonth = daysInMonth(searchFormValues.txtMonthFilter.value, searchFormValues.txtYearFilter.value);
          ptotalICAgentTotalAmountOverTime = parseFloat(parseFloat(parseFloat(parseFloat(pnoOfWorkingOverTime * 31000)) / totalDaysInMonth / 8) * 2);
          ptotalICAgentGSTAmountOverTime = parseFloat((parseFloat(ptotalICAgentTotalAmountOverTime) * 18) / 100);

          setgrandTotalAgentCostOverTime(ptotalShareOfWorkingDaysOverTime);
          settotalICAgentTotalAmountOverTime(ptotalICAgentTotalAmountOverTime);
          settotalICAgentGSTAmountOverTime(ptotalICAgentGSTAmountOverTime);
          ptotalICAgentTotalBillableAmountOverTime = parseFloat(ptotalICAgentTotalAmountOverTime + ptotalICAgentGSTAmountOverTime);
          settotalICAgentTotalBillableAmountOverTime(ptotalICAgentTotalBillableAmountOverTime);
        }
      } else {
        setIsLoadingBillingDashBoardList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getagentbillingfunc = async (formattedStartDate, formattedEndDate, companylist) => {
    const formData = {
      active_agent: "",
      from: formattedStartDate,
      to: formattedEndDate,
      ic: companylist
        ? companylist
        : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
          ? insuranceCompanyList[0].CompanyName
          : "",
    };
    const tempresult = await icAgentWorkingDetailsAPI(formData);
    if (tempresult.responseCode == 1) {
      setAgentbillingdata(tempresult.responseData);
    } else {
      setAgentbillingdata({});
    }
  };

  const getovertimebillingdata = async (formattedStartDate, formattedEndDate, companylist) => {
    const formData = {
      active_agent: "",
      from: formattedStartDate,
      to: formattedEndDate,
      ic: companylist
        ? companylist
        : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
          ? insuranceCompanyList[0].CompanyName
          : "",
    };
    const tempresult = await icAgentOvertimeDetailsAPI(formData);
    if (tempresult.responseData) {
      setOvertimenewbilling(tempresult.responseData);
    } else {
      setOvertimenewbilling({});
    }
  };

  const getallreportsummary = async (formattedStartDate, formattedEndDate, companylist) => {
    const formattedYearMonth = `${formattedStartDate.split("-")[0]}-${formattedStartDate.split("-")[1]}`;

    const formData = {
      year_month: formattedYearMonth,
      active_agent: "",
      from: formattedStartDate,
      to: formattedEndDate,
      ic: companylist
        ? companylist
        : insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1
          ? insuranceCompanyList[0].CompanyName
          : "",
    };
    setIcLogo(formData.ic);
    setYearMonth(formData.year_month);
    setInsuranceCompanyReport(formData.ic);
    setFromDate(formData.from);
    setToDate(formData.to);
    const tempresult = await totalReportSummaryAPI(formData);
    if (tempresult.responseCode === 1) {
      if (tempresult.responseData && tempresult.responseData.length > 0) {
        setTotalbillingsummary(tempresult.responseData[0]);
        /*   AsetInboundCall(tempresult.responseData[0].inbound_call_cost);
        setOutboundCall(tempresult.responseData[0].outbound_call_cost);
        setAgents(tempresult.responseData[0].agent_working_cost);
        setAgentOvertime(tempresult.responseData[0].agent_overtime_cost);
        setTextMessage(tempresult.responseData[0].sms_costing);
        setWhatsapp(tempresult.responseData[0].whatsapp_gupsup_cost); */
      }
    } else {
      setTotalbillingsummary({});
    }
  };

  const OnClickTabDashBoard = (pType) => {
    setCurrentmenu(pType);
    if (pType === "SMDTLS") {
      setActiveKey(pType);
      settotalICTotalAmount(0);
      settotalICGSTAmount(0);
      settotalICTotalBillableAmount(0);
      settotalICAgentTotalAmount(0);
      settotalICAgentGSTAmount(0);
      settotalICAgentTotalBillableAmount(0);
      settotalICAgentTotalAmountOverTime(0);
      settotalICAgentGSTAmountOverTime(0);
      settotalICAgentTotalBillableAmountOverTime(0);
      settotalICOBTotalAmount(0);
      settotalICOBGSTAmount(0);
      settotalICOBTotalBillableAmount(0);
      settotalICTxtMsgTotalAmount(0);
      settotalICTxtMsgGSTAmount(0);
      settotalICTxtMsgTotalBillableAmount(0);
      getallreportsummary(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);

      // A getbillingIbCompanyShareDetailsForSummary(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      //  A getbillingAgentDashboardForSummary(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      // A getbillingAgentWorkingOverTimeDetailsDataListForSummary(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      // A getbillingSmsCompanyDetailsSummary(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      // A getbillingWhatsappDetailsSummary(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      // A getbillingObCallDetailsForSummary(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
    } else if (pType === "INBNDCL") {
      setgrandTotalICIBPulses(0);
      settotalICTotalAmount(0);
      settotalICGSTAmount(0);
      settotalICTotalBillableAmount(0);
      setbillingDashBoardListList([]);
      getbillingIbCompanyShareDetailsList(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      setActiveKey(pType);
    } else if (pType === "AGNT") {
      setbillingDashBoardListList([]);
      setbillingDashBoardAgentICListList([]);
      setgrandTotalAgentCost(0);
      settotalICAgentTotalAmount(0);
      settotalICAgentGSTAmount(0);
      settotalICAgentTotalBillableAmount(0);
      getbillingAgentDashboardList(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      getbillingAgentWorkingDayDetailsDataList(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      getagentbillingfunc(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      setActiveKey(pType);
    } else if (pType === "AGNTOVRTM") {
      setbillingDashBoardAgentICListList([]);
      setgrandTotalAgentCostOverTime(0);
      settotalICAgentTotalAmountOverTime(0);
      settotalICAgentGSTAmountOverTime(0);
      settotalICAgentTotalBillableAmountOverTime(0);
      getbillingAgentWorkingOverTimeDetailsDataList(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      getovertimebillingdata(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
      setActiveKey(pType);
    } else if (pType === "OTBNDCL") {
      setActiveKey(pType);
      setbillingDashBoardListList([]);
      setgrandTotalOBPulses(0);
      settotalICOBTotalAmount(0);
      settotalICOBGSTAmount(0);
      settotalICOBTotalBillableAmount(0);
      getbillingObCallDetailsList(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
    } else if (pType === "TXTMSG") {
      setActiveKey(pType);
      setgrandTotalTextMsg(0);
      settotalICTxtMsgTotalAmount(0);
      settotalICTxtMsgGSTAmount(0);
      settotalICTxtMsgTotalBillableAmount(0);
      setbillingDashBoardListList([]);
      getbillingSmsCompanyDetailsList(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
    } else if (pType === "WHAPP") {
      setActiveKey(pType);
      setgrandTotalWhatsapp(0);
      settotalICWhatsappTotalAmount(0);
      settotalICWhatsappGSTAmount(0);
      settotalICWhatsappTotalBillableAmount(0);
      setbillingDashBoardListList([]);
      getbillingWhatsappCompanyDetailsList(currentdaterange?.from, currentdaterange?.to, currentdaterange?.ic);
    } else if (pType === "AIBT") {
      setActiveKey(pType);
    }
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const formattedYear_MonthName = formatYear_MonthName(yearMonth);

  const OnClickExcelDataDownlaod = (pType) => {
    if (pType === "INBNDCL") {
      InBoundCallsDataArrangeAndDownload();
    } else if (pType === "OTBNDCL") {
      OutBoundCallsDataArrangeAndDownload();
    } else if (pType === "TXTMSG") {
      TextMessageCallsDataArrangeAndDownload();
    } else if (pType === "AGNT") {
      AgentsDataArrangeAndDownload();
    } else if (pType === "AGNTOVRTM") {
      AgentsOverTimeDataArrangeAndDownload();
    } else if (pType === "WHAPP") {
      whatsappdataDataArrangeAndDownload();
    }
  };
  const InBoundCallsDataArrangeAndDownload = () => {
    const columnOrderTaggedUntagged = {
      total_matched_with_ticket: "Tagging With Tickets",
      total_matched_without_ticket: "Tagging Without Tickets",
      total_unmatched_pulses: "Total Untagged Calls",
    };
    const mappedDataTaggedUntagged = billingDashBoardList.map((value) => {
      return {
        total_matched_with_ticket: value.total_matched_with_ticket,
        total_matched_without_ticket: value.total_matched_without_ticket,
        total_unmatched_pulses: value.total_unmatched_pulses,
      };
    });
    const rearrangedDataTaggedUntagged = rearrangeAndRenameColumns(mappedDataTaggedUntagged, columnOrderTaggedUntagged);

    const columnOrderInboundICDetails = {
      srn: "Sr. No.",
      _id: "IC name",
      taged_pulses: "Sum of call_pulse",
      percentagePulse: "% of Call Pulse ",
      untaged_pulses: "#N/A Call Pulse distribution",
      total_billing_pulses: "Total Billing Pulse",
      rate: "Rate (Rs 1.25/Pulse)",
      total_amount: "Total Amount(Rs)",
      gst: "GST (18%)",
      grant_total: "Grand Total Amount(Rs)",
    };
    const mappedDataInboundICDetails = billingDashBoardList[0].IC_data.map((value, index) => {
      return {
        srn: index + 1,
        _id: value._id,
        taged_pulses: value.taged_pulses ? parseFloat(value.taged_pulses).toFixed(2) : 0.0,
        percentagePulse: value.percentagePulse ? parseFloat(value.percentagePulse).toFixed(2) : 0.0,
        untaged_pulses: value.untaged_pulses ? parseFloat(value.untaged_pulses).toFixed(2) : 0.0,
        total_billing_pulses: value.total_billing_pulses ? parseFloat(value.total_billing_pulses).toFixed(2) : 0.0,
        rate: 1.25,
        total_amount: value.total_amount ? parseFloat(value.total_amount).toFixed(2) : 0.0,
        gst: value.total_amount ? (parseFloat(value.total_amount) * 0.18).toFixed(2) : "0.00",
        grant_total: value.grand_total_amount ? parseFloat(value.grand_total_amount).toFixed(2) : 0.0,
      };
    });
    const grandTotalRow = {
      srn: "",
      _id: "Grand Total",
      taged_pulses: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.taged_pulses || 0), 0).toFixed(2),
      percentagePulse: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.percentagePulse || 0), 0).toFixed(2),
      untaged_pulses: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.untaged_pulses || 0), 0).toFixed(2),
      total_billing_pulses: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.total_billing_pulses || 0), 0).toFixed(2),
      rate: "1.25",
      total_amount: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.total_amount || 0), 0).toFixed(2),
      gst: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.gst || 0), 0).toFixed(2),
      grant_total: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.grant_total || 0), 0).toFixed(2),
    };

    mappedDataInboundICDetails.push(grandTotalRow);
    const rearrangedDataInboundICDetails = rearrangeAndRenameColumns(mappedDataInboundICDetails, columnOrderInboundICDetails);

    downloadExcelInbound(rearrangedDataInboundICDetails, rearrangedDataTaggedUntagged);
  };

  const downloadExcelInbound = (dataTaggedUntagged, dataInboundICDetails) => {
    const worksheetTaggedUntagged = XLSX.utils.json_to_sheet(dataTaggedUntagged);
    const worksheetInboundICDetails = XLSX.utils.json_to_sheet(dataInboundICDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetTaggedUntagged, "Sheet1");
    XLSX.utils.book_append_sheet(workbook, worksheetInboundICDetails, "Sheet2");
    worksheetTaggedUntagged["!cols"] = [{ width: 30 }, { width: 30 }, { width: 30 }];
    worksheetInboundICDetails["!cols"] = [{ width: 55 }, { width: 40 }, { width: 20 }, { width: 32 }, { width: 20 }];
    XLSX.writeFile(
      workbook,
      `Inbound_Call_Details_${formattedYear_MonthName ? formattedYear_MonthName : "year_month"}_${currentdaterange?.ic ? currentdaterange?.ic : "AllData"}.xlsx`,
    );
  };

  const OutBoundCallsDataArrangeAndDownload = () => {
    const columnOrderCountAgentAndOutboundCalls = {
      // AtotalDistinctAgents: "No. Of Active Agents",
      totalCalls: "No. Of Outbound Calls",
      totalCustPulse: "Total OB Billable Pulses",
    };
    const mappedDataCountAgentAndOutboundCalls = (billingDashBoardList || []).map((value) => {
      return {
        totalDistinctAgents: value?.totalDistinctAgents || 0,
        totalCalls: value?.totalCalls || 0,
        totalCustPulse: value?.totalCustPulse || 0,
      };
    });

    const rearrangedDataCountAgentAndOutboundCalls = rearrangeAndRenameColumns(mappedDataCountAgentAndOutboundCalls, columnOrderCountAgentAndOutboundCalls);

    const columnOrderOutboundICDetails = {
      srn: "Sr. No.",
      _id: "IC name",
      taged_pulses: "Sum of call_pulse",
      percentagePulse: "% of Call Pulse ",
      untaged_pulses: "#N/A Call Pulse distribution",
      total_billing_pulses: "Outbound total Billing Pulses",
      rate: "Rate (Rs 1.25/Pulse)",
      total_amount: "Total Amount(Rs)",
      gst: "GST (18%)",
      grant_total: "Grand Total Amount(Rs)",
    };
    const mappedDataOutboundICDetails = (billingDashBoardObICDetailsList[0]?.ic_data || []).map((value, index) => {
      console.log("Data4", value.total_untagged_pulses ? parseFloat(value.total_untagged_pulses).toFixed(2) : 0.0);

      return {
        srn: index + 1,
        _id: value._id,
        taged_pulses: value.total_tagged_pulses ? parseFloat(value.total_tagged_pulses).toFixed(2) : 0.0,
        percentagePulse: value.tagged_pulse_percentage ? parseFloat(value.tagged_pulse_percentage).toFixed(2) : 0.0,
        untaged_pulses: value.total_untagged_pulses ? parseFloat(value.total_untagged_pulses).toFixed(2) : 0.0,
        total_billing_pulses: value.total_pulses ? parseFloat(value.total_pulses).toFixed(2) : 0.0,
        rate: 1.25,
        total_amount: value.total_amount ? parseFloat(value.total_amount).toFixed(2) : 0.0,
        gst: value.gst ? value.gst.toFixed(2) : "0.00",
        grant_total: value.grant_total ? parseFloat(value.grant_total).toFixed(2) : 0.0,
      };
    });
    const grandTotalRow = {
      srn: "",
      _id: "Grand Total",
      taged_pulses: mappedDataOutboundICDetails.reduce((sum, row) => sum + parseFloat(row.taged_pulses || 0), 0).toFixed(2),
      percentagePulse: mappedDataOutboundICDetails.reduce((sum, row) => sum + parseFloat(row.percentagePulse || 0), 0).toFixed(2),
      untaged_pulses: mappedDataOutboundICDetails.reduce((sum, row) => sum + parseFloat(row.untaged_pulses || 0), 0).toFixed(2),
      total_billing_pulses: mappedDataOutboundICDetails.reduce((sum, row) => sum + parseFloat(row.total_billing_pulses || 0), 0).toFixed(2),
      rate: "1.25",
      total_amount: mappedDataOutboundICDetails.reduce((sum, row) => sum + parseFloat(row.total_amount || 0), 0).toFixed(2),
      gst: mappedDataOutboundICDetails.reduce((sum, row) => sum + parseFloat(row.gst || 0), 0).toFixed(2),
      grant_total: mappedDataOutboundICDetails.reduce((sum, row) => sum + parseFloat(row.grant_total || 0), 0).toFixed(2),
    };

    mappedDataOutboundICDetails.push(grandTotalRow);

    const rearrangedDataOutboundICDetails = rearrangeAndRenameColumns(mappedDataOutboundICDetails, columnOrderOutboundICDetails);
    downloadExcelOutbound(rearrangedDataOutboundICDetails, rearrangedDataCountAgentAndOutboundCalls);
  };

  const downloadExcelOutbound = (dataCountAgentAndOutboundCalls, dataOutboundICDetails) => {
    const worksheetAgentAndOutboundCalls = XLSX.utils.json_to_sheet(dataCountAgentAndOutboundCalls);
    const worksheetOutboundICDetails = XLSX.utils.json_to_sheet(dataOutboundICDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetAgentAndOutboundCalls, "Sheet1");
    XLSX.utils.book_append_sheet(workbook, worksheetOutboundICDetails, "Sheet2");
    worksheetAgentAndOutboundCalls["!cols"] = [{ width: 30 }, { width: 30 }, { width: 30 }];
    worksheetOutboundICDetails["!cols"] = [{ width: 55 }, { width: 20 }, { width: 20 }];
    XLSX.writeFile(
      workbook,
      `Outbound_Call_Details_${formattedYear_MonthName ? formattedYear_MonthName : "year_month"}_${currentdaterange?.ic ? currentdaterange?.ic : "AllData"}.xlsx`,
    );
  };

  const TextMessageCallsDataArrangeAndDownload = () => {
    const columnOrderTextMessageICDetails = {
      srn: "Sr. No.",
      _id: "IC name",
      sum_of_call_pulses: "Sum of call_pulse",
      perentage_pulses: "% of Call Pulse",
      sms_submission: "SMS Submission",
      sms_rate: "Rate as per MOU 0.125/SMS",
      total_amount: "Total Amount",
      gst: "GST (18%)",
      grant_total: "Grand Total Amount(Rs)",
    };
    const mappedDataTextMessageICDetails = billingDashBoardList[0].map((value, index) => {
      return {
        srn: index + 1,
        _id: value._id,
        sum_of_call_pulses: value.total_tagged_pulses ? parseFloat(value.total_tagged_pulses).toFixed(2) : 0.0,
        perentage_pulses: value.perentage_pulses ? parseFloat(value.perentage_pulses).toFixed(2) : 0.0,
        sms_submission: value.sms_submission ? parseFloat(value.sms_submission).toFixed(2) : 0.0,
        sms_rate: 0.125,
        total_amount: value.total_amount ? parseFloat(value.total_amount).toFixed(2) : 0.0,
        gst: value.gst ? parseFloat(value.gst).toFixed(2) : 0.0,
        grant_total: value.grant_total ? parseFloat(value.grant_total).toFixed(2) : 0.0,
      };
    });

    const grandTotalRow = {
      srn: "",
      _id: "Grand Total",
      sum_of_call_pulses: mappedDataTextMessageICDetails.reduce((sum, row) => sum + parseFloat(row.sum_of_call_pulses || 0), 0).toFixed(2),
      perentage_pulses: mappedDataTextMessageICDetails.reduce((sum, row) => sum + parseFloat(row.perentage_pulses || 0), 0).toFixed(2),
      sms_submission: mappedDataTextMessageICDetails.reduce((sum, row) => sum + parseFloat(row.sms_submission || 0), 0).toFixed(2),
      sms_rate: mappedDataTextMessageICDetails.reduce((sum, row) => sum + parseFloat(row.sms_rate || 0), 0).toFixed(2),
      total_amount: mappedDataTextMessageICDetails.reduce((sum, row) => sum + parseFloat(row.total_amount || 0), 0).toFixed(2),
      gst: mappedDataTextMessageICDetails.reduce((sum, row) => sum + parseFloat(row.gst || 0), 0).toFixed(2),
      grant_total: mappedDataTextMessageICDetails.reduce((sum, row) => sum + parseFloat(row.grant_total || 0), 0).toFixed(2),
    };
    mappedDataTextMessageICDetails.push(grandTotalRow);
    const rearrangedDataTextMessageICDetails = rearrangeAndRenameColumns(mappedDataTextMessageICDetails, columnOrderTextMessageICDetails);
    downloadExcelTextMessage(rearrangedDataTextMessageICDetails);
  };

  const downloadExcelTextMessage = (dataTextMessageICDetails) => {
    const worksheetTextMessageICDetails = XLSX.utils.json_to_sheet(dataTextMessageICDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetTextMessageICDetails, "Sheet1");
    worksheetTextMessageICDetails["!cols"] = [{ width: 50 }, { width: 30 }, { width: 30 }];
    XLSX.writeFile(
      workbook,
      `Text_Message_Details_${formattedYear_MonthName ? formattedYear_MonthName : "year_month"}_${currentdaterange?.ic ? currentdaterange?.ic : "AllData"}.xlsx`,
    );
  };
  const whatsappdataDataArrangeAndDownload = () => {
    const columnOrderTextMessageICDetails = {
      _id: "Insurance Company",
      perentage_pulses: "% Share of IBTC Pulses",
      mkt_conv_qty: "Marketing Conv.",
      mkt_conv_costing: "Marketing Conv. Amount",
      srv_conv_qty: "Service Conv.",
      srv_conv_costing: "Service Conv. Amount",
      util_conv_qty: "Conversation Utility Conv.",
      util_conv_costing: "Conversation Utility Conv. Amount",
      total: "Total Amount",
      gst: "GST (18%)",
      grand_total: "Grand Total Amount",
    };
    const mappedDataTextMessageICDetails = billingDashBoardList[0].ic_data.map((value, index) => {
      let total = (parseFloat(value?.mkt_conv_costing || 0) + parseFloat(value?.srv_conv_costing || 0) + parseFloat(value?.util_conv_costing || 0)).toFixed(2);
      let gst = total * 0.18;
      let grand_total = parseFloat(total) + parseFloat(gst);
      return {
        _id: value._id,
        perentage_pulses:
          tempmessagelist[0].length > 0 && tempmessagelist[0][index]?.perentage_pulses !== undefined
            ? `${numberWithCommas(parseFloat(tempmessagelist[0][index]?.perentage_pulses).toFixed(2))}%`
            : "0%",
        mkt_conv_qty: value.mkt_conv_qty ? parseFloat(value.mkt_conv_qty).toFixed(2) : 0.0,
        mkt_conv_costing: value.mkt_conv_costing ? parseFloat(value.mkt_conv_costing).toFixed(2) : 0.0,
        srv_conv_qty: value.srv_conv_qty ? parseFloat(value.srv_conv_qty).toFixed(2) : 0.0,
        srv_conv_costing: value.srv_conv_costing ? parseFloat(value.srv_conv_costing).toFixed(2) : 0.0,
        util_conv_qty: value.util_conv_qty ? parseFloat(value.util_conv_qty).toFixed(2) : 0.0,
        util_conv_costing: value.util_conv_costing ? parseFloat(value.util_conv_costing).toFixed(2) : 0.0,
        total: parseFloat(total).toFixed(2),
        gst: parseFloat(gst).toFixed(2),
        grand_total: parseFloat(grand_total).toFixed(2),
      };
    });
    const rearrangedDataTextMessageICDetails = rearrangeAndRenameColumns(mappedDataTextMessageICDetails, columnOrderTextMessageICDetails);
    downloadExcelWhatsapp(rearrangedDataTextMessageICDetails);
  };
  const downloadExcelWhatsapp = (dataTextMessageICDetails) => {
    const worksheetTextMessageICDetails = XLSX.utils.json_to_sheet(dataTextMessageICDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetTextMessageICDetails, "Sheet1");
    worksheetTextMessageICDetails["!cols"] = [{ width: 50 }, { width: 30 }, { width: 30 }];
    XLSX.writeFile(
      workbook,
      `Whatsapp_Details_${formattedYear_MonthName ? formattedYear_MonthName : "year_month"}_${currentdaterange?.ic ? currentdaterange?.ic : "AllData"}.xlsx`,
    );
  };
  const AgentsDataArrangeAndDownload = () => {
    const columnOrderCountAgents = {
      // A active_agent: "No. Of Active Agents",
      total_working_days_in_month: "No. Of Working Days",
      call_attended: " No. Of Calls Attended",
      // A total_training_hr: "No. Of Calls Attended",
    };
    const mappedDataCountAgents = billingDashBoardList.map((value) => {
      return {
        // A active_agent: value.active_agent,
        total_working_days_in_month: value.total_working_days_in_month,
        call_attended: value.call_attended,
        // A total_training_hr: value.total_training_hr,
      };
    });
    const rearrangedDataCountAgents = rearrangeAndRenameColumns(mappedDataCountAgents, columnOrderCountAgents);

    const columnOrderInboundICDetails = {
      srn: "Sr. No.",
      _id: "IC name",
      sum_of_pulses: "Sum of call_pulse",
      percentagePulse: "% of Call Pulse ",
      billing_day: "Count of Billing Days",
      billing_amount: "Billing Amount Rs 31000/30 Days*Billing Days)",
      gst: "GST (18%)",
      grand_total: "Grand Total Amount(Rs)",
    };

    const mappedDataInboundICDetails = billingDashBoardAgentICList[0]?.IC_data.map((value, index) => {
      const percentagePulse = value.percentagePulse ? parseFloat(value.percentagePulse) : 0.0;
      const totalPulses = value.totalPulses ? parseFloat(value.totalPulses) : 0.0;
      const billingDays = percentagePulse && noOfWorkingDays ? parseFloat((percentagePulse * noOfWorkingDays) / 100).toFixed(2) : 0.0;

      const billingAmount = percentagePulse && noOfWorkingDays ? parseFloat(billingDays * (31000 / 30)).toFixed(2) : 0.0;

      const gst = billingAmount ? parseFloat(billingAmount * 0.18).toFixed(2) : 0.0;

      const grandTotal = billingAmount ? parseFloat(parseFloat(billingAmount) + parseFloat(gst)).toFixed(2) : 0.0;

      return {
        srn: index + 1,
        _id: value._id,
        sum_of_pulses: totalPulses.toFixed(2),
        percentagePulse: percentagePulse.toFixed(2),
        billing_day: billingDays,
        billing_amount: billingAmount,
        gst: gst,
        grand_total: grandTotal,
      };
    });

    const grandTotalRow = {
      srn: "",
      _id: "Grand Total",
      sum_of_pulses: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.sum_of_pulses || 0), 0).toFixed(2),
      percentagePulse: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.percentagePulse || 0), 0).toFixed(2),
      billing_day: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.billing_day || 0), 0).toFixed(2),
      billing_amount: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.billing_amount || 0), 0).toFixed(2),
      gst: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.gst || 0), 0).toFixed(2),
      grand_total: mappedDataInboundICDetails.reduce((sum, row) => sum + parseFloat(row.grand_total || 0), 0).toFixed(2),
    };
    mappedDataInboundICDetails.push(grandTotalRow);
    const rearrangedDataInboundICDetails = rearrangeAndRenameColumns(mappedDataInboundICDetails, columnOrderInboundICDetails);

    const columnOrderAgentDetails = {
      user: "Agent Id",
      // A no_of_working_hours: "No. Of Working Hours",
      // A no_of_training_hours: "No. Of Training Hours",
      working_days: "Working Days (Including Training)",
      weekly_off_holidays: "Weekly Off And Holidays (In days)",
      total_no_of_working_days: "Total No. Of Working Days",
    };
    const mappedDataAgentDetails = billingDashBoardAgentWorkingDetailsList.map((value) => {
      return {
        user: value.user,
        // A no_of_working_hours: value.no_of_working_hours ? parseFloat(value.no_of_working_hours).toFixed(2) : 0.00,
        // A no_of_training_hours: value.no_of_training_hours ? parseFloat(value.no_of_training_hours).toFixed(2) : 0.00,
        working_days: value.working_days ? parseFloat(value.working_days).toFixed(2) : 0.0,
        weekly_off_holidays: value.holidays && value.holidays.total_holidays ? parseFloat(value.holidays.total_holidays).toFixed(2) : 0,
        total_no_of_working_days: value.total_working_days ? parseFloat(value.total_working_days).toFixed(2) : 0.0,
      };
    });
    const rearrangedDataAgentDetails = rearrangeAndRenameColumns(mappedDataAgentDetails, columnOrderAgentDetails);
    downloadExcelAgent(rearrangedDataInboundICDetails, rearrangedDataCountAgents, rearrangedDataAgentDetails);
  };

  const downloadExcelAgent = (dataCountAgents, dataInboundICDetails, dataAgentDetails) => {
    const worksheetCountAgents = XLSX.utils.json_to_sheet(dataCountAgents);
    const worksheetInboundICDetails = XLSX.utils.json_to_sheet(dataInboundICDetails);
    const worksheetAgentDetails = XLSX.utils.json_to_sheet(dataAgentDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetCountAgents, "Sheet1");
    XLSX.utils.book_append_sheet(workbook, worksheetInboundICDetails, "Sheet2");
    // XLSX.utils.book_append_sheet(workbook, worksheetAgentDetails, "Sheet3");
    worksheetCountAgents["!cols"] = [
      // { width: 25 },
      // { width: 25 },
      { width: 25 },
      { width: 25 },
    ];
    worksheetInboundICDetails["!cols"] = [{ width: 55 }, { width: 20 }, { width: 20 }];
    worksheetAgentDetails["!cols"] = [
      { width: 15 },
      { width: 32 },
      { width: 32 },
      { width: 35 },
      // A { width: 25 },
      // A { width: 25 },
      // A { width: 25 },
      // A { width: 30 },
    ];
    XLSX.writeFile(
      workbook,
      `Agent_Details_${formattedYear_MonthName ? formattedYear_MonthName : "year_month"}_${currentdaterange?.ic ? currentdaterange?.ic : "AllData"}.xlsx`,
    );
  };

  const AgentsOverTimeDataArrangeAndDownload = () => {
    const columnOrderCountAgents = {
      total_working_days_in_month: "No. Of Working Over Time",
      call_attended: " No. Of Calls Attended",
    };
    const mappedDataCountAgents = billingDashBoardAgentOverTimeList.map((value) => {
      return {
        total_working_days_in_month: parseFloat(noOfWorkingDaysOverTime).toFixed(2),
        call_attended: value.call_attended,
      };
    });
    const rearrangedDataCountAgents = rearrangeAndRenameColumns(mappedDataCountAgents, columnOrderCountAgents);

    const columnOrderInboundICDetails = {
      _id: "Insurance Company",
      percentagePulse: "% Share of IBTC Pulses",
      agents_cost: "Share of Working Over Time",
    };
    const mappedDataInboundICDetails = billingDashBoardAgentOverTimeICList[0].IC_data.map((value) => {
      return {
        _id: value._id,
        percentagePulse: value.percentagePulse ? parseFloat(value.percentagePulse).toFixed(2) : 0.0,
        agents_cost:
          value.percentagePulse && noOfWorkingDaysOverTime ? parseFloat(parseFloat(value.percentagePulse * noOfWorkingDaysOverTime) / 100).toFixed(2) : "0.00",
      };
    });
    const rearrangedDataInboundICDetails = rearrangeAndRenameColumns(mappedDataInboundICDetails, columnOrderInboundICDetails);

    const columnOrderAgentDetails = {
      user: "Agent Id",
      overtime_hours: "Over Time (In Hours)",
    };
    const mappedDataAgentDetails = billingDashBoardAgentWorkingOverTimeDetailsList.map((value) => {
      return {
        user: value.user,
        overtime_hours: value.overtime_hours ? parseFloat(value.overtime_hours).toFixed(2) : 0.0,
      };
    });
    const rearrangedDataAgentDetails = rearrangeAndRenameColumns(mappedDataAgentDetails, columnOrderAgentDetails);
    downloadExcelAgentOverTime(rearrangedDataCountAgents, rearrangedDataInboundICDetails, rearrangedDataAgentDetails);
  };

  const downloadExcelAgentOverTime = (dataCountAgents, dataInboundICDetails, dataAgentDetails) => {
    const worksheetCountAgents = XLSX.utils.json_to_sheet(dataCountAgents);
    const worksheetInboundICDetails = XLSX.utils.json_to_sheet(dataInboundICDetails);
    const worksheetAgentDetails = XLSX.utils.json_to_sheet(dataAgentDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetCountAgents, "Sheet1");
    XLSX.utils.book_append_sheet(workbook, worksheetInboundICDetails, "Sheet2");
    // XLSX.utils.book_append_sheet(workbook, worksheetAgentDetails, "Sheet3");
    worksheetCountAgents["!cols"] = [
      { width: 25 },
      { width: 25 },
      // A { width: 25 },
      // A { width: 25 },
    ];
    worksheetInboundICDetails["!cols"] = [{ width: 55 }, { width: 20 }, { width: 20 }];
    worksheetAgentDetails["!cols"] = [{ width: 15 }, { width: 25 }];
    XLSX.writeFile(
      workbook,
      `Agent_Over_Time_Details_${formattedYear_MonthName ? formattedYear_MonthName : "year_month"}_${currentdaterange?.ic ? currentdaterange?.ic : "AllData"}.xlsx`,
    );
  };

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearArray = [];
    for (let i = 2024; i <= currentYear; i += 1) {
      yearArray.push({ label: i.toString(), value: i.toString() });
    }
    setYearList(yearArray.sort().reverse());
    setSearchFormValues({
      ...searchFormValues,
      txtYearFilter: { label: currentYear.toString(), value: currentYear.toString() },
      txtMonthFilter: { label: monthList[0].label, value: monthList[0].value },
    });
    setheader({
      year: currentYear.toString(),
      month: monthList[0].label,
    });
    getInsuranceCompanyListData();
  }, []);

  const [header, setheader] = useState({
    year: "Year",
    month: "Month",
  });

  const [isPopupVisible, setPopupVisible] = useState(false);
  const handleIconHoverPass = () => {
    setPopupVisible(true);
  };

  const handleIconUnhoverPass = () => {
    setPopupVisible(false);
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
  const handlechange = (key) => {
    setActiveKey(key);
  };
  useEffect(() => {
    if (currentmenu) {
      let currentcard = cards.find((item) => item.key === currentmenu);
      setCurrentcarddetails(currentcard);
    }
  }, [currentmenu]);

  useEffect(() => {
    if (activeKey == "SMDTLS") {
      setCurrentmenu("");
      OnClickTabDashBoard("");
    } else if (activeKey) {
      setCurrentmenu(activeKey);
      OnClickTabDashBoard(activeKey);
    }
  }, [activeKey]);

  //  A get Companylist options

  const initialrenderforcampanylist = async () => {
    try {
      setIsLoadingBillingDashBoardList(true);
      const formData = {};
      const result = await getInsuranceCompanyListAPI(formData);

      if (result.responseCode === 1) {
        setIsLoadingBillingDashBoardList(false);
        if (result.responseData.length > 0) {
          let tempcompanylist = result.responseData.map((item) => item?.InsuranceMasterName);
          const uniqueCompanies = [...new Set(tempcompanylist)];
          setInsuranceCompanyoption(uniqueCompanies);
        } else {
          setInsuranceCompanyoption([]);
        }
      } else {
        setIsLoadingBillingDashBoardList(false);
        setInsuranceCompanyoption([]);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      setIsLoadingBillingDashBoardList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  useEffect(() => {
    initialrenderforcampanylist();
  }, []);

  const sumColumn = (data, columnName) => {
    return data.reduce((sum, item) => {
      return sum + (parseFloat(item[columnName]) || 0);
    }, 0);
  };

  useEffect(() => {
    if (totalbillingsummary) {
      setTotal(
        `Rs. ${numberWithCommas(
          parseFloat(
            (
              (totalbillingsummary?.inbound_call_cost || 0) +
              (totalbillingsummary?.outbound_call_cost || 0) +
              (totalbillingsummary?.agent_working_cost || 0) +
              (totalbillingsummary?.agent_overtime_cost || 0) +
              (totalbillingsummary?.sms_costing || 0) +
              (totalbillingsummary?.whatsapp_gupsup_cost || 0)
            ).toFixed(2),
          ),
        )}`,
      );

      setInboundCall(totalbillingsummary?.inbound_call_cost ? `${numberWithCommas(parseFloat(totalbillingsummary?.inbound_call_cost).toFixed(2))}` : "0.00");

      setOutboundCall(totalbillingsummary?.outbound_call_cost ? `${numberWithCommas(parseFloat(totalbillingsummary?.outbound_call_cost).toFixed(2))}` : "0.00");

      setAgents(totalbillingsummary?.agent_working_cost ? `${numberWithCommas(parseFloat(totalbillingsummary?.agent_working_cost).toFixed(2))}` : "0.00");

      setAgentOvertime(
        totalbillingsummary?.agent_overtime_cost ? `${numberWithCommas(parseFloat(totalbillingsummary?.agent_overtime_cost).toFixed(2))}` : "0.00",
      );

      setTextMessage(totalbillingsummary?.sms_costing ? `${numberWithCommas(parseFloat(totalbillingsummary?.sms_costing).toFixed(2))}` : "0.00");

      setWhatsapp(totalbillingsummary?.whatsapp_gupsup_cost ? `${numberWithCommas(parseFloat(totalbillingsummary?.whatsapp_gupsup_cost).toFixed(2))}` : "0.00");
    }
  }, [totalbillingsummary]);

  return (
    <>
      <div className="dashboard_inner">
        <Breadcrumb
          toDate={toDate}
          fromDate={fromDate}
          yearMonth={yearMonth}
          insuranceCompanyReport={insuranceCompanyReport}
          setCurrentdaterange={setCurrentdaterange}
          insuranceCompanyoptions={insuranceCompanyoptions}
          currentdaterange={currentdaterange}
          handlesubmit={OnClickTabDashBoard}
        />
        {isLoadingBillingDashBoardList && (
          <div className="Main_Dash">
            <Loader />
          </div>
        )}

        {activeKey && currentdaterange?.to && (
          <>
            <>
              <Secondsection
                toDate={toDate}
                fromDate={fromDate}
                yearMonth={yearMonth}
                insuranceCompanyReport={insuranceCompanyReport}
                icLogo={icLogo}
                setIcLogo={setIcLogo}
                cards={cards}
                currentmenu={currentmenu}
                handlechange={handlechange}
                total={total}
                inbaundcall={inboundCall}
                outboundcall={outboundCall}
                agents={agents}
                agentovertime={agentOvertime}
                textmessage={textMessage}
                whatsapp={whatsapp}
              />
            </>
            {currentmenu && (
              <>
                {currentmenu === "INBNDCL" && (
                  <>
                    <Inboundcomponent
                      yearMonth={yearMonth}
                      inbaundcall={inboundCall}
                      insuranceCompanyReport={insuranceCompanyReport}
                      activeKey={activeKey}
                      currentcarddetails={currentcarddetails}
                      billingDashBoardList={billingDashBoardList}
                      numberWithCommas={numberWithCommas}
                      grandTotalICIBPercntShare={grandTotalICIBPercntShare}
                      grandTotalICIBTaggedCalls={grandTotalICIBTaggedCalls}
                      grandTotalICIBUnTaggedCalls={grandTotalICIBUnTaggedCalls}
                      grandTotalICIBPulses={grandTotalICIBPulses}
                      totalICTotalAmount={totalICTotalAmount}
                      totalICGSTAmount={totalICGSTAmount}
                      totalICTotalBillableAmount={totalICTotalBillableAmount}
                      downloadpdfdata={() => {
                        OnClickExcelDataDownlaod(currentmenu);
                      }}
                    />
                  </>
                )}
                {currentmenu === "AGNT" && (
                  <>
                    <Agentscomponent
                      activeKey={activeKey}
                      agents={agents}
                      currentcarddetails={currentcarddetails}
                      billingDashBoardList={billingDashBoardList}
                      numberWithCommas={numberWithCommas}
                      grandTotalIBTCAgentPercntShare={grandTotalIBTCAgentPercntShare}
                      grandTotalAgentCost={grandTotalAgentCost}
                      billingDashBoardAgentICList={billingDashBoardAgentICList}
                      noOfWorkingDays={noOfWorkingDays}
                      totalICAgentTotalAmount={totalICAgentTotalAmount}
                      totalICAgentGSTAmount={totalICAgentGSTAmount}
                      totalICAgentTotalBillableAmount={totalICAgentTotalBillableAmount}
                      billingDashBoardAgentWorkingDetailsList={billingDashBoardAgentWorkingDetailsList}
                      downloadpdfdata={() => {
                        OnClickExcelDataDownlaod(currentmenu);
                      }}
                      agentbillingdata={agentbillingdata}
                    />
                  </>
                )}
                {currentmenu === "OTBNDCL" && (
                  <>
                    <Outboundcomponent
                      yearMonth={yearMonth}
                      outboundcall={outboundCall}
                      insuranceCompanyReport={insuranceCompanyReport}
                      obBillableData={obBillableData}
                      untaggedData={untaggedData}
                      activeKey={activeKey}
                      currentcarddetails={currentcarddetails}
                      billingDashBoardList={billingDashBoardList}
                      numberWithCommas={numberWithCommas}
                      billingDashBoardObICDetailsList={billingDashBoardObICDetailsList}
                      grandTotalOBPulses={grandTotalOBPulses}
                      grandTotalOBTCPercntShare={grandTotalOBTCPercntShare}
                      totalICOBTotalAmount={totalICOBTotalAmount}
                      totalICOBGSTAmount={totalICOBGSTAmount}
                      totalICOBTotalBillableAmount={totalICOBTotalBillableAmount}
                      downloadpdfdata={() => {
                        OnClickExcelDataDownlaod(currentmenu);
                      }}
                    />
                  </>
                )}
                {currentmenu === "AGNTOVRTM" && (
                  <>
                    <Agentovertimecomponent
                      activeKey={activeKey}
                      agentovertime={agentOvertime}
                      currentcarddetails={currentcarddetails}
                      numberWithCommas={numberWithCommas}
                      billingDashBoardAgentOverTimeList={billingDashBoardAgentOverTimeList}
                      billingDashBoardAgentOverTimeICList={billingDashBoardAgentOverTimeICList}
                      grandTotalAgentCostOverTime={grandTotalAgentCostOverTime}
                      grandTotalIBTCAgentPercntShareOverTime={grandTotalIBTCAgentPercntShareOverTime}
                      noOfWorkingDaysOverTime={noOfWorkingDaysOverTime}
                      totalICAgentTotalAmountOverTime={totalICAgentTotalAmountOverTime}
                      totalICAgentGSTAmountOverTime={totalICAgentGSTAmountOverTime}
                      totalICAgentTotalBillableAmountOverTime={totalICAgentTotalBillableAmountOverTime}
                      billingDashBoardAgentWorkingOverTimeDetailsList={billingDashBoardAgentWorkingOverTimeDetailsList}
                      overtimenewbilling={overtimenewbilling}
                      downloadpdfdata={() => {
                        OnClickExcelDataDownlaod(currentmenu);
                      }}
                    />
                  </>
                )}
                {currentmenu === "TXTMSG" && (
                  <>
                    <Textmessagecomponent
                      toDate={toDate}
                      fromDate={fromDate}
                      textmessage={textMessage}
                      activeKey={activeKey}
                      currentcarddetails={currentcarddetails}
                      numberWithCommas={numberWithCommas}
                      billingDashBoardList={billingDashBoardList}
                      totalICTxtMsgTotalAmount={totalICTxtMsgTotalAmount}
                      totalICTxtMsgGSTAmount={totalICTxtMsgGSTAmount}
                      totalICTxtMsgTotalBillableAmount={totalICTxtMsgTotalBillableAmount}
                      grandTotalTextMsgPercntShare={grandTotalTextMsgPercntShare}
                      grandTotalTextMsg={grandTotalTextMsg}
                      downloadpdfdata={() => {
                        OnClickExcelDataDownlaod(currentmenu);
                      }}
                      sumColumn={sumColumn}
                    />
                  </>
                )}
                {currentmenu === "WHAPP" && (
                  <>
                    <WhatsappComponent
                      activeKey={activeKey}
                      whatsapp={whatsapp}
                      currentcarddetails={currentcarddetails}
                      numberWithCommas={numberWithCommas}
                      billingDashBoardList={billingDashBoardList}
                      totalICWhatsappGSTAmount={totalICWhatsappGSTAmount}
                      totalICWhatsappTotalBillableAmount={totalICWhatsappTotalBillableAmount}
                      tempmessagelist={tempmessagelist}
                      downloadpdfdata={() => {
                        OnClickExcelDataDownlaod(currentmenu);
                      }}
                      sumColumn={sumColumn}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Billingdashboard;
