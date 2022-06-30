import React from "react";
import { ListGroup } from "react-bootstrap";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Arrival } from "../../../../api/trimet/interfaces/arrivals";
import {
  Direction,
  StopLocation,
  TrimetRoute
} from "../../../../api/trimet/interfaces/types";
import { getTimeUntilArrival } from "../../util/timeUtils";
import "./SimpleArrivalListItem.scss";

interface ArrivalListItemParams {
  id: any;
  arrival: Arrival;
  route: TrimetRoute;
  stop: StopLocation;
}

function SimpleArrivalListItem({
  id,
  arrival,
  route,
  stop
}: ArrivalListItemParams) {
  const { path } = useRouteMatch();
  const history = useHistory();
  const estimatedArrivalTime = arrival.estimated;
  const scheduledArrivalTime = arrival.scheduled;
  const routeDirection: Direction = route.dir[0];
  const routeId = route.route;
  const stopName = stop.desc;
  const timeUntilArrival = getTimeUntilArrival(
    estimatedArrivalTime,
    scheduledArrivalTime
  );

  function handleClick() {
    history.push(
      `${path}/${routeId}?stop=${stop.locid}&direction=${routeDirection.dir}`
    );
  }

  return (
    <ListGroup.Item
      variant="light"
      as="li"
      className="d-flex justify-content-between align-items-start"
      onClick={handleClick}
    >
      <div className="ms-2 me-auto">
        <span className="fw-bold h2">{routeId}</span>
        <br />
        <span>{routeDirection.desc}</span>
        <br />
        <small>
          {stopName} ({stop.locid})
        </small>
      </div>
      <div>
        <span className="h5">{timeUntilArrival}</span>
        <br />
      </div>
    </ListGroup.Item>
  );
}

export default SimpleArrivalListItem;
