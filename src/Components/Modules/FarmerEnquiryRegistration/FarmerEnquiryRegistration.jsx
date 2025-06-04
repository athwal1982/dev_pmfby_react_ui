import React, { Suspense } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import { AiFillInfoCircle } from "react-icons/ai";
import BizClass from "./FarmerEnquiryRegistration.module.scss";
import FarmerEnquiryRegistrationLogics from "./Logic/Logic";

// Lazy load components
const HeaderPortal = React.lazy(() => import("../Support/ManageTicket/Views/Layout/FarmerAuthenticateModal/HeaderPortal"));
const AddEnquiryForm = React.lazy(() => import("./ModalEnquiry/AddEnquiryForm"));
const EnquiryPopupData = React.lazy(() => import("./ModalEnquiry/EnquiryPopupData"));

function FarmerEnquiryRegistration() {
  const {
    selectedEnquiry,
    selectedTicketEnquiry,
    isLoadingSelectedTicketEnquiry,
    OpenAddForm,
    addForm,
    filterEnquiryDataList,
    searchEnquiryText,
    onSearchEnquiry,
    isLoadingEnquiryList,
    onEnquiryGridReady,
    EnquiryPopup,
    EnquiryDetails,
    value,
    setValue,
    wordcount,
    setWordcount,
    getEnquiryListData,
    handleSave,
    btnLoaderActive1,
    closeEnquiry,
    updateSearchFormState,
    searchFormValues,
    activityStatusFilterData,
    updateFarmersTickets,
    OpenViewFarmerEnquiryTiketsForm,
    enquiryGridApi,
  } = FarmerEnquiryRegistrationLogics();

  const viewEnquiryRight = getUserRightCodeAccess("ke74");
  const addEnqiryRight = getUserRightCodeAccess("bo1h");
  const viewEnquiryTicketRight = getUserRightCodeAccess("fe2t");
  const getRowStyle = (params) => {
    if (!params || !params.data) {
      return { background: "" };
    }
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.data.IsSelected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };
  const cellTemplate = (props) => {
    return (
      <button type="button" onClick={() => EnquiryDetails(props)} style={{ border: "none", backgroundColor: "none" }}>
        <AiFillInfoCircle style={{ fontSize: "18px", color: "#198754", marginTop: "1px" }} />
      </button>
    );
  };

  return (
    <>
      {EnquiryPopup ? (
        <Suspense fallback={<Loader />}>
        <EnquiryPopupData
          isLoadingSelectedTicketEnquiry={isLoadingSelectedTicketEnquiry}
          selectedTicketEnquiry={selectedTicketEnquiry}
          showfunc={closeEnquiry}
          selectedEnquiry={selectedEnquiry}
          value={value}
          setValue={setValue}
          wordcount={wordcount}
          setWordcount={setWordcount}
          handleSave={handleSave}
          btnLoaderActive1={btnLoaderActive1}
        />
        </Suspense>
      ) : (
        ""
      )}
      {addForm ?  <Suspense fallback={<Loader />}><AddEnquiryForm OpenAddForm={OpenAddForm} updateFarmersTickets={updateFarmersTickets} enquiryGridApi={enquiryGridApi} /></Suspense> : ""}
      <div className={BizClass.BizPageStart}>
         <Suspense fallback={<Loader />}>
        <HeaderPortal>
          <PageBar.Select
            label="Status"
            control="select"
            value={searchFormValues.txtActivityStatusFilter}
            name="txtActivityStatusFilter"
            getOptionLabel={(option) => `${option.Name}`}
            getOptionValue={(option) => `${option}`}
            options={activityStatusFilterData}
            onChange={(e) => updateSearchFormState("txtActivityStatusFilter", e)}
          />
          {viewEnquiryRight ? (
            <>
              {" "}
              <PageBar.Search onClick={() => getEnquiryListData(true)} value={searchEnquiryText} onChange={(e) => onSearchEnquiry(e.target.value)} />{" "}
            </>
          ) : null}
          {addEnqiryRight ? (
            <>
              <PageBar.Button onClick={() => OpenAddForm()}>Add</PageBar.Button>{" "}
            </>
          ) : null}
          {viewEnquiryTicketRight ? <PageBar.Button onClick={() => OpenViewFarmerEnquiryTiketsForm()}>View Tickets</PageBar.Button> : null}
        </HeaderPortal>
        </Suspense>
        {viewEnquiryRight ? (
          <div className={BizClass.DataGrid}>
            <DataGrid
              rowData={filterEnquiryDataList}
              loader={isLoadingEnquiryList ? <Loader /> : false}
              getRowStyle={getRowStyle}
              onGridReady={onEnquiryGridReady}
              cellRenderer="actionTemplate"
              components={{
                actionTemplate: cellTemplate,
              }}
            >
              <DataGrid.Column
                headerName="Action"
                lockPosition="1"
                pinned="left"
                width={80}
                cellRenderer="actionTemplate"
                cellRendererParams={{
                  EnquiryDetails,
                }}
              />
              <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
              <DataGrid.Column field="CallerContactNumber" headerName="Caller Mobile No." width="140px" />
              <DataGrid.Column field="farmerName" headerName="Farmer Name" width="210px" />
              <DataGrid.Column field="mobileNumber" headerName="Mobile No" width="200px" />
              <DataGrid.Column field="Description" headerName="Description" width="250px" />
              {/* <DataGrid.Column field="RelationShip" headerName="Relationship" width="180px" /> */}
              <DataGrid.Column field="InsuranceMasterName" headerName="Insurance Company" width="210px" />
              <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
              <DataGrid.Column field="SubDistrict" headerName="Sub District" width="160px" />
              <DataGrid.Column field="Village" headerName="Village" width="250px" />
              <DataGrid.Column field="EnquiryStatus" headerName="Status" width="120px" cellRenderer="actionActivityStatusCellStyle" />
            </DataGrid>
          </div>
        ) : (
          <div style={{ "text-align": "center" }}>You are not authorized to view ticket list</div>
        )}
      </div>
    </>
  );
}

export default FarmerEnquiryRegistration;
