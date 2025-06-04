import React, { useState, useEffect, useRef } from "react";
import { AlertMessage, Loader } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { FiTrash2 } from "react-icons/fi";
import { setAssignList, setUpdateAttendance } from "../Services/Methods";
import "./TrainingList.scss";
import * as XLSX from "xlsx";


function TrainingDetailsPopUp({
    toggleTrainingByAdminModal,
    trainingDetails,

}) {
    const setAlertMessage = AlertMessage();

    const [uploadedFileData, setUploadedFileData] = useState([]);
    const fileInputRef = useRef(null);
    const assignedCenterGridApiRef = useRef(null);



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
    const getAssignedUserListData = async (data) => {
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

    const handleExcelUpload = (event) => {
        const file = event.target.files[0];

        if (
            file &&
            (file.type === "application/vnd.ms-excel" ||
                file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        ) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                if (!jsonData.some((row) => row.hasOwnProperty("User_ID"))) {
                    setAlertMessage({
                        type: "error",
                        message: "XLS format is not appropriate. 'User_ID' column is missing.",
                    });
                    return;
                }

                const userIds = jsonData.map((item) => item.User_ID.toString());

                if (assignedCenterGridApi) {
                    let matchedCount = 0;
                    assignedCenterGridApi.forEachNode((node) => {
                        if (userIds.includes(node.data.UserID.toString())) {
                            node.setSelected(true);
                            matchedCount++;
                        }
                    });
                    assignedCenterGridApi.refreshCells();

                    if (matchedCount > 0) {
                        setAlertMessage({
                            type: "success",
                            message: `Successfully matched ${matchedCount} trainees from the uploaded file.`,
                        });
                    } else {
                        setAlertMessage({
                            type: "warning",
                            message: "No trainees matched from the uploaded file.",
                        });
                    }
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            setAlertMessage({
                type: "error",
                message: "Invalid file format. Please upload a valid Excel file.",
            });
        }
    };



    useEffect(() => {
        debugger;
        getAssignedUserListData(toggleTrainingByAdminModal);
    }, [toggleTrainingByAdminModal]);


    return (
        <>
            <Modal
                varient="half"
                title='Training Attendance'
                right={0}
                width="55vw"
                height="100vh"
                show={toggleTrainingByAdminModal}
            >
                <Modal.Body>
                    <div
                        className="PageStart"
                    >

                        <div className="search-upload-wrapper">
                            <div className="custom-search-container">
                                <input
                                    type="text"
                                    value={searchTextAssigendCenter}
                                    onChange={(e) => onSearchAssignedCenter(e.target.value)}
                                    className="custom-search-input"
                                    placeholder="Search"
                                />
                            </div>

                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleExcelUpload}
                                ref={fileInputRef}
                                className="excel-upload-input"
                            />


                            <Button
                                varient="secondary"
                                onClick={handleResetGrid}
                                className="custom-button-reset"
                            >
                                Reset
                            </Button>
                        </div>



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
                                lockPosition="1"
                                pinned="left"
                                headerName=""
                                flex={1}
                                field=""
                                width={80}
                                headerCheckboxSelection
                                headerCheckboxSelectionFilteredOnly
                                checkboxSelection={checkboxSelection}
                                tooltipField="Assign The Center"
                                cellRenderer="assignedCenterActionTemplate"
                                cellRendererParams={{
                                    onClickDeleteAssignedCenter,
                                }}
                                headerComponentParams={{
                                    style: { backgroundColor: "#004d00", color: "white", fontSize: "14px", textAlign: "center" },
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
                                field="IsPresent"
                                headerName="Is-Present"
                                width={150}
                                flex={1}
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
                                valueFormatter={(param) => (param.value === "Y" ? "Present" : "Absent")}
                            />
                            <DataGrid.Column
                                field="UserID"
                                headerName="User ID"
                                width={150}
                                flex={1}
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
                            />

                            <DataGrid.Column
                                field="NAME"
                                headerName="Trainee Name"
                                width={150}
                                flex={1}
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
                            />
                            <DataGrid.Column
                                field="Center"
                                headerName="Center Name"
                                width={150}
                                flex={1}
                                headerComponentParams={{
                                    style: { backgroundColor: "#04540", color: "white", fontSize: "14px", textAlign: "center" },
                                }}
                            />
                        </DataGrid>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="Button"
                        varient="danger"
                        onClick={(e) => handleSave(e)}
                        trigger={btnLoaderActive ? "true" : "false"}
                        className="custom-button-AssignUnassign"
                    >
                        <span className="button-content">
                            Save
                        </span>
                    </Button>



                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TrainingDetailsPopUp;

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