import React from "react";
import { Badge, Card, ListGroup } from "react-bootstrap";
import { ArrivalData } from "../../../api/trimet/interfaces/arrivals";

interface LocationInfoPaneProps {
  arrivalData: ArrivalData;
}

function LocationInfoPane({ arrivalData }: LocationInfoPaneProps) {
  const location = arrivalData.location[0];

  return (
    <Card>
      <Card.Header as="h5">Info</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <strong>ID:</strong>
          <Badge>{location.id}</Badge>
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Direction:</strong> {location.dir}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Queried:</strong> {arrivalData.queryTime}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Lat / Lng:</strong> {location.lat} / {location.lng}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Passenger Code:</strong> {location.passengerCode}
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default LocationInfoPane;
