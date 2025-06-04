import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";
import "./TextEditor.scss";

const TextEditor = ({ value, onChange, setWordcount, sizeLimit }) => {
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);

  const charCount = (content) => {
    return content.replace(/<\/?[^>]+(>|$)/g, "").length;
  };

  const handleInit = (editor) => {
    setWordcount(charCount(editor.getHTML()));
  };

  const handleUpdate = (content) => {
    const cCount = charCount(content);
    if (cCount <= sizeLimit) {
      onChange(content);
      setWordcount(cCount);
      setIsLimitExceeded(false);
    } else {
      setIsLimitExceeded(true);
    }
  };

  const handleKeyDown = (e) => {
    
    if (isLimitExceeded && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleUpdate}
      onInit={handleInit}
      onKeyDown={handleKeyDown}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          [{ color: ["red", "#785412"] }],
          [{ background: ["red", "#785412"] }],
        ],
      }}
      formats={["header", "font", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "script", "indent", "align", "color", "background"]}
      bounds=".ql-editor"
      style={{ height: "240px" }}
    />
  );
};

TextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  setWordcount: PropTypes.func.isRequired,
  sizeLimit: PropTypes.number.isRequired,
};

export default TextEditor;
