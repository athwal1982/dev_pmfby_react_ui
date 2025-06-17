import { React, useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage, setSessionStorage } from "../../Common/Login/Auth/auth";
import { ticketDataBindingData } from "./Service/Methods";
import CropLossintimationTickets from "./Modal/CropLossintimationTickets";
import { motion } from "framer-motion";
import "./Welcome.scss";
import CloseIcon from "@mui/icons-material/Close";
import "../../Common/ImportantInstructions/ImportantInstructions.scss";
import WellImg from "../../../assets/img/Welcome_image.jpg";
import ministry_logo from "../../../assets/img/ministry_logo.png";
import { Headphones } from "@mui/icons-material";
import CSC from "../../../assets/img/CSC_Logo.svg";
import img_quote from "../../../assets/img/quote_img.png";
import ImportantInstructionsImage from "assets/Important_Instructions_Banner.jpg";
import { IconButton } from "@mui/material";

function Welcome() {
  const setAlertMessage = AlertMessage();
  const [ad, setAd] = useState(true);
  const userData = getSessionStorage("user");
  const [cropLossintimationTicketsModal] = useState(true);
  const getticketDataBindingData = async () => {
    try {
      if (getSessionStorage("ticketDataBindingSsnStrg") === null) {
        const result = await ticketDataBindingData({});
        if (result.response.responseCode === 1) {
          if (result.response.responseData) {
            console.log(result.response.responseData);
            setSessionStorage("ticketDataBindingSsnStrg", result.response.responseData);
          } else {
            setSessionStorage("ticketDataBindingSsnStrg", null);
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  useEffect(() => {
    getticketDataBindingData();
  }, []);

  const closeAd = () => {
    setAd(false);
  };
  return (
    <>
      {userData && userData.data && userData.data.data && userData.data.data.result && cropLossintimationTicketsModal ? <CropLossintimationTickets /> : null}
      {/* Background Image */}
      <>
        <div>
          {ad === true && (
            <motion.div
              // Astyle={{ zIndex: 2, position: "absolute" }}
              className="ContainerPnlInstructions2"
              initial={{ opacity: 0, y: -600 }}
              animate={{ opacity: 1, y: 15 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            >
              <IconButton
                onClick={closeAd}
                // AclassName="close-button"
                sx={{ position: "absolute", top: "10px", right: "10px" }}
              >
                <CloseIcon />
              </IconButton>

              {/* <div className="ContainerPnlInstructions"> */}
              <a href="https://docs.google.com/spreadsheets/d/16VFtCi8BkNHoUWkErfHr0HgXuCHR79DF/edit?usp=sharing&ouid=110802551208315636984&rtpof=true&sd=true" title="Click to View" target="_blank">
                <img src={ImportantInstructionsImage} style={{ width: "734px", height: "530px" }} />
              </a>
              {/* </div> */}
            </motion.div>
          )}

          {/* <div className="background-container-overlay"> */}
          <div className="background-container" style={{ backgroundImage: `url(${WellImg})` }}>
            <div className="logo-container">
              <img src={CSC} alt="CSC" />
            </div>

            <div className="header-logo">
              <img src={ministry_logo} alt="ministry_logo" />
            </div>

            <div className="text-block">
              <h5>Welcome To</h5>
              <h2>Krishi Rakshak Portal & Helpline</h2>
              <h5>For all queries, concerns, and grievances related to PMFBY, please call us at</h5>
              <span className="helplinee">
                <span className="helpline-text">
                  <Headphones /> Krishi Rakshak Portal Helpline
                </span>
                <span className="helpline-number">
                  <strong>14447</strong>
                </span>
              </span>
            </div>
            <br />
            <img className="quote-image" src={img_quote} alt="quote" />
            {/* </div> */}
          </div>
        </div>
      </>
    </>
  );
}
export default Welcome;
