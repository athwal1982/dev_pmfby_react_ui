import { useEffect, React, useState, useRef } from "react";
import { PropTypes } from "prop-types";
import TicketCustomerDetail from "./Views/Layout/TicketCustomerDetail/TicketCustomerDetail";
import MyTicket from "./Views/MyTicket";
import ChatBox from "./Views/Layout/ChatBox/ChatBox";
import ChatList from "./Views/Layout/ChatList/ChatList";
import MyTicketLogics from "./Logic/Logic";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";

function MyTicketPage({ selectedData, showfunc }) {
  const {
    value,
    setValue,
    replyBoxCollapsed,
    setReplyBoxCollapsed,
    setTicketStatusBtn,
    getChatListDetailsData,
    ticketData,
    chatListDetails,
    isLoadingchatListDetails,
    handleSave,
    btnloaderActive,
    btnloaderCloseTicketActive,
    closeSupportTicketOnClick,
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
    selectedPolicyDetails,
    getPolicyDetailsOfFarmer,
    wordcount,
    setWordcount,
    btnLoaderActive1,
    formValidationSupportTicketReviewError,
    valueEditTicketComment,
    setValueEditTicketComment,
    handleSaveEditTicketComment,
    btnLoaderActiveEditTicketComment,
    wordcountEditTicketComment,
    setWordcountEditTicketComment,
    fileRef,
    handleResetFile,
    setSelectedHistoryData,
    btnLoaderActiveComment,
    handleAddComment,
    setapiDataAttachment,
    apiDataAttachment,
    handleInput,
    handleInput1,
    editableRef,
    editableRef1,
    updateStateSatifation,
    formValuesSatifation,
    formValidationSatisfyError,
    IsSatisfyList,
    btnLoaderActiveSatisfaction,
    handleSatisfaction,
    btnLoaderActiveAudit,
    handleAudit,
  } = MyTicketLogics();

  useEffect(() => {
    getChatListDetailsData(selectedData, 1, -1);
    getPolicyDetailsOfFarmer(selectedData);
    getTicketStatusListData();
    getBankListData();
  }, []);

    const [expanded, setExpanded] = useState("");
  
    const handleChange = (panel) => (_, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };
    const pageRef = useRef();
    const [isLoadingDownloadpdf, setIsLoadingDownloadpdf] = useState(false);
    const downloadPDF = async () => {
    if (!pageRef.current) return;
    setIsLoadingDownloadpdf(true);

    const prevExpanded = expanded;

    // A Force open all panels
    setExpanded("ALL");

    // A Wait for React to render expanded content
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const element = pageRef.current;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Ticket_Details_${selectedData && selectedData.SupportTicketNo ? selectedData.SupportTicketNo : null}.pdf`,
      image: { type: "jpeg", quality: 0.7 },
      html2canvas: {
        scale: 1,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      // A Restore previous accordion state
      setExpanded(prevExpanded);
      setIsLoadingDownloadpdf(false);
    }
  };

  return (
    <MyTicket
      replyBoxCollapsed={replyBoxCollapsed}
      setReplyBoxCollapsed={setReplyBoxCollapsed}
      setTicketStatusBtn={setTicketStatusBtn}
      ticketData={ticketData}
      btnloaderCloseTicketActive={btnloaderCloseTicketActive}
      closeSupportTicketOnClick={closeSupportTicketOnClick}
      showfunc={showfunc}
      downloadPDF={downloadPDF}
      pageRef={pageRef}
      isLoadingDownloadpdf={isLoadingDownloadpdf}
    >
      <ChatList
        chatListDetails={chatListDetails}
        isLoadingchatListDetails={isLoadingchatListDetails}
        selectedData={selectedData}
        valueEditTicketComment={valueEditTicketComment}
        setValueEditTicketComment={setValueEditTicketComment}
        handleSaveEditTicketComment={handleSaveEditTicketComment}
        btnLoaderActiveEditTicketComment={btnLoaderActiveEditTicketComment}
        wordcountEditTicketComment={wordcountEditTicketComment}
        setWordcountEditTicketComment={setWordcountEditTicketComment}
        setSelectedHistoryData={setSelectedHistoryData}
        apiDataAttachment={apiDataAttachment}
        setapiDataAttachment={setapiDataAttachment}
        updateStateSatifation={updateStateSatifation}
        formValuesSatifation={formValuesSatifation}
        formValidationSatisfyError={formValidationSatisfyError}
        IsSatisfyList={IsSatisfyList}
        btnLoaderActiveSatisfaction={btnLoaderActiveSatisfaction}
        handleSatisfaction={handleSatisfaction}
        btnLoaderActiveAudit={btnLoaderActiveAudit}
        handleAudit={handleAudit}
        expanded={expanded}
        handleChange={handleChange}
      >
        <ChatBox
          replyBoxCollapsed={replyBoxCollapsed}
          value={value}
          setValue={setValue}
          handleSave={handleSave}
          btnloaderActive={btnloaderActive}
          ticketStatusList={ticketStatusList}
          isLoadingBankDropdownDataList={isLoadingBankDropdownDataList}
          formValuesTicketProperties={formValuesTicketProperties}
          updateStateTicketProperties={updateStateTicketProperties}
          wordcount={wordcount}
          setWordcount={setWordcount}
          btnLoaderActive1={btnLoaderActive1}
          formValidationSupportTicketReviewError={formValidationSupportTicketReviewError}
          fileRef={fileRef}
          handleResetFile={handleResetFile}
          btnLoaderActiveComment={btnLoaderActiveComment}
          handleAddComment={handleAddComment}
          selectedPolicyDetails={selectedPolicyDetails}
          handleInput={handleInput}
          handleInput1={handleInput1}
          editableRef={editableRef}
          editableRef1={editableRef1}
          selectedData={selectedData}
        />
      </ChatList>
      <TicketCustomerDetail
        ticketData={ticketData}
        ticketStatusList={ticketStatusList}
        isLoadingTicketStatusList={isLoadingTicketStatusList}
        bankDropdownDataList={bankDropdownDataList}
        isLoadingBankDropdownDataList={isLoadingBankDropdownDataList}
        formValuesTicketProperties={formValuesTicketProperties}
        updateStateTicketProperties={updateStateTicketProperties}
        btnloaderStatusTicketActive={btnloaderStatusTicketActive}
        updateStatusSupportTicketOnClick={updateStatusSupportTicketOnClick}
        selectedPolicyDetails={selectedPolicyDetails}
      />
    </MyTicket>
  );
}

export default MyTicketPage;

MyTicketPage.propTypes = {
  selectedData: PropTypes.object,
  showfunc: PropTypes.func.isRequired,
};
