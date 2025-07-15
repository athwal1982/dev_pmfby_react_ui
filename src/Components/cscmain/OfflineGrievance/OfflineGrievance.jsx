import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar, Form } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat, Convert24FourHourAndMinute, daysdifference, dateFormatDefault } from "Configration/Utilities/dateformat";
import { FcViewDetails } from "react-icons/fc";
import { FaEdit } from "react-icons/fa";
import { MdOutlineAttachment } from "react-icons/md";
import moment from "moment";
import * as XLSX from "xlsx";
import { getUserRightCodeAccess } from "Components/Common/Login/Auth/auth";
import { getMasterDataBindingDataList } from "../../Modules/Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";
import { getGrievenceTicketsListData } from "./Services/Methods";
import { getMasterDataBinding } from "../../Modules/Support/ManageTicket/Services/Methods";
import BizClass from "./OfflineGrievance.module.scss";
import AddOfflineGrievance from "./AddOfflineGrievance";
import EditOfflineGrievance from "./EditOfflineGrievance";
// A import EditInsuranceCompany from "./EditInsuranceCompany";
import MyTicketPage from "./MyTicket/index";
import FileViewer from  "../../Common/FileViewer/FileViewer";

const cellActionTemplate = (props) => {
  const editTicketRight = getUserRightCodeAccess("ofg3");
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <FcViewDetails
        style={{ fontSize: "16px", color: "#000000", cursor: "pointer" }}
        onClick={() => props.toggleSupportTicketDetailsModal(props.data)}
        title="Ticket Details"
      />
      {props.data &&  props.data.TicketStatusID !== 109303 && editTicketRight === true ?
      // { {props.data &&  props.data.InsuranceCompanyID === 0 && editTicketRight === true ?}
      <FaEdit
        style={{ fontSize: "16px", color: "#000000", cursor: "pointer" }}
        onClick={() => props.toggleEditOfflineGrievanceModal(props.data)}
        // A onClick={() => props.toggleEditInsuranceCompanyModal(props.data)}
        title="Update Other Media Grievance"
      /> : null}
      {props.data && props.data.HasDocument && props.data.HasDocument === 1 ? (
            <MdOutlineAttachment  style={{ fontSize: "16px", color: "#000000", cursor: "pointer" }}
             onClick={() => props.toggleFileViewerModal(props.data)}
             title="View Attachment"
            />
          ) : null}
    </div>
  );
};

