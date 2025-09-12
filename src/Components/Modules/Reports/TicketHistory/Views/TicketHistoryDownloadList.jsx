import React, { useState, useEffect, useRef } from "react";
import { AlertMessage, Loader } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { FiTrash2 } from "react-icons/fi";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import { getTicketHistoryDownloadList } from "../Services/Methods";
import "../../../TrainingManagement/TrainingList/TrainingList.scss";
import * as XLSX from "xlsx";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";



function TicketHistoryDownloadList({
    toggleDownloadHistoryListModal,
    trainingDetails,

}) {
    const setAlertMessage = AlertMessage();
    console.log(trainingDetails, "test");

    const [uploadedFileData, setUploadedFileData] = useState([]);
    const fileInputRef = useRef(null);
    const assignedCenterGridApiRef = useRef(null);

    const handleApproveClick = async (data) => {
        const payload = {
            TrainingID: data?.TrainingID,
            ApprovalStatus: 1,
            UserID: data?.UserID
        };

        const result = await TrainingApprovalUpdate(payload);
        if (result.response.responseCode === 1) {
            setAlertMessage({
                type: "success",
                message: result.response.responseMessage,
            });
            fetchApprovalUserData(trainingDetails);
        } else {
            setAlertMessage({
                type: "error",
                message: result.response.responseMessage,
            });
        }
    };

function formatToMonthEnd(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null; 

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    const lastDay = new Date(Date.UTC(year, month + 1, 0));

    if (date.getUTCDate() === lastDay.getUTCDate()) {
        return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    }

    const day = String(lastDay.getUTCDate()).padStart(2, "0");
    const monthStr = String(lastDay.getUTCMonth() + 1).padStart(2, "0");

    return `${day}-${monthStr}-${year}`;
};




    const handleResetGrid = () => {
        onSearchAssignedCenter("");
        if (assignedCenterGridApiRef.current) {
            assignedCenterGridApiRef.current.deselectAll();
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setUploadedFileData([]);
    };


    const handleChange = (e) => {
        setSelectedCenterIds(e.target.value);
        TrainingList(e.target.value);
    };
    const [assignedCenterGridApi, setAssignedCenterGridApi] = useState();
    const onAssignedCenterGridReady = (params) => {
        setAssignedCenterGridApi(params.api);
        assignedCenterGridApiRef.current = params.api;
    };


    const [searchTextAssigendCenter, setSearchTextAssigendCenter] = useState("");
    const onSearchAssignedCenter = (val) => {
        debugger;
        setSearchTextAssigendCenter(val);
        assignedCenterGridApi.setQuickFilter(val);
        assignedCenterGridApi.refreshCells();
    };

    const [CenterList, setCenterList] = useState([]);
    const [isLoadingCenterList, setIsLoadingCenterList] = useState(false);
    /* AA  const getAssignedUserListData = async (data) => {
         debugger;
         try {
 
             setIsLoadingCenterList(true);
             const formdata = {
                 viewMode: "GETALLASSIGNED",
                 cSCAppAccessTypeID: 503,
                 centerID: "0",
                 trainingMasterID: trainingDetails && trainingDetails.TrainingMasterId
                     ? trainingDetails.TrainingMasterId.toString()
                     : "0",
                 userID: "0",
                 trainingUserAssignmentID: "0",
             };
             const result = await setAssignList(formdata);
             setIsLoadingCenterList(false);
             if (result.response.responseCode === 1) {
                 if (result.response.responseData && result.response.responseData.CscAssignManage.length > 0) {
                     const formattedData = result.response.responseData.CscAssignManage;
                     setCenterList(formattedData);
                 } else {
                     setCenterList([]);
                 }
             } else {
                 setAlertMessage({
                     type: "error",
                     message: result.responseMessage,
                 });
             }
         } catch (error) {
             console.log(error);
             setAlertMessage({
                 type: "error",
                 message: error,
             });
         }
     }; */


    function formatTimeTo12Hour(timeString) {
        if (!timeString) return "";

        const [hourStr, minute] = timeString.split(":");
        const hour = parseInt(hourStr, 10);

        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;

        return `${displayHour}:${minute} ${ampm}`;
    }


    const fetchTicketHistoryDownloadList = async (data) => {
        try {
         const userData = getSessionStorage("user");

            setIsLoadingCenterList(true);

            const formData = {
                userID:userData && userData.LoginID ? userData.LoginID : 0,
            };
            const result = await getTicketHistoryDownloadList(formData);
            setIsLoadingCenterList(false);
            console.log(result, "pradeep");
            if (result.responseCode === 1) {
                if (result.responseData.responseData && result.responseData.responseData.length > 0) {
                    const formattedData = result.responseData.responseData;
                    setCenterList(formattedData);
                } else {
                    setCenterList([]);
                }
            } else {
                setAlertMessage({
                    type: "error",
                    message: result.responseMessage,
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




    const getSelectedRowData = () => {
        const selectedNodes = assignedCenterGridApi.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        return selectedData;
    };

    const onClickDeleteAssignedCenter = async (data) => {
        debugger;
        try {
            const formdata = {
                SPViewMode: "MARKABSENT",
                SPTraningMasterID: trainingDetails && trainingDetails.TrainingMasterId
                    ? trainingDetails.TrainingMasterId
                    : 0,
                SPTrainingAssignmentID: data.TrainingUserAssignmentID,
                SPUserID: data.UserID.toString()
            };
            const result = await setUpdateAttendance(formdata);
            if (result.response.responseCode === 1) {
                setAlertMessage({
                    type: "success",
                    message: result.response.responseMessage,
                });
                getAssignedUserListData();
                data.AssignmentFlag = 0;
                if (assignedCenterGridApi) {
                    const itemsToUpdate = [];
                    assignedCenterGridApi.forEachNode(function (rowNode) {
                        if (rowNode.data.CenterMasterID === data.CenterMasterID) {
                            itemsToUpdate.push(data);
                            rowNode.setData(data);
                        }
                    });
                    assignedCenterGridApi.updateRowData({
                        update: itemsToUpdate,
                    });
                }
            } else {
                setAlertMessage({
                    type: "error",
                    message: result.response.responseMessage,
                });

            }
        } catch (error) {
            setAlertMessage({ open: true, type: "error", message: error });
            console.log(error);
        }
    };

    const [btnLoaderActive, setBtnLoaderActive] = useState(false);
    const handleSave = async (e) => {
        debugger;
        try {
            if (e) e.preventDefault();
            const checkedItem = getSelectedRowData();
            if (checkedItem.length === 0) {
                setAlertMessage({
                    type: "warning",
                    message: "Please select atleast one trainee.",
                });
                return;
            }

            const UserID = checkedItem
                .map((data) => {
                    return data.UserID;
                })
                .join(",");


            setBtnLoaderActive(true);
            const formdata = {
                SPViewMode: "MARKPRESENT",
                SPTraningMasterID: trainingDetails && trainingDetails.TrainingMasterId
                    ? trainingDetails.TrainingMasterId
                    : 0,
                SPTrainingAssignmentID: 0,
                SPUserID: UserID
            };
            const result = await setUpdateAttendance(formdata);
            setBtnLoaderActive(false);
            if (result.response.responseCode === 1) {

                setAlertMessage({
                    type: "success",
                    message: result.response.responseMessage,
                });

                getAssignedUserListData();
            } else {
                setAlertMessage({
                    type: "warning",
                    message: result.response.responseMessage,
                });
            }
        } catch (error) {
            setAlertMessage({
                type: "error",
                message: error,
            });
        }
    };


    const checkboxSelection = (params) => {
        console.log(params);
        if (params.node.data.IsPresent === "Y") {
            return false;
        } else {
            return true;
        }
    };

    const getRowStyle = (params) => {
        if (params.data.IsNewlyAdded) {
            return { background: "white" };
        }
        if (params.node.rowIndex % 2 === 0) {
            return { background: "white" };
        }
        return { background: "white" };
    };





    useEffect(() => {
        debugger;
        // AA getAssignedUserListData();
        fetchTicketHistoryDownloadList(trainingDetails);
    }, []);


    return (
        <>
            <Modal
                varient="half"
                title='Ticket History Download'
                right={0}
                width="70vw"
                height="100vh"
                show={toggleDownloadHistoryListModal}
            >
                <Modal.Body>
                    <div
                        className="PageStart"
                    >

                        <DataGrid
                            rowData={CenterList}
                            loader={isLoadingCenterList ? <Loader /> : null}
                            suppressRowClickSelection={true}
                            rowSelection={"multiple"}
                            getRowStyle={getRowStyle}
                            onGridReady={onAssignedCenterGridReady}
                            frameworkComponents={{
                                assignedCenterActionTemplate,
                            }}
                            domLayout="autoHeight"
                            className="custom-data-grid"
                        >

                            <DataGrid.Column
                                field="DownloadURL"
                                headerName="Download"
                                width="100px"
                                headerComponentParams={{
                                    style: {
                                        backgroundColor: "#04540",
                                        color: "white",
                                        fontSize: "14px",
                                        textAlign: "center"
                                    },
                                }}
                                cellRenderer={({ value }) => {
                                    if (!value) return "Inprocess";

                                    return (
                                        <span
                                            style={{
                                                cursor: "pointer",
                                                fontSize: "18px",
                                                color: "green",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "15px",
                                                width: "80px",
                                            }}
                                            onClick={(event) => {
                                                event.preventDefault(); // Prevent page refresh

                                                const link = document.createElement("a");
                                                link.href = value;
                                                link.download = "";
                                                link.target = "_blank";
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                        >
                                            &#128229; {/* Unicode download icon 📥 */}
                                        </span>
                                    );
                                }}
                            />



                            <DataGrid.Column
                                field="#"
                                headerName="Sr No."
                                flex={1}
                                width={75}
                                valueGetter="node.rowIndex + 1"
                                pinned="left"
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
                            />










                            <DataGrid.Column
                                field="RequestedParamsTicketHeaderID"
                                headerName="Request Type"
                                width="179px"
                                headerComponentParams={{
                                    style: {
                                        backgroundColor: "#04540",
                                        color: "white",
                                        fontSize: "14px",
                                        textAlign: "center"
                                    },
                                }}
                                valueFormatter={({ value }) => {
                                    if (value == null) return "";

                                    const numericValue = Number(value);

                                    switch (numericValue) {
                                        case 4:
                                            return "Crop Loss Intimation";
                                        case 1:
                                            return "Grievance";
                                        case 2:
                                            return "Information";
                                        default:
                                            return `Unknown (${numericValue})`;
                                    }
                                }}
                            />



                           <DataGrid.Column
                                field="RequestCreationDate"
                                headerName="Requested At"
                                width="200px"
                                headerComponentParams={{
                                    style: {
                                        backgroundColor: "#04540",
                                        color: "white",
                                        fontSize: "14px",
                                        textAlign: "center"
                                    },
                                }}
                                valueGetter={(node) => {
                          return node.data.RequestCreationDate
                            ? dateToSpecificFormat(
                                `${node.data.RequestCreationDate.split("T")[0]}`,
                                "DD-MM-YYYY",
                              )
                            : null;
                        }}
                            />

                            <DataGrid.Column
                                field="RequestedParamsFromDate"
                                headerName="Requested From Date"
                                width="200px"
                                headerComponentParams={{
                                    style: {
                                        backgroundColor: "#04540",
                                        color: "white",
                                        fontSize: "14px",
                                        textAlign: "center"
                                    },
                                }}
                                valueGetter={(node) => {
                          return node.data.RequestedParamsFromDate
                            ? dateToSpecificFormat(
                                node.data.RequestedParamsFromDate,
                                "DD-MM-YYYY",
                              )
                            : null;
                        }}
                            />

                            <DataGrid.Column
                                field="RequestedParamsToDate"
                                headerName="Requested To Date"
                                width="200px"
                                headerComponentParams={{
                                    style: {
                                        backgroundColor: "#04540",
                                        color: "white",
                                        fontSize: "14px",
                                        textAlign: "center"
                                    },
                                }}
                                valueGetter={(node) => {
                          return node.data.RequestedParamsToDate
                            ? dateToSpecificFormat(
                                node.data.RequestedParamsToDate,
                                "DD-MM-YYYY",
                              )
                            : null;
                        }}
                            />









                        </DataGrid>









                    </div>
                </Modal.Body>
                <Modal.Footer>




                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TicketHistoryDownloadList;

const assignedCenterActionTemplate = (props) => {
    return (
        <div style={{ display: "flex" }}>
            {props.data && props.data.IsPresent === "Y" ? (
                <span
                    title="Mark Absent"
                    style={{
                        cursor: "pointer",
                        display: "grid",
                        marginTop: "3px",
                        marginRight: "3px",
                    }}
                >
                    <FiTrash2
                        style={{ fontSize: "15px", color: "#5d6d7e" }}
                        onClick={() => props.onClickDeleteAssignedCenter(props.data)}
                    />

                </span>
            ) : null}
        </div>
    );
};