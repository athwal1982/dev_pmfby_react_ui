import React, { useState, Suspense } from "react";
import { Loader } from "Framework/Components/Widgets";
import AccessRightsLogics from "./Logic/Logic";

// Lazy load components
const AccessRights = React.lazy(() => import("./Views/AccessRights"));
const AddRights = React.lazy(() => import("./Views/Modals/AddRights/AddRights"));
const AssignUsersPopup = React.lazy(() => import("./Views/Modals/AssignUsersPopup/AssignUsersPopup"));

function AccessRightsPage() {
  const [addUserModal, setAddUserModal] = useState(false);
  const toggleAddRightsModal = () => {
    setAddUserModal(!addUserModal);
  };
  const { filteredRightsDataList, isLoadingRightsData, updateRightsData, onGridReady, userRightsItemSearch, getRightsList, onChangeRightsList } =
    AccessRightsLogics();

  const [assignedUsersPopUp, setAssignedUsersPopUp] = useState(false);

  const [assignUsersPopUp, setAssignUsersPopUp] = useState(false);
  const toggleAssignUserPopUp = (data) => {
    setAssignUsersPopUp(!assignUsersPopUp);
    setAssignedUsersPopUp(data);
  };

  return (
    <>
      {assignUsersPopUp ? (
        <Suspense fallback={<Loader />}>
          <AssignUsersPopup showfunc={toggleAssignUserPopUp} assignedUsersPopUp={assignedUsersPopUp} />
        </Suspense>
      ) : null}
      {addUserModal ? (
        <Suspense fallback={<Loader />}>
          <AddRights showfunc={toggleAddRightsModal} updateRightsData={updateRightsData} />
        </Suspense>
      ) : null}
      <Suspense fallback={<Loader />}>
        <AccessRights
          toggleAddRightsModal={toggleAddRightsModal}
          onGridReady={onGridReady}
          filteredRightsDataList={filteredRightsDataList}
          isLoadingRightsData={isLoadingRightsData}
          toggleAssignUserPopUp={toggleAssignUserPopUp}
          onChangeRightsList={onChangeRightsList}
          getRightsList={getRightsList}
          userRightsItemSearch={userRightsItemSearch}
        />
      </Suspense>
    </>
  );
}

export default AccessRightsPage;
