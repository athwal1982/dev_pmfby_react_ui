import { React, useMemo } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./OnlineOfflineTickets.module.scss";

function OnlineOfflineTickets({
  formValues,
  updateState,
  filteredOnlineOfflineTicketsDataList,
  isLoadingOnlineOfflineTicketsDataList,
  onGridReady,
  onChangeOnlineOfflineTicketsList,
  getOnlineOfflineTicketsList,
  OnlineOfflineTicketsListItemSearch,
  onClickClearSearchFilter,
  exportClick,
}) {
  const calculateTotalRow = () => {
    const totalRow = {
      StateMasterName: "Total",
      GrievenceCreated: filteredOnlineOfflineTicketsDataList.reduce((acc, row) => Number(acc) + Number(row.GrievenceCreated), 0),
      GrievenceResolved: filteredOnlineOfflineTicketsDataList.reduce((acc, row) => Number(acc) + Number(row.GrievenceResolved), 0),
      ClaimCreated: filteredOnlineOfflineTicketsDataList.reduce((acc, row) => Number(acc) + Number(row.ClaimCreated), 0),
      ClaimResolved: filteredOnlineOfflineTicketsDataList.reduce((acc, row) => Number(acc) + Number(row.ClaimResolved), 0),
      OfflineCreated: filteredOnlineOfflineTicketsDataList.reduce((acc, row) => Number(acc) + Number(row.OfflineCreated), 0),
      OfflineResolved: filteredOnlineOfflineTicketsDataList.reduce((acc, row) => Number(acc) + Number(row.OfflineResolved), 0),
    };
    return [totalRow];
  };

  const pinnedBottomRowData = useMemo(() => calculateTotalRow(), [filteredOnlineOfflineTicketsDataList]);

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
          style={{ width: "100px" }}
        />
        <PageBar.Input
          ControlTxt="To Date"
          control="input"
          type="date"
          name="txtToDate"
          value={formValues.txtToDate}
          onChange={(e) => updateState("txtToDate", e.target.value)}
          max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
          style={{ width: "100px" }}
        />

        <PageBar.Search
          value={OnlineOfflineTicketsListItemSearch}
          onChange={(e) => onChangeOnlineOfflineTicketsList(e.target.value)}
          onClick={() => getOnlineOfflineTicketsList()}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredOnlineOfflineTicketsDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid
        rowData={filteredOnlineOfflineTicketsDataList}
        loader={isLoadingOnlineOfflineTicketsDataList ? <Loader /> : false}
        onGridReady={onGridReady}
        pinnedBottomRowData={pinnedBottomRowData}
      >
        {/* <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left"  /> */}
        <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
        <DataGrid.ColumnGroup headerName="Online Tickets">
          <DataGrid.Column
            field="GrievenceCreated"
            headerName="Grievance Created"
            width="160px"
            cellStyle={{ "text-align": "right" }}
            valueGetter={(node) => {
              return node.data.GrievenceCreated ? node.data.GrievenceCreated : 0;
            }}
          />
          <DataGrid.Column
            field="GrievenceResolved"
            headerName="Grievance Resolved"
            width="160px"
            cellStyle={{ "text-align": "right" }}
            valueGetter={(node) => {
              return node.data.GrievenceResolved ? node.data.GrievenceResolved : 0;
            }}
          />
          <DataGrid.Column
            field="ClaimCreated"
            headerName="Claim Created"
            width="135px"
            cellStyle={{ "text-align": "right" }}
            valueGetter={(node) => {
              return node.data.ClaimCreated ? node.data.ClaimCreated : 0;
            }}
          />
          <DataGrid.Column
            field="ClaimResolved"
            headerName="Claim Resolved"
            width="145px"
            cellStyle={{ "text-align": "right" }}
            valueGetter={(node) => {
              return node.data.ClaimResolved ? node.data.ClaimResolved : 0;
            }}
          />
        </DataGrid.ColumnGroup>
        <DataGrid.ColumnGroup headerName="Offline Tickets" headerStyle={{ textAlign: "center" }}>
          <DataGrid.Column
            field="OfflineCreated"
            headerName="Offline Created"
            width="140px"
            cellStyle={{ "text-align": "right" }}
            valueGetter={(node) => {
              return node.data.OfflineCreated ? node.data.OfflineCreated : 0;
            }}
          />
          <DataGrid.Column
            field="OfflineResolved"
            headerName="Offline Resolved"
            width="140px"
            cellStyle={{ "text-align": "right" }}
            valueGetter={(node) => {
              return node.data.OfflineResolved ? node.data.OfflineResolved : 0;
            }}
          />
        </DataGrid.ColumnGroup>
        <DataGrid.Column
          field="total"
          headerName="Total"
          width="110px"
          cellStyle={{ "text-align": "right" }}
          valueGetter={(node) => {
            return (
              Number(node.data.GrievenceCreated) +
              Number(node.data.GrievenceResolved) +
              Number(node.data.ClaimCreated) +
              Number(node.data.ClaimResolved) +
              Number(node.data.OfflineCreated) +
              Number(node.data.OfflineResolved)
            );
          }}
        />
      </DataGrid>
    </div>
  );
}

export default OnlineOfflineTickets;
OnlineOfflineTickets.propTypes = {
  filteredOnlineOfflineTicketsDataList: PropTypes.array,
  isLoadingOnlineOfflineTicketsDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onChangeOnlineOfflineTicketsList: PropTypes.func.isRequired,
  getOnlineOfflineTicketsList: PropTypes.func.isRequired,
  OnlineOfflineTicketsListItemSearch: PropTypes.string,
  formValues: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onClickClearSearchFilter: PropTypes.func.isRequired,
  exportClick: PropTypes.func.isRequired,
};
