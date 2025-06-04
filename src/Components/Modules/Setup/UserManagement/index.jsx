import React, { useState,Suspense } from "react";
import { Loader } from "Framework/Components/Widgets";
import UserManagementLogics from "./Logic/Logic";
import ConfirmDialog from "Framework/ConfirmDialog/ConfirmDialog";

// Lazy load components
const UserManagement = React.lazy(() => import("./Views/UserManagement"));
const AddUser = React.lazy(() => import("./Views/Modals/AddUser/AddUser"));
const ProfileListModal = React.lazy(() => import("./Views/Modals/ProfileListModal/ProfileListModal"));
const AssignStateListModal = React.lazy(() => import("./Views/Modals/AssignStateListModal/AssignStateListModal"));
const ResetPasswordModal = React.lazy(() => import("./Views/Modals/ResetPasswordModal/ResetPasswordModal"));
const CategoryModal = React.lazy(() => import("./Views/Modals/Category/CategoryAssignModal"));
const AssignDistrictListModal = React.lazy(() => import("./Views/Modals/District/DistrictAssignModal"));
const AssignSubDistrictListModal = React.lazy(() => import("./Views/Modals/SubDistrict/SubDistrictAssignModal"));
const AssignBlockListModal = React.lazy(() => import("./Views/Modals/Block/BlockAssignModal"));
const AssignRegionalOfficeModal = React.lazy(() => import("./Views/Modals/AssignRegionalOfficeModal/AssignRegionalOfficeModal"));
const AssignInsCompModal = React.lazy(() => import("./Views/Modals/AssignInsCompModal/AssignInsCompModal"));

