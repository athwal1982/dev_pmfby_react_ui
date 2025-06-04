import { MdCall, MdOutlineWatchLater } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { RiBillLine, RiSignalWifiOffLine, RiWechatLine } from "react-icons/ri";
import { BsTicket, BsBarChart } from "react-icons/bs";
import { TbInfoSquare } from "react-icons/tb";
import { SlCalculator } from "react-icons/sl";
import ticketicon from "../../../assets/img/tickets.png";

const sidebar = [
  {
    name: "Dashboard",
    icon: <MdCall />,
    link: "#",
    submenu: [
      {
        name: "Calling Dashboard",
        icon: <MdCall />,
        link: "/calling-dashboard",
      },
      {
        name: "SLA Dashboard",
        icon: <MdOutlineWatchLater />,
        link: "/sla-dashboard",
      },
      {
        name: "Billing Dashboard",
        icon: <RiBillLine />,
        link: "/billing-dashboard",
      },
    ],
  },
  {
    name: "Setup",
    icon: <CiSettings />,
    link: "/setup",
  },
  {
    name: "Offline Intimation",
    icon: <RiSignalWifiOffLine />,
    link: "/offline-intimation",
  },
  {
    name: "Ticket",
    icon: <img src={ticketicon} className="icon-img" width={"20"} />,
    link: "/ticket",
  },
  {
    name: "Enquiry",
    icon: <TbInfoSquare />,
    link: "/enquiry",
  },
  {
    name: "Report",
    icon: <BsBarChart />,
    link: "/report",
  },
  {
    name: "Premium Calculator",
    icon: <SlCalculator />,
    link: "/premium-calculator",
  },
  {
    name: "FAQ",
    icon: <RiWechatLine />,
    link: "/faq",
  },
];

export default sidebar;
