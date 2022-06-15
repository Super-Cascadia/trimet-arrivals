import { map, round, sortBy } from "lodash";
import moment, { Moment } from "moment";
import React from "react";
import { Badge, ListGroup, Tab, Table, Tabs } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";

interface StopArrivalsParams {
  data: ArrivalData;
}

export function getFormattedTime(arrival: number): string {
  return moment(arrival).format("h:mma");
}

export function getNormalizedTimeDifference(time: number, toTime: Moment) {
  const timeMoment = moment(time);
  const minutesUntilArrival = timeMoment.diff(toTime, "minutes");

  return minutesUntilArrival >= 60
    ? `${round(timeMoment.diff(toTime, "hours", true), 1)} hrs`
    : `${minutesUntilArrival} min`;
}

export function getTimeDifferenceInMinutes(time: number, toTime: Moment) {
  const timeMoment = moment(time);
  return timeMoment.diff(toTime, "minutes");
}

function sortArrivalsByEstimated(arrivals: Arrival[]): Arrival[] {
  return sortBy(arrivals, arrival =>
    moment(arrival.scheduled)
      .utc()
      .valueOf()
  );
}

interface ArrivalsTableParams {
  data: ArrivalData;
}

interface TimeDiffBadgeParams {
  estimatedArrivalTime: number;
  scheduledArrivalTime: number;
}

function TimeDiffBadge({
  estimatedArrivalTime,
  scheduledArrivalTime
}: TimeDiffBadgeParams) {
  const now = moment();
  const timeStampToDiff = estimatedArrivalTime
    ? estimatedArrivalTime
    : scheduledArrivalTime;
  const timeUntilArrival = getNormalizedTimeDifference(timeStampToDiff, now);
  const minutesLate = getTimeDifferenceInMinutes(
    scheduledArrivalTime,
    moment(estimatedArrivalTime)
  );

  console.log("minutesLate", timeUntilArrival, minutesLate);

  const onTime = minutesLate === 0;
  const late = minutesLate < 0;
  const early = minutesLate > 0;

  const getColor = () => {
    if (onTime) {
      return "success";
    } else if (late) {
      return "danger";
    } else {
      return "primary";
    }
  };

  const color = getColor();

  const getStatusDescription = () => {
    if (onTime) {
      return <span> | On Time</span>;
    } else if (late) {
      return <span> | late</span>;
    } else {
      return null;
    }
  };

  return (
    <Badge bg={color} pill={true}>
      {timeUntilArrival} {getStatusDescription()}
    </Badge>
  );
}

function getArrivalsList(sortedArrivals: Arrival[]) {
  const { id } = useParams();

  return map(sortedArrivals, (arrival: Arrival) => {
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
  });
}

export function ArrivalList({ data }: ArrivalsTableParams) {
  const sortedArrivals = sortArrivalsByEstimated(data.arrival);
  const arrivalsList = getArrivalsList(sortedArrivals);

  return (
    <div>
      <ListGroup as="ul">{arrivalsList}</ListGroup>
    </div>
  );
}

function getArrivalRows(data: ArrivalData) {
  const sortedArrivals = sortArrivalsByEstimated(data.arrival);
  return map(sortedArrivals, (arrival: Arrival) => {
    const estimatedTime = arrival.estimated
      ? getFormattedTime(arrival.estimated)
      : "No estimation";
    const scheduledTime = getFormattedTime(arrival.scheduled);

    return (
      <tr>
        <td>
          <small>{arrival.shortSign}</small>
        </td>
        <td>
          <small>{estimatedTime}</small>
        </td>
        <td>
          <small>{scheduledTime}</small>
        </td>
      </tr>
    );
  });
}

function ArrivalsTable({ data }: ArrivalsTableParams) {
  return (
    <Table striped={true} bordered={true} hover={true} size="sm">
      <thead>
        <th>Route</th>
        <th>Est. Arrival</th>
        <th>Scheduled</th>
      </thead>
      <tbody>{getArrivalRows(data)}</tbody>
    </Table>
  );
}

function StopArrivals({ data }: StopArrivalsParams) {
  return (
    <>
      <h5>Arrivals</h5>
      <Tabs defaultActiveKey="list" id="stop-arrival-tabs" className="mb-3">
        <Tab eventKey="list" title="List">
          <ArrivalList data={data} />
        </Tab>
        <Tab eventKey="table" title="Table">
          <ArrivalsTable data={data} />
        </Tab>
      </Tabs>
    </>
  );
}

export default StopArrivals;
