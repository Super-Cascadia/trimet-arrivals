import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";

interface LegRenderData {
  mode: string;
  label: string;
  fromName: string;
  toName: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  distance?: number;
}

interface DirectionsStepsListProps {
  legs: Array<any>;
  fromStop: ArrivalLocation | null;
  toStop: ArrivalLocation | null;
  intermediateStops: Array<{ locid: number; desc: string }>;
}

function getLegRenderData(
  leg: any,
  fromStop: ArrivalLocation | null,
  toStop: ArrivalLocation | null
): LegRenderData {
  // Trip Planner XML→JSON structure: mode is at leg["@_mode"]
  const mode = leg["@_mode"] || "Unknown";
  const isTransit = mode.toUpperCase() === "BUS" || mode.toUpperCase() === "TRANSIT" || mode.toUpperCase() === "RAIL";

  // Extract route info (transit legs only)
  const routeName = leg.route?.name || "";
  const routeNumber = leg.route?.number || "";
  const routeLabel = isTransit && routeNumber ? `Route ${routeNumber}` : (isTransit && routeName ? routeName : "");

  // Extract from/to descriptions
  const fromName = leg.from?.description || fromStop?.desc || "Origin";
  const toName = leg.to?.description || toStop?.desc || "Destination";

  // Extract time and distance
  const timeDistance = leg["time-distance"];
  const duration = timeDistance?.duration || undefined;
  const distance = timeDistance?.distance || undefined;
  const startTime = timeDistance?.startTime || undefined;
  const endTime = timeDistance?.endTime || undefined;

  // Build label
  const modeLabel = mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
  const label = isTransit && routeLabel ? `${routeLabel}` : modeLabel;

  return { mode, label, fromName, toName, startTime, endTime, duration, distance };
}

export default function DirectionsStepsList({
  legs,
  fromStop,
  toStop,
  intermediateStops
}: DirectionsStepsListProps) {
  if (legs && legs.length > 0) {
    return (
      <>
        {legs.map((leg, idx) => {
          const renderData = getLegRenderData(leg, fromStop, toStop);
          const { label, fromName, toName, startTime, endTime, duration, distance } = renderData;

          return (
            <ListGroup.Item key={idx}>
              <div><strong>{label}</strong></div>
              <div>From: {fromName}</div>
              <div>To: {toName}</div>
              {startTime && endTime && <div>Time: {startTime} - {endTime}</div>}
              {duration && <div>Duration: {duration} min</div>}
              {distance && <div>Distance: {distance.toFixed(2)} mi</div>}
            </ListGroup.Item>
          );
        })}
      </>
    );
  }

  // Fallback to route config steps
  return (
    <>
      {fromStop && <ListGroup.Item>Board Route at {fromStop.desc}</ListGroup.Item>}
      {intermediateStops.map(s => (
        <ListGroup.Item key={s.locid}>Pass {s.desc}</ListGroup.Item>
      ))}
      {toStop && <ListGroup.Item>Alight at {toStop.desc}</ListGroup.Item>}
    </>
  );
}
