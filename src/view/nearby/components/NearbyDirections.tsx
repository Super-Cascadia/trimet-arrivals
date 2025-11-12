import React from "react";
import { Card, CardGroup, ListGroup, ProgressBar } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { TopNavBar } from "./common/TopNavBar";
import "./NearbyRoutes.scss";

export default function NearbyDirections() {
  const [searchParams] = useSearchParams();
  const stop = searchParams.get("stop");
  const direction = searchParams.get("direction");

  return (
    <div className="scrollarea">
      <TopNavBar id="Directions" />
      <Card>
        <Card.Body>
          <Card.Title>Go in 5 minutes</Card.Title>
          <ProgressBar now={60} />
          <Card.Text>Arrive at 22:39</Card.Text>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>54</Card.Header>
        <ListGroup>
          <ListGroup.Item>To Portland</ListGroup.Item>
          <ListGroup.Item>13 more items</ListGroup.Item>
          <ListGroup.Item>SW 6th & Washington</ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
}
