import React from "react";
import { Card } from "react-bootstrap";

export function InfoCard() {
  return (
    <Card>
      <Card.Header>Welcome to Trimet Arrivals</Card.Header>
      <Card.Body>
        Trimet Arrivals is a web service that can be used to get useful
        information about the state of the Trimet Transit Service.
      </Card.Body>
    </Card>
  );
}
