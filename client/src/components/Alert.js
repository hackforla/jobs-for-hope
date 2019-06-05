import React from "react";
import InfoIcon from "../icons/InfoIcon";
import SuccessIcon from "../icons/SuccessIcon";
import ErrorIcon from "../icons/ErrorIcon";
import CloseIcon from "../icons/CloseIcon";
import { positions, transitions } from "react-alert";

const alertStyle = {
  backgroundColor: "#f8f8f8",
  color: "black",
  padding: "10px",
  borderRadius: "3px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.03)",
  fontFamily: "Arial",
  width: "90%",
  maxWidth: "700px",
  boxSizing: "border-box"
};

const buttonStyle = {
  marginLeft: "20px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  color: "#FFFFFF"
};

export const AlertTemplate = ({ message, options, style, close }) => {
  return (
    <div style={{ ...alertStyle, ...style }}>
      {options.type === "info" && <InfoIcon />}
      {options.type === "success" && <SuccessIcon />}
      {options.type === "error" && <ErrorIcon />}
      <span style={{ flex: 2 }}>{message}</span>
      <button onClick={close} style={buttonStyle}>
        <CloseIcon />
      </button>
    </div>
  );
};

export const alertOptions = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 3000,
  offset: "50px",
  // you can also just use 'scale'
  transition: transitions.SCALE
};
