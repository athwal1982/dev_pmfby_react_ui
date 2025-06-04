import React, { useEffect } from "react";
import "./../dashboard.css";
import Breadcrumb from "./partials/Breadcrumb";
import Maincard from "./components/Maincard";
import Systemuptimegraph from "./components/Systemuptimegraph";
import Averagegraph from "./components/Averagegraph";
import Agenttraining from "./components/Agenttraining";

const SlaDashboard = () => {
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
    <div className="dashboard_inner sla-dashboard">
      <Breadcrumb />
      <Maincard />
      <Systemuptimegraph />
      <div className="row my-4 ">
        <div className="col-md-6 mb-5">
          <Averagegraph />
        </div>
        <div className="col-md-6 mb-5">
          <Agenttraining />
        </div>
      </div>
    </div>
  );
};

export default SlaDashboard;
