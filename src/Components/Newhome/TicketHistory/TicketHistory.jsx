import { checkStatus } from "Components/Newhome/Services/Methods";
import { AlertMessage } from "Framework/Components/Widgets";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import TicketItem from "./Components/TicketItem";
import BizClass from "./TicketHistory.module.scss";
import { useNavigate } from "react-router-dom";

const TicketHistory = () => {
  const alertMessage = AlertMessage();
  const location = useLocation();
  const mobileNum = location.state?.mobileNum;
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(true);
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  useEffect(() => {
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.height = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      document.body.style.overflowX = "";
    };
  }, []);

  const handleOnExpand = (ticketId) => {
    if (expandedTicketId === ticketId) {
      setExpandedTicketId(null);
    } else {
      setExpandedTicketId(ticketId);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!mobileNum) return;
      try {
        const response = await checkStatus(mobileNum);
        if (response.responseData) {
          setData(response.responseData);
          setErrorMsg(true);
        } else {
          alertMessage({
            type: "error",
            message: response.responseMessage,
          });
          setErrorMsg(false);
        }
      } catch (error) {
        console.log(error);
        setErrorMsg(false);
      }
    };

    fetchHistory();
  }, [mobileNum]);

  const requestorDetails = useMemo(() => {
    if (data && data.responseDynamic) {
      const item = data.responseDynamic.resolved?.[0];
      if (item) {
        return {
          requestorMobileNo: item.RequestorMobileNo,
          requestorName: item.RequestorName,
          requestorDistrict: item.DistrictMasterName,
          requestorState: item.StateMasterName,
        };
      } else {
        const item = data.responseDynamic.unresolved?.[0];
        if (item) {
          return {
            requestorMobileNo: item.RequestorMobileNo,
            requestorName: item.RequestorName,
            requestorDistrict: item.DistrictMasterName,
            requestorState: item.StateMasterName,
          };
        }
      }
    }
  }, [data]);

  function maskText(text) {
    if (!text) return;

    return text
      .split("")
      .map((char, i) => {
        if (i % 2 !== 0) return "*";
        return char;
      })
      .join("");
  }

  return (
    <div className="new-home">
      <Header />
      {mobileNum ? (
        errorMsg ? (
          <div className={BizClass.container}>
            <div className={BizClass.toprightcontainer}>
              <button className={BizClass.backbutton} onClick={handleBackClick}>
                <span className={BizClass.arrow}>&larr;</span> BACK
              </button>
            </div>
            <div className={BizClass.farmerInfo}>
              <h4>Farmer Information</h4>
              <div className={BizClass.infoFields}>
                <div className={BizClass.infoField}>
                  <label>Name</label>
                  <input type="text" defaultValue={maskText(requestorDetails?.requestorName)} readOnly />
                </div>
                <div className={BizClass.infoField}>
                  <label>Mobile No</label>
                  <input type="text" defaultValue={maskText(requestorDetails?.requestorMobileNo)} readOnly />
                </div>
                <div className={BizClass.infoField}>
                  <label>District</label>
                  <input type="text" defaultValue={maskText(requestorDetails?.requestorDistrict)} readOnly />
                </div>
              </div>
            </div>
            <div className={BizClass.ticketInfo}>
              <h4>Ticket Information</h4>
              <div className={BizClass.ticketUser}>
                <i className={BizClass.userIcon}>👤</i>
                <span>{requestorDetails?.requestorName}</span>
              </div>
              <table className={BizClass.ticketTable}>
                <thead>
                  <tr>
                    <th># Ticket Number</th>
                    <th>Policy Number</th>
                    <th>Scheme Name</th>
                    <th>Ticket Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.responseDynamic?.resolved?.map((item) => (
                      <TicketItem
                        key={item.SupportTicketNo}
                        item={item}
                        isExpanded={expandedTicketId === item.SupportTicketNo}
                        onExpand={() => handleOnExpand(item.SupportTicketNo)}
                      />
                    ))}
                  {data &&
                    data.responseDynamic?.unresolved?.map((item) => (
                      <TicketItem
                        key={item.SupportTicketNo}
                        item={item}
                        isExpanded={expandedTicketId === item.SupportTicketNo}
                        onExpand={() => handleOnExpand(item.SupportTicketNo)}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className={BizClass.NoDataFoundText}>
            <p>No data found.</p>
          </div>
        )
      ) : (
        <div className={BizClass.NoDataFoundText}>
          <p>Mobile number is missing.</p>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default TicketHistory;
