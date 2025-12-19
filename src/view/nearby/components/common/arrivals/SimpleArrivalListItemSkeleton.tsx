import React from "react";
import { ListGroup } from "react-bootstrap";
import "./SimpleArrivalListItem.scss";
import "./SimpleArrivalListItemSkeleton.scss";

function SimpleArrivalListItemSkeleton() {
  return (
    <ListGroup.Item
      variant="light"
      as="li"
      className="d-flex justify-content-between align-items-start list-item-compact"
    >
      <div className="me-1">
        <span className="fw-bold h2">
          <div className="skeleton-line w-40 h-md skeleton-inline skeleton-inline-mr" />
          <span className="h6">
            <div className="skeleton-line w-60 h-sm skeleton-inline" />
          </span>
        </span>
        <br />
        <div className="stop-location-text">
          <div className="skeleton-line w-80 h-sm" />
          <div className="skeleton-line w-60 h-sm" />
        </div>
      </div>
      <div className="text-end arrival-time-container flex-shrink-0">
        <div className="skeleton-line w-50 h-md" />
        <div className="skeleton-line w-40 h-sm" />
      </div>
    </ListGroup.Item>
  );
}

export default SimpleArrivalListItemSkeleton;
