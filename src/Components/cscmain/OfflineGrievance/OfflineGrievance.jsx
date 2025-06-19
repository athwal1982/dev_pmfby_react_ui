import React,{ useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid,PageBar, Form } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat, Convert24FourHourAndMinute, daysdifference, dateFormatDefault } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getMasterDataBindingDataList } from "../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getGrievenceTicketsListData } from "./Services/Methods";
import { getMasterDataBinding } from "../../Modules/Support/ManageTicket/Services/Methods";
import BizClass from "./OfflineGrievance.module.scss";
import AddOfflineGrievance from "./AddOfflineGrievance";

const OfflineGrievance = () => {
    const setAlertMessage = AlertMessage();


    const [formValues, setFormValues] = useState({
        txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
        txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
        txtState:  null,
        txtgrievenceTicketSourceType: null,
        txtSocialMedia: null,
        txtSourceOfReceipt: null,
        txtStatus: null,
    });

    const updateState = (name, value) => {
     setFormValues({ ...formValues, [name]: value });
    };

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    setGridApi(params.api);
   const gridColumnApi = params.columnApi;

  // A Wait for the data to load before autosizing
  setTimeout(() => {
    const allColumnIds = [];
    gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getId());
    });
    gridColumnApi.autoSizeColumns(allColumnIds, false);
  }, 100);
  };  

  const [searchTextCodeMaster, setSearchTextCodeMaster] = useState("");
  const onSearchCodeMaster = (val) => {
    setSearchTextCodeMaster(val);
    gridApi.setQuickFilter(val);
    gridApi.refreshCells();
  };

    const ClearTicketFilters = () => {
    setFormValues({
      ...formValues,
        txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
        txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
        txtState:  null,
        txtgrievenceTicketSourceType: null,
        txtSocialMedia: null,
        txtSourceOfReceipt: null,
        txtStatus: null,
    });
    setRowData([]);
  };

  const [isLoadingMaster, setIsLoadingMaster] = useState(false);
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);

    const generateColumns = (data) => {
    const columnDefinitions = [];
    if (data.length > 0) {
      columnDefinitions.push({
        headerName: "Sr.No.",
        field: "",
        valueGetter: "node.rowIndex + 1",
        width: 80,
        pinned: "left",
        lockPosition: true,
      });
Object.entries(data[0]).forEach(([key]) => {
  let mappedColumn;

  mappedColumn = {
      headerName: key,
      field: key,
    };

  if (mappedColumn) columnDefinitions.push(mappedColumn);
});



    }
    return columnDefinitions;
  };

    const getGrievenceTicketsDataList = async () => {
    try {
       if (formValues.txtFromDate) {
            if (formValues.txtToDate) {
              if (formValues.txtFromDate > formValues.txtToDate) {
                setAlertMessage({
                  type: "warning",
                  message: "From date must be less than To Date",
                });
                return;
              }
            } else {
              setAlertMessage({
                type: "warning",
                message: "Please select To Date",
              });
              return;
            }
          }
          const dateDiffrence = daysdifference(dateFormatDefault(formValues.txtFromDate), dateFormatDefault(formValues.txtToDate));
          if (dateDiffrence > 31) {
            setAlertMessage({
              type: "error",
              message: "1 month date range is allowed only",
            });
            return;
          }  
      setIsLoadingMaster(true);

      const requestData = {
         fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
         toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
         stateCodeAlpha: "",
         grievenceTicketSourceTypeID: 0,
         socialMediaTypeID: 0,
         receiptSourceID: 0,
         ticketStatusID: 0,
      };
      const result = await getGrievenceTicketsListData(requestData);
      setIsLoadingMaster(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.length > 0) {
          if (searchTextCodeMaster && searchTextCodeMaster.toLowerCase().includes("#")) {
            onSearchCodeMaster("");
          }
          setRowData([]);
          setColumnDefs([]);

          setRowData(result.responseData);
          setColumnDefs(generateColumns(result.responseData));

        } else {
          setRowData([]);
          setColumnDefs([]);
        }
      } else {
        setAlertMessage({ open: true, type: "error", message: result.responseMessage });
        console.log(result.responseMessage);
      }
    } catch (error) {
      setAlertMessage({ open: true, type: "error", message: error });
      console.log(error);
    }
  };

      const [stateList, setStateList] = useState([]);
      const [isLoadingStateList, setIsLoadingStateList] = useState(false);
      const getStateListData = async () => {
        try {
          setStateList([]);
          setIsLoadingStateList(true);
          const formdata = {
            filterID: 0,
            filterID1: 0,
            masterName: "STATEMAS",
            searchText: "#ALL",
            searchCriteria: "AW",
          };
          const result = await getMasterDataBindingDataList(formdata);
          setIsLoadingStateList(false);
          if (result.response.responseCode === 1) {
            if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
              setStateList(result.response.responseData.masterdatabinding);
            } else {
              setStateList([]);
            }
          } else {
            setAlertMessage({
              type: "error",
              message: result.response.responseMessage,
            });
          }
        } catch (error) {
          console.log(error);
          setAlertMessage({
            type: "error",
            message: error,
          });
        }
      };

        const [ticketStatusList, setTicketStatusList] = useState([]);
        const [isLoadingTicketStatusList, setIsTicketStatusList] = useState(false);
        const getTicketStatusListData = async () => {
          try {
            setTicketStatusList([]);
            setIsTicketStatusList(true);
            const formdata = {
              filterID: 109,
              filterID1: 0,
              masterName: "COMMVAL",
              searchText: "#ALL",
              searchCriteria: "AW",
            };
            const result = await getMasterDataBinding(formdata);
            setIsTicketStatusList(false);
            if (result.response.responseCode === 1) {
              if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
                setTicketStatusList(result.response.responseData.masterdatabinding);
              } else {
                setTicketStatusList([]);
              }
            } else {
              setAlertMessage({
                type: "error",
                message: result.response.responseMessage,
              });
            }
          } catch (error) {
            console.log(error);
            setAlertMessage({
              type: "error",
              message: error,
            });
          }
        };

      const [grievenceTicketSourceTypeList] = useState([
       { CommonMasterValueID: 132301, CommonMasterValue: "Social Media" },
       { CommonMasterValueID: 132302, CommonMasterValue: "Physical Letter" },
       { CommonMasterValueID: 132303, CommonMasterValue: "Email" },
       { CommonMasterValueID: 132304, CommonMasterValue: "Other" },
     ]);

     const [socialMediaList] = useState([
         { CommonMasterValueID: 1, CommonMasterValue: "Facebook" },
         { CommonMasterValueID: 2, CommonMasterValue: "Twitter" },
         { CommonMasterValueID: 3, CommonMasterValue: "LinkedIn" },
         { CommonMasterValueID: 4, CommonMasterValue: "WhatsApp" },
         { CommonMasterValueID: 5, CommonMasterValue: "Other" },
       ]);

       const [sourceOfReceiptList] = useState([
         { CommonMasterValueID: 1, CommonMasterValue: "CPGRAMS" },
         { CommonMasterValueID: 2, CommonMasterValue: "HAM Office" },
         { CommonMasterValueID: 3, CommonMasterValue: "Secretary Office" },
         { CommonMasterValueID: 4, CommonMasterValue: "Joint Secretary Office" },
         { CommonMasterValueID: 5, CommonMasterValue: "Directly to Department/Section" },
       ]);  

  const exportClick = () => {
    if (rowData.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    gridApi.exportDataAsExcel({
    fileName: "Feedback_Report.xlsx",  
    processCellCallback: (params) => {
    const colId = params.column.getColId();

    if (colId === "FeedBack Date") {
      const value = params.value;
      if (!value) return "";

      const [date, time] = value.split("T");
      return dateToSpecificFormat(`${date} ${Convert24FourHourAndMinute(time)}`, "DD-MM-YYYY HH:mm");
    }

    return params.value;
  }
});
};  

const [openAddOfflineGrievanceMdal, setOpenAddOfflineGrievanceMdal] = useState(false);
  const openAddOfflineGrievancePage = () => {
    setOpenAddOfflineGrievanceMdal(!openAddOfflineGrievanceMdal);
  };

    useEffect(() => {
    getStateListData();
    getTicketStatusListData();
  }, []);  

    return (
      <>
            {openAddOfflineGrievanceMdal && (
              <AddOfflineGrievance
                showfunc={openAddOfflineGrievancePage}
              />
            )}
     <div className={BizClass.Box}>
       <div className={BizClass.PageBar}>
         <PageBar.Button onClick={() => openAddOfflineGrievancePage()} title="Add Offline Grievance">
          Add Offline Grievance
        </PageBar.Button>
           <PageBar.ExcelButton onClick={() => exportClick()}>
          Export
        </PageBar.ExcelButton>
       </div>
        <div className={BizClass.MainBox}>
                <>
                  <div className={BizClass.divGridPagination}>
                    <DataGrid
            rowData={rowData}
            loader= {isLoadingMaster ? <Loader /> : null}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            >
    </DataGrid>
                  </div>
                  <div className={BizClass.FilterBox}>
                    <div className={BizClass.Header}>
                      {/* <h4>Filters Tickets </h4> */}
                      <button type="button" className={BizClass.FilterTicketButton} onClick={() => getFilterTicketsClick()}>
                        {" "}
                        Filters Tickets
                      </button>
                      <span />
                    </div>
                    <div className={BizClass.Content}>
                      <Form>
                        <div className={BizClass.FormContent}>
                          <Form.InputGroup label="From Date" req="false" errorMsg="">
                            <Form.InputControl
                              control="input"
                              type="date"
                              name="txtFromDate"
                              value={formValues.txtFromDate}
                              onChange={(e) => updateState("txtFromDate", e.target.value)}
                            />
                          </Form.InputGroup>
                          <Form.InputGroup label="To Date" req="false" errorMsg="">
                            <Form.InputControl
                              control="input"
                              type="date"
                              name="txtToDate"
                              value={formValues.txtToDate}
                              onChange={(e) => updateState("txtToDate", e.target.value)}
                            />
                          </Form.InputGroup>
                          <Form.InputGroup label="Source Of Grievance" req="false" errorMsg="">
                            <Form.InputControl
                              control="select"
                              name="txtgrievenceTicketSourceType"
                              options={grievenceTicketSourceTypeList}
                              value={formValues.txtgrievenceTicketSourceType}
                              getOptionLabel={(option) => `${option.CommonMasterValue}`}
                              getOptionValue={(option) => `${option}`}
                              onChange={(e) => updateState("txtgrievenceTicketSourceType", e)}
                            />
                          </Form.InputGroup>
                          {formValues && formValues.txtgrievenceTicketSourceType && formValues.txtgrievenceTicketSourceType.CommonMasterValueID && formValues.txtgrievenceTicketSourceType.CommonMasterValueID === 132301 ?
                          <Form.InputGroup label="Social Media" req="false" errorMsg="">
                            <Form.InputControl
                              control="select"
                              name="txtSocialMedia"
                              options={socialMediaList}
                              value={formValues.txtSocialMedia}
                              getOptionLabel={(option) => `${option.CommonMasterValue}`}
                              getOptionValue={(option) => `${option}`}
                              onChange={(e) => updateState("txtSocialMedia", e)}
                            />
                          </Form.InputGroup> : null }
                           {formValues && formValues.txtgrievenceTicketSourceType && formValues.txtgrievenceTicketSourceType.CommonMasterValueID && (formValues.txtgrievenceTicketSourceType.CommonMasterValueID === 132302 || formValues.txtgrievenceTicketSourceType.CommonMasterValueID === 132303) ?
                          <Form.InputGroup label="Source Of Reciept" req="false" errorMsg="">
                            <Form.InputControl
                           control="select"
                          name="txtSourceOfReceipt"
                          value={formValues.txtSourceOfReceipt}
                          options={sourceOfReceiptList}
                          getOptionLabel={(option) => `${option.CommonMasterValue}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateState("txtSourceOfReceipt", e)}
                          />
                          </Form.InputGroup> : null }
                          <Form.InputGroup label="Status" req="false" errorMsg="">
                           <Form.InputControl
                           control="select"
                          name="txtStatus"
                          value={formValues.txtStatus}
                          options={ticketStatusList}
                          isLoading={isLoadingTicketStatusList}
                          getOptionLabel={(option) => `${option.CommonMasterValue}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateState("txtStatus", e)}
                          />
                          </Form.InputGroup>
                           <Form.InputGroup label="State" req="false" errorMsg="">
                            <Form.InputControl
                              control="select"
                              name="txtState"
                              options={stateList}
                              isLoading={isLoadingStateList}
                              value={formValues.txtState}
                              getOptionLabel={(option) => `${option.StateMasterName}`}
                              getOptionValue={(option) => `${option}`}
                              onChange={(e) => updateState("txtState", e)}
                            />
                          </Form.InputGroup>
                        </div>
                      </Form>
                    </div>
                    <div className={BizClass.Footer}>
                      <button type="button" onClick={() => refereshFarmerTicket()}>
                        Apply
                      </button>
                      &nbsp;
                      <button type="button" onClick={() => ClearTicketFilters()}>
                          Clear
                        </button>
                    </div>
                  </div>{" "}

            </>
        </div>
      </div>
    </>
    );
};

export default OfflineGrievance;