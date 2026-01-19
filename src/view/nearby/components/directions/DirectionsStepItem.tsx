import React from "react";
import { ListGroup } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWalking, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";
import { ROUTE_DISPLAY } from "../../../../api/trimet/constants";
import { getLegRenderData } from "./legRender";
import StopLocationIndicator from "../../../../component/stop/StopLocationIndicator";
import RouteIndicator from "../../../../component/route/RouteIndicator";
import { StopOnRoute } from "../common/stops/StopOnRoute";
import "./DirectionsStepItem.css";
import { TripLeg, extractStopId } from "../../../../api/trimet/tripplanner";

interface DirectionsStepItemProps {
  idx: number;
  leg: TripLeg;
}

export function DirectionsStepItem({ idx, leg }: DirectionsStepItemProps) {
  const renderData = getLegRenderData(leg, null, null);
  const { label, startTime, endTime, duration, distance, mode, isTransit, routeNumber } = renderData;
  const order = leg["@_order"];
  
  // Extract from and to locations from the leg
  const fromLocation = leg.from;
  const toLocation = leg.to;

  // Use shared helper to safely extract numeric stopId from Trip Planner locations.

  let icon: React.ReactNode = null;
  let routeNode: React.ReactNode = null;
  
  // Use from.description for the main label
  const fromDirection = fromLocation?.description || "Origin";
  const toDirection = toLocation?.description || "Destination";

  if (idx === 0) {
    icon = <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />;
  } else if (mode.toUpperCase() === "WALK" && order === "end") {
    icon = <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />;
  } else {
    if (mode.toUpperCase() === "WALK") {
      icon = <FontAwesomeIcon icon={faWalking} size="lg" />;
    } else if (isTransit) {
      const isTrain = routeNumber && ROUTE_DISPLAY[parseInt(routeNumber)];
      icon = (
        <FontAwesome 
          name={isTrain ? "train" : "bus"} 
          size="lg"
        />
      );
      routeNode = <RouteIndicator routeId={parseInt(routeNumber)} />;
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
          <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
            {routeNode}
            <div className="directions-step-content">
              {extractStopId(fromLocation) !== undefined && (
                <StopLocationIndicator
                  locationId={extractStopId(fromLocation) as number}
                  nearbyStops={true}
                  selected={true}
                  size="small"
                />
              )}
              <div className="directions-step-content-inner">
                <span><strong>{fromDirection}</strong></span>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 mt-1" style={{ minWidth: 0 }}>
            <div className="directions-step-content">
              {extractStopId(toLocation) !== undefined && (
                <StopLocationIndicator
                  locationId={extractStopId(toLocation) as number}
                  nearbyStops={true}
                  selected={true}
                  size="small"
                />
              )}
              <div className="directions-step-content-inner">
                <span>{toDirection}</span>
              </div>
            </div>
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
