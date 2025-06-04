/* eslint-disable */
import React from "react";
import BizClass from "../Common/Login/login.module.scss";
export const GlobalToggleSwitch = React.memo((props) => {
  const { leftText, rightText, callback, noUpperCase, checked } = props;
  return (
    <React.Fragment>
      <input
        type="checkbox"
        id="toggle"
        className={BizClass.toggleCheckbox}
        onClick={() => {
          callback();
        }}
        checked={checked}
      />
      <label for="toggle" className={BizClass.toggleContainer}>
        <div>{leftText && (!noUpperCase ? leftText : leftText.toUpperCase())}</div>
        <div>{rightText && (!noUpperCase ? rightText : rightText.toUpperCase())}</div>
      </label>
    </React.Fragment>
  );
});