const OfflineGrievance = () => {
  const setAlertMessage = AlertMessage();
  const viewTicketRight = getUserRightCodeAccess("ofg2");
  const addTicketRight = getUserRightCodeAccess("ofg1");

  const [openMyTicketModal, setOpenMyTicketModal] = useState(false);

  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtState: null,
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
      txtState: null,
      txtgrievenceTicketSourceType: null,
      txtSocialMedia: null,
      txtSourceOfReceipt: null,
      txtStatus: null,
    });
    setRowData([]);
  };

  const [isLoadingMaster, setIsLoadingMaster] = useState(false);
  const [rowData, setRowData] = useState([]);

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
        stateCodeAlpha: formValues.txtState && formValues.txtState.StateCodeAlpha ? formValues.txtState.StateCodeAlpha : "",
        grievenceTicketSourceTypeID: formValues.txtgrievenceTicketSourceType && formValues.txtgrievenceTicketSourceType.CommonMasterValueID ? formValues.txtgrievenceTicketSourceType.CommonMasterValueID : 0,
        socialMediaTypeID: formValues.txtSocialMedia && formValues.txtSocialMedia.CommonMasterValueID ? formValues.txtSocialMedia.CommonMasterValueID : 0,
        receiptSourceID: formValues.txtSourceOfReceipt && formValues.txtSourceOfReceipt.CommonMasterValueID ? formValues.txtSourceOfReceipt.CommonMasterValueID : 0,
        ticketStatusID: formValues.txtStatus && formValues.txtStatus.CommonMasterValueID ? formValues.txtStatus.CommonMasterValueID : 0,
      };
      const result = await getGrievenceTicketsListData(requestData);
      setIsLoadingMaster(false);
      debugger;
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.grievenceTicket && result.responseData.grievenceTicket.length > 0) {
          if (searchTextCodeMaster && searchTextCodeMaster.toLowerCase().includes("#")) {
            onSearchCodeMaster("");
          }
          setRowData([]);
          setRowData(result.responseData.grievenceTicket);
        } else {
          setRowData([]);
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
    { CommonMasterValueID: 133301, CommonMasterValue: "Facebook" },
    { CommonMasterValueID: 133302, CommonMasterValue: "Twitter" },
    { CommonMasterValueID: 133303, CommonMasterValue: "LinkedIn" },
    { CommonMasterValueID: 133304, CommonMasterValue: "WhatsApp" },
    { CommonMasterValueID: 133305, CommonMasterValue: "Other" },
  ]);

  const [sourceOfReceiptList] = useState([
    { CommonMasterValueID: 134301, CommonMasterValue: "CPGRAMS" },
    { CommonMasterValueID: 134302, CommonMasterValue: "HAM Office" },
    { CommonMasterValueID: 134303, CommonMasterValue: "Secretary Office" },
    { CommonMasterValueID: 134304, CommonMasterValue: "Joint Secretary Office" },
    { CommonMasterValueID: 134305, CommonMasterValue: "Directly to Department/Section" },
  ]);

    const downloadExcel = (data) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      worksheet["!cols"] = [
        { width: 20 },
        { width: 15 },
        { width: 22 },
        { width: 22 },
        { width: 15 },
        { width: 20 },
        { width: 30 },
        { width: 15 },
        { width: 30 },
        { width: 30 },
        { width: 20 },
        { width: 25 },
        { width: 18 },
        { width: 22 },
        { width: 22 },
        { width: 40 },
        { width: 22 },
        { width: 22 },
        { width: 15 },
        { width: 15 },
        { width: 20 },
        { width: 50 },
        { width: 20 },
      ];
      XLSX.writeFile(
        workbook,
        `Offline_Grievance_Data_${dateToSpecificFormat(formValues.txtFromDate, "DD-MM-YYYY")}_To_${dateToSpecificFormat(formValues.txtToDate, "DD-MM-YYYY")}.xlsx`,
      );
    };
  
    const rearrangeAndRenameColumns = (originalData, columnMapping) => {
      return originalData.map((item) => {
        const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
        return rearrangedItem;
      });
    };
  

  const exportClick = () => {
    if (rowData.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
                  GrievenceSupportTicketNo: "Ticket No",
                  ComplaintDate: "Complaint Date",
                  ApplicationNo: "Application No",
                  InsurancePolicyNo: "Policy No",
                  TicketStatus: "Ticket Status",
                  GrievenceSourceType: "Source Of Grievance",
                  GrievenceSourceOtherType: "Other Source of Grievance",
                  SocialMediaType: "Social Media",
                  SocialMediaURL: "Social Media URL/Link",
                  OtherSocialMedia: "Other Social Media",
                  ReceiptSource: "Source Of Receipt",
                  FarmerName: "Farmer Name",
                  RequestorMobileNo: "Mobile No",
                  Email: "Email ID",
                  StateMasterName: "State",
                  DistrictMasterName: "District",
                  InsuranceCompany: "Insurance Company",
                  TicketCategoryName: "Category",
                  TicketSubCategoryName: "Sub Category",
                  RequestSeason: "Season",
                  RequestYear: "Year",
                  CropName: "Crop Name",
                  GrievenceDescription: "Description",
                  InsertDateTime: "Created At",
                };
                const mappedData = rowData.map((value) => {
                  return {
                    GrievenceSupportTicketNo: value.GrievenceSupportTicketNo,
                    ComplaintDate: value.ComplaintDate ? dateToSpecificFormat(value.ComplaintDate.split("T")[0], "DD-MM-YYYY") : "",
                    ApplicationNo: value.ApplicationNo,
                    InsurancePolicyNo: value.InsurancePolicyNo,
                    TicketStatus: value.TicketStatus,
                    GrievenceSourceType: value.GrievenceSourceType,
                    GrievenceSourceOtherType: value.GrievenceSourceOtherType,
                    SocialMediaType: value.SocialMediaType,
                    SocialMediaURL: value.SocialMediaURL,
                    OtherSocialMedia: value.OtherSocialMedia,
                    ReceiptSource: value.ReceiptSource,
                    FarmerName: value.FarmerName,
                    RequestorMobileNo: value.RequestorMobileNo,
                    Email: value.Email,
                    StateMasterName: value.StateMasterName,
                    DistrictMasterName: value.DistrictMasterName,
                    InsuranceCompany: value.InsuranceCompany,
                    TicketCategoryName: value.TicketCategoryName,
                    TicketSubCategoryName: value.TicketSubCategoryName,
                    RequestSeason: value.RequestSeason && value.RequestSeason === 1 ? "Kharif" : value.RequestSeason === 2 ? "Rabi" : "",
                    RequestYear: value.RequestYear && value.RequestYear > 0 ? value.RequestYear : "",
                    CropName: value.CropName,
                    GrievenceDescription: value.GrievenceDescription,
                    InsertDateTime: value.InsertDateTime
                      ? dateToSpecificFormat(
                          `${value.InsertDateTime.split("T")[0]} ${Convert24FourHourAndMinute(value.InsertDateTime.split("T")[1])}`,
                          "DD-MM-YYYY HH:mm",
                        )
                      : "",
                  };
                });
                const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
                downloadExcel(rearrangedData);
  };

  const [openAddOfflineGrievanceMdal, setOpenAddOfflineGrievanceMdal] = useState(false);
  const openAddOfflineGrievancePage = () => {
    setOpenAddOfflineGrievanceMdal(!openAddOfflineGrievanceMdal);
  };

  const [openEditOfflineGrievanceMdal, setOpenEditOfflineGrievanceMdal] = useState(false);
  const openEditOfflineGrievancePage = (data) => {
    if (data !== null) {
        setSelectedData(data);
      } else {
        setSelectedData(null);
      }
    setOpenEditOfflineGrievanceMdal(!openEditOfflineGrievanceMdal);
  };

    const updateFarmersTickets = (newlyAddedTicket) => {
    if (gridApi) {
      const rowData = [];
      if (newlyAddedTicket && newlyAddedTicket.length > 0) {
        newlyAddedTicket.forEach((data) => {
          rowData.push(data);
        });
      }
      gridApi.forEachNode((node) => rowData.push(node.data));
      gridApi.setRowData(rowData);
    }
  };

    const updateOfflineGrievance = (selecteddata) => {
    debugger;
    const mappedData = rowData.map((data) => {
      if (data.GrievenceSupportTicketID === selecteddata.GrievenceSupportTicketID) {
        data.RepresentationType =  selectedData.RepresentationType;
        data.InsuranceCompanyID = selecteddata.InsuranceCompanyID;
        data.InsuranceCompany = selecteddata.InsuranceCompany;
        data.FarmerName= selecteddata.FarmerName;
        data.Email= selecteddata.Email ;
        data.RequestorMobileNo= selecteddata.RequestorMobileNo;
        data.ComplaintDate= selecteddata.ComplaintDate;
        data.StateCodeAlpha=  selecteddata.StateCodeAlpha;
        data.DistrictRequestorID= selecteddata.DistrictRequestorID;
        data.GrievenceSourceTypeID=selecteddata.GrievenceSourceTypeID;
        data.GrievenceSourceOtherType= selecteddata.GrievenceSourceOtherType;
        data.SocialMediaTypeID=  selecteddata.SocialMediaTypeID;
        data.OtherSocialMedia= selecteddata.OtherSocialMedia;
        data.SocialMediaURL=selecteddata.SocialMediaURL;
        data.ReceiptSourceID=selecteddata.ReceiptSourceID;
        data.TicketCategoryID=selecteddata.TicketCategoryID;
        data.TicketSubCategoryID=selecteddata.TicketSubCategoryID;
        data.RequestYear= selecteddata.RequestYear;
        data.RequestSeason=selecteddata.RequestSeason;
        data.CropName= selecteddata.CropName;
        data.ApplicationNo= selecteddata.ApplicationNo;
        data.InsurancePolicyNo=  selecteddata.InsurancePolicyNo;
        data.DistrictMasterName=  selecteddata.DistrictMasterName;
        data.ticketSubCategoryName=selecteddata.ticketSubCategoryName;
        data.ticketCategoryName=selecteddata.ticketCategoryName;
        data.StateMasterName=  selecteddata.StateMasterName;
        data.GrievenceDescription= selecteddata.GrievenceDescription;
      }
      return data;
    });
    setRowData(mappedData);
  };

