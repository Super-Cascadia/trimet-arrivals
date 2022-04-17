import React from "react";
import { Card } from "react-bootstrap";
import FontAwesome from "react-fontawesome";

export function InfoCard() {
  return (
    <Card>
      <Card.Header as="h5">
        <FontAwesome name="circle-info" />
        Welcome to Trimet Arrivals
      </Card.Header>
      <Card.Body className="lead">
        Trimet Arrivals is a web service that can be used to get useful
        information about the state of the Trimet Transit Service.
      </Card.Body>
    </Card>
  );
}
