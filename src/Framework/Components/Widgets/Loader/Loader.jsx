import React from "react";
import BizClass from "./Loader.module.scss";

function Loader() {
  return (
    <div className={BizClass.Loader_Back}>
      <div className={BizClass.Loader}>
        <img src="https://pmfby.amnex.co.in/krph/public/img/favicon.svg" alt="Page Loader" />
      </div>
    </div>
  );
}

export default Loader;
