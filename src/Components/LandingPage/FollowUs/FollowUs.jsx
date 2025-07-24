import React, { useState } from "react";
import "./FollowUs.css";

const FollowUs = () => {
  const [expanded, setExpanded] = useState(false);

  const togglePanel = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div className="follow-us-wrapper">
        <button className="follow-us-button" onClick={togglePanel}>
          <span>FOLLOW US</span>
        </button>
      </div>
      <div className={`follow-us-panel ${expanded ? "expanded" : ""}`}>
        <div className="social-icons">
          <a target="_blank" href="https://rb.gy/x2ut5p">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
          </a>
          <a target="_blank" href="https://rb.gy/ny4uqm">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" />
          </a>
          <a target="_blank" href="https://rb.gy/kie9ew">
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" />
          </a>
          <a target="_blank" href="https://rb.gy/3agsy0">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" />
          </a>
        </div>
      </div>
    </>
  );
};

export default FollowUs;