const updateInsuranceCompany = (selecteddata) => {
    debugger;
    const mappedData = rowData.map((data) => {
      if (data.GrievenceSupportTicketID === selecteddata.GrievenceSupportTicketID) {
        data.InsuranceCompanyID = selecteddata.InsuranceCompanyID;
        data.InsuranceCompany = selecteddata.InsuranceCompany;
      }
      return data;
    });
    setRowData(mappedData);
  };


  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.node.rowIndex % 2 === 0) {
      return { background: "#fff" };
    }
    return { background: "#f3f6f9" };
  };

  const [selectedData, setSelectedData] = useState();
  const openMyTicketPage = (data) => {
      if (data !== null) {
        setSelectedData(data);
      } else {
        setSelectedData(null);
      }
      setOpenMyTicketModal(!openMyTicketModal);
  };

  const toggleSupportTicketDetailsModal = (data) => {
    console.log(data);
    openMyTicketPage(data);
  };

  const toggleEditOfflineGrievanceModal = (data) => {
    openEditOfflineGrievancePage(data);
  };

  const [openEditInsuranceCompanyMdal, setOpenEditInsuranceCompanyMdal] = useState(false);
  const openEditInsuranceCompanyPage = (data) => {
    if (data !== null) {
        setSelectedData(data);
      } else {
        setSelectedData(null);
      }
    setOpenEditInsuranceCompanyMdal(!openEditInsuranceCompanyMdal);
  };

  const toggleEditInsuranceCompanyModal = (data) => {
    openEditInsuranceCompanyPage(data);
  };
  
  useEffect(() => {
    getStateListData();
    getTicketStatusListData();
  }, []);

    const [isFileViewerModalOpen, setIsFileViewerModalOpen] = useState(false);
  
    const toggleFileViewerModal = (data) => {
       setSelectedData(data);
      setIsFileViewerModalOpen(!isFileViewerModalOpen);
    };

  return (
    <>
      {openAddOfflineGrievanceMdal && <AddOfflineGrievance showfunc={openAddOfflineGrievancePage} updateFarmersTickets={updateFarmersTickets} />}
      {openEditOfflineGrievanceMdal && <EditOfflineGrievance showfunc={openEditOfflineGrievancePage} selectedData={selectedData} updateOfflineGrievance={updateOfflineGrievance} />}
      {/* {openEditInsuranceCompanyMdal && <EditInsuranceCompany showfunc={openEditInsuranceCompanyPage} selectedData={selectedData} updateInsuranceCompany={updateInsuranceCompany} />} */}
      {openMyTicketModal && <MyTicketPage showfunc={openMyTicketPage} selectedData={selectedData} />}
      {isFileViewerModalOpen && (
              <FileViewer toggleFileViewerModal={toggleFileViewerModal} selectedData={selectedData}  />
            )}
      <div className={BizClass.Box}>
        <div className={BizClass.PageBar}>
          {addTicketRight ?  <PageBar.Button onClick={() => openAddOfflineGrievancePage()} title="Add Other Media Grievance">
            Add Other Media Grievances
          </PageBar.Button> : null}
          <PageBar.ExcelButton onClick={() => exportClick()}>Export</PageBar.ExcelButton>
        </div>
        <div className={BizClass.MainBox}>
          {viewTicketRight ?
            <>
            <div className={BizClass.divGridPagination}>
              <DataGrid rowData={rowData} loader={isLoadingMaster ? <Loader /> : null}  components={{
                        actionTemplate: cellActionTemplate,
                      }} onGridReady={onGridReady}  getRowStyle={getRowStyle}>
               <DataGrid.Column
                                      headerName="Action"
                                      lockPosition="1"
                                      pinned="left"
                                      width={80}
                                      cellRenderer="actionTemplate"
                                      cellRendererParams={{
                                        toggleSupportTicketDetailsModal,
                                        toggleEditInsuranceCompanyModal,
                                        toggleEditOfflineGrievanceModal,
                                        toggleFileViewerModal,
                                      }}
                                    />
               <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
                                    <DataGrid.Column field="RepresentationType" headerName="Representation Type" width="180px"  valueFormatter={(param) => (param.value && param.value === "SINGLE" ? "Individual Representation" : param.value === "MULTIPLE" ? "Joint Representation" : "")} /> 
                                    <DataGrid.Column field="GrievenceSupportTicketNo" headerName="Ticket No" width="150px" />
                                    <DataGrid.Column
             field="ComplaintDate"
             headerName="Complaint Date"
             width="140px"
             valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
           />   
                                    <DataGrid.Column field="ApplicationNo" headerName="Application No" width="180px" useValueFormatterForExport={true} />
                                    <DataGrid.Column field="InsurancePolicyNo" headerName="Policy No" width="170px" />
                                    <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="120px" />
                                    <DataGrid.Column field="GrievenceSourceType" headerName="Source of Grievance" width="200px" />
                                    <DataGrid.Column field="GrievenceSourceOtherType" headerName="Other Source of Grievance" width="200px" />
                                    <DataGrid.Column field="SocialMediaType" headerName="Social Media" width="200px" />
                                    <DataGrid.Column field="SocialMediaURL" headerName="Social Media URL/Link" width="200px" />
                                    <DataGrid.Column field="OtherSocialMedia" headerName="Other Social Media" width="200px" />
                                    <DataGrid.Column field="ReceiptSource" headerName="Source Of Receipt" width="200px" />
                                    <DataGrid.Column field="FarmerName" headerName="Farmer Name" width="210px" />
                                    <DataGrid.Column field="RequestorMobileNo" headerName="Mobile No" width="110px" />
                                    <DataGrid.Column field="Email" headerName="Email ID" width="170px" />
                                    <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
                                    <DataGrid.Column field="DistrictMasterName" headerName="District" width="160px" />
                                    <DataGrid.Column field="InsuranceCompany" headerName="Insurance Company" width="290px" />
                                    <DataGrid.Column field="TicketCategoryName" headerName="Category" width="200px" />
                                    <DataGrid.Column field="TicketSubCategoryName" headerName="Sub Category" width="200px" />
                                    <DataGrid.Column
                                      field="RequestSeason"
                                      headerName="Season"
                                      width="100px"
                                      valueFormatter={(param) => (param.value && param.value === 1 ? "Kharif" : param.value === 2 ? "Rabi" : "")}
                                    />
                                    <DataGrid.Column
                                      field="RequestYear"
                                      headerName="Yesr"
                                      width="100px"
                                      valueFormatter={(param) => (param.value && param.value > 0  ? param.value  : "")}
                                    />
                                    <DataGrid.Column field="CropName" headerName="Crop Name" width="150px" />
                                    <DataGrid.Column field="GrievenceDescription" headerName="Description" width="290px" />
                                    <DataGrid.Column
                                      field="#"
                                      headerName="Created At"
                                      width="145px"
                                      valueGetter={(node) => {
                                        return node.data.InsertDateTime
                                          ? dateToSpecificFormat(
                                              `${node.data.InsertDateTime.split("T")[0]} ${Convert24FourHourAndMinute(node.data.InsertDateTime.split("T")[1])}`,
                                              "DD-MM-YYYY HH:mm",
                                            )
                                          : null;
                                      }}
                                    />
              </DataGrid>
            </div>
            <div className={BizClass.FilterBox}>
              <div className={BizClass.Header}>
                <h4>Filters Tickets </h4>
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
                    {formValues &&
                    formValues.txtgrievenceTicketSourceType &&
                    formValues.txtgrievenceTicketSourceType.CommonMasterValueID &&
                    formValues.txtgrievenceTicketSourceType.CommonMasterValueID === 132301 ? (
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
                      </Form.InputGroup>
                    ) : null}
                    {formValues &&
                    formValues.txtgrievenceTicketSourceType &&
                    formValues.txtgrievenceTicketSourceType.CommonMasterValueID &&
                    (formValues.txtgrievenceTicketSourceType.CommonMasterValueID === 132302 ||
                      formValues.txtgrievenceTicketSourceType.CommonMasterValueID === 132303) ? (
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
                      </Form.InputGroup>
                    ) : null}
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
                <button type="button" onClick={() => getGrievenceTicketsDataList()}>
                  Apply
                </button>
                &nbsp;
                <button type="button" onClick={() => ClearTicketFilters()}>
                  Clear
                </button>
              </div>
            </div> </> : <div style={{ "text-align": "center" }}>You are not authorized to view ticket list</div> }
        </div>
      </div>
    </>
  );
};

export default OfflineGrievance;