import React from "react";
import dateicon from "./../../../../assets/img/sla/date-icon.png";
import monthicon from "./../../../../assets/img/sla/month.png";
import icicon from "./../../../../assets/img/sla/ic-icon.png";

const Breadcrumb = () => {
  return (
    <div className="breadcrumb-sla">
      <div className="parent-container">
        <div>
          <p className="breadcrumb-title">Service Level Agreement for Oct 2024</p>
        </div>
        <div>
          <div className="right-form-container">
            <div className="custom-select-wrapper">
              <select className="form-select" id="customSelect">
                <option value="1">Select Year</option>
              </select>
              <span className="custom-icon">
                <img src={dateicon} alt="Custom Icon" />
              </span>
            </div>
            <div className="custom-select-wrapper">
              <select className="form-select gray-color" id="customSelect">
                <option value="1">Select month</option>
              </select>
              <span className="custom-icon">
                <img src={monthicon} alt="Custom Icon" />
              </span>
            </div>
            <div className="custom-select-wrapper">
              <select className="form-select gray-color" id="customSelect">
                <option value="1">Select IC</option>
              </select>
              <span className="custom-icon">
                <img src={icicon} alt="Custom Icon" />
              </span>
            </div>
            <button className="btn btn-sm submit-green">Submit</button>
            <button className="btn btn-sm submit-reset">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
