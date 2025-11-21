import { map } from "lodash";
import moment from "moment";
import React from "react";
import { Card, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { Arrival } from "../../../../api/trimet/interfaces/arrivals";
import { ArrivalCountdown } from "./ArrivalCountdown";
import "./DeparturesCard.scss";

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

interface DeparturesCardParams {
  filteredArrivals: Arrival[];
  selectedIndex?: number;
  onSelectDeparture?: (index: number) => void;
}

export function DeparturesCard({ filteredArrivals, selectedIndex = 0, onSelectDeparture }: DeparturesCardParams) {
  return (
    <Card>
      <Card.Header>Departures</Card.Header>
      <ListGroup className="list-group-flush">
        {map(filteredArrivals, (arrival: any, index: number) => {
          const estimatedArrivalTime = arrival.estimated;
          const scheduledArrivalTime = arrival.scheduled;

          const variant = index === 0 ? "primary" : "light";
          const estimatedTime = moment(estimatedArrivalTime).format("h:mm a");
          const scheduledTime = moment(scheduledArrivalTime).format("h:mm a");
          const arrivalTime = estimatedArrivalTime
            ? estimatedTime
            : scheduledTime;

          return (
            <ListGroup.Item
              key={index}
              variant={variant}
              as="li"
              className="d-flex justify-content-between align-items-start"
              onClick={() => onSelectDeparture?.(index)}
              style={{ cursor: onSelectDeparture ? 'pointer' : 'default' }}
            >
              <div className="d-flex align-items-center gap-2">
                {onSelectDeparture && (
                  <input
                    type="radio"
                    name="departure-selection"
                    checked={selectedIndex === index}
                    onChange={() => onSelectDeparture(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <div>
                  {arrival.vehicleID ? (
                    <span className="bus-id">Bus {arrival.vehicleID}</span>
                  ) : (
                    <span>Departure {index + 1}</span>
                  )}
                </div>
              </div>
              <div style={{ fontFamily: "'Courier New', 'Consolas', 'Monaco', monospace", fontVariantNumeric: "tabular-nums", textAlign: "right" }}>
                <span className="fw-bold" style={{ fontSize: '0.85rem' }}>
                  <ArrivalCountdown
                    estimatedArrivalTime={estimatedArrivalTime}
                    scheduledArrivalTime={scheduledArrivalTime}
                  />
                  {arrivalTime && <span className="text-muted"> ({arrivalTime})</span>}
                  <StatusIndicator estimated={estimatedArrivalTime} scheduled={scheduledArrivalTime} />
                </span>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}
