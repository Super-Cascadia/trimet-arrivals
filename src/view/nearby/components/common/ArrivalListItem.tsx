import React from "react";
import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Arrival } from "../../../../api/trimet/interfaces/arrivals";
import { getFormattedTime } from "../../util/timeUtils";
import TimeDiffBadge from "./TimeDiffBadge";

interface ArrivalListItemParams {
  id: any;
  arrival: Arrival;
}

function ArrivalListItem({ id, arrival }: ArrivalListItemParams) {
  const estimatedArrivalTime = arrival.estimated;
  const scheduledArrivalTime = arrival.scheduled;
  const scheduledTime = getFormattedTime(scheduledArrivalTime);

  return (
    <ListGroup.Item
      variant="light"
      as="li"
      className="d-flex justify-content-between align-items-start"
    >
      <div className="ms-2 me-auto">
        <LinkContainer to={`/nearby/stops/${id}/arrival/${arrival.id}`}>
          <a className="fw-bold">{arrival.shortSign}</a>
        </LinkContainer>
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
