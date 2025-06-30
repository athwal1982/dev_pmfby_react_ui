import React, { useState } from "react";
import closeicon from "../../../../assets/img/sla/close.png";
import Customcardsidebar from "../partials/Customcardsidebar";
import { Drawer } from "@mui/material";
const Sidebardrawer = ({ open, currentCard, handleclose }) => {
  
  const [slamoreInformation] = useState({
    objSystemUptime: [
      { target: ">=97%", penaltyClause: "Nil" },
      { target: ">=95% but <97%", penaltyClause: "1.0% of the monthly billed amount" },
      { target: ">=92.5% but <95%", penaltyClause: "2.0% of the monthly billed amount" },
      { target: ">=90% but <92.5%", penaltyClause: "3.0% of the monthly billed amount" },
      { target: ">=87% but <90%", penaltyClause: "5.0% of the monthly billed amount" },
      { target: "<87%", penaltyClause: "7.0% of the monthly billed amount" },
    ],
    objASA: [
      { target: ">80% calls attended within 30 seconds from the caller choosing to speak to an agent (seat)", penaltyClause: "Nil" },
      { target: "70-80% calls attended within 30 seconds", penaltyClause: "3.0% of the monthly billed amount" },
      {
        target: "<70% calls attended with in 30 seconds from the caller choosing to speak to an agent (seat)",
        penaltyClause: "5.0% of the monthly billed amount",
      },
    ],
    objAHT: [
      { target: ">=300 Seconds for more than 30% of total call volume", penaltyClause: "7.0% of the monthly billed amount" },
      { target: ">=300 Seconds for 10%-30% of total call volume", penaltyClause: "5.0% of the monthly billed amount" },
      { target: ">=300 Seconds for less than 10% of total call volume", penaltyClause: "Nil" },
    ],
    objClQltyScre: [
      { target: ">80%", penaltyClause: "NIL" },
      { target: "Between 80% and 75%", penaltyClause: "2.0% of the monthly billed amount" },
      { target: "Between 70% and 75%", penaltyClause: "3.0% of the monthly billed amount" },
      { target: "<70%", penaltyClause: "5.0% of the monthly billed amount" },
    ],
    objAgntsTraning: [
      { target: "40 Hours", penaltyClause: "NIL" },
      { target: "30-40 Hours", penaltyClause: "1.5% of the monthly billed amount" },
      { target: "<30 Hours", penaltyClause: "5% of the monthly billed Amount" },
    ],
    objstutlzn: [
      { target: ">80%", penaltyClause: "NIL" },
      { target: "Between 75% to 80%", penaltyClause: "2.0% of the monthly billed amount" },
      { target: "Between 70% to 75%", penaltyClause: "3.0% of the monthly billed amount" },
      { target: "<70%", penaltyClause: "3.0% of the monthly billed amount" },
    ],
  });
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleclose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 600,
          transition: "transform 0.3s ease-in-out",
          transform: open ? "translateX(0)" : "translateX(100%)",
        },
      }}
    >
      <div className="sla-dashboard">
        <div className="sidebar_drawer">
          <div className="sidebar_drawer_container">
            <div className="title_container">
              <p className="title">
                {" "}
                {currentCard.name === "System Uptime"
                  ? "System Uptime Information"
                  : currentCard.name === "ASA > 30 Seconds"
                    ? "ASA Information"
                    : currentCard.name === "AHT >= 300 Seconds"
                      ? "AHT Information"
                      : currentCard.name === "Call Quality Score"
                        ? "Call Quality Score Information"
                        : currentCard.name === "Agents Training"
                          ? "Agents Training Information"
                          : currentCard.name === "Seat Utilization"
                            ? "Seat Utilization Information"
                            : ""}
              </p>
              <img onClick={handleclose} src={closeicon} className="icon-close" alt="" />
            </div>
            <div className="sla-content-area pb-3">
              <Customcardsidebar color={currentCard.color} name={currentCard?.name} value={currentCard.value} list={currentCard.list} icon={currentCard.icon} />
            </div>
            <div className="title_container">
              <p className="title">Service Level Agreement</p>
            </div>
            <div className="agreement_data py-3">
              <table className="table">
                <thead>
                  <th>Target</th>
                  <th>Penalty Clause</th>
                </thead>
                {currentCard.name === "System Uptime"
                  ? slamoreInformation && slamoreInformation.objSystemUptime && slamoreInformation.objSystemUptime.length > 0
                    ? slamoreInformation.objSystemUptime.map((data) => {
                        return (
                          <tbody>
                            <tr>
                              <td>{data.target}</td>
                              <td>{data.penaltyClause}</td>
                            </tr>
                          </tbody>
                        );
                      })
                    : null
                  : currentCard.name === "ASA > 30 Seconds"
                    ? slamoreInformation && slamoreInformation.objASA && slamoreInformation.objASA.length > 0
                      ? slamoreInformation.objASA.map((data) => {
                          return (
                            <tbody>
                              <tr>
                                <td>{data.target}</td>
                                <td>{data.penaltyClause}</td>
                              </tr>
                            </tbody>
                          );
                        })
                      : null
                    : currentCard.name === "AHT >= 300 Seconds"
                      ? slamoreInformation && slamoreInformation.objAHT && slamoreInformation.objAHT.length > 0
                        ? slamoreInformation.objAHT.map((data) => {
                            return (
                              <tbody>
                                <tr>
                                  <td>{data.target}</td>
                                  <td>{data.penaltyClause}</td>
                                </tr>
                              </tbody>
                            );
                          })
                        : null
                      : currentCard.name === "Call Quality Score"
                        ? slamoreInformation && slamoreInformation.objClQltyScre && slamoreInformation.objClQltyScre.length > 0
                          ? slamoreInformation.objClQltyScre.map((data) => {
                              return (
                                <tbody>
                                  <tr>
                                    <td>{data.target}</td>
                                    <td>{data.penaltyClause}</td>
                                  </tr>
                                </tbody>
                              );
                            })
                          : null
                        : currentCard.name === "Agents Training"
                          ? slamoreInformation && slamoreInformation.objAgntsTraning && slamoreInformation.objAgntsTraning.length > 0
                            ? slamoreInformation.objAgntsTraning.map((data) => {
                                return (
                                  <tbody>
                                    <tr>
                                      <td>{data.target}</td>
                                      <td>{data.penaltyClause}</td>
                                    </tr>
                                  </tbody>
                                );
                              })
                            : null
                          : currentCard.name === "Seat Utilization"
                            ? slamoreInformation && slamoreInformation.objstutlzn && slamoreInformation.objstutlzn.length > 0
                              ? slamoreInformation.objstutlzn.map((data) => {
                                  return (
                                    <tbody>
                                      <tr>
                                        <td>{data.target}</td>
                                        <td>{data.penaltyClause}</td>
                                      </tr>
                                    </tbody>
                                  );
                                })
                              : null
                            : ""}
                {/*  <tbody>
                  <tr>
                    <td>{">=97%"}</td>
                    <td>Nil</td>
                  </tr>
                  <tr>
                    <td>{">=95% but <97%"}</td>
                    <td>1.0% of the monthly billed amount</td>
                  </tr>
                  <tr>
                    <td>{">=92.5% but <95%"}</td>
                    <td>2.0% of the monthly billed amount</td>
                  </tr>
                  <tr>
                    <td>{">=90% but <92.5%"}</td>
                    <td>3.0% of the monthly billed amount</td>
                  </tr>
                  <tr>
                    <td>{">=87% but <90%"}</td>
                    <td>5.0% of the monthly billed amount</td>
                  </tr>
                  <tr>
                    <td>{"<87%"}</td>
                    <td>7.0% of the monthly billed amount</td>
                  </tr>
                </tbody> */}
              </table>
            </div>
            <div className="down-button-area">
              <button className="close-btn" onClick={handleclose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Sidebardrawer;
