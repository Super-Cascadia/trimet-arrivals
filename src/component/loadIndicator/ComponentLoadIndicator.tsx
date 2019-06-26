import React from "react";
import FontAwesome from "react-fontawesome";
import "./RouteLoadIndicator.scss";

export default function ComponentLoadIndicator() {
  return (
    <div className="load-indicator component-indicator">
      <FontAwesome name="spinner" size="lg" spin={true} />
      Loading component!
    </div>
  );
}
