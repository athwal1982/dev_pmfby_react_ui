import React, { useState, useMemo } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import BizClass from "./ICWiseAudit.module.scss";
import { getAuditReportData } from "./Service/Methods";
function ICWiseAudit() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
  });

  const [iCWiseAuditDataList, setICWiseAuditDataList] = useState(false);
  const [filteredICWiseAuditDataList, setFilteredICWiseAuditDataList] = useState([]);
  const [isLoadingICWiseAuditDataList, setLoadingICWiseAuditDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [iCWiseAuditListItemSearch, setICWiseAuditListItemSearch] = useState("");
  const onChangeICWiseAuditList = (val) => {
    setICWiseAuditListItemSearch(val);
    gridApi.setQuickFilter(val);
  };


  const getICWiseAuditData = async () => {
    try {
      const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
      if (dateDiffrence > 31) {
        setAlertMessage({
          type: "error",
          message: "1 month date range is allowed only",
        });
        return;
      }
      setLoadingICWiseAuditDataList(true);

      const formData = {
        fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        viewMode: "ICWiseAudit",
        supportTicketNo: "",
      };
      const result = await getAuditReportData(formData);
      setLoadingICWiseAuditDataList(false);
      if (result.responseCode === 1) {
        if (iCWiseAuditListItemSearch && iCWiseAuditListItemSearch.toLowerCase().includes("#")) {
          onChangeICWiseAuditList("");
        }
        setICWiseAuditDataList(result.responseData.auditData);
        setFilteredICWiseAuditDataList(result.responseData.auditData);
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

  const getICWiseAuditList = () => {
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
    getICWiseAuditData();
  };

  const exportClick = () => {
    if (iCWiseAuditDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const excelParams = {
      fileName: "IC_Wise_Audit",
      sheetName: "Audit_Report",
    };
    gridApi.exportDataAsExcel(excelParams);

  };

     const calculateTotalRow = () => {
      const totalRow = {
      InsuranceCompany: "Total",
      IsAudit: filteredICWiseAuditDataList.reduce((acc, row) => Number(acc) + Number(row.IsAudit ? row.IsAudit : 0), 0),
      Unstatisfied: filteredICWiseAuditDataList.reduce((acc, row) => Number(acc) + Number(row.Unstatisfied ? row.Unstatisfied : 0), 0),
      Satisfied: filteredICWiseAuditDataList.reduce((acc, row) => Number(acc) + Number(row.Satisfied ? row.Satisfied : 0), 0),
      NotFlagged: filteredICWiseAuditDataList.reduce((acc, row) => Number(acc) + Number(row.NotFlagged ? row.NotFlagged : 0), 0),
     };
      return [totalRow];
    };
 const pinnedBottomRowData = useMemo(() => calculateTotalRow(), [filteredICWiseAuditDataList]);
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
          value={iCWiseAuditListItemSearch}
          onChange={(e) => onChangeICWiseAuditList(e.target.value)}
          onClick={() => getICWiseAuditList()}
        />
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredICWiseAuditDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredICWiseAuditDataList} loader={isLoadingICWiseAuditDataList ? <Loader /> : false} onGridReady={onGridReady}  pinnedBottomRowData={pinnedBottomRowData}>
        <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="320px" />
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

export default ICWiseAudit;
