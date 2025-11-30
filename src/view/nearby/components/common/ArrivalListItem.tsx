import React from "react";
import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Arrival } from "../../../../api/trimet/interfaces/arrivals";
import { getFormattedTime } from "../../util/timeUtils";
import TimeDiffBadge from "./TimeDiffBadge";

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
  const scheduledTime = getFormattedTime(scheduledArrivalTime);

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
      className="d-flex justify-content-between align-items-start"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
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
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
        <div className="me-auto">
          <span className="fw-bold">{arrival.shortSign}</span>
          <div>
            {estimatedArrivalTime ? (
              <small>
                Estimated: {getFormattedTime(estimatedArrivalTime)} /{" "}
                {scheduledTime}
              </small>
            ) : (
              <small>Scheduled: {scheduledTime}</small>
            )}
          </div>
        </div>
        <TimeDiffBadge
          estimatedArrivalTime={estimatedArrivalTime}
          scheduledArrivalTime={scheduledArrivalTime}
        />
      </div>
    </ListGroup.Item>
  );
}

export default ArrivalListItem;
