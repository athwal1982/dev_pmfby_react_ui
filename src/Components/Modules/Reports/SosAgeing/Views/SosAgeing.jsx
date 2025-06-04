import React, { useState, Suspense } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./SosAgeing.module.scss";

// Lazy load components
const SosAgeingTicketList = React.lazy(() => import("./Modal/SosAgeingTicketList"));

function SosAgeingReport({
  filteredSosAgeingReportDataList,
  isLoadingSosAgeingReportDataList,
  formValues,
  updateState,
  onGridReady,
  reportFilterList,
  onClickSosAgeingReport,
  exportClick,
  SosAgeingTicketCountList,
  isLoadingSosAgeingTicketCountList,
  getSosAgeingReportsDetailsList,
  exportSosAgeingTicketListClick,
}) {
  const [openSosAgeingTicketModal, setOpenSosAgeingTicketModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const openSosAgeingTicketListClick = (data, headerName) => {
    setSelectedRowData(data);
    
    if (data) {
      let pViewMode =
        formValues && formValues.txtReportFilter && formValues.txtReportFilter.Value === "Insurance"
          ? "I"
          : formValues.txtReportFilter.Value === "State"
          ? "S"
          : formValues.txtReportFilter.Value === "Category"
          ? "C"
          : formValues.txtReportFilter.Value === "Status"
          ? "All"
          : "";
      let pFiterlID = data && data.ID ? data.ID : 0;
      let pSosAgeingPeriodsID =
        headerName === "Total Open Ticket"
          ? "0"
          : headerName === "0-2 days"
          ? "1"
          : headerName === "2-4 days"
          ? "2"
          : headerName === "4-6 days"
          ? "3"
          : headerName === "6-8 days"
          ? "4"
          : headerName === "More than 8"
          ? "5"
          : "";
      getSosAgeingReportsDetailsList(pViewMode, pFiterlID, pSosAgeingPeriodsID);
    }
    setOpenSosAgeingTicketModal(!openSosAgeingTicketModal);
  };
  return (
    <>
      {openSosAgeingTicketModal && (
        <Suspense fallback={<Loader />}>
        <SosAgeingTicketList
          openSosAgeingTicketListClick={openSosAgeingTicketListClick}
          selectedRowData={selectedRowData}
          SosAgeingTicketCountList={SosAgeingTicketCountList}
          isLoadingSosAgeingTicketCountList={isLoadingSosAgeingTicketCountList}
          exportSosAgeingTicketListClick={exportSosAgeingTicketListClick}
        />
        </Suspense>
      )}
      <div className={BizClass.PageStart}>
        <PageBar>
          <PageBar.Select
            ControlTxt="Report Type"
            name="txtReportFilter"
            value={formValues.txtReportFilter}
            options={reportFilterList}
            getOptionLabel={(option) => `${option.Name}`}
            getOptionValue={(option) => `${option}`}
            onChange={(e) => updateState("txtReportFilter", e)}
          />
          <PageBar.Button onClick={() => onClickSosAgeingReport()} title="Clear">
            Search
          </PageBar.Button>
          <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredSosAgeingReportDataList.length === 0}>
            Export
          </PageBar.ExcelButton>
        </PageBar>

        <DataGrid
          onGridReady={onGridReady}
          rowData={filteredSosAgeingReportDataList}
          loader={isLoadingSosAgeingReportDataList ? <Loader /> : false}
          frameworkComponents={{
            totalOpenTicketCellStyle,
            zeroto3daysCellStyle,
            fourto7daysCellStyle,
            eighttotwelvedaysCellStyle,
            thirteentofifteendaysCellStyle,
            morthansixteenCellStyle,
          }}
        >
          <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
          <DataGrid.Column
            field="Name"
            headerName={
              formValues.txtReportFilter
                ? formValues.txtReportFilter.Value === "Insurance"
                  ? "Insurance Company"
                  : formValues.txtReportFilter.Value === "State"
                  ? "State Name"
                  : formValues.txtReportFilter.Value === "Category"
                  ? "Category"
                  : formValues.txtReportFilter.Value === "Status"
                  ? "Status"
                  : "#"
                : "#"
            }
            width={280}
          />
          <DataGrid.Column
            field={["Total Open Ticket"]}
            headerName="Total Open Ticket"
            width={150}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="totalOpenTicketCellStyle"
            cellRendererParams={{
              openSosAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["0-2 days"]}
            headerName="0-2 days"
            width={140}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="zeroto3daysCellStyle"
            cellRendererParams={{
              openSosAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["2-4 days"]}
            headerName="2-4 days"
            width={110}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="fourto7daysCellStyle"
            cellRendererParams={{
              openSosAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["4-6 days"]}
            headerName="4-6 days"
            width={110}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="eighttotwelvedaysCellStyle"
            cellRendererParams={{
              openSosAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["6-8 days"]}
            headerName="6-8 days"
            width={110}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="thirteentofifteendaysCellStyle"
            cellRendererParams={{
              openSosAgeingTicketListClick,
            }}
          />
          <DataGrid.Column
            field={["More than 8"]}
            headerName="More than 8"
            width={115}
            cellStyle={{ "text-align": "right" }}
            cellRenderer="morthansixteenCellStyle"
            cellRendererParams={{
              openSosAgeingTicketListClick,
            }}
          />
        </DataGrid>
      </div>
    </>
  );
}
const totalOpenTicketCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["Total Open Ticket"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openSosAgeingTicketListClick(params.data, "Total Open Ticket")}>
          {params.data["Total Open Ticket"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};
const zeroto3daysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["0-2 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openSosAgeingTicketListClick(params.data, "0-2 days")}>
          {params.data["0-2 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};
const fourto7daysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["2-4 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openSosAgeingTicketListClick(params.data, "2-4 days")}>
          {params.data["2-4 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

const eighttotwelvedaysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["4-6 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openSosAgeingTicketListClick(params.data, "4-6 days")}>
          {params.data["4-6 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

const thirteentofifteendaysCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["6-8 days"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openSosAgeingTicketListClick(params.data, "6-8 days")}>
          {params.data["6-8 days"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

const morthansixteenCellStyle = (params) => {
  return (
    <div>
      {params.data && params.data["More than 8"] ? (
        <a href="#" style={{ cursor: "pointer" }} onClick={() => params.openSosAgeingTicketListClick(params.data, "More than 8")}>
          {params.data["More than 8"]}
        </a>
      ) : (
        "0"
      )}
    </div>
  );
};

export default SosAgeingReport;
SosAgeingReport.propTypes = {
  filteredSosAgeingReportDataList: PropTypes.array,
  isLoadingSosAgeingReportDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  reportFilterList: PropTypes.array,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickSosAgeingReport: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
  SosAgeingTicketCountList: PropTypes.array,
  isLoadingSosAgeingTicketCountList: PropTypes.bool,
  getSosAgeingReportsDetailsList: PropTypes.func.isRequired,
};
