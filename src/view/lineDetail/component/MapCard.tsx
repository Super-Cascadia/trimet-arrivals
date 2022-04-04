import React from "react";
import { Card } from "react-bootstrap";

export function MapCard() {
  return (
    <Card>
      <Card.Header as="h5">Map</Card.Header>
      <Card.Body>
        <Card.Text>
          <p>Map goes here</p>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
