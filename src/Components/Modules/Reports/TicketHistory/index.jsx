import React from "react";
import TicketHistory from "./Views/TicketHistory";
import TicketHistoryLogics from "./Logic/Logic";

function TicketHistoryPage() {
  const {
    formValues,
    updateState,
    filteredTicketHistoryDataList,
    isLoadingTicketHistoryDataList,
    insuranceCompanyList,
    isLoadingInsuranceCompanyList,
    getInsuranceCompanyListData,
    stateList,
    isLoadingStateList,
    getStateListData,
    onGridReady,
    onChangeTicketHistoryList,
    getTicketHistoryList,
    ticketHistoryListItemSearch,
    onClickClearSearchFilter,
    exportClick,
    totalPages,
    currentPage,
    handlePageChange,
    toggleDownloadReportModal,
    columnDefs,
  } = TicketHistoryLogics();

  return (
    <TicketHistory
      filteredTicketHistoryDataList={filteredTicketHistoryDataList}
      isLoadingTicketHistoryDataList={isLoadingTicketHistoryDataList}
      insuranceCompanyList={insuranceCompanyList}
      isLoadingInsuranceCompanyList={isLoadingInsuranceCompanyList}
      getInsuranceCompanyListData={getInsuranceCompanyListData}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      getStateListData={getStateListData}
      onGridReady={onGridReady}
      getTicketHistoryList={getTicketHistoryList}
      onChangeTicketHistoryList={onChangeTicketHistoryList}
      ticketHistoryListItemSearch={ticketHistoryListItemSearch}
      formValues={formValues}
      updateState={updateState}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
      totalPages={totalPages}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      toggleDownloadReportModal={toggleDownloadReportModal}
      columnDefs={columnDefs}
    />
  );
}

export default TicketHistoryPage;
