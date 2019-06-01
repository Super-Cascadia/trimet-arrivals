import React from "react";
import { Route, StopLocation } from "../../../api/trimet/types";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import "./StopInfo.css";
import StopRouteListing from "./StopRouteListing";

interface Props {
  stopLocation: StopLocation;
  onClick: (route: Route) => void;
}

export default function StopInfo({ stopLocation, onClick }: Props) {
  if (!stopLocation) {
    return null;
  }

  return (
    <div className="stop-info-header">
      <h2>
        <StopLocationIndicator locationId={stopLocation.locid} />
        <span className="stop-info">
          {stopLocation.desc} - {stopLocation.dir}
        </span>
      </h2>
      <StopRouteListing routes={stopLocation.route} onClick={onClick} />
    </div>
  );
}
