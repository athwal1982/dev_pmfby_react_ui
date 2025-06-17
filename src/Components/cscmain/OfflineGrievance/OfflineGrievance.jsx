import React,{ useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat, Convert24FourHourAndMinute, daysdifference, dateFormatDefault } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getMasterDataBindingDataList } from "../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getFeedbackReportData } from "./Services/Methods";
import BizClass from "./OfflineGrievance.module.scss";
import AddOfflineGrievance from "./AddOfflineGrievance";

const OfflineGrievance = () => {
    const setAlertMessage = AlertMessage();


    const [formValues, setFormValues] = useState({
        txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
        txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    });

    const updateState = (name, value) => {
     setFormValues({ ...formValues, [name]: value });
    };

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    setGridApi(params.api);
   const gridColumnApi = params.columnApi;

  // Wait for the data to load before autosizing
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

    const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
     txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
     txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
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

    const getFeedbackReportDataList = async () => {
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
      };
      const result = await getFeedbackReportData(requestData);
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
  }, []);  

    return (
      <>
            {openAddOfflineGrievanceMdal && (
              <AddOfflineGrievance
                showfunc={openAddOfflineGrievancePage}
              />
            )}
      <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Input
          ControlTxt="From Date"
          control="input"
          type="date"
          name="txtFromDate"
          value={formValues.txtFromDate}
          onChange={(e) => updateState("txtFromDate", e.target.value)}
        />
        <PageBar.Input
          ControlTxt="To Date"
          control="input"
          type="date"
          name="txtToDate"
          value={formValues.txtToDate}
          onChange={(e) => updateState("txtToDate", e.target.value)}
          max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
        />
        <PageBar.Search focus={true} onClick={() => getFeedbackReportDataList()} value={searchTextCodeMaster} name="txtCodeName" onChange={(e) => onSearchCodeMaster(e.target.value)} />
        <PageBar.Button onClick={() => openAddOfflineGrievancePage()} title="Add">
          Add Offline Grievance
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
     <DataGrid
            rowData={rowData}
            loader= {isLoadingMaster ? <Loader /> : null}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            >
    </DataGrid>
    </div>
    </>
    );
};

export default OfflineGrievance;