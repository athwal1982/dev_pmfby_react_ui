import React, { useState } from "react";
import "./ICTablePopup.css";
import axios from "axios";
import excelLogo from "assets/img/excelLogo.png";
import { Box } from "@mui/system";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import ExportReportLogics from "../Partials/ExportReportLogics";
import FutureGeneraliLogo from "assets/ICLogo/FutureGen.jpeg";
import Aic from "assets/ICLogo/Aic.png";
import BajajAl from "assets/ICLogo/BajajAllianza.jpeg";
import CholaMS from "assets/ICLogo/CholaMS.png";
import HdfcErgo from "assets/ICLogo/HdfcErgo.jpeg";
import IciciLom from "assets/ICLogo/IciciLomb.png";
import IfcoTokia from "assets/ICLogo/IfcoTokio.jpeg";
import Config from "Configration/Config.json";
import UnitedIndia from "assets/ICLogo/Unitedindia.jpeg";
import UnivSompo from "assets/ICLogo/UnivSompo.png";
import Orient from "assets/ICLogo/OrientalInsur.png";
import kShema from "assets/ICLogo/kshema.jpeg";
import NationInsur from "assets/ICLogo/NationalInsur.jpeg";
import NewIndia from "assets/ICLogo/NewIndiaAssur.jpeg";
import RelGen from "assets/ICLogo/RelGeneral.png";
import RoyalSund from "assets/ICLogo/RoyalSund.png";
import SbiGen from "assets/ICLogo/SbiGen.png";
import TataAig from "assets/ICLogo/TataAig.jpeg";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { Tooltip } from "@mui/material";

