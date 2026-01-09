import React, { useState, useMemo, Suspense } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToCompanyFormat, dateToSpecificFormat, dateFormatDefault, daysdifference, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import * as XLSX from "xlsx";
import BizClass from "./ICWiseAuditGFOS.module.scss";
import { getGrievanceAuditReportData, getGrievanceAuditDetailReportData } from "./Service/Methods";
// Lazy load components
const ICWiseAuditDetails = React.lazy(() => import("./Modal/ICWiseAuditDetails"));

function ICWiseAudit({}) {
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
        grievenceSupportTicketNo: "",
      };
      const result = await getGrievanceAuditReportData(formData);
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
      TicketReOpen: filteredICWiseAuditDataList.reduce((acc, row) => Number(acc) + Number(row.TicketReOpen ? row.TicketReOpen : 0), 0),
    };
    return [totalRow];
  };
  const pinnedBottomRowData = useMemo(() => calculateTotalRow(), [filteredICWiseAuditDataList]);

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
 worksheet["!cols"] = [
      { width: 20 },
      { width: 25 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 18 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 25 },
      { width: 20 },
      { width: 45 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
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
      { width: 15 },
      { width: 80 },
      { width: 20 },
    ];
    XLSX.writeFile(workbook, "IC_Wise_Audit_GFOS_Details.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };
  const exportICWiseAuditDetailsListClick = () => {
    if (iCWiseAuditDetailsCountList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      GrievenceSupportTicketNo: "Ticket No",
      CPGramRegistrationNumber: "CPGRAM Registration No",
      ComplaintDate: "Complaint Date",
      ApplicationNo: "Application No",
      InsurancePolicyNo: "Policy No",
      TicketStatus: "Ticket Status",
      GrievenceSourceType: "Source Of Grievance",
      GrievenceSourceOtherType: "Other Source of Grievance",
      SocialMediaType: "Social Media",
      SocialMediaURL: "Social Media URL/Link",
      OtherSocialMedia: "Other Social Media",
      ReceiptSource: "Source Of Receipt",
      FarmerName: "Farmer Name",
      RequestorMobileNo: "Mobile No",
      Email: "Email ID",
      StateMasterName: "State",
      DistrictMasterName: "District",
      InsuranceCompany: "Insurance Company",
      TicketCategoryName: "Category",
      TicketSubCategoryName: "Sub Category",
      RequestSeason: "Season",
      RequestYear: "Year",
      CropName: "Crop Name",
      GrievenceDescription: "Description",
      AuditBy: "Audit By",
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
      Resolved1UpdatedBy: "Resolved-2 By",
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
    const mappedData = iCWiseAuditDetailsCountList.map((value) => {
      return {
        GrievenceSupportTicketNo: value.GrievenceSupportTicketNo,
        CPGramRegistrationNumber: value.CPGramRegistrationNumber,
        ComplaintDate: value.ComplaintDate ? dateToSpecificFormat(value.ComplaintDate.split("T")[0], "DD-MM-YYYY") : "",
        ApplicationNo: value.ApplicationNo,
        InsurancePolicyNo: value.InsurancePolicyNo,
        TicketStatus: value.TicketStatus,
        GrievenceSourceType: value.GrievenceSourceType,
        GrievenceSourceOtherType: value.GrievenceSourceOtherType,
        SocialMediaType: value.SocialMediaType,
        SocialMediaURL: value.SocialMediaURL,
        OtherSocialMedia: value.OtherSocialMedia,
        ReceiptSource: value.ReceiptSource,
        FarmerName: value.FarmerName,
        RequestorMobileNo: value.RequestorMobileNo,
        Email: value.Email,
        StateMasterName: value.StateMasterName,
        DistrictMasterName: value.DistrictMasterName,
        InsuranceCompany: value.InsuranceCompany,
        TicketCategoryName: value.TicketCategoryName,
        TicketSubCategoryName: value.TicketSubCategoryName,
        RequestSeason: value.RequestSeason && value.RequestSeason === 1 ? "Kharif" : value.RequestSeason === 2 ? "Rabi" : "",
        RequestYear: value.RequestYear && value.RequestYear > 0 ? value.RequestYear : "",
        CropName: value.CropName,
        AuditBy: value.AuditBy,
        InprogressDate: value.InprogressDate ? dateToSpecificFormat(value.InprogressDate.split("T")[0], "DD-MM-YYYY") : "",
                InprogressComment: value.InprogressComment,
                InprogressUpdatedBy: value.InprogressUpdatedBy,
                ResolvedDate: value.ResolvedDate ? dateToSpecificFormat(value.ResolvedDate.split("T")[0], "DD-MM-YYYY") : "",
                ResolvedComment: value.ResolvedComment,
                ResolvedUpdatedBy: value.ResolvedUpdatedBy,
                ReOpenDate: value.ReOpenDate ? dateToSpecificFormat(value.ReOpenDate.split("T")[0], "DD-MM-YYYY") : "",
                ReOpenComment: value.ReOpenComment,
                ReOpenUpdatedBy: value.ReOpenUpdatedBy,
                Inprogress1Date: value.Inprogress1Date ? dateToSpecificFormat(value.Inprogress1Date.split("T")[0], "DD-MM-YYYY") : "",
                Inprogress1Comment: value.Inprogress1Comment,
                Inprogress1UpdatedBy: value.Inprogress1UpdatedBy,
                Resolved1Date: value.Resolved1Date ? dateToSpecificFormat(value.Resolved1Date.split("T")[0], "DD-MM-YYYY") : "",
                Resolved1Comment: value.Resolved1Comment,
                Resolved1UpdatedBy: value.Resolved1UpdatedBy,
                ReOpen1Date: value.ReOpen1Date ? dateToSpecificFormat(value.ReOpen1Date.split("T")[0], "DD-MM-YYYY") : "",
                ReOpen1Comment: value.ReOpen1Comment,
                ReOpen1UpdatedBy: value.ReOpen1UpdatedBy,
                Inprogress2Date: value.Inprogress2Date ? dateToSpecificFormat(value.Inprogress2Date.split("T")[0], "DD-MM-YYYY") : "",
                Inprogress2Comment: value.Inprogress2Comment,
                Inprogress2UpdatedBy: value.Inprogress2UpdatedBy,
                Resolved2Date: value.Resolved2Date ? dateToSpecificFormat(value.Resolved2Date.split("T")[0], "DD-MM-YYYY") : "",
                Resolved2Comment: value.Resolved2Comment,
                Resolved2UpdatedBy: value.Resolved2UpdatedBy,
                ReOpen2Date: value.ReOpen2Date ? dateToSpecificFormat(value.ReOpen2Date.split("T")[0], "DD-MM-YYYY") : "",
                ReOpen2Comment: value.ReOpen2Comment,
                ReOpen2UpdatedBy: value.ReOpen2UpdatedBy,
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  const [iCWiseAuditDetailsCountList, setICWiseAuditDetailsCountList] = useState([]);
  const [isLoadingICWiseAuditDetailsCountList, setIsLoadingICWiseAuditDetailsCountList] = useState(false);
  const getIcWiseAuditDetailsList = async (pType, pinsuranceCompanyID, pgrandTotal) => {
    try {
      setIsLoadingICWiseAuditDetailsCountList(true);

      const formData = {
        fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        viewMode: "ICWiseAudit",
        type: pType,
        grandTotal: pgrandTotal,
        insuranceCompanyID: pinsuranceCompanyID,
        userID: 0,
      };

      const result = await getGrievanceAuditDetailReportData(formData);
      setIsLoadingICWiseAuditDetailsCountList(false);
      if (result.responseCode === 1) {
        if (result.responseData.auditData && result.responseData.auditData.length > 0) {
          setICWiseAuditDetailsCountList(result.responseData.auditData);
        } else {
          setICWiseAuditDetailsCountList([]);
        }
      } else {
        setICWiseAuditDetailsCountList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [openICWiseAuditDetailsModal, setOpenICWiseAuditDetailsModal] = useState(false);
  const openICWiseAuditDetailsClick = (data, type, grandTotal) => {
    if (data) {
      let pInsuranceCompanyID = data && data.InsuranceCompanyID ? data.InsuranceCompanyID : 0;
      getIcWiseAuditDetailsList(type, pInsuranceCompanyID, grandTotal);
    }
    setOpenICWiseAuditDetailsModal(!openICWiseAuditDetailsModal);
  };

 const IsAuditCellStyle = (params) => {
    return (
      <div>
        {params.node.rowPinned ? params.data && Number(params.data.IsAudit) > 0 ? (
          <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openICWiseAuditDetailsClick(params.data, "AUDIT",1)}>
            {params.data.IsAudit}
          </a>
        ) : 0 : (
          params.data && Number(params.data.IsAudit) > 0 ? 
           <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openICWiseAuditDetailsClick(params.data, "AUDIT", 0)}>
            {params.data.IsAudit}
          </a> : 0
        ) }
      </div>
    );
  };
  const SatisfiedCellStyle = (params) => {
    return (
      <div>
        {params.node.rowPinned ? params.data && Number(params.data.Satisfied) > 0 ? (
          <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openICWiseAuditDetailsClick(params.data, "SATISFIED",1)}>
            {params.data.Satisfied}
          </a>
        ) : 0 : (
          params.data && Number(params.data.Satisfied) > 0 ? 
           <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openICWiseAuditDetailsClick(params.data, "SATISFIED", 0)}>
            {params.data.Satisfied}
          </a> : 0
        )}
      </div>
    );
  };
  const UnstatisfiedCellStyle = (params) => {
    return (
      <div>
        {params.node.rowPinned ? params.data && Number(params.data.Unstatisfied) > 0 ? (
          <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openICWiseAuditDetailsClick(params.data, "UNSATISFIED",1)}>
            {params.data.Unstatisfied}
          </a>
        ) : 0 : (
          params.data && Number(params.data.Unstatisfied) > 0 ? 
           <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openICWiseAuditDetailsClick(params.data, "UNSATISFIED", 0)}>
            {params.data.Unstatisfied}
          </a> : 0
        )}
      </div>
    );
  };

  const NotFlaggedCellStyle = (params) => {
    return (
      <div>
         {params.node.rowPinned ? params.data && Number(params.data.NotFlagged) > 0 ? (
          <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openICWiseAuditDetailsClick(params.data, "UNFLAGGED",1)}>
            {params.data.NotFlagged}
          </a>
        ) : 0 : (
          params.data && Number(params.data.NotFlagged) > 0 ? 
           <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openICWiseAuditDetailsClick(params.data, "UNFLAGGED", 0)}>
            {params.data.NotFlagged}
          </a> : 0
        )}
      </div>
    );
  };

  const ReOpenCellStyle = (params) => {
    return (
      <div>
         {params.node.rowPinned ? params.data && Number(params.data.TicketReOpen) > 0 ?   (
          <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openICWiseAuditDetailsClick(params.data, "REOPEN",1)}>
            {params.data.TicketReOpen}
          </a>
        ) : 0 : (
          params.data && Number(params.data.TicketReOpen) > 0 ? 
           <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openICWiseAuditDetailsClick(params.data, "REOPEN", 0)}>
            {params.data.TicketReOpen}
          </a> : 0
        )}
      </div>
    );
  };
  return (
    <>
      {openICWiseAuditDetailsModal && (
        <Suspense fallback={<Loader />}>
          <ICWiseAuditDetails
            openICWiseAuditDetailsClick={openICWiseAuditDetailsClick}
            iCWiseAuditDetailsCountList={iCWiseAuditDetailsCountList}
            isLoadingICWiseAuditDetailsCountList={isLoadingICWiseAuditDetailsCountList}
            exportICWiseAuditDetailsListClick={exportICWiseAuditDetailsListClick}
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

          <PageBar.Search value={iCWiseAuditListItemSearch} onChange={(e) => onChangeICWiseAuditList(e.target.value)} onClick={() => getICWiseAuditList()} />
          <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredICWiseAuditDataList.length === 0}>
            Export
          </PageBar.ExcelButton>
        </PageBar>
        <DataGrid
          rowData={filteredICWiseAuditDataList}
          loader={isLoadingICWiseAuditDataList ? <Loader /> : false}
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
          <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="320px" />
          <DataGrid.Column
            field="IsAudit"
            headerName="Audited"
            width="140px"
            cellStyle={{ "text-align": "right" }}
            cellRenderer="IsAuditCellStyle"
            cellRendererParams={{
              openICWiseAuditDetailsClick,
            }}
          />
          <DataGrid.Column
            field="Satisfied"
            headerName="Satisfactory"
            width="140px"
            cellStyle={{ "text-align": "right" }}
            cellRenderer="SatisfiedCellStyle"
            cellRendererParams={{
              openICWiseAuditDetailsClick,
            }}
          />
          <DataGrid.Column
            field="Unstatisfied"
            headerName="Unsatisfactory"
            width="140px"
            cellStyle={{ "text-align": "right" }}
            cellRenderer="UnstatisfiedCellStyle"
            cellRendererParams={{
              openICWiseAuditDetailsClick,
            }}
          />
          <DataGrid.Column
            field="NotFlagged"
            headerName="Audit done,result pending"
            width="210px"
            cellStyle={{ "text-align": "right" }}
            cellRenderer="NotFlaggedCellStyle"
            cellRendererParams={{
              openICWiseAuditDetailsClick,
            }}
          />
          <DataGrid.Column
            field="TicketReOpen"
            headerName="Re-Open"
            width="110px"
            cellStyle={{ "text-align": "right" }}
            cellRenderer="ReOpenCellStyle"
            cellRendererParams={{
              openICWiseAuditDetailsClick,
            }}
          />
        </DataGrid>
      </div>
    </>
  );
}

export default ICWiseAudit;
