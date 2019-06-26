import React from "react";
import FontAwesome from "react-fontawesome";
import "./RouteLoadIndicator.scss";

export default function RouteLoadIndicator() {
  return (
    <div className="load-indicator route-indicator">
      <FontAwesome name="spinner" size="lg" spin={true} />
      Loading route!
    </div>
  );
}