function UserManagementPage() {
  const [addUserModal, setAddUserModal] = useState(false);
  const toggleAddVisitModal = () => {
    setAddUserModal(!addUserModal);
  };
  const {
    filteredUserDataList,
    isLoadingUserDataList,
    updateUserData,
    onGridReady,
    onChangeUserList,
    getUsersList,
    userListItemSearch,
    onActiveUser,
    onDeActiveUser,
    updateUserDataList,
    onClearSearchClick,
  } = UserManagementLogics();

  const referenceTypeOptions = [
    { Name: "EMP", Value: "EMP" },
    { Name: "BR", Value: "BR" },
  ];

  const [selectedUserData, setSelectedUserData] = useState({});

  const [profileListModal, setProfileListModal] = useState(false);
  const toggleProfileListModal = (data) => {
    
    setProfileListModal(!profileListModal);
    setSelectedUserData(data);
  };

  const [assignStateListModal, setAssignStateListModal] = useState(false);
  const toggleAssignStateListModal = (data) => {
    setAssignStateListModal(!assignStateListModal);
    setSelectedUserData(data);
  };

  const [assignDistrictListModal, setAssignDistrictListModal] = useState(false);
  const toggleAssignDistrictListModal = (data) => {
    setAssignDistrictListModal(!assignDistrictListModal);
    setSelectedUserData(data);
  };
  const [assignSubDistrictListModal, setAssignSubDistrictListModal] = useState(false);
  const toggleAssignSubDistrictListModal = (data) => {
    setAssignSubDistrictListModal(!assignSubDistrictListModal);
    setSelectedUserData(data);
  };
  const [assignBlockListModal, setAssignBlockListModal] = useState(false);
  const toggleAssignBlockListModal = (data) => {
    setAssignBlockListModal(!assignBlockListModal);
    setSelectedUserData(data);
  };

  const toggleCloseDistrictListModal = () => {
    setAssignDistrictListModal(!assignDistrictListModal);
  };
  const toggleCloseSubDistrictListModal = () => {
    setAssignSubDistrictListModal(!assignSubDistrictListModal);
  };
  const toggleCloseBlockListModal = () => {
    setAssignBlockListModal(!assignBlockListModal);
  };

  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const toggleResetPasswordModal = (data) => {
    setResetPasswordModal(!resetPasswordModal);
    setSelectedUserData(data);
  };

  const [categoryModal, setCategoryModal] = useState(false);
  const toggleCategoryModal = (data) => {
    setCategoryModal(!categoryModal);
    setSelectedUserData(data);
  };
  const toggleCloseCategoryModal = () => {
    setCategoryModal(!categoryModal);
  };

  const [assignRegionalOfficeListModal, setAssignRegionalOfficeListModal] = useState(false);
  const toggleAssignRegionalOfficeListModal = (data) => {
    setAssignRegionalOfficeListModal(!assignRegionalOfficeListModal);
    setSelectedUserData(data);
  };

  const [assignInsCompModal, setAssignInsCompModal] = useState(false);
  const toggleAssignInsCompModal = (data) => {
    setAssignInsCompModal(!assignInsCompModal);
    setSelectedUserData(data);
  };

  const [confirmAlert, setConfirmAlert] = useState({
    open: false,
    title: "",
    msg: "",
    onConfirm: null,
    button: { confirmText: "", abortText: "" },
  });

  return (
    <>
      {confirmAlert.open && <ConfirmDialog confirmAlert={confirmAlert} setConfirmAlert={setConfirmAlert} />}
      {addUserModal ? (
         <Suspense fallback={<Loader />}>
        <AddUser showfunc={toggleAddVisitModal} updateUserData={updateUserData} referenceTypeOptions={referenceTypeOptions} setConfirmAlert={setConfirmAlert} /></Suspense>
      ) : null}
      {profileListModal && <ProfileListModal showfunc={toggleProfileListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} />}
      {assignStateListModal ? (
         <Suspense fallback={<Loader />}>
        <AssignStateListModal showfunc={toggleAssignStateListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} /></Suspense>
      ) : null}
      {assignDistrictListModal ? (
         <Suspense fallback={<Loader />}>
        <AssignDistrictListModal showfunc={toggleCloseDistrictListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} /></Suspense>
      ) : null}
      {assignSubDistrictListModal ? (
         <Suspense fallback={<Loader />}>
        <AssignSubDistrictListModal showfunc={toggleCloseSubDistrictListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} /></Suspense>
      ) : null}
      {assignBlockListModal ? (
         <Suspense fallback={<Loader />}>
        <AssignBlockListModal showfunc={toggleCloseBlockListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} /></Suspense>
      ) : null}

      {resetPasswordModal ? <Suspense fallback={<Loader />}><ResetPasswordModal showfunc={toggleResetPasswordModal} selectedUserData={selectedUserData} /></Suspense> : null}
      {categoryModal ? <Suspense fallback={<Loader />}><CategoryModal showfunc={toggleCloseCategoryModal} selectedUserData={selectedUserData} /></Suspense> : null}
      {assignRegionalOfficeListModal ? (
         <Suspense fallback={<Loader />}>
        <AssignRegionalOfficeModal showfunc={toggleAssignRegionalOfficeListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} /></Suspense>
      ) : null}
      {assignInsCompModal ? (
        <Suspense fallback={<Loader />}>
        <AssignInsCompModal showfunc={toggleAssignInsCompModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} /></Suspense>
      ) : null}
       <Suspense fallback={<Loader />}>
      <UserManagement
        filteredUserDataList={filteredUserDataList}
        isLoadingUserDataList={isLoadingUserDataList}
        toggleAddVisitModal={toggleAddVisitModal}
        onGridReady={onGridReady}
        getUsersList={getUsersList}
        onChangeUserList={onChangeUserList}
        userListItemSearch={userListItemSearch}
        onActiveUser={onActiveUser}
        onDeActiveUser={onDeActiveUser}
        toggleProfileListModal={toggleProfileListModal}
        toggleAssignStateListModal={toggleAssignStateListModal}
        toggleAssignDistrictListModal={toggleAssignDistrictListModal}
        toggleAssignSubDistrictListModal={toggleAssignSubDistrictListModal}
        toggleAssignBlockListModal={toggleAssignBlockListModal}
        toggleCloseSubDistrictListModal={toggleCloseSubDistrictListModal}
        toggleCloseBlockListModal={toggleCloseBlockListModal}
        toggleResetPasswordModal={toggleResetPasswordModal}
        toggleCategoryModal={toggleCategoryModal}
        toggleCloseCategoryModal={toggleCloseCategoryModal}
        toggleCloseDistrictListModal={toggleCloseDistrictListModal}
        toggleAssignRegionalOfficeListModal={toggleAssignRegionalOfficeListModal}
        toggleAssignInsCompModal={toggleAssignInsCompModal}
        onClearSearchClick={onClearSearchClick}
      />
      </Suspense>
    </>
  );
}

export default UserManagementPage;
