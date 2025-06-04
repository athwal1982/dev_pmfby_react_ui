import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Breadcrumb from "./Partials/Breadcrumb";
import Secondsection from "./Partials/Secondsection";
import Calculationdetails from "./Partials/Calculationdetails";
import { FaPhoneAlt, FaUserTie, FaWhatsapp } from "react-icons/fa";
import { SiClockify, SiProbot } from "react-icons/si";
import { MdOutlineMessage, MdWifiCalling3 } from "react-icons/md";
import Tabledata from "./Partials/Tabledata";
import Calculationdetailsbootom from "./Partials/Calculationdetailsbootom";
import Dashboardwrapper from "./layouts/Dashboardwrapper";
import Billingdashboard from "./Billingdashboard";

const Dashboard = () => {
  const cards = [
    {
      name: "Inbound Calls",
      value: "1,02,01,243.05",
      icon: <FaPhoneAlt />,
      color: "#5C67F7",
      key: "inboundcall",
    },
    {
      name: "Agents",
      value: "3,57,38,660",
      icon: <FaUserTie />,
      color: "#E354D4",
      key: "agents",
    },
    {
      name: "Agents Over Time",
      value: "0.00",
      icon: <SiClockify />,
      color: "#FF5D9F",
      key: "agentsovertime",
    },
    // A {
    // A   name: "Outbound Calls",
    // A  value: "1,64,601.15",
    // A  icon: <MdWifiCalling3 />,
    // A  color: "#FF8E6F",
    // A  key: "outboundcalls",
    // A },
    {
      name: "Text Messages",
      value: "1,02,01,243.05",
      icon: <MdOutlineMessage />,
      color: "#075307",
      key: "textmessage",
    },

    {
      name: "WhatsApp",
      value: "3,57,38,660",
      icon: <FaWhatsapp />,
      color: "#9E5CF7",
      key: "whatsapp",
    },
    {
      name: "AI Bot",
      value: "0.00",
      icon: <SiProbot />,
      color: "#D57616",
      key: "aibot",
    },
  ];
  const [currentmenu, setCurrentmenu] = useState("inboundcall");
  const [currentcarddetails, setCurrentcarddetails] = useState({});
  const handlechange = (key) => {
    setCurrentmenu(key);
  };
  useEffect(() => {
    if (currentmenu) {
      let currentcard = cards.find((item) => item.key === currentmenu);
      setCurrentcarddetails(currentcard);
    }
  }, [currentmenu]);
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
  return (
    <Dashboardwrapper>
      <Billingdashboard />
    </Dashboardwrapper>
  );
};

export default Dashboard;
