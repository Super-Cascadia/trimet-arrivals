import React from "react";
import { ListGroup } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWalking, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";
import { ROUTE_DISPLAY } from "../../../../api/trimet/constants";
import { getLegRenderData } from "./legRender";
import StopLocationIndicator from "../../../../component/stop/StopLocationIndicator";
import { StopOnRoute } from "../common/stops/StopOnRoute";

interface DirectionsStepItemProps {
  idx: number;
  leg: any;
  fromStop: ArrivalLocation | null;
  toStop: ArrivalLocation | null;
}

export function DirectionsStepItem({ idx, leg, fromStop, toStop }: DirectionsStepItemProps) {
  const renderData = getLegRenderData(leg, fromStop, toStop);
  const { label, startTime, endTime, duration, distance, mode, isTransit, routeNumber } = renderData;

  let icon: React.ReactNode = null;
  let displayLabel = idx === 0 ? "Start" : label;

  if (idx === 0) {
    icon = <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />;
  } else {
    if (mode.toUpperCase() === "WALK") {
      icon = <FontAwesomeIcon icon={faWalking} size="lg" />;
      // For walk legs, display "Walk to <location>"
      const toLocation = leg.to?.description || "destination";
      displayLabel = `Walk to ${toLocation}`;
    } else if (isTransit) {
      const isTrain = routeNumber && ROUTE_DISPLAY[parseInt(routeNumber)];
      icon = (
        <FontAwesome 
          name={isTrain ? "train" : "bus"} 
          size="lg"
        />
      );
      // For transit legs, display "Board <ROUTE> to <LOCATION>"
      const toLocation = leg.to?.description || "destination";
      displayLabel = `Board ${label} to ${toLocation}`;
    }
  }

  const durationAndDistance: string[] = [];
  if (duration) durationAndDistance.push(`${duration} min`);
  if (distance) durationAndDistance.push(`${Number(distance).toFixed(2)} mi`);
  const durationAndDistanceText = durationAndDistance.join(" • ");

  return (
    <ListGroup.Item>
      <div className="d-flex align-items-start gap-3">
        <div style={{ width: "24px", flexShrink: 0 }}>
          {icon}
        </div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2">
            <strong>{displayLabel}</strong>
            {idx === 0 && fromStop && (
              <div className="d-flex align-items-center gap-2">
                <StopLocationIndicator
                  locationId={fromStop.id}
                  nearbyStops={true}
                  selected={false}
                  size="small"
                />
                <div>
                  <span>{fromStop.desc}</span>
                </div>
              </div>
            )}
          </div>
          {startTime && endTime && (
              <small className="text-muted">
                  {startTime} - {endTime} {" • "}
              </small>
          )}
          {durationAndDistanceText && (
            <small className="text-muted">{durationAndDistanceText}</small>
          )}
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default DirectionsStepItem;
