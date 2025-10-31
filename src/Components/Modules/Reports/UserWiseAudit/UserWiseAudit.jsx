import React, { useState, useMemo, Suspense } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import * as XLSX from "xlsx";
import BizClass from "./UserWiseAudit.module.scss";
// Lazy load components
const UserWiseAuditDetails = React.lazy(() => import("./Modal/UserWiseAuditDetails"));

import { getAuditReportData, getAuditDetailReportData } from "./Service/Methods";
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
      TicketReOpen: filteredUserWiseAuditDataList.reduce((acc, row) => Number(acc) + Number(row.TicketReOpen ? row.TicketReOpen : 0), 0),
    };
    return [totalRow];
  };
  const pinnedBottomRowData = useMemo(() => calculateTotalRow(), [filteredUserWiseAuditDataList]);

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 55 },
      { width: 25 },
      { width: 25 },
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
      { width: 80 },
      { width: 15 },
      { width: 80 },
      { width: 20 },
      { width: 15 },
      { width: 80 },
      { width: 20 },
      { width: 15 },
      { width: 80 },
      { width: 20 },
      { width: 15 },
      { width: 80 },
      { width: 20 },
      { width: 15 },
      { width: 80 },
      { width: 20 },
      { width: 15 },
      { width: 80 },
      { width: 20 },
      { width: 15 },
      { width: 80 },
      { width: 20 },
      { width: 15 },
      { width: 80 },
      { width: 20 },
      { width: 15 },
      { width: 80 },
      { width: 20 },
    ];
    XLSX.writeFile(workbook, "User_Wise_Audit_Details.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };
  const exportUserWiseAuditDetailsListClick = () => {
    if (UserWiseAuditDetailsCountList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      SupportTicketNo: "Ticket No",
      TicketDate: "Creation Date",
      TicketStatus: "Ticket Status",
      StateMasterName: "State",
      DistrictMasterName: "District",
      SubDistrictName: "Sub District",
      TicketHeadName: "Type",
      TicketTypeName: "Category",
      TicketCategoryName: "Sub Category",
      CropSeasonName: "Season",
      RequestYear: "Year",
      InsuranceCompany: "Insurance Company",
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
      PlotVillageName: "Plot Village",
      PlotDistrictName: "Plot District Name",
      ApplicationSource: "Application Source",
      CropShare: "Crop Share",
      IFSCCode: "IFSC Code",
      FarmerShare: "Farmer Share",
      SowingDate: "Sowing Date",
      TicketDescription: "Description",
      InprogressDate: "In-Progress",
      InprogressComment: "In-Progress Comment",
      InprogressUpdatedBy: "In-Progress By",
      ResolvedDate: "Resolved",
      ResolvedComment: "Resolved Comment",
      ResolvedUpdatedBy: "Resolved By",
      ReOpenDate: "Re-Open",
      ReOpenComment: "Re-Open Comment",
      ReOpenUpdatedBy: "Re-Open By",
      Inprogress1Date: "In-Progress-1",
      Inprogress1Comment: "In-Progress-1 Comment",
      Inprogress1UpdatedBy: "In-Progress-1 By",
      Resolved1Date: "Resolved-1",
      Resolved1Comment: "Resolved-1 Comment",
      Resolved1UpdatedBy: "Resolved-1 By",
      ReOpen1Date: "Re-Open-1",
      ReOpen1Comment: "Re-Open-1 Comment",
      ReOpen1UpdatedBy: "Re-Open-1 By",
      Inprogress2Date: "In-Progress-2",
      Inprogress2Comment: "In-Progress-2 Comment",
      Inprogress2UpdatedBy: "In-Progress-2 By",
      Resolved2Date: "Resolved-2",
      Resolved2Comment: "Resolved-2 Comment",
      Resolved2UpdatedBy: "Resolved-2 By",
      ReOpen2Date: "Re-Open-2",
      ReOpen2Comment: "Re-Open-2 Comment",
      ReOpen2UpdatedBy: "Re-Open-2 By",
    };
    const mappedData = UserWiseAuditDetailsCountList.map((value) => {
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
        CropSeasonName: value.CropSeasonName,
        RequestYear: value.RequestYear,
        TicketDate: value.Created ? dateToSpecificFormat(value.Created.split("T")[0], "DD-MM-YYYY") : "",
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
          ? dateToSpecificFormat(`${value.SowingDate.split("T")[0]} ${Convert24FourHourAndMinute(value.SowingDate.split("T")[1])}`, "DD-MM-YYYY HH:mm")
          : "",
        TicketDescription: value.TicketDescription,
        InprogressDate: value.InprogressDate,
        InprogressComment: value.InprogressComment,
        InprogressUpdatedBy: value.InprogressUpdatedBy,
        ResolvedDate: value.ResolvedDate,
        ResolvedComment: value.ResolvedComment,
        ResolvedUpdatedBy: value.ResolvedUpdatedBy,
        ReOpenDate: value.ReOpenDate,
        ReOpenComment: value.ReOpenComment,
        ReOpenUpdatedBy: value.ReOpenUpdatedBy,
        Inprogress1Date: value.Inprogress1Date,
        Inprogress1Comment: value.Inprogress1Comment,
        Inprogress1UpdatedBy: value.Inprogress1UpdatedBy,
        Resolved1Date: value.Resolved1Date,
        Resolved1Comment: value.Resolved1Comment,
        Resolved1UpdatedBy: value.Resolved1UpdatedBy,
        ReOpen1Date: value.ReOpen1Date,
        ReOpen1Comment: value.ReOpen1Comment,
        ReOpen1UpdatedBy: value.ReOpen1UpdatedBy,
        Inprogress2Date: value.Inprogress2Date,
        Inprogress2Comment: value.Inprogress2Comment,
        Inprogress2UpdatedBy: value.Inprogress2UpdatedBy,
        Resolved2Date: value.Resolved2Date,
        Resolved2Comment: value.Resolved2Comment,
        Resolved2UpdatedBy: value.Resolved2UpdatedBy,
        ReOpen2Date: value.ReOpen2Date,
        ReOpen2Comment: value.ReOpen2Comment,
        ReOpen2UpdatedBy: value.ReOpen2UpdatedBy,
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  const [UserWiseAuditDetailsCountList, setUserWiseAuditDetailsCountList] = useState([]);
  const [isLoadingUserWiseAuditDetailsCountList, setIsLoadingUserWiseAuditDetailsCountList] = useState(false);
  const getUserWiseAuditDetailsList = async (pType, pAppAccessID) => {
    try {
      setIsLoadingUserWiseAuditDetailsCountList(true);

      const formData = {
        fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        viewMode: "UserWiseAudit",
        type: pType,
        insuranceCompanyID: 0,
        userID: pAppAccessID,
      };

      const result = await getAuditDetailReportData(formData);
      setIsLoadingUserWiseAuditDetailsCountList(false);
      if (result.responseCode === 1) {
        if (result.responseData.auditData && result.responseData.auditData.length > 0) {
          setUserWiseAuditDetailsCountList(result.responseData.auditData);
        } else {
          setUserWiseAuditDetailsCountList([]);
        }
      } else {
        setUserWiseAuditDetailsCountList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [openUserWiseAuditDetailsModal, setOpenUserWiseAuditDetailsModal] = useState(false);
  const openUserWiseAuditDetailsClick = (data, type) => {
    if (data) {
      let pAppAccessID = data && data.AppAccessID ? data.AppAccessID : 0;
      getUserWiseAuditDetailsList(type, pAppAccessID);
    }
    setOpenUserWiseAuditDetailsModal(!openUserWiseAuditDetailsModal);
  };

  const IsAuditCellStyle = (params) => {
    return (
      <div>
        {params.node.rowPinned ? (
          params.data.IsAudit
        ) : params.data && Number(params.data.IsAudit) > 0 ? (
          <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openUserWiseAuditDetailsClick(params.data, "AUDIT")}>
            {params.data.IsAudit}
          </a>
        ) : (
          "0"
        )}
      </div>
    );
  };
  const SatisfiedCellStyle = (params) => {
    return (
      <div>
        {params.node.rowPinned ? (
          params.data.Satisfied
        ) : params.data && Number(params.data.Satisfied) > 0 ? (
          <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openUserWiseAuditDetailsClick(params.data, "SATISFIED")}>
            {params.data.Satisfied}
          </a>
        ) : (
          "0"
        )}
      </div>
    );
  };
  const UnstatisfiedCellStyle = (params) => {
    return (
      <div>
        {params.node.rowPinned ? (
          params.data.Unstatisfied
        ) : params.data && Number(params.data.Unstatisfied) > 0 ? (
          <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openUserWiseAuditDetailsClick(params.data, "UNSATISFIED")}>
            {params.data.Unstatisfied}
          </a>
        ) : (
          "0"
        )}
      </div>
    );
  };

  const NotFlaggedCellStyle = (params) => {
    return (
      <div>
        {params.node.rowPinned ? (
          params.data.NotFlagged
        ) : params.data && Number(params.data.NotFlagged) > 0 ? (
          <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openUserWiseAuditDetailsClick(params.data, "UNFLAGGED")}>
            {params.data.NotFlagged}
          </a>
        ) : (
          "0"
        )}
      </div>
    );
  };

  const ReOpenCellStyle = (params) => {
    return (
      <div>
        {params.node.rowPinned ? (
          params.data.TicketReOpen
        ) : params.data && Number(params.data.TicketReOpen) > 0 ? (
          <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openUserWiseAuditDetailsClick(params.data, "REOPEN")}>
            {params.data.TicketReOpen}
          </a>
        ) : (
          "0"
        )}
      </div>
    );
  };
  return (
    <>
      {openUserWiseAuditDetailsModal && (
        <Suspense fallback={<Loader />}>
          <UserWiseAuditDetails
            openUserWiseAuditDetailsClick={openUserWiseAuditDetailsClick}
            UserWiseAuditDetailsCountList={UserWiseAuditDetailsCountList}
            isLoadingUserWiseAuditDetailsCountList={isLoadingUserWiseAuditDetailsCountList}
            exportUserWiseAuditDetailsListClick={exportUserWiseAuditDetailsListClick}
          />
        </Suspense>
      )}
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
        <DataGrid
          rowData={filteredUserWiseAuditDataList}
          loader={isLoadingUserWiseAuditDataList ? <Loader /> : false}
          onGridReady={onGridReady}
          frameworkComponents={{
            IsAuditCellStyle,
            SatisfiedCellStyle,
            UnstatisfiedCellStyle,
            NotFlaggedCellStyle,
            ReOpenCellStyle,
          }}
          pinnedBottomRowData={pinnedBottomRowData}
        >
          <DataGrid.Column field="UserDisplayName" headerName="User Name" width="190px" />
          <DataGrid.Column
            field="IsAudit"
            headerName="Audited"
            width="140px"
            cellStyle={{ "text-align": "right" }}
            cellRenderer="IsAuditCellStyle"
            cellRendererParams={{
              openUserWiseAuditDetailsClick,
            }}
          />
          <DataGrid.Column
            field="Satisfied"
            headerName="Satisfactory"
            width="140px"
            cellStyle={{ "text-align": "right" }}
            cellRenderer="SatisfiedCellStyle"
            cellRendererParams={{
              openUserWiseAuditDetailsClick,
            }}
          />
          <DataGrid.Column
            field="Unstatisfied"
            headerName="Unsatisfactory"
            width="140px"
            cellStyle={{ "text-align": "right" }}
            cellRenderer="UnstatisfiedCellStyle"
            cellRendererParams={{
              openUserWiseAuditDetailsClick,
            }}
          />
          <DataGrid.Column
            field="NotFlagged"
            headerName="Audit done,result pending"
            width="210px"
            cellStyle={{ "text-align": "right" }}
            cellRenderer="NotFlaggedCellStyle"
            cellRendererParams={{
              openUserWiseAuditDetailsClick,
            }}
          />
          <DataGrid.Column
            field="TicketReOpen"
            headerName="Re-Open"
            width="110px"
            cellStyle={{ "text-align": "right" }}
            cellRenderer="ReOpenCellStyle"
            cellRendererParams={{
              openUserWiseAuditDetailsClick,
            }}
          />
        </DataGrid>
      </div>
    </>
  );
}

export default UserWiseAudit;
