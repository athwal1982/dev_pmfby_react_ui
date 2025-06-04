import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import React from "react";
import { FaFileExcel } from "react-icons/fa";
const Tabledata = ({ columns, tabledata, grandtotal, customStyle = [], downloadpdfdata, showdownload }) => {
  let filteredData = [];
  const userData = getSessionStorage("user");
  const wrapPercentageWithBadge = (value) => {
    if (typeof value === "string" && value.trim().endsWith("%")) {
      const numericValue = parseFloat(value.replace("%", "").trim());

      const badgeClass = numericValue >= 20 ? "badge-green" : numericValue >= 10 ? "badge-purple" : "badge-orange";

      return <span className={`badge ${badgeClass}`}>{value}</span>;
    }
    return value;
  };
  filteredData =
    tabledata &&
    tabledata.length > 0 &&
    tabledata.filter((item) => {
      if (userData?.UserCompanyType == "CSC") {
        return item?.checkvalue > 0;
      }
      return true;
    });
  return (
    <div className="row">
      <div className="d-flex align-items-center justify-content-end mb-1">
        {showdownload && (
          <button
            className="btn btn-primary btn-sm bg-orange"
            onClick={() => {
              downloadpdfdata();
            }}
          >
            <FaFileExcel /> Download
          </button>
        )}
      </div>
      <div className="col-md-12">
        <div className="card card-custom table-card responsive-table">
          <table className="table table-striped">
            <thead>
              <tr>
                {/* Ensure columns are rendered with <th> */}
                {columns &&
                  columns.length > 0 &&
                  columns.map((item, index) => (
                    <td style={customStyle[index]} key={index}>
                      {item}
                    </td>
                  ))}
              </tr>
            </thead>
            <tbody>
              {tabledata && tabledata.length > 0 ? (
                filteredData.map((item, index) => {
                  if (userData?.UserCompanyType == "CSC") {
                    if (item?.checkvalue > 0) {
                      return (
                        <tr key={index}>
                          <td style={customStyle?.[0]}>{index + 1}</td>
                          {item?.id && <td style={customStyle?.[1]}>{item?.id}</td>}
                          {item?.tagedPulses && <td style={customStyle?.[2]}>{wrapPercentageWithBadge(item.tagedPulses)}</td>}
                          {item?.percentagePulse && <td style={customStyle?.[3]}>{wrapPercentageWithBadge(item.percentagePulse)}</td>}
                          {item?.untagedPulses && <td style={customStyle?.[4]}>{wrapPercentageWithBadge(item.untagedPulses)}</td>}
                          {item?.totalBillingPulses && <td style={customStyle?.[5]}>{wrapPercentageWithBadge(item.totalBillingPulses)}</td>}
                        </tr>
                      );
                    }
                  } else {
                    return (
                      <tr key={index}>
                        <td style={customStyle?.[0]}>{index + 1}</td>
                        {item?.id && <td style={customStyle?.[1]}>{item?.id}</td>}
                        {item?.tagedPulses && <td style={customStyle?.[2]}>{wrapPercentageWithBadge(item.tagedPulses)}</td>}
                        {item?.percentagePulse && <td style={customStyle?.[3]}>{wrapPercentageWithBadge(item.percentagePulse)}</td>}
                        {item?.untagedPulses && <td style={customStyle?.[4]}>{wrapPercentageWithBadge(item.untagedPulses)}</td>}
                        {item?.totalBillingPulses && <td style={customStyle?.[5]}>{wrapPercentageWithBadge(item.totalBillingPulses)}</td>}
                      </tr>
                    );
                  }
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: "center" }}>
                    Data not exist
                  </td>
                </tr>
              )}
            </tbody>
            {grandtotal && grandtotal.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="2">Grand Total</td>

                  {grandtotal &&
                    grandtotal.length > 0 &&
                    grandtotal.map((item, index) => {
                      return (
                        <td key={index} style={{ textAlign: "center" }}>
                          {item}
                        </td>
                      );
                    })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tabledata;
