import React from "react";
import SosAgeingReport from "./Views/SosAgeing";
import SosAgeingReportLogics from "./Logic/Logic";

function SosAgeingReportPage() {
  const {
    filteredSosAgeingReportDataList,
    isLoadingSosAgeingReportDataList,
    onGridReady,
    formValues,
    updateState,
    reportFilterList,
    onClickSosAgeingReport,
    exportClick,
    SosAgeingTicketCountList,
    isLoadingSosAgeingTicketCountList,
    getSosAgeingReportsDetailsList,
    exportSosAgeingTicketListClick,
  } = SosAgeingReportLogics();

  return (
    <SosAgeingReport
      filteredSosAgeingReportDataList={filteredSosAgeingReportDataList}
      isLoadingSosAgeingReportDataList={isLoadingSosAgeingReportDataList}
      formValues={formValues}
      updateState={updateState}
      onGridReady={onGridReady}
      reportFilterList={reportFilterList}
      onClickSosAgeingReport={onClickSosAgeingReport}
      exportClick={exportClick}
      SosAgeingTicketCountList={SosAgeingTicketCountList}
      isLoadingSosAgeingTicketCountList={isLoadingSosAgeingTicketCountList}
      getSosAgeingReportsDetailsList={getSosAgeingReportsDetailsList}
      exportSosAgeingTicketListClick={exportSosAgeingTicketListClick}
    />
  );
}

export default SosAgeingReportPage;
