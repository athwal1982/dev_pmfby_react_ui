import React, { useState, useEffect } from "react";
import { AlertMessage, Loader } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { FiTrash2 } from "react-icons/fi";
import { getCenterNotificationAssignManage } from "../Services/Methods";
import "../Notifications.module.scss";

function AssignUnAssignCenters({ toggleAssignUnAssignCentersModal, assignUnAssignCentersModal }) {
  const setAlertMessage = AlertMessage();

  const [assignedCenterGridApi, setAssignedCenterGridApi] = useState();
  const onAssignedCenterGridReady = (params) => {
    setAssignedCenterGridApi(params.api);
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
  const getAssignedCenterListData = async (data) => {
    try {
      setIsLoadingCenterList(true);
      const formdata = {
        viewMode: "GETASSIGNED",
        notificationCenterID: "0",
        notificationMasterID: data && data.NotificationMasterID ? data.NotificationMasterID : 0,
        centerID: "0",
      };
      const result = await getCenterNotificationAssignManage(formdata);
      setIsLoadingCenterList(false);
      if (result.response.responseCode === 1) {
        if (
          result.response.responseData &&
          result.response.responseData.data &&
          result.response.responseData.data.NotificationCenter &&
          result.response.responseData.data.NotificationCenter.length > 0
        ) {
          setCenterList(result.response.responseData.data.NotificationCenter);
        } else {
          setCenterList([]);
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

  const onClickDeleteAssignedCenter = async (data) => {
    debugger;
    try {
      const formdata = {
        viewMode: "UNASSIGN",
        notificationCenterID: data.NotificationCenterID,
        notificationMasterID:
          assignUnAssignCentersModal && assignUnAssignCentersModal.NotificationMasterID ? assignUnAssignCentersModal.NotificationMasterID : 0,
        centerID: data.CenterMasterID,
      };
      const result = await getCenterNotificationAssignManage(formdata);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
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

  const getSelectedRowData = () => {
    const selectedNodes = assignedCenterGridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
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
          message: "Please select atleast one Center.",
        });
        return;
      }
      const CenterIds = checkedItem
        .map((data) => {
          return data.CenterMasterID;
        })
        .join(",");

      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGN",
        notificationCenterID: "0",
        notificationMasterID:
          assignUnAssignCentersModal && assignUnAssignCentersModal.NotificationMasterID ? assignUnAssignCentersModal.NotificationMasterID : 0,
        centerID: CenterIds,
      };

      const result = await getCenterNotificationAssignManage(formdata);
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });

        if (result.response.responseData) {
          const responseAssignedIds =
            result.response.responseData && result.response.responseData.data && result.response.responseData.data.NotificationCenterID
              ? result.response.responseData.data.NotificationCenterID.split(",")
              : [];
          console.log(responseAssignedIds);
          let assignedIds = [];
          if (responseAssignedIds.length > 0) {
            assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
              const splitData = data.split("|");
              if (splitData.length > 0 && splitData[0] && splitData[1]) {
                assignmentIdList.push({
                  CenterMasterID: splitData[0],
                  NotificationCenterID: splitData[1],
                });
              }
              return assignmentIdList;
            }, []);
          }

          if (assignedIds.length > 0) {
            assignedIds.forEach((data) => {
              CenterList.forEach((x) => {
                let pCenterMasterID = "0";
                if (!Array.isArray(x)) {
                  pCenterMasterID = x.CenterMasterID.toString();
                } else {
                  pCenterMasterID = x[0].CenterMasterID.toString();
                }
                if (pCenterMasterID === data.CenterMasterID.toString()) {
                  x.AssignmentFlag = 1;
                  x.CenterMasterID = data.CenterMasterID;
                  x.NotificationCenterID = data.NotificationCenterID;
                }
              });
            });
          }
        }

        setCenterList([]);
        setCenterList(CenterList);
        if (assignedCenterGridApi) {
          assignedCenterGridApi.setRowData(CenterList);
        }
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
    if (params.node.data.AssignmentFlag === 1) {
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
    getAssignedCenterListData(assignUnAssignCentersModal);
  }, []);

  return (
    <>
      <Modal varient="half" title="Center Allocation" right={0} width="50vw" height="100vh" show={toggleAssignUnAssignCentersModal}>
        <Modal.Body>
          <div className="PageStart">
            <div className="custom-search-container">
              <input
                type="text"
                value={searchTextAssigendCenter}
                onChange={(e) => onSearchAssignedCenter(e.target.value)}
                className="custom-search-input"
                placeholder="Search Center..."
              />
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
                field="AssignmentFlag"
                headerName="Status"
                width={120}
                flex={1}
                valueFormatter={(param) => (param.value === 1 ? "Assigned" : "Not Assigned")}
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
            <span className="button-content">Save</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AssignUnAssignCenters;

const assignedCenterActionTemplate = (props) => {
  return (
    <div style={{ display: "flex" }}>
      {props.data && props.data.AssignmentFlag === 1 ? (
        <span
          title="Unassign The Center"
          style={{
            cursor: "pointer",
            display: "grid",
            marginTop: "3px",
            marginRight: "3px",
          }}
        >
          <FiTrash2 style={{ fontSize: "15px", color: "#5d6d7e" }} onClick={() => props.onClickDeleteAssignedCenter(props.data)} />
        </span>
      ) : null}
    </div>
  );
};
