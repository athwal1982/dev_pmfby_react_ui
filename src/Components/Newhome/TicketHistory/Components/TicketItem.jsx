import classNames from "classnames";
import React from "react";
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
        <td>{ticket.CategoryName}</td>
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
                  <strong>{ticket.CallerMobileNo}</strong>
                  </div> */}
              {/* <div className={BizClass.detailsCol}>
                  <span>Support Ticket No</span>
                  <strong>{ticket.SupportTicketNo}</strong>
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
                  <strong>{ticket.InsuranceCompany}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Requestor Name</span>
                  <strong>{ticket.RequestorName}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Requestor Mobile No</span>
                  <strong>{ticket.RequestorMobileNo}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Application Number</span>
                  <strong>{ticket.ApplicationNo ?? "--"}</strong>
                </div>
              </div>
              <div className={BizClass.detailsGrid}>
                <div className={BizClass.detailsCol}>
                  <span>Crop Category Others</span>
                  <strong>{ticket.CropCategoryOthers ? ticket.CropCategoryOthers : "--"}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Request Year</span>
                  <strong>{ticket.RequestYear}</strong>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Request Season</span>
                  <strong>{ticket.RequestSeason}</strong>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <span>Loss Date</span>
                  <strong>{ticket.LossDate ? moment(ticket.LossDate).format("YYYY-MM-DD") : "--"}</strong>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Loss Time</span>
                  <strong>{ticket.LossTime ?? "--"}</strong>
                </div> */}
                {/* <div className={BizClass.detailsCol}>
                  <span>On Time Intimation Flag</span>
                  <strong>{ticket.OnTimeIntimationFlag}</strong>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <span>Village Name</span>
                  <strong>{ticket.VillageName}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Application Crop Name</span>
                  <strong>{ticket.ApplicationCropName}</strong>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Crop Name</span>
                  <strong>{ticket.CropName ? ticket.CropName : "--"}</strong>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <span>Area</span>
                  <strong>{ticket.AREA}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Post Harvest Date</span>
                  <strong>{ticket.PostHarvestDate ?? "--"}</strong>
                </div>

                {/* <div className={BizClass.detailsCol}>
                  <span>Insurance Policy Number</span>
                  <strong>{ticket.InsurancePolicyNo ?? "--"}</strong>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <span>Insurance Expiry Date</span>
                  <strong>{ticket.InsurancePolicyDate ?? "--"}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Farmer Share</span>
                  <strong>{ticket.FarmerShare ?? "--"}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Sowing Date/Seeding Date</span>
                  <strong>{ticket.SowingDate ? moment(ticket.SowingDate).format("YYYY-MM-DD") : "--"}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Crop Season Name</span>
                  <strong>{ticket.CropSeasonName}</strong>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Ticket Source Name</span>
                  <strong>{ticket.TicketSourceName}</strong>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <span>Ticket Category Name</span>
                  <strong>{ticket.CategoryName}</strong>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Ticket Status</span>
                  <strong>{ticket.TicketStatus}</strong>
                </div> */}

                <div className={BizClass.detailsCol}>
                  <span>Ticket Type Name</span>
                  <strong>{ticket.CategoryName}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>State Master Name</span>
                  <strong>{ticket.StateMasterName}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>District Master Name</span>
                  <strong>{ticket.District}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Ticket Head Name</span>
                  <strong>{ticket.TicketHeadName}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Scheme Name</span>
                  <strong>{ticket.SchemeName}</strong>
                </div>
                {/* <div className={BizClass.detailsCol}>
                  <span>Created At</span>
                  <strong>{ticket.CreatedAt}</strong>
                </div> */}
                <div className={BizClass.detailsCol}>
                  <span>Status Changed On</span>
                  <strong>{ticket.StatusChangedOn}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Ticket Description</span>
                  <strong>{ticket && ticket.TicketDescription ? parse(ticket.TicketDescription) : null}</strong>
                </div>
                <div className={BizClass.detailsCol}>
                  <span>Comments</span>
                  <strong>{ticket && ticket.Comments ? parse(ticket.Comments) : null}</strong>
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
