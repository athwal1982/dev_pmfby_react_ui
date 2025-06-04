import React, { useState, Suspense } from "react";
import { Loader } from "Framework/Components/Widgets";
import RegionalManagementLogics from "./Logic/Logic";

// Lazy load components
const RegionalManagement = React.lazy(() => import("./Views/RegionalManagement"));
const AddRegionalOfficeMaster = React.lazy(() => import("./Views/Modals/AddRegionalMaster/AddRegionalMasterModal"));
const UnAssignedRegionalStateModal = React.lazy(() => import("./Views/Modals/UnAssignRegionalStateModal/UnAssignRegionalStateModal"));

function RegionalManagementPage() {
  const [addRegionalMasterModal, setAddRegionalMasterModal] = useState(false);
  const [unAssignRegionalStateModal, setUnAssignRegionalStateModal] = useState(false);
  const {
    isLoadingRegionalDataList,
    regionalDataList,
    onGridReady,
    updateUserData,
    regionalListItemSearch,
    onChangeRegionList,
    getRegionalList,
    onGetMenuClick,
    isLoadingAssignDataList,
    assignStateList,
    onGridAssignReady,
    onClickDeleteAssignedRegionalState,
    onSearchAssignedRegionalState,
    updateAssignedStateList,
    selectedRowData,
  } = RegionalManagementLogics();

  const toggleAddRegionalMasterModal = () => {
    setAddRegionalMasterModal(!addRegionalMasterModal);
  };

  const toggleUnAssignedRegionalStateModal = () => {
    setUnAssignRegionalStateModal(!unAssignRegionalStateModal);
  };

  const bankInsuranceTypeOptions = [
    { Name: "Bank", Value: 1 },
    { Name: "Insurance Company", Value: 2 },
  ];

  return (
    <>
      {addRegionalMasterModal ? (
         <Suspense fallback={<Loader />}><AddRegionalOfficeMaster showfunc={toggleAddRegionalMasterModal} updateUserData={updateUserData} bankInsuranceTypeOptions={bankInsuranceTypeOptions} /></Suspense>
      ) : null}
      {unAssignRegionalStateModal ? (
         <Suspense fallback={<Loader />}><UnAssignedRegionalStateModal
          showfunc={toggleUnAssignedRegionalStateModal}
          updateAssignedStateList={updateAssignedStateList}
          selectedRowData={selectedRowData}
        />
        </Suspense>
      ) : null}

       <Suspense fallback={<Loader />}><RegionalManagement
        isLoadingRegionalDataList={isLoadingRegionalDataList}
        regionalDataList={regionalDataList}
        onGridReady={onGridReady}
        toggleAddRegionalMasterModal={toggleAddRegionalMasterModal}
        onChangeRegionList={onChangeRegionList}
        regionalListItemSearch={regionalListItemSearch}
        getRegionalList={getRegionalList}
        onGetMenuClick={onGetMenuClick}
        isLoadingAssignDataList={isLoadingAssignDataList}
        assignStateList={assignStateList}
        onGridAssignReady={onGridAssignReady}
        onClickDeleteAssignedRegionalState={onClickDeleteAssignedRegionalState}
        onSearchAssignedRegionalState={onSearchAssignedRegionalState}
        toggleUnAssignedRegionalStateModal={toggleUnAssignedRegionalStateModal}
      />
      </Suspense>
    </>
  );
}

export default RegionalManagementPage;
