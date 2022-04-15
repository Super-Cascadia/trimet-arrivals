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

  const id = stopLocation.locid ? stopLocation.locid : stopLocation.id;
  return (
    <Card className="stop-info-header">
      <Card.Header>
        <h3 className="h6">
          <StopLocationIndicator locationId={id} />
          <span className="stop-info">
            {stopLocation.desc} - {stopLocation.dir} -
          </span>
          <span>{stopLocation.distance} feet away</span>
        </h3>
      </Card.Header>
      <Card.Body>
        <StopRouteListing routes={stopLocation.route} onClick={onClick} />
      </Card.Body>
    </Card>
  );
}
