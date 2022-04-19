import React from "react";
import { Card } from "react-bootstrap";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import LineDetailViewStops from "./LineDetailViewStops";

interface StopsCardParams {
  route: TrimetRoute;
}

export function StopsCard({ route }: StopsCardParams) {
  return (
    <Card>
      <Card.Header as="h5">Stops</Card.Header>
      <Card.Body>
        <LineDetailViewStops route={route} />
      </Card.Body>
    </Card>
  );
}
