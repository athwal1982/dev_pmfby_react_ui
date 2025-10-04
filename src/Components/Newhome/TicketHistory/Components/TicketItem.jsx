import classNames from "classnames";
import React, { useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BizClass from "../TicketHistory.module.scss";
import moment from "moment";
import parse from "html-react-parser";
import FutureGeneraliLogo from "../../../../assets/ICLogo/FutureGen.jpeg";
import Aic from "../../../../assets/ICLogo/Aic.png";
import BajajAl from "../../../../assets/ICLogo/BajajAllianza.jpeg";
import CholaMS from "../../../../assets/ICLogo/CholaMS.png";
import HdfcErgo from "../../../../assets/ICLogo/HdfcErgo.jpeg";
import IciciLom from "../../../../assets/ICLogo/IciciLomb.png";
import IfcoTokia from "../../../../assets/ICLogo/IfcoTokio.jpeg";
import kShema from "../../../../assets/ICLogo/kshema.jpeg";
import NationInsur from "../../../../assets/ICLogo/NationalInsur.jpeg";
import NewIndia from "../../../../assets/ICLogo/NewIndiaAssur.jpeg";
import RelGen from "../../../../assets/ICLogo/RelGeneral.png";
import RoyalSund from "../../../../assets/ICLogo/RoyalSund.png";
import SbiGen from "../../../../assets/ICLogo/SbiGen.png";
import TataAig from "../../../../assets/ICLogo/TataAig.jpeg";
import UnitedIndia from "../../../../assets/ICLogo/Unitedindia.jpeg";
import UnivSompo from "../../../../assets/ICLogo/UnivSompo.png";
import Orient from "../../../../assets/ICLogo/OrientalInsur.png";
import { BiUnderline } from "react-icons/bi";
import FarmerRating from "./FarmerRating";

const TicketItem = ({ item: ticket, isExpanded, onExpand }) => {
  const isResolved = ticket.TicketStatus === "Resolved";

  const removeHtmlTags = (str) => {
    if (!str) return "";
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const insuranceLogos = {
    "FUTURE GENERALI INDIA INSURANCE CO. LTD.": FutureGeneraliLogo,
    "AGRICULTURE INSURANCE COMPANY": Aic,
    "BAJAJ ALLIANZ GENERAL INSURANCE CO. LTD": BajajAl,
    "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LIMITED": CholaMS,
    "HDFC ERGO GENERAL INSURANCE CO. LTD.": HdfcErgo,
    "ICICI LOMBARD GENERAL INSURANCE CO. LTD.": IciciLom,
    "IFFCO TOKIO GENERAL INSURANCE CO. LTD.": IfcoTokia,
    "KSHEMA GENERAL INSURANCE LIMITED": kShema,
    "NATIONAL INSURANCE COMPANY LIMITED": NationInsur,
    "NEW INDIA ASSURANCE COMPANY": NewIndia,
    "RELIANCE GENERAL INSURANCE CO. LTD.": RelGen,
    "ROYAL SUNDARAM GENERAL INSURANCE CO. LIMITED": RoyalSund,
    "SBI GENERAL INSURANCE": SbiGen,
    "TATA AIG GENERAL INSURANCE CO. LTD.": TataAig,
    "UNITED INDIA INSURANCE CO.": UnitedIndia,
    "UNIVERSAL SOMPO GENERAL INSURANCE COMPANY": UnivSompo,
    "ORIENTAL INSURANCE": Orient,
  };
  const getInsuranceLogo = (insuranceCompany) => {
    return insuranceLogos[insuranceCompany];
  };

  const logoPath = getInsuranceLogo(ticket.InsuranceCompany);

  return (
    <React.Fragment>
      <tr className={BizClass.ticketRow} onClick={onExpand}>
        <td>{ticket.SupportTicketNo}</td>
        <td>{ticket.InsurancePolicyNo}</td>
        <td>{ticket.SchemeName ?? "--"}</td>
        <td>{ticket.TicketTypeName}</td>
        <td className={classNames(BizClass.status, isResolved ? BizClass.resolved : BizClass.unresolved)}>
          {ticket.TicketStatus}
          {isExpanded ? (
            <ArrowDropUpIcon className={BizClass.arrowIcon} style={{ color: "black" }} />
          ) : (
            <ArrowDropDownIcon className={BizClass.arrowIcon} style={{ color: "black" }} />
          )}
        </td>
      </tr>

      {/* Expandable content within the same row */}
      {isExpanded && (
        <tr className={BizClass.expandableContent}>
          <td colSpan="5">
            <div className={classNames(BizClass.ticketDetails, BizClass.open)}>
              <h3>Ticket Details #{ticket.SupportTicketNo}</h3>
              {/* <div className={BizClass.detailsCol}>
                  <span>Caller Contact Number</span>
                  <span>{ticket.CallerMobileNo}</span>
                  </div> */}
              {/* <div className={BizClass.detailsCol}>
                  <span>Support Ticket No</span>
                  <span>{ticket.SupportTicketNo}</span>
                  </div> */}
              <div className={BizClass.detailsGrid} style={{ background: "white", borderRadius: "10px", paddingLeft: "20px", marginBottom: "10px" }}>
                <div className={BizClass.detailsCol}>
                  <img
                    src={logoPath}
                    alt={ticket.InsuranceCompany}
                    className={BizClass.insuranceLogo}
                    style={{
                      width: "100px",
                      height: "auto",
                      marginTop: "10px",
                      objectFit: "contain",
                    }}
                  />
                  <span>{ticket.InsuranceCompany}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Requestor Name</strong>
                  <span>{ticket.RequestorName}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Requestor Mobile No</strong>
                  <span>{ticket.RequestorMobileNo}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Application Number</strong>
                  <span>{ticket.ApplicationNo ?? "--"}</span>
                </div>
              </div>
              <div className={BizClass.detailsGrid}>
                <div className={BizClass.detailsCol}>
                  <strong>Crop Category Others</strong>
                  <span>{ticket.CropCategoryOthers ? ticket.CropCategoryOthers : "--"}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Request Year</strong>
                  <span>{ticket.RequestYear}</span>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Request Season</span>
                  <span>{ticket.RequestSeason}</span>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <strong>Loss Date</strong>
                  <span>{ticket.LossDate ? moment(ticket.LossDate).format("DD-YYYY-MM") : "--"}</span>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Loss Time</span>
                  <span>{ticket.LossTime ?? "--"}</span>
                </div> */}
                {/* <div className={BizClass.detailsCol}>
                  <span>On Time Intimation Flag</span>
                  <span>{ticket.OnTimeIntimationFlag}</span>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <strong>Village Name</strong>
                  <span>{ticket.VillageName}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Application Crop Name</strong>
                  <span>{ticket.ApplicationCropName}</span>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Crop Name</span>
                  <span>{ticket.CropName ? ticket.CropName : "--"}</span>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <strong>Area</strong>
                  <span>{ticket.AREA}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Post Harvest Date</strong>
                  <span>{ticket.PostHarvestDate ? moment(ticket.PostHarvestDate).format("DD-MM-YYYY") : "--"}</span>
                </div>

                {/* <div className={BizClass.detailsCol}>
                  <span>Insurance Policy Number</span>
                  <span>{ticket.InsurancePolicyNo ?? "--"}</span>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <strong>Insurance Expiry Date</strong>
                  <span>{ticket.InsurancePolicyDate ?? "--"}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Farmer Share</strong>
                  <span>{ticket.FarmerShare ?? "--"}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Sowing Date/Seeding Date</strong>
                  <span>{ticket.SowingDate ? moment(ticket.SowingDate).format("DD-MM-YYYY") : "--"}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Crop Season Name</strong>
                  <span>{ticket.CropSeasonName}</span>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Ticket Source Name</span>
                  <span>{ticket.TicketSourceName}</span>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <strong>Ticket Category Name</strong>
                  <span>{ticket.CategoryName}</span>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Ticket Status</span>
                  <span>{ticket.TicketStatus}</span>
                </div> */}

                <div className={BizClass.detailsCol}>
                  <strong>Ticket Type Name</strong>
                  <span>{ticket.CategoryName}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>State Name</strong>
                  <span>{ticket.StateMasterName}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>District Name</strong>
                  <span>{ticket.District}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Ticket Head Name</strong>
                  <span>{ticket.TicketHeadName}</span>
                </div>
                <div className={BizClass.detailsCol}>
                  <strong>Scheme Name</strong>
                  <span>{ticket.SchemeName}</span>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Created At</span>
                  <span>{ticket.CreatedAt}</span>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <strong>Status Changed On</strong>
                  <span>{ticket.StatusChangedOn ? moment(ticket.StatusChangedOn).format("DD-MM-YYYY") : "--"}</span>
                </div>
              </div>
              <div className={BizClass.detailsGrid}>
                <div className={BizClass.detailsCol}>
                  <strong>Ticket Description</strong>
                  <span>{ticket && ticket.TicketDescription ? parse(ticket.TicketDescription) : null}</span>
                </div>
              </div>
              <br />
              <div className={BizClass.detailsGridcomment}>
                <div className={BizClass.detailsCol}>
                  <strong>Comments</strong>
                  <span>{ticket && ticket.Comments ? parse(ticket.Comments) : "--"}</span>
                </div>
                <div className={BizClass.detailsCol} style={{paddingTop:"110px"}}>
                  {ticket.TicketStatus === "Resolved" ? <strong>Rating</strong> : null}
                  {ticket.TicketStatus === "Resolved" ? (
                    ticket && ticket.Rating && ticket.Rating !== null ? (
                      <div style={{ fontSize: "22px" }}>
                        {Array.from({ length: ticket.Rating }, (i) => (
                          <span
                            key={i}
                            style={{
                              cursor: "pointer",
                              color: "#ffcc00",
                            }}
                          >
                            &#9733;
                          </span>
                        ))}
                      </div>
                    ) : (
                      <FarmerRating ticket={ticket} />
                    )
                  ) : null}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default TicketItem;