import { useEffect, useState } from "react";
import moment from "moment";
import publicIp from "public-ip";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getGrievenceSupportTicketReview, addGrievenceSupportTicketReview, getMasterDataBinding, farmerTicketStatusUpdate } from "../Services/Services";
// A import { sendSMSToFarmer } from "../../../Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";

function MyTicketLogics() {
  const [value, setValue] = useState("<p></p>");
  const [replyBoxCollapsed, setReplyBoxCollapsed] = useState(true);
  const [wordcount, setWordcount] = useState(0);

  const setAlertMessage = AlertMessage();

  const [formValuesTicketProperties, setFormValuesTicketProperties] = useState({
    txtTicketStatus: null,
    txtBankName: null,
  });

  const updateStateTicketProperties = (name, value) => {
    setFormValuesTicketProperties({ ...formValuesTicketProperties, [name]: value });
  };

  const [ticketData, setTicketData] = useState("");
  const [ticketStatusBtn, setTicketStatusBtn] = useState("");

  const [chatListDetails, setChatListDetails] = useState([]);
  const [isLoadingchatListDetails, setIsLoadingchatListDetails] = useState(false);
  const getChatListDetailsData = async (pticketData, pPageIndex, pPageSize) => {
    try {
      setTicketData(pticketData);
      // A setFormValuesTicketProperties({
      // A  ...formValuesTicketProperties,
      // A  txtTicketStatus:
      // A    pticketData && pticketData.TicketStatus && pticketData.TicketStatusID
      // A      ? {
      // A          CommonMasterValueID: pticketData.TicketStatusID,
      // A          CommonMasterValue: pticketData.TicketStatus,
      // A          BMCGCode: pticketData.BMCGCode,
      // A        }
      // A      : null,
      // A });
      setIsLoadingchatListDetails(true);
      const formdata = {
        grievenceSupportTicketID: pticketData.GrievenceSupportTicketID,
        pageIndex: pPageIndex,
        pageSize: pPageSize,
      };
      const result = await getGrievenceSupportTicketReview(formdata);
      console.log(result, "chat List");
      setIsLoadingchatListDetails(false);
      if (result.responseCode === 1) {
        if (result.responseData.supportTicket && result.responseData.supportTicket.length > 0) {
          setChatListDetails(result.responseData.supportTicket);
        } else {
          setChatListDetails([]);
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const showMoreChatListOnClick = () => {
    getChatListDetailsData(ticketData, 1, -1);
  };

  useEffect(() => {
    console.log(value);
  }, [value]);

  const updateTicketHistorytData = (addedData) => {
    if (addedData.IsNewlyAdded === true) {
      chatListDetails.unshift(addedData);
    }
    console.log(addedData);
    setChatListDetails([]);
    setChatListDetails(chatListDetails);
  };

  const updateStatusSupportTicket = async () => {
    try {
      const formData = {
        farmerSupportTicketID: ticketData.FarmerSupportTicketID,
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
      };
      const result = await farmerTicketStatusUpdate(formData);
      if (result.response.responseCode === 1) {
        ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
        ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;
        setReplyBoxCollapsed(!replyBoxCollapsed);
        // A if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
        // A  SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
        // A }
        setFormValuesTicketProperties({
          ...formValuesTicketProperties,
          txtTicketStatus: {
            CommonMasterValueID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
            CommonMasterValue: formValuesTicketProperties.txtTicketStatus.CommonMasterValue,
            BMCGCode: formValuesTicketProperties.txtTicketStatus.BMCGCode,
          },
        });
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [btnLoaderActive1, setBtnLoaderActive1] = useState(false);
  const handleSave = async (e) => {
    debugger;
    if (e) e.preventDefault();
    let popUpMsg = "";

    const strippedText = value.replace(/<[^>]*>/g, "").trim();

    if (!strippedText) {
      popUpMsg = "Ticket comment is required!";
      setAlertMessage({
        type: "warning",
        message: popUpMsg,
      });
      return;
    }

    if (formValuesTicketProperties.txtTicketStatus === null) {
      setAlertMessage({
        type: "warning",
        message: "Ticket status is required!",
      });
      return;
    }
    if (formValuesTicketProperties.txtTicketStatus !== null) {
      if (ticketData.TicketStatusID === formValuesTicketProperties.txtTicketStatus.CommonMasterValueID) {
        setAlertMessage({
          type: "warning",
          message: "Same status is not allowed to change the ticket status",
        });
        return;
      }
    }
    try {
      const formData = {
        grievenceTicketHistoryID: 0,
        grievenceSupportTicketID: ticketData.GrievenceSupportTicketID,
        agentUserID: ticketData.InsertUserID ? ticketData.InsertUserID : "0",
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
        ticketDescription: value,
        hasDocument: 0,
        attachmentPath: "",
      };
      setBtnLoaderActive1(true);
      const result = await addGrievenceSupportTicketReview(formData);
      setBtnLoaderActive1(false);
      if (result.response.responseCode === 1) {
        if (result.response && result.response.responseData && result.response.responseData.GrievenceTicketHistoryID) {
          const ip = await publicIp.v4();
          const user = getSessionStorage("user");
          const newlyAddedEntry = {
            CreatedBY: user && user.UserDisplayName ? user.UserDisplayName.toString() : "",
            UserType: user && user.UserCompanyType ? user.UserCompanyType.toString() : "",
            AgentUserID: ticketData.InsertUserID ? ticketData.InsertUserID : "0",
            HasDocument: 0,
            InsertIPAddress: ip,
            InsertUserID: user && user.LoginID ? user.LoginID.toString() : "0",
            GrievenceSupportTicketID: ticketData.GrievenceSupportTicketID,
            TicketDescription: value,
            TicketHistoryDate: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
            TicketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
            IsNewlyAdded: true,
          };
          updateTicketHistorytData(newlyAddedEntry);

          ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
          ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;

          setFormValuesTicketProperties({
            ...formValuesTicketProperties,
            txtTicketStatus: {
              CommonMasterValueID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
              CommonMasterValue: formValuesTicketProperties.txtTicketStatus.CommonMasterValue,
              BMCGCode: formValuesTicketProperties.txtTicketStatus.BMCGCode,
            },
          });
          setValue("<p></p>");
          setWordcount(0);
          setReplyBoxCollapsed(!replyBoxCollapsed);
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };
  const [ticketStatusList, setTicketStatusList] = useState([]);
  const [isLoadingTicketStatusList, setIsTicketStatusList] = useState(false);
  const getTicketStatusListData = async (pticketData) => {
    debugger;
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
      console.log(result, "ticketStatus");
      setIsTicketStatusList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          let filterStatusData = [];
          const user = getSessionStorage("user");
          const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";
          if (pticketData && pticketData.GrievenceTicketSourceTypeID === 132304 && ChkBRHeadTypeID === "124002") {
            filterStatusData = result.response.responseData.masterdatabinding.filter((data) => {
              return data.CommonMasterValueID === 109303;
            });
            setTicketStatusList(filterStatusData);
          } else if (pticketData && pticketData.GrievenceTicketSourceTypeID === 132304 && ChkBRHeadTypeID === "124003") {
            filterStatusData = result.response.responseData.masterdatabinding.filter((data) => {
              return data.CommonMasterValueID === 109302;
            });
            setTicketStatusList(filterStatusData);
          } else if (pticketData && pticketData.TicketStatusID === 109303 && (ChkBRHeadTypeID === "124001" || ChkBRHeadTypeID === "124002")) {
            filterStatusData = result.response.responseData.masterdatabinding.filter((data) => {
              return data.CommonMasterValueID === 109304;
            });
            setTicketStatusList(filterStatusData);
          } else if (
            ((pticketData && pticketData.TicketStatusID === 109301) || (pticketData && pticketData.TicketStatusID === 109302)) &&
            ChkBRHeadTypeID === "124003"
          ) {
            filterStatusData = result.response.responseData.masterdatabinding.filter((data) => {
              return data.CommonMasterValueID === 109302 || data.CommonMasterValueID === 109303;
            });
            setTicketStatusList(filterStatusData);
          }
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [bankDropdownDataList, setBankDropdownDataList] = useState([]);
  const [isLoadingBankDropdownDataList, setIsLoadingBankDropdownDataList] = useState(false);
  const getBankListData = async () => {
    try {
      setIsLoadingBankDropdownDataList(true);
      const formdata = {
        filterID: 124004,
        filterID1: 0,
        masterName: "CMPLST",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getMasterDataBinding(formdata);
      console.log(result, "Bank Data");
      setIsLoadingBankDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
            setBankDropdownDataList(result.response.responseData.masterdatabinding);
          } else {
            setBankDropdownDataList([]);
          }
        } else {
          setBankDropdownDataList([]);
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [btnloaderStatusTicketActive, setBtnloaderStatusTicketActive] = useState(false);
  const updateStatusSupportTicketOnClick = async () => {
    try {
      const chkAccessALL = ticketData && ticketData.AccessALL ? ticketData.AccessALL : "";

      const chkRightResolved =
        ticketData && ticketData.RightResolved && ticketData.RightResolved === 1
          ? true
          : ticketData.RightResolved === 0
            ? false
            : ticketData.RightResolved === undefined
              ? ""
              : "";
      if (chkAccessALL === "E") {
        if (chkRightResolved === false) {
          setAlertMessage({
            type: "warning",
            message: "You do not have right to change status!",
          });
          return;
        }
      }

      if (chkAccessALL === "N") {
        if (chkRightResolved === false) {
          setAlertMessage({
            type: "warning",
            message: "You do not have right to change status!",
          });
          return;
        }
      }
      const user = getSessionStorage("user");
      const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";
      const ChkAppAccessTypeID = user && user.AppAccessTypeID ? user.AppAccessTypeID.toString() : "0";

      if (ChkBRHeadTypeID === "124001" || ChkBRHeadTypeID === "124002") {
        if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
          setAlertMessage({
            type: "warning",
            message: "CSC user can not resolved the ticket ",
          });
          return;
        }
        if (ticketData.TicketStatusID.toString() === "109303") {
          if (
            formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109014" ||
            formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019"
          ) {
            setAlertMessage({
              type: "warning",
              message: "CSC user can not change the status(In-Progress or Open) or  if status is resolved ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            if (ticketData.TicketHeaderID.toString() === "2") {
              setAlertMessage({
                type: "warning",
                message: "CSC user can not Re-Open the ticket with ticket type(Information) ",
              });
              return;
            }
          }
        }
      }

      if (ChkBRHeadTypeID === "124003") {
        if (ChkAppAccessTypeID === "472") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019") {
            setAlertMessage({
              type: "warning",
              message: "Insurance admin user can not Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "Insurance admin user can not Re-Open the ticket ",
            });
            return;
          }
        }
        if (ChkAppAccessTypeID === "503") {
          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109019") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109026") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Re-Open the ticket ",
            });
            return;
          }

          if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
            setAlertMessage({
              type: "warning",
              message: "Insurance user can not Resolved the ticket ",
            });
            return;
          }
        }
      }

      const formData = {
        farmerSupportTicketID: ticketData.FarmerSupportTicketID,
        ticketStatusID: formValuesTicketProperties.txtTicketStatus.CommonMasterValueID,
      };
      setBtnloaderStatusTicketActive(true);
      const result = await farmerTicketStatusUpdate(formData);
      setBtnloaderStatusTicketActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        ticketData.TicketStatusID = formValuesTicketProperties.txtTicketStatus.CommonMasterValueID;
        ticketData.TicketStatus = formValuesTicketProperties.txtTicketStatus.CommonMasterValue;
        // A if (formValuesTicketProperties.txtTicketStatus.BMCGCode.toString() === "109025") {
        // A  SendSMSToFarmerAgaintSupportTicket("C", ticketData.RequestorMobileNo, ticketData.SupportTicketNo);
        // A }
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  return {
    value,
    setValue,
    replyBoxCollapsed,
    setReplyBoxCollapsed,
    ticketStatusBtn,
    setTicketStatusBtn,
    chatListDetails,
    isLoadingchatListDetails,
    getChatListDetailsData,
    ticketData,
    handleSave,
    formValuesTicketProperties,
    updateStateTicketProperties,
    ticketStatusList,
    isLoadingTicketStatusList,
    getTicketStatusListData,
    bankDropdownDataList,
    isLoadingBankDropdownDataList,
    getBankListData,
    btnloaderStatusTicketActive,
    updateStatusSupportTicketOnClick,
    // Anil funstion not in use
    updateStatusSupportTicket,
    // Anil funstion not in use
    showMoreChatListOnClick,
    wordcount,
    setWordcount,
    btnLoaderActive1,
  };
}

export default MyTicketLogics;
