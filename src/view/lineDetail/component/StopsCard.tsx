import React from "react";
import { Card } from "react-bootstrap";
import { Alert } from "../../../api/trimet/interfaces/alertsData";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import LineDetailViewStops from "./LineDetailViewStops";

interface StopsCardParams {
  route: TrimetRoute;
  alertsData: Alert[];
}

export function StopsCard({ route, alertsData }: StopsCardParams) {
  return (
    <Card>
      <Card.Header as="h5">Stops</Card.Header>
      <Card.Body>
        <LineDetailViewStops route={route} alertsData={alertsData} />
      </Card.Body>
    </Card>
  );
}
