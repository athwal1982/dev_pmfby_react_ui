import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, Convert24FourHourAndMinute, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getSupportTicketDetailReport, getSupportTicketDetailReportMongo } from "../Services/Methods";
import { getMasterDataBinding } from "../../../Support/ManageTicket/Services/Methods";

function TicketHistoryLogics() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtInsuranceCompany: null,
    txtState: null,
    txtTicketType: null,
  });

  const [ticketHistoryDataList, setTicketHistoryDataList] = useState(false);
  const [filteredTicketHistoryDataList, setFilteredTicketHistoryDataList] = useState([]);
  const [isLoadingTicketHistoryDataList, setLoadingTicketHistoryDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [ticketHistoryListItemSearch, setTicketHistoryListItemSearch] = useState("");
  const onChangeTicketHistoryList = (val) => {
    setTicketHistoryListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [isLoadingInsuranceCompanyList, setIsLoadingInsuranceCompanyList] = useState(false);
  const getInsuranceCompanyListData = async () => {
    try {
      setInsuranceCompanyList([]);
      setIsLoadingInsuranceCompanyList(true);
      // A const formdata = {
      // A  filterID: 124003,
      // A  filterID1: 0,
      // A  masterName: "CMPLST",
      // A  searchText: "#ALL",
      // A  searchCriteria: "",
      // A };
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "INSURASIGN",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "Insurance Comapny");
      setIsLoadingInsuranceCompanyList(false);
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

  const [stateList, setStateList] = useState([]);
  const [isLoadingStateList, setIsLoadingStateList] = useState(false);
  const getStateListData = async () => {
    try {
      setStateList([]);
      setIsLoadingStateList(true);
      // A const formdata = {
      // A   filterID: 0,
      // A  filterID1: 0,
      // A  masterName: "STATEMAS",
      // A  searchText: "#ALL",
      // A  searchCriteria: "AW",
      // A };
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "STATASIGN",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "State Data");
      setIsLoadingStateList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateList(result.response.responseData.masterdatabinding);
        } else {
          setStateList([]);
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

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 12 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 25 },
      { width: 30 },
      { width: 30 },
      { width: 10 },
      { width: 10 },
      { width: 55 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 30 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 60 },
    ];
    XLSX.writeFile(workbook, "Ticket_History.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const getTicketHistoryData = async (pType) => {
    try {
      const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
      if (dateDiffrence > 31) {
        setAlertMessage({
          type: "error",
          message: "1 month date range is allowed only",
        });
        return;
      }
      setLoadingTicketHistoryDataList(true);

      const formData = {
        insuranceCompanyID:
          formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID.toString() : "#ALL",
        ticketHeaderID: formValues.txtTicketType && formValues.txtTicketType.TicketTypeID ? formValues.txtTicketType.TicketTypeID : 0,
        stateID: formValues.txtState && formValues.txtState.StateMasterID ? formValues.txtState.StateMasterID.toString() : "#ALL",
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      let result = [];
      if (pType === "MONGO") {
        result = await getSupportTicketDetailReportMongo(formData);
      } else {
        result = await getSupportTicketDetailReport(formData);
      }
      setLoadingTicketHistoryDataList(false);
      if (result.responseCode === 1) {
        if (ticketHistoryListItemSearch && ticketHistoryListItemSearch.toLowerCase().includes("#")) {
          onChangeTicketHistoryList("");
        }
        setTicketHistoryDataList(result.responseData.supportTicket);
        setFilteredTicketHistoryDataList(result.responseData.supportTicket);
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
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

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const getTicketHistoryList = (pType) => {
    if (formValues.txtFromDate) {
      if (formValues.txtToDate) {
        if (formValues.txtFromDate > formValues.txtToDate) {
          setAlertMessage({
            type: "warning",
            message: "From date must be less than To Date",
          });
          return;
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: "Please select To Date",
        });
        return;
      }
    }
    getTicketHistoryData(pType);
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
      txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
      txtInsuranceCompany: null,
      txtState: null,
      txtTicketType: null,
    });
  };

  const exportClick = () => {
    // A const excelParams = {
    // A  fileName: "Ticket History",
    // A };
    // A gridApi.exportDataAsExcel(excelParams);
    if (ticketHistoryDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      CallingUserID: "Agent ID",
      CallingUniqueID: "Calling ID",
      NCIPDocketNo: "NCIP Docket No",
      SupportTicketNo: "Ticket No",
      TicketDate: "Creation Date",
      ReOpenDate: "Re-Open Date",
      TicketStatus: "Ticket Status",
      StatusDate: "Status Date",
      StateMasterName: "State",
      DistrictMasterName: "District",
      SubDistrictName: "Sub District",
      TicketHeadName: "Type",
      SupportTicketTypeName: "Category",
      TicketCategoryName: "Sub Category",
      CropSeasonName: "Season",
      RequestYear: "Year",
      InsuranceMasterName: "Insurance Company",
      ApplicationNo: "Application No",
      InsurancePolicyNo: "Policy No",
      CallerContactNumber: "Caller Mobile No.",
      RequestorName: "Farmer Name",
      RequestorMobileNo: "Mobile No",
      Relation: "Relation",
      RelativeName: "Relative Name",
      PolicyPremium: "Policy Premium",
      PolicyArea: "Policy Area",
      PolicyType: "Policy Type",
      LandSurveyNumber: "Land Survey Number",
      LandDivisionNumber: "Land Division Number",
      PlotStateName: "Plot State",
      PlotDistrictName: "Plot District",
      PlotVillageName: "Plot Village",
      ApplicationSource: "Application Source",
      CropShare: "Crop Share",
      IFSCCode: "IFSC Code",
      FarmerShare: "Farmer Share",
      SowingDate: "Sowing Date",
      CreatedBY: "Created By",
      TicketDescription: "Description",
    };
    const mappedData = ticketHistoryDataList.map((value) => {
      return {
        CallingUserID: value.CallingUserID,
        CallingUniqueID: value.CallingUniqueID,
        NCIPDocketNo: value.NCIPDocketNo,
        SupportTicketNo: value.SupportTicketNo,
        ApplicationNo: value.ApplicationNo,
        InsurancePolicyNo: value.InsurancePolicyNo,
        TicketStatus: value.TicketStatus,
        CallerContactNumber: value.CallerContactNumber,
        RequestorName: value.RequestorName,
        RequestorMobileNo: value.RequestorMobileNo,
        StateMasterName: value.StateMasterName,
        DistrictMasterName: value.DistrictMasterName,
        SubDistrictName: value.SubDistrictName,
        InsuranceMasterName: value.InsuranceMasterName,
        TicketHeadName: value.TicketHeadName,
        SupportTicketTypeName: value.SupportTicketTypeName,
        TicketCategoryName: value.TicketCategoryName,
        CropSeasonName: value.CropSeasonName,
        RequestYear: value.RequestYear,
        StatusDate: value.StatusDate ? dateToSpecificFormat(value.StatusDate.split("T")[0], "DD-MM-YYYY") : "",
        TicketDate: value.TicketDate ? dateToSpecificFormat(value.TicketDate.split("T")[0], "DD-MM-YYYY") : "",
        ReOpenDate: value.ReOpenDate ? dateToSpecificFormat(value.ReOpenDate.split("T")[0], "DD-MM-YYYY") : "",
        Relation: value.Relation,
        RelativeName: value.RelativeName,
        PolicyPremium: value.PolicyPremium,
        PolicyArea: value.PolicyArea,
        PolicyType: value.PolicyType,
        LandSurveyNumber: value.LandSurveyNumber,
        LandDivisionNumber: value.LandDivisionNumber,
        PlotStateName: value.PlotStateName,
        PlotDistrictName: value.PlotDistrictName,
        PlotVillageName: value.PlotVillageName,
        ApplicationSource: value.ApplicationSource,
        CropShare: value.CropShare,
        IFSCCode: value.IFSCCode,
        FarmerShare: value.FarmerShare,
        SowingDate: value.SowingDate
          ? dateToSpecificFormat(`${value.SowingDate.split("T")[0]} ${Convert24FourHourAndMinute(value.SowingDate.split("T")[1])}`, "DD-MM-YYYY HH:mm")
          : "",
        CreatedBY: value.CreatedBY,
        TicketDescription: value.TicketDescription,
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  return {
    ticketHistoryDataList,
    filteredTicketHistoryDataList,
    isLoadingTicketHistoryDataList,
    insuranceCompanyList,
    isLoadingInsuranceCompanyList,
    getInsuranceCompanyListData,
    stateList,
    isLoadingStateList,
    getStateListData,
    gridApi,
    onGridReady,
    onChangeTicketHistoryList,
    ticketHistoryListItemSearch,
    getTicketHistoryList,
    formValues,
    updateState,
    isLoadingTicketHistoryDataList,
    onClickClearSearchFilter,
    exportClick,
  };
}
export default TicketHistoryLogics;
