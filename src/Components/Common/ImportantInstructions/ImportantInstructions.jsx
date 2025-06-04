import React from "react";
import ImportantInstructionsImage from "../../../assets/Important_Instructions_Banner.jpeg";
import "./ImportantInstructions.scss";
function ImportantInstructions() {
  return (
    <div className="ContainerPnlInstructions">
      <a href="https://drive.google.com/file/d/11OeQEMPEe9FLlqJ-vNEbCJnRsO7QWmUu/view?usp=sharing" title="click to view" target="_blank">   
      <img src={ImportantInstructionsImage} style={{ width: "900px", height: "610px" }} />
      </a>
    </div>
  );
}

export default ImportantInstructions;