const ICTablePopup = ({
  yearMonth,
  icmailData,
  setIcMailData,
  handleIcPopUpclose,
  handleIcPopUpOpen,
  templatePopup,
  setTemplatePopUp,
  isoverlayICPopup,
  setIsOverlayICPopup,
}) => {
  const setAlertMessage = AlertMessage();
  const [file, setFile] = useState(null);
  const [icCompany, setIcCompany] = useState();

  const [popUpImport2, setPopUpImport2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectAll, setSelectAll] = useState(false);
  const {
    handleNotificationButton,
    handleDownloadIcFile,
    handleTemplateShow,
    mailTemplatesubject,
    setMailTemplateSubject,
    mailTemplateBody,
    setMailTemplateBody,
  } = ExportReportLogics({
    yearMonth,
  });

  const [members, setMembers] = useState(icmailData[0].map((item) => ({ ...item, selected: false })));

  const normalizeKey = (name) => {
    return name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  };

  const insuranceLogos = {
    [normalizeKey("NATIONAL INSURANCE COMPANY LIMITED")]: NationInsur,
    [normalizeKey("ROYAL SUNDARAM GENERAL INSURANCE CO. LIMITED")]: RoyalSund,
    [normalizeKey("NEW INDIA ASSURANCE COMPANY")]: NewIndia,
    [normalizeKey("AGRICULTURE INSURANCE COMPANY")]: Aic,
    [normalizeKey("BAJAJ ALLIANZ GENERAL INSURANCE CO. LTD")]: BajajAl,
    [normalizeKey("CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LIMITED")]: CholaMS,
    [normalizeKey("FUTURE GENERALI INDIA INSURANCE CO. LTD.")]: FutureGeneraliLogo,
    [normalizeKey("HDFC ERGO GENERAL INSURANCE CO. LTD.")]: HdfcErgo,
    [normalizeKey("ICICI LOMBARD GENERAL INSURANCE CO. LTD.")]: IciciLom,
    [normalizeKey("IFFCO TOKIO GENERAL INSURANCE CO. LTD.")]: IfcoTokia,
    [normalizeKey("KSHEMA GENERAL INSURANCE LIMITED")]: kShema,
    [normalizeKey("ORIENTAL INSURANCE")]: Orient,
    [normalizeKey("RELIANCE GENERAL INSURANCE CO. LTD.")]: RelGen,
    [normalizeKey("SBI GENERAL INSURANCE")]: SbiGen,
    [normalizeKey("TATA AIG GENERAL INSURANCE CO. LTD.")]: TataAig,
    [normalizeKey("UNITED INDIA INSURANCE CO.")]: UnitedIndia,
    [normalizeKey("UNIVERSAL SOMPO GENERAL INSURANCE COMPANY")]: UnivSompo,
  };

  const getCompanyLogo = (companyName) => insuranceLogos[normalizeKey(companyName)] || "default-logo.png";

  const handleCheckboxChange = (index) => {
    setMembers((prevMembers) => {
      const updatedMembers = prevMembers.map((member, i) => (i === index ? { ...member, selected: !member.selected } : member));
      setSelectAll(updatedMembers.every((member) => member.selected));
      return updatedMembers;
    });
  };

  const handleSelectAll = () => {
    setMembers((prevMembers) => {
      const allSelected = !selectAll;
      const updatedMembers = prevMembers.map((member) => ({
        ...member,
        selected: allSelected,
      }));
      setSelectAll(allSelected);
      return updatedMembers;
    });
  };

  const handleSubmit = async () => {
    if (!members || members.length === 0) {
      setAlertMessage({ type: "error", message: "No data available" });
      return;
    }

    const selectedData = members.filter((member) => member.selected);
    if (selectedData.length === 0) {
      setAlertMessage({ type: "error", message: "Please select any box" });
      return;
    }

    const selectedICNames = [...new Set(selectedData.map((member) => member.company_name))];
    setIcCompany(selectedICNames);

    await handleTemplateShow();
    setTemplatePopUp(true);
    setAlertMessage({ type: "success", message: "Please check the mail template" });
  };

  const handleUploadExcelicmail = async (file) => {
    const user = getSessionStorage("user");
    const userMenuID = getSessionStorage("UserMenuId");
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    const options = {
      method: "POST",
      url: `${Config.BaseUrl}FGMS/uploadIcMaildsDataXlsx`,
      params: { year_month: yearMonth, masterMenuId: userMenuID },
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: user.token.Token,
      },
      data: form,
    };

    try {
      const response = await axios.request(options);

      if (response?.data?.error) {
        setAlertMessage({
          type: "error",
          message: response.data.error,
        });
      } else {
        setAlertMessage({
          type: "success",
          message: "Mails updated successfully",
        });
      }

      await handleNotificationButton();
      setPopUpImport2(false);
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Invalid Ic maild file format.",
      });
      setPopUpImport2(false);
    }
  };

  const handleSendEmailNotif = async (icCompany) => {
    const user = getSessionStorage("user");
    const userMenuID = getSessionStorage("UserMenuId");

    const options = {
      method: "POST",
      url: `${Config.BaseUrl}FGMS/publishDataAndSendNotificationToICs`,
      params: { masterMenuId: userMenuID },
      headers: {
        Authorization: user.token.Token,
        "Content-Type": "application/json",
      },
      data: {
        year_month: yearMonth,
        SelectedICNames: icCompany,
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data.responseCode === "1") {
        setAlertMessage({ type: "success", message: "Mail sent to selected IC's successfully ." });
        setIsOverlayICPopup(false);
        setIcMailData([]);
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePopupupload = async (e) => {
    e.stopPropagation();
    setPopUpImport2(true);
  };

  const handleClose = () => {
    setPopUpImport2(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      handleUploadExcelicmail(file);
    } else {
      console.error("Please select a file.");
    }
  };

  return (
    <>
      {isoverlayICPopup === true ? (
        <>
          <div className="ICTABLE-overlay">
            <div className="ICTABLE-modal">
              {/* <button onClick={handleIcPopUpclose} className="ICTABLE-close-button">
                <img src={close} alt="X" />
              </button> */}
              <IconButton className="ICTABLE-close-button" onClick={handleIcPopUpclose}>
                <Close />
              </IconButton>

              {templatePopup === true ? (
                <>
                  <div
                    style={{ fontFamily: "Quicksand, sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: `<strong>Subject: ${mailTemplatesubject}</strong><br />${mailTemplateBody}` }}
                  ></div>
                  <div className="ICTABLE-button-group">
                    <button className="btn btn-primary bg-green custom-btn-size" onClick={() => handleSendEmailNotif(icCompany)}>
                      Send Mail
                    </button>
                  </div>{" "}
                </>
              ) : (
                <>
                  <br />
                  {/* <span className="ICTABLE-txt">IC Member List</span> */}
                  <table className="ICTABLE-table">
                    <thead className="ICTABLE-thead">
                      <tr className="ICTABLE-tr">
                        <th
                          className="ICTABLE-th"
                          style={{
                            width: "5%",
                          }}
                        >
                          <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                        </th>
                        <th
                          className="ICTABLE-th"
                          style={{
                            width: "5%",
                          }}
                        >
                          Logo
                        </th>
                        <th
                          className="ICTABLE-th"
                          style={{
                            width: "40%",
                          }}
                        >
                          IC Name
                        </th>
                        <th
                          className="ICTABLE-th"
                          style={{
                            width: "55%",
                          }}
                        >
                          IC Mail
                        </th>
                      </tr>
                    </thead>
                    <tbody className="ICTABLE-tbody">
                      {members.map((member, index) => (
                        <tr key={member._id} className="ICTABLE-tr">
                          <td
                            className="ICTABLE-td"
                            style={{
                              width: "5%",
                            }}
                          >
                            <input type="checkbox" checked={member.selected} onChange={() => handleCheckboxChange(index)} />
                          </td>
                          <td className="ICTABLE-td" style={{ width: "10%" }}>
                            <img
                              src={getCompanyLogo(member.company_name)}
                              alt={member.company_name}
                              style={{ width: "140px", height: "80px", objectFit: "fill" }}
                            />
                          </td>

                          <td
                            className="ICTABLE-td"
                            style={{
                              width: "40%",
                              fontSize: "14px",
                            }}
                          >
                            {member.company_name}
                          </td>

                          <td
                            className="ICTABLE-td"
                            style={{
                              width: "55%",
                            }}
                          >
                            {typeof member.mail_id === "string" && member.mail_id.length > 0
                              ? member.mail_id.split(";").map((email, index) => <div key={index}>{email.trim()}</div>)
                              : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="ICTABLE-button-group">
                    <Tooltip arrow title="Download File for Email change">
                      <button className="btn btn-primary bg-green custom-btn-size" onClick={handleDownloadIcFile}>
                        Download
                      </button>
                    </Tooltip>
                    <Tooltip arrow title="Upload Email Changes">
                      <button className="btn btn-primary bg-green custom-btn-size" onClick={handlePopupupload}>
                        Upload
                      </button>
                    </Tooltip>
                    <Tooltip arrow title="Submit">
                      <button className="btn btn-primary bg-green custom-btn-size" onClick={handleSubmit}>
                        Submit
                      </button>
                    </Tooltip>
                  </div>
                </>
              )}
            </div>

            {popUpImport2 === true && (
              <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: "10px",
                    transition: "opacity 0.3s ease-in-out",
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    padding: "0px 24px",
                    bgcolor: "#075307",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: "17px",
                  }}
                >
                  Upload File
                  <IconButton onClick={handleClose} sx={{ color: "white" }}>
                    <Close />
                  </IconButton>
                </DialogTitle>

                <DialogContent sx={{ textAlign: "center", p: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                    <div style={{ border: "1px solid #EFF0F1", borderRadius: "5px", padding: "10px" }}>
                      <img src={excelLogo} alt="Excel" width={50} />
                    </div>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 2, fontWeight: "bold", fontFamily: "Quicksand, sans-serif" }}>
                    Select an Excel file to upload
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "center", width: "100%", gap: 2 }}>
                    <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
                  </Box>

                  <Button
                    onClick={handleUpload}
                    variant="contained"
                    disabled={loading || !file}
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#d4f3af",
                      color: "black",
                      borderRadius: "10px",
                      px: 8,
                      fontFamily: "Quicksand, sans-serif",
                      mt: 3,
                    }}
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </Button>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default ICTablePopup;
