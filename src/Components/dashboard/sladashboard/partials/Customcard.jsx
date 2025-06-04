import React from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";

const Customcard = ({ color, name, value, list, icon, link, handleopen }) => {
  return (
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
      <div className="icon-area">
        <div className="icon-card-cotainer">
          <img src={icon} className="icon-card" alt="" />
        </div>
        <Link
          onClick={() => {
            handleopen({
              color,
              name,
              value,
              list,
              icon,
            });
          }}
          className="more-info"
        >
          {"More Info"}
          <FaChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default Customcard;
