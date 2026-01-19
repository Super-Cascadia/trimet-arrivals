import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";
import StopLocationIndicator from "../../../../component/stop/StopLocationIndicator";

interface FallbackProps {
  fromStop: ArrivalLocation | null;
  toStop: ArrivalLocation | null;
  intermediateStops: Array<{ locid: number; desc: string }>;
}

export default function DirectionsFallbackSteps({ fromStop, toStop, intermediateStops }: FallbackProps) {
  return (
    <Card>
      <Card.Header>Steps</Card.Header>
      <ListGroup>
        {fromStop && (
          <ListGroup.Item>
            <div className="d-flex align-items-start justify-content-between">
              <div className="flex-grow-1">
                <strong>Start</strong>
              </div>
              <div className="text-muted">1</div>
            </div>
            <div className="mt-2">
              <div className="d-flex align-items-center gap-2 flex-grow-1">
                <StopLocationIndicator locationId={fromStop.id} nearbyStops={true} selected={false} />
                <div>
                  <span>{fromStop.desc}</span>
                </div>
              </div>
            </div>
          </ListGroup.Item>
        )}
        {intermediateStops.map((s, idx) => (
          <ListGroup.Item key={s.locid}>
            <div className="d-flex align-items-start justify-content-between">
              <div className="flex-grow-1">
                <strong>Pass</strong>
              </div>
              <div className="text-muted">{fromStop ? idx + 2 : idx + 1}</div>
            </div>
            <div className="mt-2">
              <small>{s.desc}</small>
            </div>
          </ListGroup.Item>
        ))}
        {toStop && (
          <ListGroup.Item>
            <div className="d-flex align-items-start justify-content-between">
              <div className="flex-grow-1">
                <strong>End</strong>
              </div>
              <div className="text-muted">{fromStop ? intermediateStops.length + 2 : intermediateStops.length + 1}</div>
            </div>
            <div className="mt-2">
              <span>{toStop.desc}</span>
            </div>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
}
