import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import "../arrivals/SimpleArrivalListItemSkeleton.scss";

function DeparturesCardSkeleton() {
  return (
    <Card>
      <Card.Header>Departures 2</Card.Header>
      <ListGroup className="list-group-flush">
        {Array.from({ length: 3 }).map((_, index) => (
          <ListGroup.Item
            key={`departure-skeleton-${index}`}
            variant="light"
            as="li"
            className="d-flex justify-content-between align-items-start"
          >
            <div>
              <div className="skeleton-line w-50 h-md" />
            </div>
            <div className="skeleton-line w-40 h-sm" />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default DeparturesCardSkeleton;
