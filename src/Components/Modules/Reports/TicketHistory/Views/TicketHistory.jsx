import React, { useEffect, useState } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Button, Loader } from "Framework/Components/Widgets";
import { dateFormatDDMMYY, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/bootstrap.css";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import BizClass from "./TicketHistory.module.scss";
import DownloadReport from "./DownloadReport";
import TicketHistoryDownloadList from "./TicketHistoryDownloadList";

function TicketHistory({
  formValues,
  updateState,
  filteredTicketHistoryDataList,
  isLoadingTicketHistoryDataList,
  insuranceCompanyList,
  isLoadingInsuranceCompanyList,
  getInsuranceCompanyListData,
  stateList,
  isLoadingStateList,
  getStateListData,
  onGridReady,
  onChangeTicketHistoryList,
  getTicketHistoryList,
  ticketHistoryListItemSearch,
  onClickClearSearchFilter,
  exportClick,
  totalPages,
  currentPage,
  handlePageChange,
  toggleDownloadReportModal,
  columnDefs,
}) {
  const userData = getSessionStorage("user");
  const ChkBRHeadTypeID = userData && userData.BRHeadTypeID ? userData.BRHeadTypeID.toString() : "0";
  const ChkAppAccessTypeID = userData && userData.AppAccessTypeID ? userData.AppAccessTypeID.toString() : "0";

  const ticketTypeList = [
    { TicketTypeID: "1", TicketTypeName: "Grievance" },
    { TicketTypeID: "2", TicketTypeName: "Information" },
    { TicketTypeID: "4", TicketTypeName: "Crop Loss Intimation" },
  ];

  useEffect(() => {
    getInsuranceCompanyListData();
    getStateListData();
  }, []);

  // A const [isDownloadReportModalOpen, setIsDownloadReportModalOpen] = useState(false);
  const [isDownloadHistoryListModalOpen, setisDownloadHistoryListModalOpen] = useState(false);

  //  A const toggleDownloadReportModal = () => {
  //  A debugger;
  //  A setIsDownloadReportModalOpen(!isDownloadReportModalOpen);
  // A };

  const toggleDownloadHistoryListModal = () => {
    setisDownloadHistoryListModalOpen(!isDownloadHistoryListModalOpen);
  };

  return (
    <>
      {/* {isDownloadReportModalOpen && <DownloadReport toggleDownloadReportModal={toggleDownloadReportModal} formValues={formValues} />} */}
      {isDownloadHistoryListModalOpen && <TicketHistoryDownloadList toggleDownloadHistoryListModal={toggleDownloadHistoryListModal} />}

      <div className={BizClass.PageStart}>
        <PageBar>
          <PageBar.Input
            ControlTxt="From Date"
            control="input"
            type="date"
            name="txtFromDate"
            value={formValues.txtFromDate}
            onChange={(e) => updateState("txtFromDate", e.target.value)}
            max={dateToSpecificFormat(moment().subtract(2, "days"), "YYYY-MM-DD")}
            style={{ width: "105px" }}
          />
          <PageBar.Input
            ControlTxt="To Date"
            control="input"
            type="date"
            name="txtToDate"
            value={formValues.txtToDate}
            onChange={(e) => updateState("txtToDate", e.target.value)}
            max={dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD")}
            style={{ width: "105px" }}
          />

          <PageBar.Select
            ControlTxt="State"
            name="txtState"
            value={formValues.txtState}
            loader={isLoadingStateList ? <Loader /> : null}
            options={stateList}
            getOptionLabel={(option) => `${option.StateMasterName}`}
            getOptionValue={(option) => `${option}`}
            onChange={(e) => updateState("txtState", e)}
          />

          <PageBar.Select
            ControlTxt="Insurance Company"
            name="txtInsuranceCompany"
            value={formValues.txtInsuranceCompany}
            loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
            options={insuranceCompanyList}
            getOptionLabel={(option) => `${option.CompanyName}`}
            getOptionValue={(option) => `${option}`}
            onChange={(e) => updateState("txtInsuranceCompany", e)}
          />
          <PageBar.Select
            ControlTxt="Search By"
            name="txtTicketType"
            label="Ticket Type"
            value={formValues.txtTicketType}
            options={ticketTypeList}
            getOptionLabel={(option) => option.TicketTypeName}
            getOptionValue={(option) => `${option}`}
            onChange={(e) => updateState("txtTicketType", e)}
          />
          <PageBar.Search
            value={ticketHistoryListItemSearch}
            onChange={(e) => onChangeTicketHistoryList(e.target.value)}
            onClick={() => getTicketHistoryList()}
            style={{ width: "100px" }}
          />
          {/* {ChkBRHeadTypeID === "124001" && ChkAppAccessTypeID === "472" ? (
          <Button type="button" varient="primary" onClick={() => getTicketHistoryList("MONGO")}>
            Search Mongodb
          </Button>
        ) : null} */}
          <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
            Clear
          </PageBar.Button>
          {/* <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredTicketHistoryDataList.length === 0}>
          Export
        </PageBar.ExcelButton> */}
          <PageBar.ExcelButton onClick={() => toggleDownloadReportModal()} disabled={filteredTicketHistoryDataList.length === 0}>
            Export
          </PageBar.ExcelButton>
          <PageBar.ExcelButton onClick={() => toggleDownloadHistoryListModal()}>List</PageBar.ExcelButton>
        </PageBar>
        <div className={BizClass.divGridPagination}>
          <DataGrid
            rowData={filteredTicketHistoryDataList}
            loader={isLoadingTicketHistoryDataList ? <Loader /> : null}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          ></DataGrid>

          {filteredTicketHistoryDataList.length === 0 ? null : (
            <ResponsivePagination current={currentPage} total={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </>
  );
}

export default TicketHistory;
TicketHistory.propTypes = {
  filteredTicketHistoryDataList: PropTypes.array,
  isLoadingTicketHistoryDataList: PropTypes.bool,
  getInsuranceCompanyListData: PropTypes.func.isRequired,
  insuranceCompanyList: PropTypes.array.isRequired,
  isLoadingInsuranceCompanyList: PropTypes.bool,
  getStateListData: PropTypes.func.isRequired,
  stateList: PropTypes.array.isRequired,
  isLoadingStateList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeTicketHistoryList: PropTypes.func.isRequired,
  getTicketHistoryList: PropTypes.func.isRequired,
  ticketHistoryListItemSearch: PropTypes.string,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
  toggleDownloadReportModal: PropTypes.func.isRequired,
};
