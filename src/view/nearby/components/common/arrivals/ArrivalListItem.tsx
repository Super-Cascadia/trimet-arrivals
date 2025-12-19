import moment from "moment";
import React from "react";
import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Arrival } from "../../../../../api/trimet/interfaces/arrivals";
import { ArrivalTimestamp } from "./ArrivalTimestamp";
import "./ArrivalListItem.scss";

interface ArrivalListItemParams {
  id: any;
  arrival: Arrival;
  isSelected?: boolean;
  onSelect?: () => void;
}

function ArrivalListItem({ id, arrival, isSelected, onSelect }: ArrivalListItemParams) {
  const navigate = useNavigate();
  const estimatedArrivalTime = arrival.estimated;
  const scheduledArrivalTime = arrival.scheduled;

  function handleClick() {
    if (onSelect) {
      onSelect();
    } else {
      const url = `/nearby/simple-routes/${arrival.route}?stop=${arrival.locid}&direction=${arrival.dir}`;
      navigate(url);
    }
  }

  return (
    <ListGroup.Item
      variant={isSelected ? "primary" : "light"}
      as="li"
      className="d-flex justify-content-between align-items-start clickable"
      onClick={handleClick}
    >
      <div className="d-flex align-items-center w-100">
        {onSelect && (
          <div className="me-2">
            <input
              type="radio"
              name="departure-selection"
              checked={isSelected}
              onChange={() => {}}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              title="Select this departure"
              aria-label="Select this departure"
            />
          </div>
        )}
        <div className="me-auto">
          <span className="fw-bold">{arrival.shortSign}</span>
        </div>
        <ArrivalTimestamp 
          estimatedArrivalTime={estimatedArrivalTime} 
          scheduledArrivalTime={scheduledArrivalTime} 
        />
      </div>
    </ListGroup.Item>
  );
}

export default ArrivalListItem;
