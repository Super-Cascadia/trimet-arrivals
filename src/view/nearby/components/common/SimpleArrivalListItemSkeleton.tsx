import React from "react";
import { ListGroup } from "react-bootstrap";
import "./SimpleArrivalListItem.scss";
import "./SimpleArrivalListItemSkeleton.scss";

function SimpleArrivalListItemSkeleton() {
  return (
    <ListGroup.Item
      variant="light"
      as="li"
      className="d-flex justify-content-between align-items-start"
    >
      <div className="ms-2 me-auto">
        <span className="fw-bold h2">
          <div className="skeleton-line w-40 h-md skeleton-inline skeleton-inline-mr" />
          <span className="h6">
            <div className="skeleton-line w-60 h-sm skeleton-inline" />
          </span>
        </span>
        <br />
        <small>
          <div className="skeleton-line w-80 h-sm" />
        </small>
      </div>
      <div>
        <div className="skeleton-line w-50 h-md" />
      </div>
    </ListGroup.Item>
  );
}

export default SimpleArrivalListItemSkeleton;
