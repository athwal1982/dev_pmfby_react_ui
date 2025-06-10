import React, { useState, Suspense } from "react";
import { Loader } from "Framework/Components/Widgets";
import InsuranceCompanyManagementLogics from "./Logic/Logic";

// Lazy load components
const InsuranceCompanyManagement = React.lazy(() => import("./Views/InsuranceCompanyManagement"));
const AddInsuranceCompany = React.lazy(() => import("./Views/Modal/AddInsuranceCompany/AddInsuranceCompany"));
const EditInsuranceCompany = React.lazy(() => import("./Views/Modal/EditInsuranceCompany/EditInsuranceCompany"));

function InsuranceCompanyManagementPage() {
  const [addInsuranceCompanyModal, setAddInsuranceCompanyModal] = useState(false);
  const [editInsuranceCompanyModal, setEditInsuranceCompanyModal] = useState(false);
  const {
    isLoadingInsuranceCompanyDataList,
    insuranceCompanyDataList,
    onGridReady,
    updateInsuranceCompanyData,
    insuranceCompanyListItemSearch,
    onChangeInsuranceCompanyList,
    getInsuranceCompanyList,
  } = InsuranceCompanyManagementLogics();
  const toggleAddInsuranceCompanyModal = () => {
    setAddInsuranceCompanyModal(!addInsuranceCompanyModal);
  };
  const [seletedData, setSeletedData] = useState({});
  const toggleEditInsuranceCompanyModal = (data) => {
    setSeletedData(data);
    setEditInsuranceCompanyModal(!editInsuranceCompanyModal);
  };
  return (
    <>
      {addInsuranceCompanyModal ? (
        <Suspense fallback={<Loader />}>
          <AddInsuranceCompany showfunc={toggleAddInsuranceCompanyModal} updateInsuranceCompanyData={updateInsuranceCompanyData} />
        </Suspense>
      ) : null}
      {editInsuranceCompanyModal ? (
        <Suspense fallback={<Loader />}>
          <EditInsuranceCompany showfunc={toggleEditInsuranceCompanyModal} seletedData={seletedData} />
        </Suspense>
      ) : null}
      <Suspense fallback={<Loader />}>
        <InsuranceCompanyManagement
          isLoadingInsuranceCompanyDataList={isLoadingInsuranceCompanyDataList}
          insuranceCompanyDataList={insuranceCompanyDataList}
          onGridReady={onGridReady}
          toggleAddInsuranceCompanyModal={toggleAddInsuranceCompanyModal}
          onChangeInsuranceCompanyList={onChangeInsuranceCompanyList}
          insuranceCompanyListItemSearch={insuranceCompanyListItemSearch}
          getInsuranceCompanyList={getInsuranceCompanyList}
          toggleEditInsuranceCompanyModal={toggleEditInsuranceCompanyModal}
        />
      </Suspense>
    </>
  );
}

export default InsuranceCompanyManagementPage;
