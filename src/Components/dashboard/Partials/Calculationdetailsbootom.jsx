import React from "react";
import Contentcardcenter from "./Contentcardcenter";
import { FaPlus } from "react-icons/fa6";
import { TbEqual } from "react-icons/tb";

const Calculationdetailsbootom = ({ name, tabonename, tabtwoname, tabthree, inboundpulse, taxes, total }) => {
  return (
    <div className="py-3 calculationdetails">
      <div className="d-flex align-items-center justify-content-start custom-gap">
        <p className="title">{name}</p>
        <div className="green-line"></div>
      </div>
      <div className="row pt-3">
        <div className="col-md-12">
          <div className="calculation-area">
            <div className="card card-custom">
              <div className="content d-flex align-items-center justify-content-between">
                <div className="text-center">
                  <p className="card-name ">
                    {tabonename &&
                      tabonename.length > 0 &&
                      tabonename.map((line, index) => (
                        <React.Fragment key={index}>
                          <span>{line}</span>
                          {index < tabonename.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                  </p>
                  <p className="card-value">{inboundpulse}</p>
                </div>
              </div>
            </div>
            <div className="icon" style={{ background: "#D57616" }}>
              <FaPlus />
            </div>
            <div className="card card-custom">
              <div className="content d-flex align-items-center justify-content-between">
                <div className="text-center">
                  <p className="card-name ">
                    {tabtwoname &&
                      tabtwoname.length > 0 &&
                      tabtwoname.map((line, index) => (
                        <React.Fragment key={index}>
                          <span>{line}</span>
                          {index < tabonename.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                  </p>
                  <p className="card-value">{taxes}</p>
                </div>
              </div>
            </div>

            <div className="icon" style={{ background: "#D57616" }}>
              <TbEqual />
            </div>
            <div className="card card-custom bg-green text-white">
              <div className="content d-flex align-items-center justify-content-between">
                <div className="text-center">
                  <p
                    className="card-name "
                    style={{
                      color: "#fff",
                    }}
                  >
                    {tabthree &&
                      tabthree.length > 0 &&
                      tabthree.map((line, index) => (
                        <React.Fragment key={index}>
                          <span>{line}</span>
                          {index < tabonename.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                  </p>
                  <p className="card-value">{total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculationdetailsbootom;
