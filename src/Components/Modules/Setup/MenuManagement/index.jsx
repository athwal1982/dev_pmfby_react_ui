import React, { useState, Suspense } from "react";
import MenuManagementLogics from "./Logic/Logic";

// Lazy load components
const MenuManagement = React.lazy(() => import("./Views/MenuManagement"));
const SubMenuPopup = React.lazy(() => import("./Views/SubMenu/SubMenuPopUp"));
const AddMenuPopup = React.lazy(() => import("./Views/AddMenuPopUp/AddMenuPopUp"));

function MenuManagementPage() {
  const [addMenuModal, setAddMenuModal] = useState(false);
  const toggleAddMenuModal = () => {
    setAddMenuModal(!addMenuModal);
  };

  const {
    treeMenuListData,
    isLoadingMenuList,
    submenuPopupData,
    openSubmenuPopup,
    toggleAddSubMenuModal,
    onGridReady,
    updateMenuList,
    onChangemenuList,
    getMenuList,
    menuItemSearch,
  } = MenuManagementLogics();

  return (
    <>
      {addMenuModal ? (
        <Suspense fallback={<Loader />}>
          <AddMenuPopup showMenufunc={toggleAddMenuModal} updateMenuList={updateMenuList} />
        </Suspense>
      ) : null}
      {submenuPopupData.open ? (
        <Suspense fallback={<Loader />}>
          <SubMenuPopup
            isEditMode={submenuPopupData.isEditMode}
            openSubmenuPopup={openSubmenuPopup}
            menuData={submenuPopupData.data}
            showfunc={toggleAddSubMenuModal}
            updateMenuList={updateMenuList}
          />
        </Suspense>
      ) : null}
      <Suspense fallback={<Loader />}>
        <MenuManagement
          treeMenuListData={treeMenuListData}
          isLoadingMenuList={isLoadingMenuList}
          openSubmenuPopup={openSubmenuPopup}
          onGridReady={onGridReady}
          toggleAddMenuModal={toggleAddMenuModal}
          onChangemenuList={onChangemenuList}
          getMenuList={getMenuList}
          menuItemSearch={menuItemSearch}
        />
      </Suspense>
    </>
  );
}

export default MenuManagementPage;
