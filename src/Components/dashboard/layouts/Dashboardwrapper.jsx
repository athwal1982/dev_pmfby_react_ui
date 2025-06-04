import React from "react";
import Dashboardheader from "./Dashboardheader";
import Dashboardsidebar from "./Dashboardsidebar";

const Dashboardwrapper = ({ children }) => {
  return (
    <div className="dashboard-main-container">
      <Dashboardheader />
      <div className="dashboard-inner-container">
        <Dashboardsidebar />
        {children}
      </div>
    </div>
  );
};

export default Dashboardwrapper;
