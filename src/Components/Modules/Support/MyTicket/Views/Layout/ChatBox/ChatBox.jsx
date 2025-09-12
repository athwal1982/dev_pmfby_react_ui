import  React from "react";
import TextEditor from "Framework/Components/Widgets/TextEditor/TextEditor";
import { PropTypes } from "prop-types";
import { Loader, Button } from "Framework/Components/Widgets";
import { Form, PageBar } from "Framework/Components/Layout";
import { Card, CardContent, Typography } from "@mui/material";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import BizClass from "./ChatBox.module.scss";

function ChatBox({
  replyBoxCollapsed,
  value,
  setValue,
  handleSave,
  btnLoaderActive1,
  ticketStatusList,
  isLoadingTicketStatusList,
  formValuesTicketProperties,
  updateStateTicketProperties,
  wordcount,
  setWordcount,
  formValidationSupportTicketReviewError,
  fileRef,
  handleResetFile,
  btnLoaderActiveComment,
  handleAddComment,
  selectedPolicyDetails,
  handleInput,
  editableRef,
  handleInput1,
  editableRef1,
}) {
  const sizeLimit = 2000;

 
  const user = getSessionStorage("user");
  const ChkBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";

  return (
    <div className={BizClass.ReplyBox} style={{ display: replyBoxCollapsed ? "none" : "block" }}>
 {ChkBRHeadTypeID === "124003" ?     
 <Card
  sx={{
    maxWidth: 832,
    borderRadius: "10px",
    boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
    color: "black",
    p: 0.4, // A smaller padding for Card
  }}
>
  <CardContent
    sx={{
      padding: "4px", // A override default 16px
      "&:last-child": { paddingBottom: "2px" }, // A fixes extra bottom padding
    }}
      
      
  >
  <div ref={editableRef} 
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}  style={{ fontSize: "0.8rem", lineHeight: 1.4 }} 
      >
      <p>Dear Mr./Ms  {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].farmerName : ""}</p>
      <p>The {selectedPolicyDetails && selectedPolicyDetails.length > 0 ? selectedPolicyDetails[0].insuranceCompanyName : ""} has examined your grievance relating to</p>
    </div>
  </CardContent>
</Card> : null }

      <TextEditor value={value} onChange={setValue} setWordcount={setWordcount} sizeLimit={sizeLimit} />
      <div className={BizClass.SendBox}>
        <p>
          Count : {sizeLimit} / {sizeLimit - wordcount}
        </p>
        <Form.InputGroup label="" errorMsg={formValidationSupportTicketReviewError["txtDocumentUpload"]}>
          <Form.InputControl
            control="input"
            type="file"
            accept="image/*,.pdf"
            name="txtDocumentUpload"
            onChange={(e) => updateStateTicketProperties(e.target.name, e.target.files)}
            ref={fileRef}
            multiple
          />
        </Form.InputGroup>
        <Form.InputGroup column={1}>
          <Button type="button" varient="primary" onClick={() => handleResetFile()}>
            {" "}
            Reset File
          </Button>
        </Form.InputGroup>
        <PageBar.Select
          control="select"
          name="txtTicketStatus"
          options={ticketStatusList}
          loader={isLoadingTicketStatusList ? <Loader /> : null}
          value={formValuesTicketProperties.txtTicketStatus}
          getOptionLabel={(option) => `${option.CommonMasterValue}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateStateTicketProperties("txtTicketStatus", e)}
        />

        <Button type="button" varient="secondary" trigger={btnLoaderActive1} onClick={(e) => handleSave(e)}>
          Send
        </Button>
        {ChkBRHeadTypeID === "124001" ? (
          <Button type="button" varient="primary" trigger={btnLoaderActiveComment} onClick={() => handleAddComment()}>
            Comment
          </Button>
        ) : null}
      </div>
      {ChkBRHeadTypeID === "124003" ?
       <Card
  sx={{
    maxWidth: 832,
    borderRadius: "10px",
    boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
    color: "black",
    p: 0.4, // A smaller padding for Card
  }}
>
  <CardContent
    sx={{
      padding: "4px", // A override default 16px
      "&:last-child": { paddingBottom: "2px" }, // A fixes extra bottom padding
    }}
  >
     <div ref={editableRef1} 
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput1}  style={{ fontSize: "0.8rem", lineHeight: 1.4 }}  variant="body2" component="div" sx={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
      <p>If you are satisfied with our response, please rate us in a scale of 1 (not satisfied) to 5 (highly satisfied) <span class="fa fa-star"></span>
<span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span><br/>
If you are not satisfied with the response, you may call back again at 14447 and Re-Open the ticket for review. 
</p>
      <p>For more details, please check the claim payment details in bottom screen or check in Farmer login in NCIP <a href="https://pmfby.gov.in/farmerLogin" target="_blank">(https://pmfby.gov.in/farmerLogin)</a> or PMFBY WhatsApp Chat Bot (+91 70655 14447) or Crop Insurance App.</p>
    <p> Thanking You:  {user && user.UserCompanyType ? user.UserCompanyType.toString() : ""} - {user && user.UserDisplayName ? user.UserDisplayName.toString() : ""}</p>
    </div>
  </CardContent>
  </Card> : null }
    </div>
  );
}

export default ChatBox;

ChatBox.propTypes = {
  replyBoxCollapsed: PropTypes.bool.isRequired,
  value: PropTypes.node.isRequired,
  setValue: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  btnLoaderActive1: PropTypes.bool,
  ticketStatusList: PropTypes.array.isRequired,
  isLoadingTicketStatusList: PropTypes.bool,
  formValuesTicketProperties: PropTypes.object.isRequired,
  updateStateTicketProperties: PropTypes.func.isRequired,
  wordcount: PropTypes.number.isRequired,
  setWordcount: PropTypes.func.isRequired,
  formValidationSupportTicketReviewError: PropTypes.func.isRequired,
  fileRef: PropTypes.func.isRequired,
  handleResetFile: PropTypes.func.isRequired,
  handleAddComment: PropTypes.func.isRequired,
  btnLoaderActiveComment: PropTypes.bool,
  editableRef: PropTypes.func.isRequired,
  editableRef1: PropTypes.func.isRequired,
};
