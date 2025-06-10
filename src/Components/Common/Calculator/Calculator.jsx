import React from "react";
import { PageBar, Form } from "Framework/Components/Layout";
import { InputControl, InputGroup } from "Framework/OldFramework/FormComponents/FormComponents";
import { KrphButton } from "../KrphAllActivitiesND/Widgets/KrphButton";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import CalculatorLogics from "./Logic/Logics";
import "../KrphAllActivitiesND/cssmain.css";

function Calculator() {
  const {
    yearList,
    formValidationFarmersError,
    updateStateForCalculator,
    formValuesForCalculator,
    btnLoaderActive,
    stateForCalculatorDropdownDataList,
    isLoadingStateForCalculatorDropdownDataList,
    districtForCalculatorDropdownDataList,
    isLoadingDistrictForCalculatorDropdownDataList,
    seasonForCalculatorDropdownDataList,
    // A isLoadingSeasonForCalculatorDropdownDataList,
    schemeList,
    // A isLoadingSchemeListDropdownDataList,
    cropForCalculatorDropdownDataList,
    isLoadingCropForCalculatorDropdownDataList,
    getCalculatorDataOnClick,
    clearFormOnClick,
    selectedCropData,
    selectedCropHeader,
    selectedCalculation,
    btnCalculateState,
    logoPath,
  } = CalculatorLogics();

  return (
    <div className="csc_main py-3">
      <div className="container my-3">
        <div className="row">
          <div className="col-md-12">
            <div className="card csc-form-cards">
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    backgroundColor: "#075307",
                    color: "white",
                    textAlign: "center",
                    padding: "10px",
                    fontSize: "22px",
                    borderRadius: "10px",
                  }}
                >
                  INSURANCE PREMIUM CALCULATOR
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                  <div style={{ width: "65%" }}>
                    <form>
                      <div style={{ display: "flex", gap: "20px" }}>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: "320px" }}>
                            <label>
                              Caller Mobile No. <span className="asteriskCss">&#42;</span>
                            </label>
                            <InputGroup>
                              <InputControl
                                Input_type="input"
                                name="txtCallerMobileNumber"
                                value={formValuesForCalculator.txtCallerMobileNumber}
                                maxlength="10"
                                minlength="10"
                                onChange={(e) => updateStateForCalculator("txtCallerMobileNumber", e.target.value.replace(/\D/g, ""))}
                                autoComplete="off"
                              />
                            </InputGroup>
                            <span className="login_ErrorTxt">{formValidationFarmersError["txtCallerMobileNumber"]}</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: "320px" }}>
                            <label>
                              Season <span className="asteriskCss">&#42;</span>
                            </label>
                            <InputGroup>
                              <InputControl
                                Input_type="select"
                                name="txtSeasonForCalculator"
                                getOptionLabel={(option) => `${option.CropSeasonName}`}
                                value={formValuesForCalculator.txtSeasonForCalculator}
                                getOptionValue={(option) => `${option}`}
                                options={seasonForCalculatorDropdownDataList}
                                onChange={(e) => updateStateForCalculator("txtSeasonForCalculator", e)}
                                ControlTxt="Season"
                                focus="true"
                              />
                            </InputGroup>
                            <span className="login_ErrorTxt">{formValidationFarmersError["txtSeasonForCalculator"]}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "20px" }}>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: "320px" }}>
                            <label>
                              Year <span className="asteriskCss">&#42;</span>
                            </label>
                            <InputGroup>
                              <InputControl
                                Input_type="select"
                                name="txtYearForCalculator"
                                getOptionLabel={(option) => `${option.Name}`}
                                value={formValuesForCalculator.txtYearForCalculator}
                                getOptionValue={(option) => `${option}`}
                                options={yearList}
                                onChange={(e) => updateStateForCalculator("txtYearForCalculator", e)}
                                ControlTxt="Year"
                              />
                            </InputGroup>
                            <span className="login_ErrorTxt">{formValidationFarmersError["txtYearForCalculator"]}</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: "320px" }}>
                            <label>
                              Scheme <span className="asteriskCss">&#42;</span>
                            </label>
                            <InputGroup>
                              <InputControl
                                Input_type="select"
                                name="txtSchemeForCalculator"
                                getOptionLabel={(option) => `${option.SchemeName}`}
                                value={formValuesForCalculator.txtSchemeForCalculator}
                                getOptionValue={(option) => `${option}`}
                                options={schemeList}
                                onChange={(e) => updateStateForCalculator("txtSchemeForCalculator", e)}
                                ControlTxt="Scheme"
                                focus="true"
                              />
                            </InputGroup>
                            <span className="login_ErrorTxt">{formValidationFarmersError["txtSchemeForCalculator"]}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "20px" }}>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: "320px" }}>
                            <label>
                              State <span className="asteriskCss">&#42;</span>
                            </label>
                            <InputGroup>
                              <InputControl
                                Input_type="select"
                                name="txtStateForCalculator"
                                isLoading={isLoadingStateForCalculatorDropdownDataList}
                                getOptionLabel={(option) => `${option.StateMasterName}`}
                                value={formValuesForCalculator.txtStateForCalculator}
                                getOptionValue={(option) => `${option}`}
                                options={stateForCalculatorDropdownDataList}
                                ControlTxt="State"
                                onChange={(e) => updateStateForCalculator("txtStateForCalculator", e)}
                              />
                            </InputGroup>
                            <span className="login_ErrorTxt">{formValidationFarmersError["txtStateForCalculator"]}</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: "320px" }}>
                            <label>
                              District <span className="asteriskCss">&#42;</span>
                            </label>
                            <InputGroup>
                              <InputControl
                                Input_type="select"
                                name="txtDistrictForCalculator"
                                isLoading={isLoadingDistrictForCalculatorDropdownDataList}
                                getOptionLabel={(option) => `${option.level3Name}`}
                                value={formValuesForCalculator.txtDistrictForCalculator}
                                getOptionValue={(option) => `${option}`}
                                options={districtForCalculatorDropdownDataList}
                                ControlTxt="District"
                                onChange={(e) => updateStateForCalculator("txtDistrictForCalculator", e)}
                              />
                            </InputGroup>
                            <span className="login_ErrorTxt">{formValidationFarmersError["txtDistrictForCalculator"]}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "20px" }}>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: "320px" }}>
                            <label>
                              Crop <span className="asteriskCss">&#42;</span>
                            </label>
                            <InputGroup>
                              <InputControl
                                Input_type="select"
                                name="txtCropForCalculator"
                                isLoading={isLoadingCropForCalculatorDropdownDataList}
                                getOptionLabel={(option) => `${option.cropName}`}
                                value={formValuesForCalculator.txtCropForCalculator}
                                getOptionValue={(option) => `${option}`}
                                options={cropForCalculatorDropdownDataList}
                                ControlTxt="Crop"
                                onChange={(e) => updateStateForCalculator("txtCropForCalculator", e)}
                              />
                            </InputGroup>
                            <span className="login_ErrorTxt">{formValidationFarmersError["txtCropForCalculator"]}</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: "320px" }}>
                            <label>
                              Area in Hectare <span className="asteriskCss">&#42;</span>
                            </label>
                            <InputGroup>
                              <InputControl
                                Input_type="input"
                                name="txtAreaInHectareForCalculator"
                                value={formValuesForCalculator.txtAreaInHectareForCalculator}
                                maxlength="3"
                                minlength="3"
                                onChange={(e) => updateStateForCalculator("txtAreaInHectareForCalculator", e.target.value)}
                                autoComplete="off"
                              />
                            </InputGroup>
                            <span className="login_ErrorTxt">{formValidationFarmersError["txtAreaInHectareForCalculator"]}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "20px" }}>
                        <KrphButton type="button" varient="primary" trigger={btnLoaderActive && "true"} onClick={() => getCalculatorDataOnClick()}>
                          Calculate
                        </KrphButton>
                        <button
                          type="button"
                          style={{
                            backgroundColor: "white",
                            color: "red",
                            border: "1px solid #DC2626",
                            borderRadius: "15px",
                            padding: "10px 35px",
                            fontSize: "14px",
                          }}
                          onClick={() => clearFormOnClick()}
                        >
                          Reset
                        </button>
                      </div>
                    </form>
                  </div>

                  <div
                    style={{
                      height: "100%",
                      width: "30%",
                      borderTop: "10px solid #16A34A",
                      borderRight: "2px solid #16A34A",
                      borderBottom: "2px solid #16A34A",
                      borderLeft: "2px solid #16A34A",
                      borderRadius: "20px 20px 10px 10px",
                      padding: "15px 0 100px 0px",
                      // AbackgroundColor: "#f9f9f9",
                    }}
                  >
                    <div style={{ marginLeft: "7px" }}>
                      <div
                        style={{
                          flexDirection: "column",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          border: "1px solid #000000",
                          borderRadius: "40px",
                          boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                          padding: "16px 16px 16px 20px",
                          width: "98%",
                        }}
                      >
                        <img
                          src={logoPath}
                          style={{
                            width: "40%",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
                        <span style={{ padding: "8px", fontWeight: "bold" }}>
                          {selectedCropData && selectedCropData.insuranceCompanyName ? selectedCropData.insuranceCompanyName : "Insurance Company"}
                        </span>
                      </div>
                    </div>
                    <h1
                      style={{
                        color: "#16A34A",
                        textAlign: "center",
                        fontSize: "32px",
                        marginBottom: "10px",
                        marginTop: "10px",
                      }}
                    >
                      {selectedCalculation && selectedCalculation.Preminumpaidbyfarmer ? `₹ ${selectedCalculation.Preminumpaidbyfarmer}` : "₹ 0"}
                    </h1>
                    <>
                      {" "}
                      <p
                        style={{
                          textAlign: "center",
                          margin: 0,
                          fontWeight: "bold",
                          fontSize: "16px",
                          textDecoration: "underline",
                        }}
                      >
                        Estimated Premium{" "}
                      </p>
                    </>{" "}
                    <p
                      style={{
                        textAlign: "center",
                      }}
                    ></p>
                    <table
                      style={{
                        width: "100%",
                        marginTop: "15px",
                        borderSpacing: "0",
                        fontSize: "14px",
                        padding: "0 0 100px 0",
                        borderCollapse: "collapse",
                      }}
                    >
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          {/* <td style={{ padding: "8px" }}>Insurance Company</td> */}
                          {/* <td style={{ padding: "8px" }}>
                          {selectedCropData && selectedCropData.insuranceCompanyName
                            ? selectedCropData.insuranceCompanyName
                            : "................................"}
                        </td> */}
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={{ padding: "8px" }}>Sum Insured(Rs)/Hectare</td>
                          <td style={{ padding: "8px" }}>{selectedCropData && selectedCropData.sumInsured ? selectedCropData.sumInsured : "0"}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={{ padding: "8px" }}>Farmer Share(%)</td>
                          <td style={{ padding: "8px" }}>{selectedCropData && selectedCropData.farmerShare ? selectedCropData.farmerShare : "0"}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={{ padding: "8px" }}>Actuarial Rate(%)</td>
                          <td style={{ padding: "8px" }}>{selectedCalculation && selectedCalculation.ActurialRate ? selectedCalculation.ActurialRate : "0"}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={{ padding: "8px" }}>Cut Off Date</td>
                          <td style={{ padding: "8px" }}>
                            {selectedCropData && selectedCropData.cutOfDate
                              ? dateFormatDDMMYY(selectedCropData.cutOfDate.split("T")[0])
                              : "................................"}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={{ padding: "8px" }}>Crop</td>
                          <td style={{ padding: "8px" }}>
                            {selectedCropData && selectedCropData.cropName ? selectedCropData.cropName : "................................"}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={{ padding: "8px" }}>Area(Hectare)</td>
                          <td style={{ padding: "8px" }}>
                            {selectedCalculation && selectedCalculation.AreaInhectare ? selectedCalculation.AreaInhectare : "0"}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={{ padding: "8px" }}>Premium Paid By Govt(Rs)</td>
                          <td style={{ padding: "8px" }}>
                            {selectedCalculation && selectedCalculation.Preminumpaidbygovt ? selectedCalculation.Preminumpaidbygovt : "0"}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: "8px" }}>Sum Insured(Rs)</td>
                          <td style={{ padding: "8px" }}>
                            {selectedCalculation && selectedCalculation.CalculatedSumInsured ? selectedCalculation.CalculatedSumInsured : "0"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
