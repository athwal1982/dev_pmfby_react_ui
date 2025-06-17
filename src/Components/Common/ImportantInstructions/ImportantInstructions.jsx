import React from "react";
import ImportantInstructionsImage from "../../../assets/Important_Instructions_Banner.jpg";
import "./ImportantInstructions.scss";
function ImportantInstructions() {
  return (
    <div className="ContainerPnlInstructions">
      <a href="https://docs.google.com/spreadsheets/d/16VFtCi8BkNHoUWkErfHr0HgXuCHR79DF/edit?usp=sharing&ouid=110802551208315636984&rtpof=true&sd=true" title="click to view" target="_blank">
        <img src={ImportantInstructionsImage} style={{ width: "900px", height: "610px" }} />
      </a>
    </div>
  );
}

export default ImportantInstructions;
