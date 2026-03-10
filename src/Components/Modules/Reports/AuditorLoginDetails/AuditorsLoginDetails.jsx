import React, { useState, useMemo, Suspense } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateFormatDefault, dateToCompanyFormat, daysdifference, Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import * as XLSX from "xlsx";
import BizClass from "./AuditorsLoginDetails.module.scss";


import { getAuditorsLoginReportData } from "./Service/Methods";
function AuditorsLoginDetails() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
  });

  const [auditorLoginDetailsDataList, setAuditorLoginDetailsDataList] = useState(false);
  const [filteredAuditorLoginDetailsDataList, setFilteredAuditorLoginDetailsDataList] = useState([]);
  const [isLoadingAuditorLoginDetailsDataList, setLoadingAuditorLoginDetailsDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [auditorLoginDetailsListItemSearch, setAuditorLoginDetailsListItemSearch] = useState("");
  const onChangeAuditorLoginDetailsList = (val) => {
    setAuditorLoginDetailsListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const getAuditorLoginDetailsData = async () => {
    try {
      const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
      if (dateDiffrence > 31) {
        setAlertMessage({
          type: "error",
          message: "1 month date range is allowed only",
        });
        return;
      }
      setLoadingAuditorLoginDetailsDataList(true);

      const formData = {
        fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      const result = await getAuditorsLoginReportData(formData);
      setLoadingAuditorLoginDetailsDataList(false);
      if (result.responseCode === 1) {
        if (auditorLoginDetailsListItemSearch && auditorLoginDetailsListItemSearch.toLowerCase().includes("#")) {
          onChangeAuditorLoginDetailsList("");
        }
        setAuditorLoginDetailsDataList(result.responseData.auditData);
        setFilteredAuditorLoginDetailsDataList(result.responseData.auditData);
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

  const getAuditorLoginDetailsList = () => {
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
    getAuditorLoginDetailsData();
  };



  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 15 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
  
    ];
    XLSX.writeFile(workbook, "Auditors_Login_Details.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const exportClick = () => {
    if (auditorLoginDetailsDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      Purpose: "Purpose",
      LoginTime: "Login Time",
      LogoutTime: "Logout Time",
      AgentName: "Agent",
      UserID: "Agent ID",
    };
    const mappedData = auditorLoginDetailsDataList.map((value) => {
      return {
        Purpose: value.Purpose,
        LoginTime: value.LoginTime
          ? dateToSpecificFormat(`${value.LoginTime.split("T")[0]} ${Convert24FourHourAndMinute(value.LoginTime.split("T")[1])}`, "DD-MM-YYYY HH:mm")
          : "",
        LogoutTime: value.LogoutTime
          ? dateToSpecificFormat(`${value.LogoutTime.split("T")[0]} ${Convert24FourHourAndMinute(value.LogoutTime.split("T")[1])}`, "DD-MM-YYYY HH:mm")
          : "",
        AgentName: value.AgentName,
        UserID: value.UserID,
        
       
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };


  return (
    <>
      <div className={BizClass.PageStart}>
        <PageBar>
          <PageBar.Input
            ControlTxt="From Date"
            control="input"
            type="date"
            name="txtFromDate"
            value={formValues.txtFromDate}
            onChange={(e) => updateState("txtFromDate", e.target.value)}
          />
          <PageBar.Input
            ControlTxt="To Date"
            control="input"
            type="date"
            name="txtToDate"
            value={formValues.txtToDate}
            onChange={(e) => updateState("txtToDate", e.target.value)}
            max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
          />

          <PageBar.Search
            value={auditorLoginDetailsListItemSearch}
            onChange={(e) => onChangeAuditorLoginDetailsList(e.target.value)}
            onClick={() => getAuditorLoginDetailsList()}
          />
          <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredAuditorLoginDetailsDataList.length === 0}>
            Export
          </PageBar.ExcelButton>
        </PageBar>
        <DataGrid
          rowData={filteredAuditorLoginDetailsDataList}
          loader={isLoadingAuditorLoginDetailsDataList ? <Loader /> : false}
          onGridReady={onGridReady}
         
        >
          <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
          <DataGrid.Column field="Purpose" headerName="Purpose" width="120px" />
           <DataGrid.Column field="LoginTime" headerName="Login Time" width="150px" valueGetter={(node) => {
                          return node.data.LoginTime
                            ? dateToSpecificFormat(
                                `${node.data.LoginTime.split("T")[0]} ${Convert24FourHourAndMinute(node.data.LoginTime.split("T")[1])}`,
                                "DD-MM-YYYY HH:mm",
                              )
                            : null;
                        }} />
            <DataGrid.Column field="LogoutTime" headerName="Logout Time" width="150px" valueGetter={(node) => {
                          return node.data.LogoutTime
                            ? dateToSpecificFormat(
                                `${node.data.LogoutTime.split("T")[0]} ${Convert24FourHourAndMinute(node.data.LogoutTime.split("T")[1])}`,
                                "DD-MM-YYYY HH:mm",
                              )
                            : null;
                        }} />
             <DataGrid.Column field="AgentName" headerName="Agent" width="170px" />
              <DataGrid.Column field="UserID" headerName="Agent ID" width="120px" />
        </DataGrid>
      </div>
    </>
  );
}

export default AuditorsLoginDetails;