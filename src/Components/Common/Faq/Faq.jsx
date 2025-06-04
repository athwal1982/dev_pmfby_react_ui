import React, { useState } from "react";
import "./FAQ.css";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";

function Faq() {
  const [selected, setSelected] = useState("english");

  const toolbarPluginInstance = toolbarPlugin({
    toolbarItems: (toolbarSlot) =>
      [toolbarSlot.zoomOut, toolbarSlot.zoomIn, toolbarSlot.previousPage, toolbarSlot.nextPage, toolbarSlot.currentPage, toolbarSlot.numPages].filter(Boolean),
  });

  const { Toolbar } = toolbarPluginInstance;

  return (
    <div className="faq-container">
      <div className="faq-txt-container">
        <span className="faq-txt">
          <span className="faq-txt1">Frequently Asked Questions (FAQs)</span>
          <span className="faq-txt2">A comprehensive booklet about PMFBY & RWBCIS</span>
        </span>
        <div className="togg-container">
          <div className="togg-btn-container">
            <div className={`togg-button ${selected === "english" ? "active" : ""}`} onClick={() => setSelected("english")}>
              <span> PMFBY-FAQ-English</span>
            </div>
            <div className={`togg-button ${selected === "hindi" ? "active" : ""}`} onClick={() => setSelected("hindi")}>
              <span> PMFBY-FAQ-Hindi</span>
            </div>
          </div>
        </div>
      </div>

      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="pdf-setting">
          <Toolbar />
          <Viewer
            fileUrl={
              selected === "english"
                ? "https://pmfby.amnex.co.in/krph/public/tutorial/PMFBY-FAQ-English.pdf"
                : "https://pmfby.amnex.co.in/krph/public/tutorial/PMFBY-FAQ-Hindi.pdf"
            }
            plugins={[toolbarPluginInstance]}
          />
        </div>
      </Worker>
    </div>
  );
}

export default Faq;
