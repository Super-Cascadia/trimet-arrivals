import React from "react";
import { Card } from "react-bootstrap";
import "./SimpleArrivalListItemSkeleton.scss";

function RouteStopInfoSkeleton() {
  return (
    <Card>
      <Card.Header>
        <div className="skeleton-line w-80 h-md" />
      </Card.Header>
      <Card.Body>
        <div className="skeleton-line w-60 h-sm" />
      </Card.Body>
    </Card>
  );
}

export default RouteStopInfoSkeleton;
