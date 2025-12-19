import React from "react";
import { Card } from "react-bootstrap";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";

interface DirectionsRouteInfoProps {
  route: string;
  dirDesc: string;
  fromStop: ArrivalLocation | null;
  toStop: ArrivalLocation | null;
}

export default function DirectionsRouteInfo({ route, dirDesc, fromStop, toStop }: DirectionsRouteInfoProps) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Route {route} — {dirDesc}</Card.Title>
        {fromStop && toStop && (
          <>
            <Card.Text>From: {fromStop.desc} (Stop {fromStop.id})</Card.Text>
            <Card.Text>To: {toStop.desc} (Stop {toStop.id})</Card.Text>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
