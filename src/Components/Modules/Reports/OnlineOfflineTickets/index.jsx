import React from "react";
import OnlineOfflineTickets from "./Views/OnlineOfflineTickets";
import OnlineOfflineTicketsLogics from "./Logic/Logic";

function OnlineOfflineTicketsPage() {
  const {
    formValues,
    updateState,
    filteredOnlineOfflineTicketsDataList,
    isLoadingOnlineOfflineTicketsDataList,
    stateList,
    isLoadingStateList,
    onGridReady,
    onChangeOnlineOfflineTicketsList,
    getOnlineOfflineTicketsList,
    OnlineOfflineTicketsListItemSearch,
    onClickClearSearchFilter,
    exportClick,
    monthList,
    yearList,
  } = OnlineOfflineTicketsLogics();

  return (
    <OnlineOfflineTickets
      filteredOnlineOfflineTicketsDataList={filteredOnlineOfflineTicketsDataList}
      isLoadingOnlineOfflineTicketsDataList={isLoadingOnlineOfflineTicketsDataList}
      stateList={stateList}
      isLoadingStateList={isLoadingStateList}
      onGridReady={onGridReady}
      getOnlineOfflineTicketsList={getOnlineOfflineTicketsList}
      onChangeOnlineOfflineTicketsList={onChangeOnlineOfflineTicketsList}
      OnlineOfflineTicketsListItemSearch={OnlineOfflineTicketsListItemSearch}
      formValues={formValues}
      updateState={updateState}
      onClickClearSearchFilter={onClickClearSearchFilter}
      exportClick={exportClick}
      monthList={monthList}
      yearList={yearList}
    />
  );
}

export default OnlineOfflineTicketsPage;
