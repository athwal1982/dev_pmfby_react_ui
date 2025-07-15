import { FaPhoneAlt, FaUserTie, FaWhatsapp } from "react-icons/fa";
import { SiClockify, SiProbot } from "react-icons/si";
import { MdOutlineMessage, MdWifiCalling3 } from "react-icons/md";

export const billinginfo = () => {
  const cards = [
    {
      name: "Inbound Calls",
      value: "1,02,01,243.05",
      icon: <FaPhoneAlt />,
      color: "#5C67F7",
      key: "INBNDCL",
    },
    {
      name: "Outbound Calls",
      value: "1,64,601.15",
      icon: <MdWifiCalling3 />,
      color: "#FF8E6F",
      key: "OTBNDCL",
    },
    {
      name: "Agents",
      value: "3,57,38,660",
      icon: <FaUserTie />,
      color: "#E354D4",
      key: "AGNT",
    },
    {
      name: "Agents Over Time",
      value: "0.00",
      icon: <SiClockify />,
      color: "#FF5D9F",
      key: "AGNTOVRTM",
    },

    {
      name: "Text Messages",
      value: "1,02,01,243.05",
      icon: <MdOutlineMessage />,
      color: "#075307",
      key: "TXTMSG",
    },
    {
      name: "WhatsApp",
      value: "0.00",
      icon: <FaWhatsapp />,
      color: "#9E5CF7",
      key: "WHAPP",
    },
    {
      name: "AI Bot",
      value: "0.00",
      icon: <SiProbot />,
      color: "#D57616",
      key: "AIBT",
    },
  ];

  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearlist = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
  const monthlist = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const columns = [
    { key: "taged_pulses", displayName: "No. of In Bound Tagged Calls (IBTC) Pulses (A1)" },
    { key: "percentagePulse", displayName: "% Share of IBTC Pulses (B1)" },
    { key: "untaged_pulses", displayName: "No. of IB Untagged Calls (C1)" },
    { key: "total_billing_pulses", displayName: "Total Billable Pulses (R)" },
  ];

  return { cards, yearlist, monthlist, columns };
};

export default billinginfo;
