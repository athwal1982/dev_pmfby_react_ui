import { useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference } from "Configration/Utilities/dateformat";
import * as XLSX from "xlsx";
import { getKRPHOnlineOtherTicketReport } from "../Services/Methods";

function OnlineOfflineTicketsLogics() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
  });

  const [OnlineOfflineTicketsDataList, setOnlineOfflineTicketsDataList] = useState(false);
  const [filteredOnlineOfflineTicketsDataList, setFilteredOnlineOfflineTicketsDataList] = useState([]);
  const [isLoadingOnlineOfflineTicketsDataList, setLoadingOnlineOfflineTicketsDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [OnlineOfflineTicketsListItemSearch, setOnlineOfflineTicketsListItemSearch] = useState("");
  const onChangeOnlineOfflineTicketsList = (val) => {
    setOnlineOfflineTicketsListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    // Calculate totals for each numeric column
    const totals = {};
    const columnKeys = Object.keys(data[0]); // Assumes all rows have the same keys

    columnKeys.forEach((key) => {
      if (typeof data[0][key] === "number") {
        totals[key] = data.reduce((sum, row) => sum + (row[key] || 0), 0); // Sum values in each column
      } else {
        totals[key] = "Total"; // Label for non-numeric columns
      }
    });

    // Append totals row to worksheet
    XLSX.utils.sheet_add_json(worksheet, [totals], { skipHeader: true, origin: -1 });
    worksheet["!cols"] = [{ width: 25 }, { width: 18 }, { width: 18 }, { width: 15 }, { width: 20 }, { width: 15 }, { width: 18 }, { width: 15 }];
    XLSX.writeFile(workbook, "Online_Offline_Tickets.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const getOnlineOfflineTicketsData = async () => {
    try {
      setLoadingOnlineOfflineTicketsDataList(true);

      const formData = {
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      const result = await getKRPHOnlineOtherTicketReport(formData);
      setLoadingOnlineOfflineTicketsDataList(false);
      if (result.responseCode === 1) {
        if (OnlineOfflineTicketsListItemSearch && OnlineOfflineTicketsListItemSearch.toLowerCase().includes("#")) {
          onChangeOnlineOfflineTicketsList("");
        }
        setOnlineOfflineTicketsDataList(result.responseData.status);
        setFilteredOnlineOfflineTicketsDataList(result.responseData.status);
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

  const getOnlineOfflineTicketsList = () => {
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
    const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
    if (dateDiffrence > 31) {
      setAlertMessage({
        type: "error",
        message: "1 month date range is allowed only",
      });
      return;
    }
    getOnlineOfflineTicketsData();
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtYearFilter: null,
      txtMonthFilter: null,
    });
  };

  const exportClick = () => {
    // A const excelParams = {
    // A  fileName: "Ticket History",
    // A };
    // A gridApi.exportDataAsExcel(excelParams);
    if (OnlineOfflineTicketsDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      StateMasterName: "State",
      GrievenceCreated: "Grievance Created",
      GrievenceResolved: "Grievance Resolved",
      ClaimCreated: "Claim Created",
      ClaimResolved: "Claim Resolved",
      OfflineCreated: "Offline Created",
      OfflineResolved: "Offline Resolved",
      Total: "Total",
    };
    const mappedData = OnlineOfflineTicketsDataList.map((value) => {
      return {
        StateMasterName: value.StateMasterName,
        GrievenceCreated: value.GrievenceCreated ? Number(value.GrievenceCreated) : 0,
        GrievenceResolved: value.GrievenceResolved ? Number(value.GrievenceResolved) : 0,
        ClaimCreated: value.ClaimCreated ? Number(value.ClaimCreated) : 0,
        ClaimResolved: value.ClaimResolved ? Number(value.ClaimResolved) : 0,
        OfflineCreated: value.OfflineCreated ? Number(value.OfflineCreated) : 0,
        OfflineResolved: value.OfflineResolved ? Number(value.OfflineResolved) : 0,
        Total:
          (value.GrievenceCreated ? Number(value.GrievenceCreated) : 0) +
          (value.GrievenceResolved ? Number(value.GrievenceResolved) : 0) +
          (value.ClaimCreated ? Number(value.ClaimCreated) : 0) +
          (value.ClaimResolved ? Number(value.ClaimResolved) : 0) +
          (value.OfflineCreated ? Number(value.OfflineCreated) : 0) +
          (value.OfflineResolved ? Number(value.OfflineResolved) : 0),
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  return {
    OnlineOfflineTicketsDataList,
    filteredOnlineOfflineTicketsDataList,
    isLoadingOnlineOfflineTicketsDataList,
    gridApi,
    onGridReady,
    onChangeOnlineOfflineTicketsList,
    OnlineOfflineTicketsListItemSearch,
    getOnlineOfflineTicketsList,
    formValues,
    updateState,
    isLoadingOnlineOfflineTicketsDataList,
    onClickClearSearchFilter,
    exportClick,
  };
}
export default OnlineOfflineTicketsLogics;
