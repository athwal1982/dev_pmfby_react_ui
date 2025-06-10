import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar, Form } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, Convert24FourHourAndMinute, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/bootstrap.css";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding, getMasterDataBindingDataList, getFarmerTicketsListIndex } from "./Services/Methods";
import BizClass from "./FarmerCreatedTicket.module.scss";
// A import HeaderPortal from "../ManageTicket/Views/Layout/FarmerAuthenticateModal/HeaderPortal";

function FarmerCreatedTicket() {
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");
  const ticketTypeList = [
    { TicketTypeID: "1", TicketTypeName: "Grievance" },
    { TicketTypeID: "2", TicketTypeName: "Information" },
    { TicketTypeID: "4", TicketTypeName: "Crop Loss Intimation" },
  ];

  const searchByoptions = [
    { value: "1", label: "Mobile No" },
    { value: "2", label: "Ticket No" },
    { value: "3", label: "Application No" },
  ];

  const [filterValues, setFilterValues] = useState({
    SearchByFilter: null,
    txtSearchFilter: "",
  });
  const [formValues, setFormValues] = useState({
    txtTicketType: null,
    txtTicketCategory: null,
    txtTicketCategoryType: null,
    txtTicketSource: null,
    txtStatus: null,
    txtInsuranceCompany: null,
    txtState: null,
    txtFromDate: "",
    txtToDate: "",
    txtScheme: null,
  });

  const updateFilterState = (name, value) => {
    setFilterValues({ ...filterValues, [name]: value });
  };

  const [ticketSourceList, setTicketSourceList] = useState([]);
  const [isLoadingTicketSourceList, setIsTicketSourceList] = useState(false);
  const getTicketSourceListData = async () => {
    try {
      setTicketSourceList([]);
      setIsTicketSourceList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "TCKTSRC",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      setIsTicketSourceList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketSourceList(result.response.responseData.masterdatabinding);
        } else {
          setTicketSourceList([]);
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

  const [ticketCategoryList, setTicketCategoryList] = useState([]);
  const [isLoadingTicketCategoryList, setIsTicketCategoryList] = useState(false);
  const getTicketCategoryListData = async (supportTicketTypeID) => {
    try {
      setTicketCategoryList([]);
      setIsTicketCategoryList(true);
      const formdata = {
        filterID: supportTicketTypeID,
        filterID1: 0,
        masterName: "TCKCGZ",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      setIsTicketCategoryList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketCategoryList(result.response.responseData.masterdatabinding);
        } else {
          setTicketCategoryList([]);
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

  const [ticketCategoryTypeList, setTicketCategoryTypeList] = useState([]);
  const [isLoadingTicketCategoryTypeList, setIsTicketCategoryTypeList] = useState(false);
  const getTicketCategoryTypeListData = async (pselectedOption) => {
    try {
      setIsTicketCategoryTypeList(true);
      const formdata = {
        filterID: pselectedOption,
        filterID1: 0,
        masterName: "TCKTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      setIsTicketCategoryTypeList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          if (pselectedOption === "4") {
            const mappedData = result.response.responseData.masterdatabinding.map((value) => {
              return {
                SupportTicketTypeName:
                  value.SupportTicketTypeID === 13
                    ? `${value.SupportTicketTypeName}(Loss at individual farms)`
                    : value.SupportTicketTypeID === 14
                      ? `${value.SupportTicketTypeName}(Loss at multiple farms)`
                      : value.SupportTicketTypeName,
                SupportTicketTypeID: value.SupportTicketTypeID ? value.SupportTicketTypeID : "",
              };
            });
            setTicketCategoryTypeList(mappedData);
          } else {
            setTicketCategoryTypeList(result.response.responseData.masterdatabinding);
          }
        } else {
          setTicketCategoryTypeList([]);
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

  const [ticketStatusList, setTicketStatusList] = useState([]);
  const [isLoadingTicketStatusList, setIsTicketStatusList] = useState(false);
  const getTicketStatusListData = async () => {
    try {
      setTicketStatusList([]);
      setIsTicketStatusList(true);
      const formdata = {
        filterID: 109,
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      setIsTicketStatusList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setTicketStatusList(result.response.responseData.masterdatabinding);
        } else {
          setTicketStatusList([]);
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

  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [isLoadingInsuranceCompanyList, setIsLoadingInsuranceCompanyList] = useState(false);
  const getInsuranceCompanyListData = async () => {
    try {
      setInsuranceCompanyList([]);
      setIsLoadingInsuranceCompanyList(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "INSURASIGN",
        searchText: "#ALL",
        searchCriteria: "",
      };
      const result = await getMasterDataBinding(formdata);
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
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        masterName: "STATASIGN",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      setIsLoadingStateList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          const mappedData = [];
          result.response.responseData.masterdatabinding.forEach((v) => {
            mappedData.push({
              label: v.StateMasterName,
              value: v.StateMasterID,
            });
          });
          setStateList(mappedData);
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

  const [schemeList, setSchemeList] = useState([]);
  const [isLoadingSchemeListDropdownDataList, setIsLoadingSchemeListDropdownDataList] = useState(false);
  const getSchemeListData = async () => {
    try {
      setIsLoadingSchemeListDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        masterName: "SCHEME",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBindingDataList(formdata);
      setIsLoadingSchemeListDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setSchemeList(result.response.responseData.masterdatabinding);
        } else {
          setSchemeList([]);
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

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });

    if (name === "txtTicketCategoryType") {
      setFormValues({
        ...formValues,
        txtTicketCategoryType: value,
        txtTicketCategory: null,
      });
      setTicketCategoryList([]);
      if (value) {
        getTicketCategoryListData(value.SupportTicketTypeID);
      }
    }

    if (name === "txtTicketType") {
      setFormValues({
        ...formValues,
        txtTicketType: value,
        txtTicketCategoryType: null,
        txtTicketCategory: null,
      });
      setTicketCategoryTypeList([]);
      setTicketCategoryList([]);
      getTicketCategoryTypeListData(value.TicketTypeID);
    }
  };

  const ClearTicketFilters = () => {
    setFormValues({
      ...formValues,
      txtTicketType: null,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtTicketSource: null,
      txtStatus: null,
      txtInsuranceCompany: null,
      txtState: null,
      txtScheme: null,
      txtFromDate: "",
      txtToDate: "",
      txtScheme: null,
    });
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
  };

  const SetTicketFiltersTab = () => {
    setFormValues({
      ...formValues,
      txtTicketType: null,
      txtTicketCategory: null,
      txtTicketCategoryType: null,
      txtTicketSource: null,
      txtStatus: null,
      txtInsuranceCompany: null,
      txtState: null,
      txtScheme: null,
      txtFromDate: "",
      txtToDate: "",
      txtScheme: null,
    });
    setTicketCategoryTypeList([]);
    setTicketCategoryList([]);
  };

  const getOneDayTicketData = async () => {
    setshowHideDownload(false);
    SetTicketFiltersTab();
    settotalSatatusCount("0");
    setSatatusCount([{ Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" }]);
    setFarmersTicketData([]);
  };

  const getFilterTicketsClick = async () => {
    setshowHideDownload(true);
    SetTicketFiltersTab();
    settotalSatatusCount("0");
    setSatatusCount([{ Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" }]);
    setFarmersTicketData([]);
  };

  const searchByMobileTicketsOnClick = async (pageIndex, pageSize) => {
    try {
      let ticketNoVal = "";
      let mobileNoVal = "";
      let applicationNoVal = "";
      let pviewTYP = "";

      if (!filterValues.SearchByFilter) {
        setAlertMessage({
          type: "error",
          message: "Please select search type.",
        });
        return;
      }
      const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
      if (filterValues.SearchByFilter.value === "1") {
        if (filterValues.txtSearchFilter.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter Mobile No.",
          });
          return;
        }

        if (!regex.test(filterValues.txtSearchFilter)) {
          setAlertMessage({
            type: "error",
            message: "Please enter Valid Mobile No.",
          });
          return;
        }
        if (filterValues.txtSearchFilter.length < 10 || filterValues.txtSearchFilter.length > 10) {
          setAlertMessage({
            type: "error",
            message: "Please enter Valid 10 digit mobile No.",
          });
          return;
        }

        mobileNoVal = filterValues.txtSearchFilter;
        pviewTYP = "MOBILE";
      } else if (filterValues.SearchByFilter.value === "2") {
        if (filterValues.txtSearchFilter.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter Ticket No.",
          });
          return;
        }

        if (!regex.test(filterValues.txtSearchFilter)) {
          setAlertMessage({
            type: "error",
            message: "Please enter numeric value for Ticket No.",
          });
          return;
        }
        ticketNoVal = filterValues.txtSearchFilter;
        pviewTYP = "TICKET";
      } else if (filterValues.SearchByFilter.value === "3") {
        if (filterValues.txtSearchFilter.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter Application No.",
          });
          return;
        }
        if (!regex.test(filterValues.txtSearchFilter)) {
          setAlertMessage({
            type: "error",
            message: "Please enter numeric value for Application No",
          });
          return;
        }
        applicationNoVal = filterValues.txtSearchFilter;
        pviewTYP = "APPNO";
      }

      setViewTypeMode(pviewTYP);

      const formData = {
        insuranceCompanyID: 0,
        viewTYP: pviewTYP,
        stateID: "",
        supportTicketID: 0,
        ticketCategoryID: 0,
        ticketSourceID: 0,
        supportTicketTypeID: 0,
        supportTicketNo: ticketNoVal,
        applicationNo: applicationNoVal,
        statusID: 0,
        fromdate: "",
        toDate: "",
        RequestorMobileNo: mobileNoVal,
        schemeID: 0,
        ticketHeaderID: 0,
        pageIndex: pageIndex,
        pageSize: pageSize,
      };
      setIsLoadingFarmersticket(true);
      const result = await getFarmerTicketsListIndex(formData);
      setIsLoadingFarmersticket(false);
      let totalStsCnt = 0;
      const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" };
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.supportTicket && result.responseData.status) {
          if (result.responseData.supportTicket.length > 0 && result.responseData.status.length > 0) {
            result.responseData.status.forEach((v) => {
              if (v.TicketStatus === "Open") {
                jsonStatusCnt.Open = v.Total;
              }
              if (v.TicketStatus === "In-Progress") {
                jsonStatusCnt.InProgress = v.Total;
              }
              if (v.TicketStatus === "Re-Open") {
                jsonStatusCnt.ReOpen = v.Total;
              }
              if (v.TicketStatus === "Resolved") {
                jsonStatusCnt.Resolved = v.Total;
              }
              if (v.TicketStatus === "Resolved(Information)") {
                jsonStatusCnt.ResolvedInformation = v.Total;
              }
              totalStsCnt += Number(v.Total);
            });
            setTotalPages(Math.ceil(result.responseData.supportTicket.length / 20));
            settotalSatatusCount(totalStsCnt.toString());
            setSatatusCount([jsonStatusCnt]);
            setFarmersTicketData(result.responseData.supportTicket);
          } else {
            settotalSatatusCount(totalStsCnt.toString());
            setSatatusCount([jsonStatusCnt]);
            setFarmersTicketData([]);
          }
        } else {
          settotalSatatusCount(totalStsCnt.toString());
          setSatatusCount([jsonStatusCnt]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
        settotalSatatusCount(totalStsCnt.toString());
        setSatatusCount([jsonStatusCnt]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const dateToCompanyFormat = (date) => {
    try {
      const format = "yyyy-MM-dd".toUpperCase();
      const d = new Date(date);
      const convertedDate = moment(d).format(format);
      return convertedDate;
    } catch {
      return "";
    }
  };
  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 20 },
      { width: 25 },
      { width: 26 },
      { width: 12 },
      { width: 15 },
      { width: 30 },
      { width: 12 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 40 },
      { width: 18 },
      { width: 22 },
      { width: 22 },
      { width: 30 },
      { width: 12 },
      { width: 12 },
      { width: 22 },
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
      { width: 12 },
      { width: 22 },
      { width: 20 },
    ];
    XLSX.writeFile(
      workbook,
      `Ticket_Data_${dateToSpecificFormat(formValues.txtFromDate, "DD-MM-YYYY")}_To_${dateToSpecificFormat(formValues.txtToDate, "DD-MM-YYYY")}.xlsx`,
    );
    setAlertMessage({
      type: "success",
      message: "Ticket data downloaded successfully.",
    });
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // ... do something with `page`
    if (viewTypeMode === "FILTER" && page >= 1) {
      getFarmersTickets("FILTER", "", page, 20);
    } else if (viewTypeMode === "MOBILE" && page >= 1) {
      searchByMobileTicketsOnClick(page, 20);
    }
  };
  const [isLoadingFarmersticket, setIsLoadingFarmersticket] = useState(false);
  const [farmersTicketData, setFarmersTicketData] = useState([]);
  const [satatusCount, setSatatusCount] = useState({});
  const [totalSatatusCount, settotalSatatusCount] = useState("0");
  const [viewTypeMode, setViewTypeMode] = useState([]);
  const [showHideDownload, setshowHideDownload] = useState(true);
  const [showHideManageTicket, setshowHideManageTicket] = useState(false);
  const getFarmersTickets = async (pviewTYP, pType, pageIndex, pageSize) => {
    setViewTypeMode(pviewTYP);
    let TicketStatusID = 0;
    if (pType === "") {
      TicketStatusID = formValues.txtStatus && formValues.txtStatus.CommonMasterValueID ? formValues.txtStatus.CommonMasterValueID : 0;
    } else if (pType === "DEFAULTFILTER") {
      TicketStatusID = 109301;
    }

    if (showHideDownload === false) {
      const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
      if (formValues.txtFromDate === "") {
        setAlertMessage({
          type: "error",
          message: "Please Select From Date",
        });
        return;
      }
      if (formValues.txtFromDate) {
        if (formValues.txtToDate) {
          if (formValues.txtFromDate > formValues.txtToDate) {
            setAlertMessage({
              type: "error",
              message: "From Date must be less than To Date",
            });
            return;
          }
        } else {
          setAlertMessage({
            type: "error",
            message: "Please select To Date",
          });
          return;
        }
      }

      if (dateDiffrence + 1 > 7) {
        setAlertMessage({
          type: "error",
          message: "7 days is allowed only to download.",
        });
        return;
      }
    }

    try {
      const formData = {
        insuranceCompanyID: formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID : 0,
        viewTYP: pviewTYP,
        stateID: formValues.txtState && formValues.txtState.length > 0 ? formValues.txtState.map((x) => x.value.toString()).join(",") : "",
        supportTicketID: 0,
        ticketCategoryID: formValues.txtTicketCategory && formValues.txtTicketCategory.TicketCategoryID ? formValues.txtTicketCategory.TicketCategoryID : 0,
        ticketSourceID: 0,
        supportTicketTypeID:
          formValues.txtTicketCategoryType && formValues.txtTicketCategoryType.SupportTicketTypeID ? formValues.txtTicketCategoryType.SupportTicketTypeID : 0,
        supportTicketNo: "",
        applicationNo: "",
        statusID: TicketStatusID,
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        RequestorMobileNo: "",
        schemeID: 0,
        ticketHeaderID: formValues.txtTicketType && formValues.txtTicketType.TicketTypeID ? formValues.txtTicketType.TicketTypeID : 0,
        pageIndex: showHideDownload === false ? -1 : pageIndex,
        pageSize: pageSize,
      };
      setIsLoadingFarmersticket(true);
      const result = await getFarmerTicketsListIndex(formData);
      setIsLoadingFarmersticket(false);
      let totalStsCnt = 0;
      const jsonStatusCnt = { Open: "0", InProgress: "0", Resolved: "0", ResolvedInformation: "0", ReOpen: "0" };
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.supportTicket && result.responseData.status) {
          if (pviewTYP === "ESCAL") {
            setEsclatedCount(result.responseData.supportTicket.length);
          }
          setFarmersTicketData(result.responseData.supportTicket);

          result.responseData.status.forEach((v) => {
            if (v.TicketStatus === "Open") {
              jsonStatusCnt.Open = v.Total;
            }
            if (v.TicketStatus === "In-Progress") {
              jsonStatusCnt.InProgress = v.Total;
            }
            if (v.TicketStatus === "Re-Open") {
              jsonStatusCnt.ReOpen = v.Total;
            }
            if (v.TicketStatus === "Resolved") {
              jsonStatusCnt.Resolved = v.Total;
            }
            if (v.TicketStatus === "Resolved(Information)") {
              jsonStatusCnt.ResolvedInformation = v.Total;
            }
            totalStsCnt += Number(v.Total);
          });
          if (pviewTYP === "ESCAL") {
            setTotalPages(Math.ceil(result.responseData.supportTicket.length / 20));
          } else {
            setTotalPages(Math.ceil(totalStsCnt / 20));
          }
          settotalSatatusCount(totalStsCnt.toString());
          setSatatusCount([jsonStatusCnt]);
          if (showHideDownload === false) {
            if (result.responseData.supportTicket.length > 0) {
              setTimeout(() => {
                // A const excelParams = {
                // A  fileName: `Ticket_Data_${dateToSpecificFormat(formValues.txtFromDate, "DD-MM-YYYY")}`,
                // A };
                // A gridApi.exportDataAsExcel(excelParams);
                const columnOrder = {
                  SupportTicketNo: "Ticket No",
                  ApplicationNo: "Application No",
                  InsurancePolicyNo: "Policy No",
                  TicketStatus: "Ticket Status",
                  CallerContactNumber: "Caller Mobile No",
                  RequestorName: "Farmer Name",
                  RequestorMobileNo: "Mobile No",
                  StateMasterName: "State",
                  DistrictMasterName: "District",
                  SubDistrictName: "Sub District",
                  InsuranceCompany: "Insurance Company",
                  TicketHeadName: "Type",
                  TicketTypeName: "Category",
                  TicketCategoryName: "Sub Category",
                  SchemeName: "Scheme",
                  RequestSeason: "Season",
                  RequestYear: "Year",
                  ApplicationCropName: "Crop Name",
                  Relation: "Relation",
                  RelativeName: "Relative Name",
                  PolicyPremium: "Policy Premium",
                  PolicyArea: "Policy Area",
                  PolicyType: "Policy Type",
                  LandSurveyNumber: "Land Survey Number",
                  LandDivisionNumber: "Land Division Number",
                  PlotVillageName: "Plot Village",
                  PlotDistrictName: "Plot District Name",
                  ApplicationSource: "Application Source",
                  CropShare: "Crop Share",
                  IFSCCode: "IFSC Code",
                  FarmerShare: "Farmer Share",
                  SowingDate: "Sowing Date",
                  LossDate: "Crop Loss At",
                  CreatedBY: "Created By",
                  CreatedAt: "Created At",
                };
                const mappedData = result.responseData.supportTicket.map((value) => {
                  return {
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
                    InsuranceCompany: value.InsuranceCompany,
                    TicketHeadName: value.TicketHeadName,
                    TicketTypeName: value.TicketTypeName,
                    TicketCategoryName: value.TicketCategoryName,
                    SchemeName: value.SchemeName,
                    RequestSeason: value.RequestSeason && value.RequestSeason === 1 ? "Kharif" : value.RequestSeason === 2 ? "Rabi" : "",
                    RequestYear: value.RequestYear,
                    ApplicationCropName: value.ApplicationCropName,
                    Relation: value.Relation,
                    RelativeName: value.RelativeName,
                    PolicyPremium: value.PolicyPremium,
                    PolicyArea: value.PolicyArea,
                    PolicyType: value.PolicyType,
                    LandSurveyNumber: value.LandSurveyNumber,
                    LandDivisionNumber: value.LandDivisionNumber,
                    PlotVillageName: value.PlotVillageName,
                    PlotDistrictName: value.PlotDistrictName,
                    ApplicationSource: value.ApplicationSource,
                    CropShare: value.CropShare,
                    IFSCCode: value.IFSCCode,
                    FarmerShare: value.FarmerShare,
                    SowingDate: value.SowingDate
                      ? dateToSpecificFormat(
                          `${value.SowingDate.split("T")[0]} ${Convert24FourHourAndMinute(value.SowingDate.split("T")[1])}`,
                          "DD-MM-YYYY HH:mm",
                        )
                      : "",
                    LossDate: value.LossDate ? dateToSpecificFormat(value.LossDate.split("T")[0], "DD-MM-YYYY") : "",
                    CreatedBY: value.CreatedBY,
                    CreatedAt: value.CreatedAt
                      ? dateToSpecificFormat(
                          `${value.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(value.CreatedAt.split("T")[1])}`,
                          "DD-MM-YYYY HH:mm",
                        )
                      : "",
                  };
                });
                const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
                downloadExcel(rearrangedData);
              }, 1000);
            } else {
              setAlertMessage({
                type: "error",
                message: "Data not found to download",
              });
            }
          }
        } else {
          settotalSatatusCount(totalStsCnt.toString());
          setSatatusCount([jsonStatusCnt]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
        settotalSatatusCount(totalStsCnt.toString());
        setSatatusCount([jsonStatusCnt]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.node.rowIndex % 2 === 0) {
      return { background: "#fff" };
    }
    return { background: "#f3f6f9" };
  };

  const refereshFarmerTicket = () => {
    getFarmersTickets("FILTER", "", 1, 20);
  };

  useEffect(() => {
    if (userData && userData.data && userData.data.data && userData.data.data.result) {
      getFarmersTickets("MOBILE", "", 1, 20);
    } else {
      getTicketSourceListData();
      getTicketStatusListData();
      getInsuranceCompanyListData();
      getStateListData();
      getSchemeListData();
      getFarmersTickets("FILTER", "", 1, 20);
    }
  }, []);

  return (
    <div className={BizClass.Box}>
      <div className={BizClass.PageBar}>
        <div className={BizClass.ticketCounterBar}>
          <span>Open :</span>
          <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].Open : 0}</p>
          <span>In-Progress :</span>
          <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].InProgress : 0}</p>
          <span>Resolved :</span>
          <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].Resolved : 0}</p>
          <span>Resolved(Information) :</span>
          <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].ResolvedInformation : 0}</p>
          <span>Re-Open :</span>
          <p>{satatusCount && satatusCount.length > 0 ? satatusCount[0].ReOpen : 0}</p>
          <span>Total :</span>
          <p>{totalSatatusCount}</p>
        </div>
        {/* <HeaderPortal> */}
        {userData && userData.data && userData.data.data && userData.data.data.result ? null : (
          <>
            <PageBar.Select
              ControlTxt="Search By"
              name="SearchByFilter"
              getOptionLabel={(option) => `${option.label}`}
              getOptionValue={(option) => `${option}`}
              options={searchByoptions}
              value={filterValues.SearchByFilter}
              onChange={(e) => updateFilterState("SearchByFilter", e)}
            />
            <PageBar.Search
              placeholder="Search "
              name="txtSearchFilter"
              value={filterValues.txtSearchFilter}
              onChange={(e) => updateFilterState(e.target.name, e.target.value)}
              onClick={() => searchByMobileTicketsOnClick(1, 5000)}
              style={{ width: "158px" }}
            />
          </>
        )}
        {/* </HeaderPortal> */}
      </div>
      <div className={BizClass.MainBox}>
        <div className={BizClass.divGridPagination}>
          <DataGrid
            rowData={farmersTicketData}
            loader={isLoadingFarmersticket ? <Loader /> : null}
            getRowStyle={getRowStyle}
            onGridReady={onGridReady}
            suppressContextMenu={true}
          >
            <DataGrid.Column headerName="Action" lockPosition="1" pinned="left" width={80} />
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
            <DataGrid.Column field="SupportTicketNo" headerName="Ticket No" width="150px" />
            <DataGrid.Column field="ApplicationNo" headerName="Application No" width="180px" useValueFormatterForExport={true} />
            <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="170px" />
            <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="120px" />
            <DataGrid.Column field="CallerContactNumber" headerName="Caller Mobile No." width="140px" />
            <DataGrid.Column field="RequestorName" headerName="Farmer Name" width="210px" />
            <DataGrid.Column field="RequestorMobileNo" headerName="Mobile No" width="110px" />
            <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
            <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="290px" />
            <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
            <DataGrid.Column field="TicketTypeName" headerName="Category" width="180px" />
            <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="200px" />
            <DataGrid.Column field="SchemeName" headerName="Scheme" width="220px" />
            <DataGrid.Column
              field="RequestSeason"
              headerName="Season"
              width="100px"
              valueFormatter={(param) => (param.value && param.value === 1 ? "Kharif" : param.value === 2 ? "Rabi" : "")}
            />
            <DataGrid.Column field="RequestYear" headerName="Year" width="100px" />
            <DataGrid.Column field="ApplicationCropName" headerName="Crop Name" width="150px" />
            {/* <DataGrid.Column
                 field="LossDate"
                 headerName="Crop Loss Date"
                 width="130px"
                 valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
               />
               <DataGrid.Column
                 field="LossTime"
                 headerName="Crop Loss Time"
                 width="130px"
                 valueGetter={(node) => {
                   return node.data.LossTime ? Convert24FourHourAndMinute(node.data.LossTime) : null;
                 }}
               /> */}
            <DataGrid.Column field="CreatedBY" headerName="Created By" width="160px" />
            <DataGrid.Column
              field="#"
              headerName="Created At"
              width="145px"
              valueGetter={(node) => {
                // A return node.data.CreatedAt ? `${dateFormat(node.data.CreatedAt.split("T")[0])} ${tConvert(node.data.CreatedAt.split("T")[1])}` : null;
                return node.data.CreatedAt
                  ? dateToSpecificFormat(
                      `${node.data.CreatedAt.split("T")[0]} ${Convert24FourHourAndMinute(node.data.CreatedAt.split("T")[1])}`,
                      "DD-MM-YYYY HH:mm",
                    )
                  : null;
              }}
            />
          </DataGrid>
          {showHideDownload === false || farmersTicketData.length === 0 ? null : (
            <ResponsivePagination current={currentPage} total={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
        {userData && userData.data && userData.data.data && userData.data.data.result ? null : (
          <div className={BizClass.FilterBox}>
            <div className={BizClass.Header}>
              {/* <h4>Filters Tickets </h4> */}
              <button type="button" className={BizClass.FilterTicketButton} onClick={() => getFilterTicketsClick()}>
                {" "}
                Filters Tickets
              </button>
              <span />

              <button type="button" className={BizClass.ExportButton} onClick={() => getOneDayTicketData()}>
                {" "}
                Download
              </button>
              <span />
            </div>
            <div className={BizClass.Content}>
              <Form>
                <div className={BizClass.FormContent}>
                  <Form.InputGroup label="From Date" req="false" errorMsg="">
                    <Form.InputControl
                      control="input"
                      type="date"
                      name="txtFromDate"
                      value={formValues.txtFromDate}
                      onChange={(e) => updateState("txtFromDate", e.target.value)}
                    />
                  </Form.InputGroup>
                  <Form.InputGroup label="To Date" req="false" errorMsg="">
                    <Form.InputControl
                      control="input"
                      type="date"
                      name="txtToDate"
                      value={formValues.txtToDate}
                      onChange={(e) => updateState("txtToDate", e.target.value)}
                    />
                  </Form.InputGroup>
                  <Form.InputGroup label="Type" req="false" errorMsg="">
                    <Form.InputControl
                      control="select"
                      name="txtTicketType"
                      value={formValues.txtTicketType}
                      options={ticketTypeList}
                      getOptionLabel={(option) => `${option.TicketTypeName}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateState("txtTicketType", e)}
                    />
                  </Form.InputGroup>
                  <Form.InputGroup label="Category" req="false" errorMsg="">
                    <Form.InputControl
                      control="select"
                      name="txtTicketCategoryType"
                      value={formValues.txtTicketCategoryType}
                      // A loader={isLoadingTicketCategoryTypeList ? <Loader /> : null}
                      isLoading={isLoadingTicketCategoryTypeList}
                      options={ticketCategoryTypeList}
                      getOptionLabel={(option) => `${option.SupportTicketTypeName}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateState("txtTicketCategoryType", e)}
                    />
                  </Form.InputGroup>
                  <Form.InputGroup label="Sub Category" req="false" errorMsg="">
                    <Form.InputControl
                      control="select"
                      name="txtTicketCategory"
                      options={ticketCategoryList}
                      // A loader={isLoadingTicketCategoryList ? <Loader /> : null}
                      isLoading={isLoadingTicketCategoryList}
                      getOptionLabel={(option) => `${option.TicketCategoryName}`}
                      getOptionValue={(option) => `${option}`}
                      value={formValues.txtTicketCategory}
                      onChange={(e) => updateState("txtTicketCategory", e)}
                    />
                  </Form.InputGroup>
                  {showHideDownload ? (
                    <Form.InputGroup label="Source" req="false" errorMsg="">
                      <Form.InputControl
                        control="select"
                        name="txtTicketSource"
                        options={ticketSourceList}
                        // A loader={isLoadingTicketSourceList ? <Loader /> : null}
                        isLoading={isLoadingTicketSourceList}
                        value={formValues.txtTicketSource}
                        getOptionLabel={(option) => `${option.TicketSourceName}`}
                        getOptionValue={(option) => `${option}`}
                        onChange={(e) => updateState("txtTicketSource", e)}
                      />
                    </Form.InputGroup>
                  ) : null}
                  <Form.InputGroup label="Status" req="false" errorMsg="">
                    <Form.InputControl
                      control="select"
                      name="txtStatus"
                      options={ticketStatusList}
                      // A loader={isLoadingTicketStatusList ? <Loader /> : null}
                      isLoading={isLoadingTicketStatusList}
                      value={formValues.txtStatus}
                      getOptionLabel={(option) => `${option.CommonMasterValue}`}
                      getOptionValue={(option) => `${option}`}
                      onChange={(e) => updateState("txtStatus", e)}
                    />
                  </Form.InputGroup>
                  {showHideDownload ? (
                    <>
                      <Form.InputGroup label="Scheme" req="false" errorMsg="">
                        <Form.InputControl
                          control="select"
                          name="txtScheme"
                          value={formValues.txtScheme}
                          options={schemeList}
                          // A loader={isLoadingSchemeListDropdownDataList ? <Loader /> : null}
                          isLoading={isLoadingSchemeListDropdownDataList}
                          getOptionLabel={(option) => `${option.SchemeName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateState("txtScheme", e)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Insurance Comp." req="false" errorMsg="">
                        <Form.InputControl
                          control="select"
                          name="txtInsuranceCompany"
                          options={insuranceCompanyList}
                          // A loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
                          isLoading={isLoadingInsuranceCompanyList}
                          getOptionLabel={(option) => `${option.CompanyName}`}
                          getOptionValue={(option) => `${option}`}
                          value={formValues.txtInsuranceCompany}
                          onChange={(e) => updateState("txtInsuranceCompany", e)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="State" req="false" errorMsg="">
                        <Form.InputControl
                          control="multiselect"
                          name="txtState"
                          options={stateList}
                          // A loader={isLoadingStateList ? <Loader /> : null}
                          isLoading={isLoadingStateList}
                          value={formValues.txtState}
                          onChange={(e) => updateState("txtState", e)}
                        />
                      </Form.InputGroup>
                    </>
                  ) : null}
                </div>
              </Form>
            </div>
            <div className={BizClass.Footer}>
              <button type="button" onClick={() => refereshFarmerTicket()}>
                Apply
              </button>
              &nbsp;
              {showHideDownload ? (
                <button type="button" onClick={() => ClearTicketFilters()}>
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmerCreatedTicket;
