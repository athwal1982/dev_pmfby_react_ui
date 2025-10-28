import React from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import BizClass from "./ICWiseAuditDetails.module.scss";
function ICWiseAuditDetails({
  openICWiseAuditDetailsClick,
  iCWiseAuditDetailsCountList,
  isLoadingICWiseAuditDetailsCountList,
  exportICWiseAuditDetailsListClick,
}) {
  return (
    <Modal varient="half" title="IC Wise Audit Details" show={openICWiseAuditDetailsClick} right="0" width="75vw">
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search />
            <PageBar.ExcelButton onClick={() => exportICWiseAuditDetailsListClick()} disabled={iCWiseAuditDetailsCountList.length === 0}>
              Export
            </PageBar.ExcelButton>
          </PageBar>
          <DataGrid rowData={iCWiseAuditDetailsCountList} loader={isLoadingICWiseAuditDetailsCountList ? <Loader /> : false}>
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
            <DataGrid.Column field="SupportTicketNo" headerName="Ticket No" width="160px" />
            <DataGrid.Column
              field="#"
              headerName="Creation Date"
              width="128px"
              valueGetter={(node) => {
                return node.data.InsertDateTime ? `${dateFormatDDMMYY(node.data.InsertDateTime.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="150px" />
            <DataGrid.Column field="StateMasterName" headerName="State" width="150px" />
            <DataGrid.Column field="DistrictMasterName" headerName="District" width="150px" />
            <DataGrid.Column field="TicketHeadName" headerName="Type" width="150px" />
            <DataGrid.Column field="TicketTypeName" headerName="Category" width="160px" />
            <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="170px" />
            <DataGrid.Column field="CropSeasonName" headerName="Season" width="90px" />
            <DataGrid.Column field="RequestYear" headerName="Year" width="70px" />
            <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="290px" />
            <DataGrid.Column field="ApplicationNo" headerName="Application No" width="210px" />
            <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="170px" />
            <DataGrid.Column field="CallerContactNumber" headerName="Caller Mobile No." width="140px" />
            <DataGrid.Column field="RequestorName" headerName="Farmer Name" width="220px" />
            <DataGrid.Column field="RequestorMobileNo" headerName="Mobile No" width="125px" />
            <DataGrid.Column field="TicketDescription" headerName="Description" width="290px" />
            <DataGrid.Column
              field="InprogressDate"
              headerName="In-progress"
              width="120px"
              valueGetter={(node) => {
                return node.data.InprogressDate ? `${dateFormatDDMMYY(node.data.InprogressDate.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="InprogressComment" headerName="In-Progress Comment" width="290px" />
            <DataGrid.Column field="InprogressUpdatedBy" headerName="In-Progress By" width="160px" />
            <DataGrid.Column
              field="ResolvedDate"
              headerName="Resolved"
              width="120px"
              valueGetter={(node) => {
                return node.data.ResolvedDate ? `${dateFormatDDMMYY(node.data.ResolvedDate.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="ResolvedComment" headerName="Resolved Comment" width="290px" />
            <DataGrid.Column field="ResolvedUpdatedBy" headerName="Resolved By" width="160px" />
            <DataGrid.Column
              field="ReOpenDate"
              headerName="Re-Open"
              width="120px"
              valueGetter={(node) => {
                return node.data.ReOpenDate ? `${dateFormatDDMMYY(node.data.ReOpenDate.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="ReOpenComment" headerName="Re-Open Comment" width="290px" />
            <DataGrid.Column field="ReOpenUpdatedBy" headerName="Re-Open By" width="160px" />
            <DataGrid.Column
              field="Inprogress1Date"
              headerName="In-Progress-1"
              width="132px"
              valueGetter={(node) => {
                return node.data.Inprogress1Date ? `${dateFormatDDMMYY(node.data.Inprogress1Date.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="Inprogress1Comment" headerName="In-Progress-1 Comment" width="290px" />
            <DataGrid.Column field="Inprogress1UpdatedBy" headerName="In-Progress-1 By" width="160px" />
            <DataGrid.Column
              field="Resolved1Date"
              headerName="Resolved-1"
              width="120px"
              valueGetter={(node) => {
                return node.data.Resolved1Date ? `${dateFormatDDMMYY(node.data.Resolved1Date.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="Resolved1Comment" headerName="Resolved-1 Comment" width="290px" />
            <DataGrid.Column field="Resolved1UpdatedBy" headerName="Resolved-1 By" width="160px" />
            <DataGrid.Column
              field="ReOpen1Date"
              headerName="Re-Open-1"
              width="120px"
              valueGetter={(node) => {
                return node.data.ReOpen1Date ? `${dateFormatDDMMYY(node.data.ReOpen1Date.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="ReOpen1Comment" headerName="Re-Open-1 Comment" width="290px" />
            <DataGrid.Column field="ReOpen1UpdatedBy" headerName="Re-Open-1 By" width="160px" />
            <DataGrid.Column
              field="Inprogress2Date"
              headerName="In-Progress-2"
              width="132px"
              valueGetter={(node) => {
                return node.data.Inprogress2Date ? `${dateFormatDDMMYY(node.data.Inprogress2Date.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="Inprogress2Comment" headerName="In-Progress-2 Comment" width="290px" />
            <DataGrid.Column field="Inprogress2UpdatedBy" headerName="In-Progress-2 By" width="160px" />
            <DataGrid.Column
              field="Resolved2Date"
              headerName="Resolved-2"
              width="132px"
              valueGetter={(node) => {
                return node.data.Resolved2Date ? `${dateFormatDDMMYY(node.data.Resolved2Date.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="Resolved2Comment" headerName="Resolved-2 Comment" width="290px" />
            <DataGrid.Column field="Resolved2UpdatedBy" headerName="Resolved-2 By" width="160px" />
            <DataGrid.Column
              field="ReOpen2Date"
              headerName="Re-Open-2"
              width="132px"
              valueGetter={(node) => {
                return node.data.ReOpen2Date ? `${dateFormatDDMMYY(node.data.ReOpen2Date.split("T")[0])}` : null;
              }}
            />
            <DataGrid.Column field="ReOpen2Comment" headerName="Re-Open-2 Comment" width="290px" />
            <DataGrid.Column field="ReOpen2UpdatedBy" headerName="Re-Open-2 By" width="160px" />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default ICWiseAuditDetails;
