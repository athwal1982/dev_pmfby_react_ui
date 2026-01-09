import React from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import moment from "moment";
import BizClass from "./UserWiseAuditDetails.module.scss";
function UserWiseAuditDetails({
  openUserWiseAuditDetailsClick,
  UserWiseAuditDetailsCountList,
  isLoadingUserWiseAuditDetailsCountList,
  exportUserWiseAuditDetailsListClick,
}) {
  return (
    <Modal varient="half" title="User Wise Audit Details" show={openUserWiseAuditDetailsClick} right="0" width="75vw">
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search />
            <PageBar.ExcelButton onClick={() => exportUserWiseAuditDetailsListClick()} disabled={UserWiseAuditDetailsCountList.length === 0}>
              Export
            </PageBar.ExcelButton>
          </PageBar>
          <DataGrid rowData={UserWiseAuditDetailsCountList} loader={isLoadingUserWiseAuditDetailsCountList ? <Loader /> : false}>
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
 <DataGrid.Column
                    field="RepresentationType"
                    headerName="Representation Type"
                    width="180px"
                    valueFormatter={(param) =>
                      param.value && param.value === "SINGLE" ? "Individual Representation" : param.value === "MULTIPLE" ? "Joint Representation" : ""
                    }
                  />
                  <DataGrid.Column field="GrievenceSupportTicketNo" headerName="Ticket No" width="150px" />
                  <DataGrid.Column field="CPGramRegistrationNumber" headerName="CPGRAM Registration No" width="200px" />
                  <DataGrid.Column
                    field="ComplaintDate"
                    headerName="Complaint Date"
                    width="140px"
                    valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
                  />
                  <DataGrid.Column field="ApplicationNo" headerName="Application No" width="180px" useValueFormatterForExport={true} />
                  <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="170px" />
                  <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="120px" />
                  <DataGrid.Column field="GrievenceSourceType" headerName="Source of Grievance" width="200px" />
                  <DataGrid.Column field="GrievenceSourceOtherType" headerName="Other Source of Grievance" width="200px" />
                  <DataGrid.Column field="SocialMediaType" headerName="Social Media" width="200px" />
                  <DataGrid.Column field="SocialMediaURL" headerName="Social Media URL/Link" width="200px" />
                  <DataGrid.Column field="OtherSocialMedia" headerName="Other Social Media" width="200px" />
                  <DataGrid.Column field="ReceiptSource" headerName="Source Of Receipt" width="200px" />
                  <DataGrid.Column field="FarmerName" headerName="Farmer Name" width="210px" />
                  <DataGrid.Column field="RequestorMobileNo" headerName="Mobile No" width="110px" />
                  <DataGrid.Column field="Email" headerName="Email ID" width="170px" />
                  <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
                  <DataGrid.Column field="DistrictMasterName" headerName="District" width="160px" />
                  <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="290px" />
                  <DataGrid.Column field="TicketCategoryName" headerName="Category" width="200px" />
                  <DataGrid.Column field="TicketSubCategoryName" headerName="Sub Category" width="200px" />
                  <DataGrid.Column
                    field="RequestSeason"
                    headerName="Season"
                    width="100px"
                    valueFormatter={(param) => (param.value && param.value === 1 ? "Kharif" : param.value === 2 ? "Rabi" : "")}
                  />
                  <DataGrid.Column
                    field="RequestYear"
                    headerName="Yesr"
                    width="100px"
                    valueFormatter={(param) => (param.value && param.value > 0 ? param.value : "")}
                  />
                  <DataGrid.Column field="CropName" headerName="Crop Name" width="150px" />
                  <DataGrid.Column field="GrievenceDescription" headerName="Description" width="290px" />
            <DataGrid.Column field="AuditBy" headerName="Audit By" width="160px" />
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

export default UserWiseAuditDetails;
