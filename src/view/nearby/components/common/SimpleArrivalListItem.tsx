import React from "react";
import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
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

function getStaticTimeUntil(estimatedTime: number, scheduledTime: number): string {
  const now = moment();
  const arrivalTime = moment(estimatedTime || scheduledTime);
  const diffInMinutes = Math.floor(arrivalTime.diff(now, "minutes"));
  
  if (diffInMinutes <= 0) {
    return "Arriving";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else {
    const hours = Math.floor(diffInMinutes / 60);
    const remainingMinutes = diffInMinutes % 60;
    return `${hours}hr ${remainingMinutes}m`;
  }
}

interface StatusIndicatorProps {
  estimated?: number;
  scheduled?: number;
}

function StatusIndicator({ estimated, scheduled }: StatusIndicatorProps) {
  if (!estimated || !scheduled) {
    return null;
  }

  const diffInMinutes = moment(estimated).diff(moment(scheduled), "minutes");
  
  let color: string;
  let status: string;
  let detail: string;
  
  if (Math.abs(diffInMinutes) <= 1) {
    color = "#28a745"; // Green - on time
    status = "On Time";
    detail = "Arrival is on schedule";
  } else if (diffInMinutes < -1) {
    color = "#007bff"; // Blue - early
    status = "Early";
    detail = `Running ${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) === 1 ? '' : 's'} early`;
  } else {
    color = "#dc3545"; // Red - late
    status = "Delayed";
    detail = `Running ${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} late`;
  }

  const tooltip = (
    <Tooltip id="status-tooltip">
      <strong>{status}</strong>
      <br />
      {detail}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="left" overlay={tooltip}>
      <span
        className="status-indicator"
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: color,
          marginLeft: "4px",
          cursor: "pointer"
        }}
      />
    </OverlayTrigger>
  );
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
  currentLocation
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
  
  // Format next arrival time
  const nextEstimatedArrivalTime = nextArrival?.estimated;
  const nextScheduledArrivalTime = nextArrival?.scheduled;
  const nextArrivalTimeStamp = nextEstimatedArrivalTime || nextScheduledArrivalTime;
  const nextExactTime = nextArrivalTimeStamp
    ? new Date(nextArrivalTimeStamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : '';
  const nextTimeUntil = nextArrival ? getStaticTimeUntil(nextEstimatedArrivalTime, nextScheduledArrivalTime) : '';
  
  // Format third arrival time
  const thirdEstimatedArrivalTime = thirdArrival?.estimated;
  const thirdScheduledArrivalTime = thirdArrival?.scheduled;
  const thirdArrivalTimeStamp = thirdEstimatedArrivalTime || thirdScheduledArrivalTime;
  const thirdExactTime = thirdArrivalTimeStamp
    ? new Date(thirdArrivalTimeStamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : '';
  const thirdTimeUntil = thirdArrival ? getStaticTimeUntil(thirdEstimatedArrivalTime, thirdScheduledArrivalTime) : '';
  
  // Format fourth arrival time
  const fourthEstimatedArrivalTime = fourthArrival?.estimated;
  const fourthScheduledArrivalTime = fourthArrival?.scheduled;
  const fourthArrivalTimeStamp = fourthEstimatedArrivalTime || fourthScheduledArrivalTime;
  const fourthExactTime = fourthArrivalTimeStamp
    ? new Date(fourthArrivalTimeStamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : '';
  const fourthTimeUntil = fourthArrival ? getStaticTimeUntil(fourthEstimatedArrivalTime, fourthScheduledArrivalTime) : '';

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
          {routeId}{' '}
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
        <small className="fw-bold" style={{ fontSize: '0.7rem' }}>
          <ArrivalCountdown
            estimatedArrivalTime={estimatedArrivalTime}
            scheduledArrivalTime={scheduledArrivalTime}
          />
          {exactTime && <span className="text-muted"> ({exactTime})</span>}
          <StatusIndicator estimated={estimatedArrivalTime} scheduled={scheduledArrivalTime} />
        </small>
        {nextArrival && (
          <>
            <br />
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
              {nextTimeUntil}
              {nextExactTime && <span> ({nextExactTime})</span>}
              <StatusIndicator estimated={nextEstimatedArrivalTime} scheduled={nextScheduledArrivalTime} />
            </small>
          </>
        )}
        {thirdArrival && (
          <>
            <br />
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
              {thirdTimeUntil}
              {thirdExactTime && <span> ({thirdExactTime})</span>}
              <StatusIndicator estimated={thirdEstimatedArrivalTime} scheduled={thirdScheduledArrivalTime} />
            </small>
          </>
        )}
        {fourthArrival && (
          <>
            <br />
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
              {fourthTimeUntil}
              {fourthExactTime && <span> ({fourthExactTime})</span>}
              <StatusIndicator estimated={fourthEstimatedArrivalTime} scheduled={fourthScheduledArrivalTime} />
            </small>
          </>
        )}
      </div>
    </ListGroup.Item>
  );
}

export default SimpleArrivalListItem;
