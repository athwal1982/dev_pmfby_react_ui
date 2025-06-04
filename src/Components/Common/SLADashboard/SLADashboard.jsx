import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Accordion } from "react-bootstrap";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { Loader } from "Framework/Components/Widgets";
import "./SLADashboard.scss";
import { slaReports } from "./Services/Services";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding } from "../../Modules/Support/ManageTicket/Services/Methods";
import "../../../../src/Components/dashboard/dashboard.css";
import Maincard from "Components/dashboard/sladashboard/components/Maincard";
import dateicon from "../../../assets/img/sla/date-icon.png";
import monthicon from "../../../assets/img/sla/month.png";
import icicon from "../../../assets/img/sla/ic-icon.png";
import SLA2Chart from "./charts/SLA2Chart";
function SLADashboard() {
  const setAlertMessage = AlertMessage();

  const [activeKey, setActiveKey] = useState("");
  const [sla1Chart, setsla1Chart] = useState({});
  const [sla2Chart, setsla2Chart] = useState({});
  const [sla3Chart, setsla3Chart] = useState({});
  const [sla4Chart, setsla4Chart] = useState({});
  const [sla5Chart, setsla5Chart] = useState({});
  const [sla6Chart, setsla6Chart] = useState({});

  const [header, setheader] = useState({
    year: "Year",
    month: "Month",
  });

  const [slaReportData, setSlaReportData] = useState({
    totalAnsweredCallASA: 0,
    totalQuedCallsASA: 0,
    percentQuedCallsASA: 0,
    totalAnsweredCallAHT: 0,
    callAHT_300_seconds: 0,
    percentAHT_300_seconds: 0,
    totalCallsLanded: 0,
    totalInboundCalls: 0,
    totalOutboundCalls: 0,
    callsPerActiveAgent: 0,
    totalActiveAgent: 0,
    percentQuedCallsSYS: 0,
    percentQuedCallsSY: 0,
    uptime: 0,
    totalAuditCalls: 0,
    totalAgents: 0,
    totalScoreAllAgents: 0,
    qualityPercentage: 0,
    agentCompletedSixTwelveMonth: 0,
    totalHoursOfTraining: 0,
    averageHours: 0,
  });

  const ClearFormData = () => {
    setSlaReportData({
      totalAnsweredCallASA: 0,
      totalQuedCallsASA: 0,
      percentQuedCallsASA: 0,
      totalAnsweredCallAHT: 0,
      callAHT_300_seconds: 0,
      percentAHT_300_seconds: 0,
      totalCallsLanded: 0,
      totalInboundCalls: 0,
      totalOutboundCalls: 0,
      callsPerActiveAgent: 0,
      totalActiveAgent: 0,
      percentQuedCallsSYS: 0,
      percentQuedCallsSY: 0,
      uptime: 0,
      totalAuditCalls: 0,
      totalAgents: 0,
      totalScoreAllAgents: 0,
      qualityPercentage: 0,
      agentCompletedSixTwelveMonth: 0,
      totalHoursOfTraining: 0,
      averageHours: 0,
    });

    setsla1Chart([]);
    setsla2Chart([]);
    setsla3Chart([]);
    setsla4Chart([]);
    setsla5Chart([]);
    setsla6Chart([]);

    setSearchFormValues({
      txtInsuranceCompany: "",
      txtYearFilter: "",
      txtMonthFilter: "",
    });

    setheader({
      year: "Year",
      month: "Month",
    });
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const [asaData, setAsaData] = useState([]);
  const [ahtData, setAhtData] = useState([]);
  const [callQualtiyData, setCallQualtiyData] = useState([]);
  const [seatUtlizationData, setSeatUtlizationData] = useState([]);
  const [agenttrainingReportData, setAgentTrainingReportData] = useState([]);
  const [systemUptimeData, setSystemUptimeData] = useState([]);

  const getSLACallData = async (formattedStartDate, formattedEndDate, pInsuranceCompanyCode) => {
    
    try {
      const formData = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        ic_code: pInsuranceCompanyCode,
      };
      setBtnLoaderActive(true);

      const result = await slaReports(formData);
      setBtnLoaderActive(false);

      const data = result.responseData?.[0] || [];

      setSystemUptimeData(result.responseData?.[0].SYSTEM_UPTIME_REPORT);
      setAsaData(result.responseData?.[0].ASA_graph);
      setAhtData(result.responseData?.[0].AHT_graph);
      setCallQualtiyData(result.responseData?.[0].CALL_QUALITY_SCORE_GRAPH);
      setAgentTrainingReportData(result.responseData?.[0].TRANING_REPORT_GRAPH);
      setSeatUtlizationData(result.responseData?.[0].SEAT_UTILIZATION_graph);

      if (Object.keys(data).length === 0) {
        ClearFormData();

        setAlertMessage({
          type: "warning",
          message: "This month has no data",
        });
      } else {
        const ASA_REPORT = data?.ASA_REPORT || {};
        const AHT_REPORT = data?.AHT_REPORT || {};
        const SEAT_UTILIZATION = data?.SEAT_UTILIZATION || {};
        const SYSTEM_UPTIME_REPORT = data?.SYSTEM_UPTIME_REPORT || {};
        const CALL_QUALITY_SCORE = data?.CALL_QUALITY_SCORE || {};
        const TRAINING_REPORT = data?.TRAINING_REPORT || {};

        const ASA_graph =
          data.ASA_graph?.map((item) => ({
            cs_date: item.month,
            asa: item.value,
          })) || [];

        const AHT_graph =
          data.AHT_graph?.map((item) => ({
            cs_date: item.month,
            aht: item.value,
          })) || [];

        const SEAT_UTILIZATION_graph =
          data.SEAT_UTILIZATION_graph?.map((item) => ({
            cs_date: item.month,
            seat: item.value,
          })) || [];

        const SYSTEM_UPTIME_GRAPH =
          data.SYSTEM_UPTIME_GRAPH?.map((item) => ({
            cs_date: item.month,
            uptime: item.uptime,
          })) || [];
        const CALL_QUALITY_SCORE_GRAPH =
          data.CALL_QUALITY_SCORE_GRAPH?.map((item) => ({
            cs_date: item.month,
            percentage: item.percentage,
          })) || [];
        const TRANING_REPORT_GRAPH =
          data.TRANING_REPORT_GRAPH?.map((item) => ({
            cs_date: item.month,
            averageHours: item.averageHours,
          })) || [];

        setSlaReportData({
          totalAnsweredCallASA: ASA_REPORT.totalAnsweredCallASA || 0,
          totalQuedCallsASA: ASA_REPORT.totalQuedCallsASA || 0,
          percentQuedCallsASA: ASA_REPORT.percentQuedCallsASA || 0,
          totalAnsweredCallAHT: AHT_REPORT.totalAnsweredCallAHT || 0,
          callAHT_300_seconds: AHT_REPORT.callAHT_300_seconds || 0,
          percentAHT_300_seconds: AHT_REPORT.percentAHT_300_seconds || 0,
          totalInboundCalls: SEAT_UTILIZATION.totalInboundCalls || 0,
          totalOutboundCalls: SEAT_UTILIZATION.totalOutboundCalls || 0,
          totalCallsLanded: SEAT_UTILIZATION.totalCallsLanded || 0,
          callsPerActiveAgent: SEAT_UTILIZATION.callsPerActiveAgent || 0,
          totalActiveAgent: SEAT_UTILIZATION.totalActiveAgent || 0,
          uptime: SYSTEM_UPTIME_REPORT.uptime || 0,
          totalAuditCalls: CALL_QUALITY_SCORE.totalAuditCalls || 0,
          totalAgents: CALL_QUALITY_SCORE.totalAgents || 0,
          totalScoreAllAgents: CALL_QUALITY_SCORE.totalScoreAllAgents || 0,
          qualityPercentage: CALL_QUALITY_SCORE.qualityPercentage || 0,
          agentCompletedSixTwelveMonth: TRAINING_REPORT.agentCompletedSixTwelveMonth || 0,
          totalHoursOfTraining: TRAINING_REPORT.totalHoursOfTraining || 0,
          averageHours: TRAINING_REPORT.averageHours || 0,
        });

        getSLA1Chart(SYSTEM_UPTIME_GRAPH);
        getSLA2Chart(ASA_graph);
        getSLA3Chart(AHT_graph);
        getSLA4Chart(CALL_QUALITY_SCORE_GRAPH);
        getSLA5Chart(TRANING_REPORT_GRAPH);
        getSLA6Chart(SEAT_UTILIZATION_graph);
      }
    } catch (error) {
      console.error(error);
      setAlertMessage({
        type: "error",
        message: error.message,
      });
    }
  };

  const getSLA1Chart = (arraySLA1) => {
    
    const pCategories = [];
    const pSeries = { name: "", data: [] };

    arraySLA1.forEach((v) => {
      // A const date = new Date(v.cs_date).getTime();
      // A pCategories.push(date);
      const date = v.cs_date;
      pCategories.push(date);

      pSeries.data.push({
        x: date,
        // A y: Math.round(Number(v.uptime))
        y: Number(v.uptime),
      });

      pSeries.name = "System Uptime";
    });

    const jsonSLA1 = {
      series: [pSeries],
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            export: {
              csv: { filename: "% System Uptime" },
              svg: { filename: "% System Uptime" },
              png: { filename: "% System Uptime" },
            },
          },
          zoom: { enabled: true },
        },
        colors: ["#9BBB58"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val}%`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          // A labels: {
          // A  format: "dd MMM",
          // A },
        },
        yaxis: { title: { text: "SYSTEM UPTIME" } },
        fill: { opacity: 1 },
        grid: { borderColor: "#9BBB58" },
      },
    };
    setsla1Chart(jsonSLA1);
  };

  const getSLA2Chart = (arraySLA2) => {
    
    const pCategories = [];
    const pSeries = { name: "", data: [] };
    arraySLA2.forEach((v) => {
      // A const date = new Date(v.cs_date).getTime();
      // A pCategories.push(date);
      const date = v.cs_date;
      pCategories.push(date);
      pSeries.data.push({
        x: date,
        // A y: Math.round(Number(v.asa))
        y: Number(v.asa),
      });

      pSeries.name = "Average Speed to Answer (ASA)";
    });

    const jsonSLA2 = {
      series: [pSeries],
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            export: {
              csv: { filename: "Average Speed to Answer (ASA)" },
              svg: { filename: "Average Speed to Answer (ASA)" },
              png: { filename: "Average Speed to Answer (ASA)" },
            },
          },
          zoom: { enabled: true },
        },
        colors: ["#60B65B"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val}%`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          // A labels: {
          // A format: "dd MMM",
          // A },
        },
        yaxis: { title: { text: "AVERAGE SPEED TO ANSWER (ASA)" } },
        fill: { opacity: 1 },
        grid: { borderColor: "#60B65B" },
      },
    };
    setsla2Chart(jsonSLA2);
  };

  const getSLA3Chart = (arraySLA3) => {
    const pCategories = [];
    const pSeries = { name: "", data: [] };

    arraySLA3.forEach((v) => {
      // A const date = new Date(v.cs_date).getTime();
      // A pCategories.push(date);
      const date = v.cs_date;
      pCategories.push(date);

      pSeries.data.push({
        x: date,
        // A y: Math.round(Number(v.aht))
        y: Number(v.aht),
      });
      pSeries.name = "Average Handle Time (AHT)";
    });

    const jsonSLA3 = {
      series: [pSeries],
      options: {
        chart: {
          height: 350,
          type: "area",
          toolbar: {
            export: {
              csv: { filename: "% Average Handle Time (AHT)" },
              svg: { filename: "% Average Handle Time (AHT)" },
              png: { filename: "% Average Handle Time (AHT)" },
            },
          },
          zoom: { enabled: false },
        },
        colors: ["#5DB18F"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val}%`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          // A labels: {
          // A format: "dd MMM",
          // A },
        },
        yaxis: {
          title: { text: "AVERAGE HANDLE TIME (AHT)" },
        },
        grid: { borderColor: "#5DB18F" },
      },
    };
    setsla3Chart(jsonSLA3);
  };

  const getSLA4Chart = (arraySLA4) => {
    const pCategories = [];
    const pSeries = { name: "", data: [] };

    arraySLA4.forEach((v) => {
      // A const date = new Date(v.cs_date).getTime();
      // A pCategories.push(date);
      const date = v.cs_date;
      pCategories.push(date);

      pSeries.data.push({
        x: date,
        // A y: Math.round(Number(v.rating))
        y: Number(v.percentage),
      });
      pSeries.name = "Call Quality Score";
    });

    const jsonSLA4 = {
      series: [pSeries],
      options: {
        chart: {
          height: 350,
          type: "radar",
          toolbar: {
            export: {
              csv: { filename: "% Call Quality Score" },
              svg: { filename: "% Call Quality Score" },
              png: { filename: "% Call Quality Score" },
            },
          },
          zoom: { enabled: false },
        },
        colors: ["#5F9DAC"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val}%`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          // A labels: {
          // A  format: "dd MMM",
          // A },
        },
        yaxis: {
          title: { text: "CALL QUALITY SCORE" },
        },
        grid: { borderColor: "#5F9DAC" },
      },
    };
    setsla4Chart(jsonSLA4);
  };

  const getSLA5Chart = (arraySLA5) => {
    const pCategories = [];
    const pSeries = [];

    arraySLA5.forEach((v) => {
      pCategories.push(v.cs_date);
      pSeries.push({
        // A x: new Date(v.cs_date).getTime(),
        // A y: Math.round(Number(v.training)),
        x: v.cs_date,
        y: Number(v.averageHours),
      });
    });

    const jsonSLA5 = {
      series: [
        {
          name: "Agent (Seats) Training",
          data: pSeries,
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "bubble",
          toolbar: {
            export: {
              csv: { filename: "% Agent (Seats) Training" },
              svg: { filename: "% Agent (Seats) Training" },
              png: { filename: "% Agent (Seats) Training" },
            },
          },
          zoom: { enabled: true },
        },
        colors: ["#626EA8"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val} Hrs`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          categories: pCategories,
        },
        yaxis: {
          title: { text: "AGENT (SEATS)TRAINING" },
        },
        grid: { borderColor: "#626EA8" },
      },
    };
    setsla5Chart(jsonSLA5);
  };

  const getSLA6Chart = (arraySLA6) => {
    const pCategories = [];
    const pSeries = [];

    arraySLA6.forEach((v) => {
      pCategories.push(v.cs_date);
      pSeries.push({
        // A x: new Date(v.cs_date).getTime(),
        // A y: Math.round(Number(v.training)),
        x: v.cs_date,
        y: Number(v.seat),
      });
    });

    const jsonSLA6 = {
      series: [
        {
          name: "Seat Utilization",
          data: pSeries,
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "bubble",
          toolbar: {
            export: {
              csv: { filename: "% Seat Utilization" },
              svg: { filename: "% Seat Utilization" },
              png: { filename: "% Seat Utilization" },
            },
          },
          zoom: { enabled: true },
        },
        colors: ["#8064A1"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "30%", endingShape: "rounded" },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val}%`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          // A type: "datetime",
          categories: pCategories,
        },
        yaxis: {
          title: { text: "SEAT UTILIZATION" },
        },
        grid: { borderColor: "#8064A1" },
      },
    };
    setsla6Chart(jsonSLA6);
  };

  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [isLoadingInsuranceCompanyList, setisLoadingInsuranceCompanyList] = useState(false);

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
      setisLoadingInsuranceCompanyList(true);
      const result = await getMasterDataBinding(formdata);
      setisLoadingInsuranceCompanyList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setInsuranceCompanyList(result.response.responseData.masterdatabinding.filter((company) => company.InsuranceCompanyCode !== 1019));
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

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearArray = [];
    for (let i = 2024; i <= currentYear; i += 1) {
      yearArray.push({ label: i.toString(), value: i.toString() });
    }
    setYearList(yearArray.sort());
    getInsuranceCompanyListData();
  }, []);

  const [monthList] = useState([
    { label: "Jan", value: 1 },
    { label: "Feb", value: 2 },
    { label: "Mar", value: 3 },
    { label: "Apr", value: 4 },
    { label: "May", value: 5 },
    { label: "Jun", value: 6 },
    { label: "Jul", value: 7 },
    { label: "Aug", value: 8 },
    { label: "Sep", value: 9 },
    { label: "Oct", value: 10 },
    { label: "Nov", value: 11 },
    { label: "Dec", value: 12 },
  ]);
  const [yearList, setYearList] = useState([]);

  const [searchFormValues, setSearchFormValues] = useState({
    txtYearFilter: "",
    txtMonthFilter: "",
    txtInsuranceCompany: "",
  });

  const updateSearchFormState = (name, value) => {
    
    setSearchFormValues({ ...searchFormValues, [name]: value });

    if (name === "txtMonthFilter") {
      setSearchFormValues({
        ...searchFormValues,
        txtMonthFilter: value,
      });
      setheader({
        year: "Year",
        month: "Month",
      });
      if (value) {
        setheader({
          year: searchFormValues.txtYearFilter,
          month:
            value === "1"
              ? "Jan"
              : value === "2"
                ? "Feb"
                : value === "3"
                  ? "Mar"
                  : value === "4"
                    ? "Apr"
                    : value === "5"
                      ? "May"
                      : value === "6"
                        ? "Jun"
                        : value === "7"
                          ? "Jul"
                          : value === "8"
                            ? "Aug"
                            : value === "9"
                              ? "Sept"
                              : value === "10"
                                ? "Oct"
                                : value === "11"
                                  ? "Nov"
                                  : value === "12"
                                    ? "Dec"
                                    : "",
        });
      }
    }
    if (name === "txtYearFilter") {
      setSearchFormValues({
        ...searchFormValues,
        txtYearFilter: value,
      });
      setheader({
        year: "Year",
        month: "Month",
      });
      if (value) {
        if (searchFormValues.txtMonthFilter !== "") {
          setheader({
            year: value,
            month:
              searchFormValues.txtMonthFilter === "1"
                ? "Jan"
                : searchFormValues.txtMonthFilter === "2"
                  ? "Feb"
                  : searchFormValues.txtMonthFilter === "3"
                    ? "Mar"
                    : searchFormValues.txtMonthFilter === "4"
                      ? "Apr"
                      : searchFormValues.txtMonthFilter === "5"
                        ? "May"
                        : searchFormValues.txtMonthFilter === "6"
                          ? "Jun"
                          : searchFormValues.txtMonthFilter === "7"
                            ? "Jul"
                            : searchFormValues.txtMonthFilter === "8"
                              ? "Aug"
                              : searchFormValues.txtMonthFilter === "9"
                                ? "Sept"
                                : searchFormValues.txtMonthFilter === "10"
                                  ? "Oct"
                                  : searchFormValues.txtMonthFilter === "11"
                                    ? "Nov"
                                    : searchFormValues.txtMonthFilter === "12"
                                      ? "Dec"
                                      : "",
          });
        }
      }
    }
  };

  const getYearMonthICWiseSlaGraph = (pYear, pMonth, pInsuranceCompanyCode) => {
    

    const year = pYear;
    const month = pMonth;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const formattedStartDate = `${String(startDate.getDate()).padStart(2, "0")}-${String(startDate.getMonth() + 1).padStart(
      2,
      "0",
    )}-${startDate.getFullYear()}`;
    const formattedEndDate = `${String(endDate.getDate()).padStart(2, "0")}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${endDate.getFullYear()}`;

    getSLACallData(formattedStartDate, formattedEndDate, pInsuranceCompanyCode);
  };

  const OnClickSubmit = () => {
    
    if (searchFormValues.txtYearFilter === null || searchFormValues.txtYearFilter === "") {
      setAlertMessage({
        type: "error",
        message: "Please select year",
      });
      return;
    }
    if (searchFormValues.txtMonthFilter === null || searchFormValues.txtMonthFilter === "") {
      setAlertMessage({
        type: "error",
        message: "Please select month.",
      });
      return;
    }

    const pYear = searchFormValues && searchFormValues.txtYearFilter ? searchFormValues.txtYearFilter : "";
    const pMonth = searchFormValues && searchFormValues.txtMonthFilter ? searchFormValues.txtMonthFilter : "";
    const pInsuranceCompanyCode =
      searchFormValues.txtInsuranceCompany && searchFormValues.txtInsuranceCompany.InsuranceCompanyCode
        ? searchFormValues.txtInsuranceCompany.InsuranceCompanyCode
        : "";
    getYearMonthICWiseSlaGraph(pYear, pMonth, pInsuranceCompanyCode);
  };

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
      <div className="PageStart">
        {btnLoaderActive ? <Loader /> : false}
        <div className="Header_container"></div>
        <>
          {" "}
          <>
            <div className="dashboard_inner sla-dashboard">
              <>
                <div className="breadcrumb-sla">
                  <div className="parent-container">
                    <div>
                      <p className="breadcrumb-title">
                        Service Level Agreement For {header.month} {header.year}
                      </p>
                    </div>
                    <div>
                      <div className="right-form-container">
                        <div className="custom-select-wrapper">
                          <select
                            className="form-select"
                            id="customSelect"
                            value={searchFormValues.txtYearFilter}
                            onChange={(e) => updateSearchFormState("txtYearFilter", e.target.value)}
                          >
                            <option value="">Select Year</option>
                            {yearList.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>

                          <span className="custom-icon">
                            <img src={dateicon} alt="Custom Icon" />
                          </span>
                        </div>
                        <div className="custom-select-wrapper">
                          <select
                            className="form-select gray-color"
                            id="customMonthSelect"
                            value={searchFormValues.txtMonthFilter}
                            onChange={(e) => updateSearchFormState("txtMonthFilter", e.target.value)}
                          >
                            <option value="">Select Month</option>
                            {monthList.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <span className="custom-icon">
                            <img src={monthicon} alt="Custom Icon" />
                          </span>
                        </div>
                        <div className="custom-select-wrapper">
                          <select
                            className="form-select gray-color"
                            id="customICSelect"
                            value={searchFormValues.txtInsuranceCompany?.CompanyName || ""}
                            onChange={(e) => {
                              const selectedCompany = insuranceCompanyList.find((company) => company.CompanyName === e.target.value);
                              console.log("Selected Company:", selectedCompany); // Debugging
                              updateSearchFormState("txtInsuranceCompany", selectedCompany);
                            }}
                            disabled={insuranceCompanyList && insuranceCompanyList.length === 1}
                            style={{ width: "200px" }}
                          >
                            <option value="">Select IC</option>
                            {isLoadingInsuranceCompanyList ? (
                              <option disabled>Loading...</option>
                            ) : (
                              insuranceCompanyList.map((option, index) => (
                                <option key={index} value={option.CompanyName}>
                                  {option.CompanyName}
                                </option>
                              ))
                            )}
                          </select>
                          <span className="custom-icon">
                            <img src={icicon} alt="Custom Icon" />
                          </span>
                        </div>

                        <button className="btn btn-sm submit-green" onClick={OnClickSubmit}>
                          Submit
                        </button>
                        <button className="btn btn-sm submit-reset" onClick={ClearFormData}>
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
              {slaReportData ? (
                <Maincard
                  slaReportData={slaReportData}
                  open={open}
                  setOpen={setOpen}
                  currentCard={currentCard}
                  handleopen={handleopen}
                  handleclose={handleclose}
                />
              ) : (
                <p>Loading...</p>
              )}{" "}
            </div>
          </>
        </>
        <div className="Main_Dash">
          {/* {insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ?
          <>
          <div className="ContainerPnlUpperHeading">
            <span>
            Insurance Company : {insuranceCompanyList && insuranceCompanyList.length > 0 && insuranceCompanyList.length == 1 ? insuranceCompanyList[0].CompanyName : ""}
            </span> 
          </div> </> : "" } */}

          <div className="Box">
            <SLA2Chart
              activeKey={activeKey}
              onSelect={(key) => setActiveKey(key)}
              asaData={asaData}
              ahtData={ahtData}
              agenttrainingReportData={agenttrainingReportData}
              seatUtlizationData={seatUtlizationData}
              callQualtiyData={callQualtiyData}
              systemUptimeData={systemUptimeData}
            />
            {/*  A<Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
              <Accordion.Item eventKey="0">
                <Accordion.Header> SLA 1 # System uptime</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla1Chart).length === 0 ? null : <Chart options={sla1Chart.options} series={sla1Chart.series} type="bar" height={260} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header> SLA 2 # Average Speed to Answer (ASA)</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla2Chart).length === 0 ? null : <Chart options={sla2Chart.options} series={sla2Chart.series} type="bar" height={420} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>SLA 3 # Average Handle Time (AHT)</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla3Chart).length === 0 ? null : <Chart options={sla3Chart.options} series={sla3Chart.series} type="bar" height={260} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>SLA 4 # Call Quality Score</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla4Chart).length === 0 ? null : <Chart options={sla4Chart.options} series={sla4Chart.series} type="bar" height={260} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>SLA 5 # Agents (seats) Training</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla5Chart).length === 0 ? null : <Chart options={sla5Chart.options} series={sla5Chart.series} type="bar" height={260} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="5">
                <Accordion.Header>SLA 6 # Seat Utilization</Accordion.Header>
                <Accordion.Body>
                  <div className="graph">
                    {Object.keys(sla6Chart).length === 0 ? null : <Chart options={sla6Chart.options} series={sla6Chart.series} type="bar" height={260} />}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SLADashboard;
