import React from "react";
import FontAwesome from "react-fontawesome";
import "./RouteLoadIndicator.scss";

export default function MapLoadIndicator() {
  return (
    <div className="load-indicator map-indicator">
      <FontAwesome name="spinner" size="lg" spin={true} />
      Loading map!
    </div>
  );
}
