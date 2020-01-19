import React from "react";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import { StopLocationWithDistance } from "../../../store/reducers/stopsReducer";
import "./StopInfo.css";
import StopRouteListing from "./StopRouteListing";

interface Props {
  stopLocation: StopLocationWithDistance;
  onClick: (route: TrimetRoute) => void;
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
          {stopLocation.desc} - {stopLocation.dir} -
        </span>
        <span>{stopLocation.distance} feet away</span>
      </h2>
      <StopRouteListing routes={stopLocation.route} onClick={onClick} />
    </div>
  );
}
