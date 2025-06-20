import React, { useState, useEffect } from "react";
import { AlertMessage, Loader } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { FiTrash2 } from "react-icons/fi";
import { getCenterNotificationAssignManage } from "../Services/Methods";
import "../Notifications.module.scss";

function AssignUnAssignResourcePartner({ toggleAssignUnAssignResourcePartnerModal, assignUnAssignResourcePartnerModal }) {
  const setAlertMessage = AlertMessage();

  const [assignedResourcePartnerGridApi, setAssignedResourcePartnerGridApi] = useState();
  const onAssignedResourcePartnerGridReady = (params) => {
    setAssignedResourcePartnerGridApi(params.api);
  };

  const [searchTextAssigendResourcePartner, setSearchTextAssigendResourcePartner] = useState("");
  const onSearchAssignedResourcePartner = (val) => {
    debugger;
    setSearchTextAssigendResourcePartner(val);
    assignedResourcePartnerGridApi.setQuickFilter(val);
    assignedResourcePartnerGridApi.refreshCells();
  };

  const [ResourcePartnerList, setResourcePartnerList] = useState([]);
  const [isLoadingResourcePartnerList, setIsLoadingResourcePartnerList] = useState(false);
  const getAssignedResourcePartnerListData = async (data) => {
    debugger;
    try {
      setIsLoadingResourcePartnerList(true);
      const formdata = {
        viewMode: "GETRESASSIGNED",
        notificationCenterID: "0",
        notificationMasterID: data && data.NotificationMasterID ? data.NotificationMasterID : 0,
        centerID: "0",
      };
      const result = await getCenterNotificationAssignManage(formdata);
      setIsLoadingResourcePartnerList(false);
      if (result.response.responseCode === 1) {
        if (
          result.response.responseData &&
          result.response.responseData.data &&
          result.response.responseData.data.NotificationCenter &&
          result.response.responseData.data.NotificationCenter.length > 0
        ) {
          setResourcePartnerList(result.response.responseData.data.NotificationCenter);
        } else {
          setResourcePartnerList([]);
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

  const onClickDeleteAssignedResourcePartner = async (data) => {
    debugger;
    try {
      const formdata = {
        viewMode: "UNASSIGN",
        notificationCenterID: data.NotificationCenterID,
        notificationMasterID:
          assignUnAssignResourcePartnerModal && assignUnAssignResourcePartnerModal.NotificationMasterID
            ? assignUnAssignResourcePartnerModal.NotificationMasterID
            : 0,
        centerID: data.ResourcePartnerID,
      };
      const result = await getCenterNotificationAssignManage(formdata);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        data.AssignmentFlag = 0;
        if (assignedResourcePartnerGridApi) {
          const itemsToUpdate = [];
          assignedResourcePartnerGridApi.forEachNode(function (rowNode) {
            if (rowNode.data.ResourcePartnerID === data.ResourcePartnerID) {
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          assignedResourcePartnerGridApi.updateRowData({
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
    const selectedNodes = assignedResourcePartnerGridApi.getSelectedNodes();
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
      const ResourcePartnerIds = checkedItem
        .map((data) => {
          return data.ResourcePartnerID;
        })
        .join(",");

      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "RESASSIGN",
        notificationCenterID: "0",
        notificationMasterID:
          assignUnAssignResourcePartnerModal && assignUnAssignResourcePartnerModal.NotificationMasterID
            ? assignUnAssignResourcePartnerModal.NotificationMasterID
            : 0,
        centerID: ResourcePartnerIds,
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
                  ResourcePartnerID: splitData[0],
                  NotificationCenterID: splitData[1],
                });
              }
              return assignmentIdList;
            }, []);
          }

          if (assignedIds.length > 0) {
            assignedIds.forEach((data) => {
              ResourcePartnerList.forEach((x) => {
                let pResourcePartnerID = "0";
                if (!Array.isArray(x)) {
                  pResourcePartnerID = x.ResourcePartnerID.toString();
                } else {
                  pResourcePartnerID = x[0].ResourcePartnerID.toString();
                }
                if (pResourcePartnerID === data.ResourcePartnerID.toString()) {
                  x.AssignmentFlag = 1;
                  x.ResourcePartnerID = data.ResourcePartnerID;
                  x.NotificationCenterID = data.NotificationCenterID;
                }
              });
            });
          }
        }

        setResourcePartnerList([]);
        setResourcePartnerList(ResourcePartnerList);
        if (assignedResourcePartnerGridApi) {
          assignedResourcePartnerGridApi.setRowData(ResourcePartnerList);
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
    getAssignedResourcePartnerListData(assignUnAssignResourcePartnerModal);
  }, []);

  return (
    <>
      <Modal varient="half" title="Resource Partner Allocation" right={0} width="50vw" height="100vh" show={toggleAssignUnAssignResourcePartnerModal}>
        <Modal.Body>
          <div className="PageStart">
            <div className="custom-search-container">
              <input
                type="text"
                value={searchTextAssigendResourcePartner}
                onChange={(e) => onSearchAssignedResourcePartner(e.target.value)}
                className="custom-search-input"
                placeholder="Search Resource Partner..."
              />
            </div>
            <DataGrid
              rowData={ResourcePartnerList}
              loader={isLoadingResourcePartnerList ? <Loader /> : null}
              suppressRowClickSelection={true}
              rowSelection={"multiple"}
              getRowStyle={getRowStyle}
              onGridReady={onAssignedResourcePartnerGridReady}
              frameworkComponents={{
                assignedResourcePartnerActionTemplate,
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
                tooltipField="Assign The Resource Partner"
                cellRenderer="assignedResourcePartnerActionTemplate"
                cellRendererParams={{
                  onClickDeleteAssignedResourcePartner,
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
                field="ResourcePartnerName"
                headerName="Resource Partner"
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

export default AssignUnAssignResourcePartner;

const assignedResourcePartnerActionTemplate = (props) => {
  return (
    <div style={{ display: "flex" }}>
      {props.data && props.data.AssignmentFlag === 1 ? (
        <span
          title="Unassign The Resource Partner"
          style={{
            cursor: "pointer",
            display: "grid",
            marginTop: "3px",
            marginRight: "3px",
          }}
        >
          <FiTrash2 style={{ fontSize: "15px", color: "#5d6d7e" }} onClick={() => props.onClickDeleteAssignedResourcePartner(props.data)} />
        </span>
      ) : null}
    </div>
  );
};
