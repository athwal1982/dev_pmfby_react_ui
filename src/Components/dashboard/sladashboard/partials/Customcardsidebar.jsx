import React from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";

const Customcardsidebar = ({ color, name, value, list, icon, link }) => {
  return (
    <>
      <div
        className="card sla-custom-card"
        style={{
          background: color,
        }}
      >
        <div className="card-left">
          <div className="top-wrapper">
            <p className="card_name">{name}</p>
            <p className="card_value">{value}</p>
          </div>
        </div>
        <div className="icon-area">
          <div className="icon-card-cotainer">
            <img src={icon} className="icon-card" alt="" />
          </div>
        </div>
      </div>
      <div className="drawer_sidebar_container">
        <ul className="card_ul">
          {list.map((item, index) => {
            return (
              <li key={index}>
                <IoMdArrowDropright />
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Customcardsidebar;
