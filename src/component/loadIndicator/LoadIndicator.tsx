import React from "react";
import logo from "../../assets/images/trimet-logo.png";
import "./LoadIndicator.scss";

export default function LoadIndicator() {
  return (
    <div className="load-indicator">
      <img className="load-logo" src={logo} />
      <h1>Loading...</h1>
    </div>
  );
}
