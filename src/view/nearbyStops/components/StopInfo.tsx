import React from "react";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import { StopLocationWithDistance } from "../../../store/reducers/util/formatStopLocations";
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

  const id = stopLocation.locid ? stopLocation.locid : stopLocation.id;
  return (
    <div className="stop-info-header">
      <h2 className="stop-heading">
        <StopLocationIndicator locationId={id} />
        <span className="stop-info">
          {stopLocation.desc} - {stopLocation.dir}
        </span>
      </h2>
      <p className="stop-distance">{stopLocation.distance} feet away</p>
      <StopRouteListing routes={stopLocation.route} onClick={onClick} />
    </div>
  );
}
