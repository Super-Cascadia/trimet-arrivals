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
}

function ArrivalListItem({ id, arrival }: ArrivalListItemParams) {
  const navigate = useNavigate();
  const estimatedArrivalTime = arrival.estimated;
  const scheduledArrivalTime = arrival.scheduled;
  const scheduledTime = getFormattedTime(scheduledArrivalTime);

  function handleClick() {
    const url = `/nearby/simple-routes/${arrival.route}?stop=${arrival.locid}&direction=${arrival.dir}`;
    navigate(url);
  }

  return (
    <ListGroup.Item
      variant="light"
      as="li"
      className="d-flex justify-content-between align-items-start"
      onClick={handleClick}
    >
      <div className="ms-2 me-auto">
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
    </ListGroup.Item>
  );
}

export default ArrivalListItem;
