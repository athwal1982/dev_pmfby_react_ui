import React, { useState, Suspense } from "react";
import { Loader } from "Framework/Components/Widgets";
import ProfileManagementLogics from "./Logic/Logic";

// Lazy load components
const ProfileManagement = React.lazy(() => import("./Views/ProfileManagement"));
const AddUserProfile = React.lazy(() => import("./Views/Modals/AddUserProfie/AddUserProfile"));
const AssignedUserListModal = React.lazy(() => import("./Views/Modals/AssignedUserListModal/AssignedUserListModal"));
const AssignedUserProfileRightListModal = React.lazy(() => import("./Views/Modals/AssignedUserProfileRightListModel/AssignedUserProfileRightListModel"));

function ProfileManagementPage() {
  const [addUserProfileModal, setAddUserProfileModal] = useState(false);
  const toggleAddUserProfileModal = () => {
    setAddUserProfileModal(!addUserProfileModal);
  };

  const {
    filterProfileMasterData,
    isLoadingProfileMasterData,
    updateProfileMgmt,
    onGetMenuClick,
    onProfileGridReady,
    menuListData,
    treeMenuListData,
    onGridReady,
    onAssignMenu,
    onUnAssignMenu,
    onSearch,
    onRefreshClick,
    onSearchMenuList,
  } = ProfileManagementLogics();

  const [assignedUsersModal, setAssignedUsersModal] = useState(false);

  const [assignedUserListModal, setAssignedUserListModal] = useState(false);
  const toggleAssignedUserListModal = (data) => {
    setAssignedUserListModal(!assignedUserListModal);
    setAssignedUsersModal(data);
  };

  const [assignedUsersProfileRightModal, setAssignedUsersProfileRightModal] = useState(false);

  const [assignedUserProfileRightListModal, setAssignedUserProfileRightListModal] = useState(false);
  const toggleAssignedUserProfileRightListModal = (data) => {
    setAssignedUserProfileRightListModal(!assignedUserProfileRightListModal);
    setAssignedUsersProfileRightModal(data);
  };

  return (
    <>
      {addUserProfileModal ? (
        <Suspense fallback={<Loader />}>
          <AddUserProfile showfunc={toggleAddUserProfileModal} updateProfileMgmt={updateProfileMgmt} />
        </Suspense>
      ) : null}
      {assignedUserListModal && (
        <Suspense fallback={<Loader />}>
          <AssignedUserListModal showfunc={toggleAssignedUserListModal} assignedUsersModal={assignedUsersModal} />
        </Suspense>
      )}
      {assignedUserProfileRightListModal && (
        <Suspense fallback={<Loader />}>
          <AssignedUserProfileRightListModal
            showfunc={toggleAssignedUserProfileRightListModal}
            assignedUsersProfileRightModal={assignedUsersProfileRightModal}
          />
        </Suspense>
      )}
      <Suspense fallback={<Loader />}>
        <ProfileManagement
          filterProfileMasterData={filterProfileMasterData}
          isLoadingProfileMasterData={isLoadingProfileMasterData}
          toggleAddUserProfileModal={toggleAddUserProfileModal}
          onProfileGridReady={onProfileGridReady}
          onGetMenuClick={onGetMenuClick}
          menuListData={menuListData}
          treeMenuListData={treeMenuListData}
          onGridReady={onGridReady}
          onAssignMenu={onAssignMenu}
          onUnAssignMenu={onUnAssignMenu}
          toggleAssignedUserListModal={toggleAssignedUserListModal}
          onSearch={onSearch}
          onRefreshClick={onRefreshClick}
          onSearchMenuList={onSearchMenuList}
          toggleAssignedUserProfileRightListModal={toggleAssignedUserProfileRightListModal}
        />
      </Suspense>
    </>
  );
}

export default ProfileManagementPage;
