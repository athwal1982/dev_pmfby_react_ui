import React, { useState, useMemo } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import BizClass from "./UserWiseAudit.module.scss";
import { getAuditReportData } from "./Service/Methods";
function UserWiseAudit() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),

  });

  const [userWiseAuditDataList, setUserWiseAuditDataList] = useState(false);
  const [filteredUserWiseAuditDataList, setFilteredUserWiseAuditDataList] = useState([]);
  const [isLoadingUserWiseAuditDataList, setLoadingUserWiseAuditDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [userWiseAuditListItemSearch, setUserWiseAuditListItemSearch] = useState("");
  const onChangeUserWiseAuditList = (val) => {
    setUserWiseAuditListItemSearch(val);
    gridApi.setQuickFilter(val);
  };


  const getUserWiseAuditData = async () => {
    try {
      const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
      if (dateDiffrence > 31) {
        setAlertMessage({
          type: "error",
          message: "1 month date range is allowed only",
        });
        return;
      }
      setLoadingUserWiseAuditDataList(true);

      const formData = {
        fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        viewMode: "UserWiseAudit",
        supportTicketNo: "",
      };
      const result = await getAuditReportData(formData);
      setLoadingUserWiseAuditDataList(false);
      if (result.responseCode === 1) {
        if (userWiseAuditListItemSearch && userWiseAuditListItemSearch.toLowerCase().includes("#")) {
          onChangeUserWiseAuditList("");
        }
        setUserWiseAuditDataList(result.responseData.auditData);
        setFilteredUserWiseAuditDataList(result.responseData.auditData);
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

  const getUserWiseAuditList = () => {
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
    getUserWiseAuditData();
  };

  const exportClick = () => {
    if (userWiseAuditDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const excelParams = {
      fileName: "User_Wise_Audit",
      sheetName: "Audit_Report",
    };
    gridApi.exportDataAsExcel(excelParams);
   
  };

      const calculateTotalRow = () => {
      const totalRow = {
      UserDisplayName: "Total",
      IsAudit: filteredUserWiseAuditDataList.reduce((acc, row) => Number(acc) + Number(row.IsAudit ? row.IsAudit : 0), 0),
      Unstatisfied: filteredUserWiseAuditDataList.reduce((acc, row) => Number(acc) + Number(row.Unstatisfied ? row.Unstatisfied : 0), 0),
      Satisfied: filteredUserWiseAuditDataList.reduce((acc, row) => Number(acc) + Number(row.Satisfied ? row.Satisfied : 0), 0),
      NotFlagged: filteredUserWiseAuditDataList.reduce((acc, row) => Number(acc) + Number(row.NotFlagged ? row.NotFlagged : 0), 0),
     };
      return [totalRow];
    };
   const pinnedBottomRowData = useMemo(() => calculateTotalRow(), [filteredUserWiseAuditDataList]);

  return (
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
          value={userWiseAuditListItemSearch}
          onChange={(e) => onChangeUserWiseAuditList(e.target.value)}
          onClick={() => getUserWiseAuditList()}
        />
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredUserWiseAuditDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredUserWiseAuditDataList} loader={isLoadingUserWiseAuditDataList ? <Loader /> : false} onGridReady={onGridReady} pinnedBottomRowData={pinnedBottomRowData}>
                <DataGrid.Column field="UserDisplayName" headerName="User Name" width="190px" />
               <DataGrid.Column field="IsAudit" headerName="Audited" width="140px" cellStyle={{ "text-align": "right" }}  valueGetter={(node) => {
                                   return (
                                     Number(node.data.IsAudit ? node.data.IsAudit : 0)
                                   );
                                 }} />
                       <DataGrid.Column field="Satisfied" headerName="Satisfatory" width="140px" cellStyle={{ "text-align": "right" }}  valueGetter={(node) => {
                                   return (
                                     Number(node.data.Satisfied ?  node.data.Satisfied : 0)
                                   );
                                 }} />
                       <DataGrid.Column field="Unstatisfied" headerName="Unsatisfatory" width="140px" cellStyle={{ "text-align": "right" }}  valueGetter={(node) => {
                                   return (
                                     Number(node.data.Unstatisfied ?  node.data.Unstatisfied : 0)
                                   );
                                 }} />
                       <DataGrid.Column field="NotFlagged" headerName="Audit done,result pending" width="210px" cellStyle={{ "text-align": "right" }}  valueGetter={(node) => {
                                   return (
                                     Number(node.data.NotFlagged ? node.data.NotFlagged : 0)
                                   );
                                 }} /> 
                        <DataGrid.Column
                                 field="total"
                                 headerName="Total"
                                 width="110px"
                                 cellStyle={{ "text-align": "right" }}
                                 valueGetter={(node) => {
                                   return (
                                     Number(node.data.IsAudit ? node.data.IsAudit : 0) +
                                     Number(node.data.Satisfied ?  node.data.Satisfied : 0) +
                                     Number(node.data.Unstatisfied ?  node.data.Unstatisfied : 0) +
                                     Number(node.data.NotFlagged ? node.data.NotFlagged : 0)
                                   );
                                 }}
                               />
      </DataGrid>
    </div>
  );
}

export default UserWiseAudit;
