import React from "react";
import { Card } from "react-bootstrap";
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

  return (
    <Card className="stop-info-header">
      <Card.Header>
        <h2>
          <StopLocationIndicator locationId={stopLocation.locid} />
          <span className="stop-info">
            {stopLocation.desc} - {stopLocation.dir} -
          </span>
          <span>{stopLocation.distance} feet away</span>
        </h2>
      </Card.Header>
      <Card.Body>
        <StopRouteListing routes={stopLocation.route} onClick={onClick} />
      </Card.Body>
    </Card>
  );
}
