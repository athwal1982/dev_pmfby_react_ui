import React, { useState, useEffect } from "react";
import { AlertMessage, Loader } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { FiTrash2 } from "react-icons/fi";
import { getInsuranceNotificationAssignManage } from "../Services/Methods";
import "../Notifications.module.scss";

function AssignUnAssignInsuranceCompany({ toggleAssignUnAssignInsuranceCompanyModal, assignUnAssignInsuranceCompanyModal }) {
  const setAlertMessage = AlertMessage();

  const [assignedInsuranceCompanyGridApi, setAssignedInsuranceCompanyGridApi] = useState();
  const onAssignedInsuranceCompanyGridReady = (params) => {
    setAssignedInsuranceCompanyGridApi(params.api);
  };

  const [searchTextAssigendInsuranceCompany, setSearchTextAssigendInsuranceCompany] = useState("");
  const onSearchAssignedInsuranceCompany = (val) => {
    debugger;
    setSearchTextAssigendInsuranceCompany(val);
    assignedInsuranceCompanyGridApi.setQuickFilter(val);
    assignedInsuranceCompanyGridApi.refreshCells();
  };

  const [InsuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [isLoadingInsuranceCompanyList, setIsLoadingInsuranceCompanyList] = useState(false);
  const getAssignedInsuranceCompanyListData = async (data) => {
    debugger;
    try {
      setIsLoadingInsuranceCompanyList(true);
      const formdata = {
        viewMode: "GETASSIGNED",
        notificationInsuranceID: "0",
        notificationMasterID: data && data.NotificationMasterID ? data.NotificationMasterID : 0,
        insuranceCompanyID: "0",
      };
      const result = await getInsuranceNotificationAssignManage(formdata);
      setIsLoadingInsuranceCompanyList(false);
      if (result.response.responseCode === 1) {
        if (
          result.response.responseData &&
          result.response.responseData.data &&
          result.response.responseData.data.NotificationInsurance &&
          result.response.responseData.data.NotificationInsurance.length > 0
        ) {
          setInsuranceCompanyList(result.response.responseData.data.NotificationInsurance);
        } else {
          setInsuranceCompanyList([]);
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

  const onClickDeleteAssignedInsuranceCompany = async (data) => {
    debugger;
    try {
      const formdata = {
        viewMode: "UNASSIGN",
        notificationInsuranceID: data.InsuranceMasterID,
        notificationMasterID:
          assignUnAssignInsuranceCompanyModal && assignUnAssignInsuranceCompanyModal.NotificationMasterID
            ? assignUnAssignInsuranceCompanyModal.NotificationMasterID
            : 0,
        insuranceCompanyID: data.InsuranceMasterID,
      };
      const result = await getInsuranceNotificationAssignManage(formdata);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        data.AssignmentFlag = 0;
        if (assignedInsuranceCompanyGridApi) {
          const itemsToUpdate = [];
          assignedInsuranceCompanyGridApi.forEachNode(function (rowNode) {
            if (rowNode.data.InsuranceMasterID === data.InsuranceMasterID) {
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          assignedInsuranceCompanyGridApi.updateRowData({
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
    const selectedNodes = assignedInsuranceCompanyGridApi.getSelectedNodes();
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
      const InsuranceCompanyIds = checkedItem
        .map((data) => {
          return data.InsuranceMasterID;
        })
        .join(",");

      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGN",
        notificationInsuranceID: "0",
        notificationMasterID:
          assignUnAssignInsuranceCompanyModal && assignUnAssignInsuranceCompanyModal.NotificationMasterID
            ? assignUnAssignInsuranceCompanyModal.NotificationMasterID
            : 0,
        insuranceCompanyID: InsuranceCompanyIds,
      };

      const result = await getInsuranceNotificationAssignManage(formdata);
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });

        if (result.response.responseData) {
          const responseAssignedIds =
            result.response.responseData && result.response.responseData.data && result.response.responseData.data.NotificationInsuranceID
              ? result.response.responseData.data.NotificationInsuranceID.split(",")
              : [];
          console.log(responseAssignedIds);
          let assignedIds = [];
          if (responseAssignedIds.length > 0) {
            assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
              const splitData = data.split("|");
              if (splitData.length > 0 && splitData[0] && splitData[1]) {
                assignmentIdList.push({
                  InsuranceMasterID: splitData[0],
                  NotificationInsuranceID: splitData[1],
                });
              }
              return assignmentIdList;
            }, []);
          }

          if (assignedIds.length > 0) {
            assignedIds.forEach((data) => {
              InsuranceCompanyList.forEach((x) => {
                let pInsuranceCompanyID = "0";
                if (!Array.isArray(x)) {
                  pInsuranceCompanyID = x.InsuranceMasterID.toString();
                } else {
                  pInsuranceCompanyID = x[0].InsuranceMasterID.toString();
                }
                if (pInsuranceCompanyID === data.InsuranceMasterID.toString()) {
                  x.AssignmentFlag = 1;
                  x.InsuranceMasterID = data.InsuranceMasterID;
                  x.NotificationInsuranceID = data.NotificationInsuranceID;
                }
              });
            });
          }
        }

        setInsuranceCompanyList([]);
        setInsuranceCompanyList(InsuranceCompanyList);
        if (assignedInsuranceCompanyGridApi) {
          assignedInsuranceCompanyGridApi.setRowData(InsuranceCompanyList);
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
    getAssignedInsuranceCompanyListData(assignUnAssignInsuranceCompanyModal);
  }, []);

  return (
    <>
      <Modal varient="half" title="Insurance Company Allocation" right={0} width="50vw" height="100vh" show={toggleAssignUnAssignInsuranceCompanyModal}>
        <Modal.Body>
          <div className="PageStart">
            <div className="custom-search-container">
              <input
                type="text"
                value={searchTextAssigendInsuranceCompany}
                onChange={(e) => onSearchAssignedInsuranceCompany(e.target.value)}
                className="custom-search-input"
                placeholder="Search Insurance Company..."
              />
            </div>
            <DataGrid
              rowData={InsuranceCompanyList}
              loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
              suppressRowClickSelection={true}
              rowSelection={"multiple"}
              getRowStyle={getRowStyle}
              onGridReady={onAssignedInsuranceCompanyGridReady}
              frameworkComponents={{
                assignedInsuranceCompanyActionTemplate,
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
                cellRenderer="assignedInsuranceCompanyActionTemplate"
                cellRendererParams={{
                  onClickDeleteAssignedInsuranceCompany,
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
                field="InsuranceMasterName"
                headerName="Insurance Company"
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

export default AssignUnAssignInsuranceCompany;

const assignedInsuranceCompanyActionTemplate = (props) => {
  return (
    <div style={{ display: "flex" }}>
      {props.data && props.data.AssignmentFlag === 1 ? (
        <span
          title="Unassign The Insurance Company"
          style={{
            cursor: "pointer",
            display: "grid",
            marginTop: "3px",
            marginRight: "3px",
          }}
        >
          <FiTrash2 style={{ fontSize: "15px", color: "#5d6d7e" }} onClick={() => props.onClickDeleteAssignedInsuranceCompany(props.data)} />
        </span>
      ) : null}
    </div>
  );
};
