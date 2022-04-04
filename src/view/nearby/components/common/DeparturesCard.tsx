import { map } from "lodash";
import moment from "moment";
import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { Arrival } from "../../../../api/trimet/interfaces/arrivals";
import { getTimeUntilArrival } from "../../util/timeUtils";

interface DeparturesCardParams {
  filteredArrivals: Arrival[];
}

export function DeparturesCard({ filteredArrivals }: DeparturesCardParams) {
  return (
    <Card>
      <Card.Header>Departures</Card.Header>
      <ListGroup className="list-group-flush">
        {map(filteredArrivals, (arrival: any, index: number) => {
          const estimatedArrivalTime = arrival.estimated;
          const scheduledArrivalTime = arrival.scheduled;
          const timeUntilArrival = getTimeUntilArrival(
            estimatedArrivalTime,
            scheduledArrivalTime
          );

          const variant = index === 0 ? "primary" : "light";
          const estimatedTime = moment(estimatedArrivalTime).format("h:mm a");
          const scheduledTime = moment(scheduledArrivalTime).format("h:mm a");
          const arrivalTime = estimatedArrivalTime
            ? estimatedTime
            : scheduledTime;

          return (
            <ListGroup.Item
              key={index}
              variant={variant}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <span>
                {index === 0 && <FontAwesome name="caret-right" />}
                {timeUntilArrival}
              </span>
              <small>{arrivalTime}</small>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}
