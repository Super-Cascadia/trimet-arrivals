import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import "../arrivals/SimpleArrivalListItemSkeleton.scss";

function StopsOnRouteSkeleton() {
  return (
    <Card>
      <Card.Header>Stops</Card.Header>
      <ListGroup className="list-group-flush">
        {Array.from({ length: 5 }).map((_, index) => (
          <ListGroup.Item
            key={`stop-skeleton-${index}`}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="skeleton-line w-80 h-sm" />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default StopsOnRouteSkeleton;
