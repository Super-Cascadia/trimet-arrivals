import React from "react";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Arrival } from "../../../../api/trimet/interfaces/arrivals";
import {
  Direction,
  StopLocation,
  TrimetRoute
} from "../../../../api/trimet/interfaces/types";
import { ArrivalCountdown } from "./ArrivalCountdown";
import "./SimpleArrivalListItem.scss";

interface ArrivalListItemParams {
  id: any;
  arrival: Arrival;
  nextArrival?: Arrival;
  thirdArrival?: Arrival;
  fourthArrival?: Arrival;
  route: TrimetRoute;
  stop: StopLocation;
  distanceString?: string;
  currentLocation?: number[];
  hasMultipleStops?: boolean;
  currentStopIndex?: number;
  totalStops?: number;
  onCycleStop?: (direction: 'prev' | 'next') => void;
  onHover?: (stopId: string | null) => void;
}

function getDirectionArrow(currentLocation: number[], stopLocation: StopLocation): string {
  if (!currentLocation || !stopLocation) return "";
  
  // Calculate bearing from current location to stop
  const lat1 = currentLocation[1] * Math.PI / 180;
  const lat2 = stopLocation.lat * Math.PI / 180;
  const dLon = (stopLocation.lng - currentLocation[0]) * Math.PI / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  
  // Normalize to 0-360
  const normalizedBearing = (bearing + 360) % 360;
  
  // Convert to 8-direction arrow (N, NE, E, SE, S, SW, W, NW)
  const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const index = Math.round(normalizedBearing / 45) % 8;
  
  return directions[index];
}

function SimpleArrivalListItem({
  id,
  arrival,
  nextArrival,
  thirdArrival,
  fourthArrival,
  route,
  stop,
  distanceString,
  currentLocation,
  hasMultipleStops,
  currentStopIndex,
  totalStops,
  onCycleStop,
  onHover
}: ArrivalListItemParams) {
  const navigate = useNavigate();

  if (!arrival || !route || !stop) {
    return null;
  }

  const estimatedArrivalTime = arrival.estimated;
  const scheduledArrivalTime = arrival.scheduled;
  const routeDirection: Direction = route.dir[0];
  const routeId = route.route;
  const stopName = stop.desc;
  const directionArrow = getDirectionArrow(currentLocation, stop);
  
  // Format exact arrival time
  const arrivalTimeStamp = estimatedArrivalTime || scheduledArrivalTime;
  const exactTime = arrivalTimeStamp 
    ? new Date(arrivalTimeStamp).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    : '';

  function handleClick() {
    const url = `/nearby/simple-routes/${routeId}?stop=${stop.locid}&direction=${routeDirection.dir}`;
    navigate(url);
  }

  return (
    <ListGroup.Item
      variant="light"
      as="li"
      className="d-flex justify-content-between align-items-start list-item-compact"
      onClick={handleClick}
    >
      <div className="me-1">
        <span className="fw-bold h2">
          {routeId}
          <span className="h6 route-direction-desc">{routeDirection.desc}</span>
        </span>
        {/* <br /> */}
        {/* <span>{routeDirection.desc}</span> */}
        <br />
        <div className="stop-location-text">
          <div>at {stopName} ({stop.locid})</div>
          {distanceString && (
            <div>
              {directionArrow && <span className="direction-arrow">{directionArrow} </span>}
              {distanceString}
            </div>
          )}
        </div>
      </div>
      <div className="text-end arrival-time-container flex-shrink-0">
        <span className="h6">
          <ArrivalCountdown
            estimatedArrivalTime={estimatedArrivalTime}
            scheduledArrivalTime={scheduledArrivalTime}
          />
        </span>
        <br />
        {exactTime && <small className="text-muted exact-time">{exactTime}</small>}
      </div>
    </ListGroup.Item>
  );
}

export default SimpleArrivalListItem;
