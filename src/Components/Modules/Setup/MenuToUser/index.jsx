import React, { Suspense } from "react";
import { Loader } from "Framework/Components/Widgets";
import MenuToUserLogics from "./Logic/Logic";

// Lazy load components
const MenuToUserManagement = React.lazy(() => import("./Views/MenuToUser"));

function MenuToUser() {
  const {
    filteredUserDataList,
    isLoadingUserDataList,
    onGridReady,
    updateState,
    formValues,
    userNameSelect,
    onChangeMenuList,
    menuListItemSearch,
    getMenuLists,
    treeMenuListData,
    isLoadingMenuList,
    onAssignUnAssignMenu,
  } = MenuToUserLogics();
  return (
    <Suspense fallback={<Loader />}>
      <MenuToUserManagement
        treeMenuListData={treeMenuListData}
        isLoadingMenuList={isLoadingMenuList}
        filteredUserDataList={filteredUserDataList}
        isLoadingUserDataList={isLoadingUserDataList}
        onGridReady={onGridReady}
        updateState={updateState}
        formValues={formValues}
        userNameSelect={userNameSelect}
        onChangeMenuList={onChangeMenuList}
        menuListItemSearch={menuListItemSearch}
        getMenuLists={getMenuLists}
        onAssignUnAssignMenu={onAssignUnAssignMenu}
      />
    </Suspense>
  );
}

export default MenuToUser;
