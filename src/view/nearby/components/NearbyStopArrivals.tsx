import { map, sortBy } from "lodash";
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

function getArrivalsList(sortedArrivals: Arrival[], now: moment.Moment) {
  const { id } = useParams();

  return map(sortedArrivals, (arrival: Arrival) => {
    const estimatedArrivalTime = arrival.estimated;
    const scheduledArrivalTime = arrival.scheduled;
    const formattedEstimatedTime = estimatedArrivalTime
      ? getFormattedTime(estimatedArrivalTime)
      : "No Estimation";
    const scheduledTime = getFormattedTime(scheduledArrivalTime);
    const timeStampToDiff = estimatedArrivalTime
      ? estimatedArrivalTime
      : scheduledArrivalTime;
    const timeDiff = getNormalizedTimeDifference(timeStampToDiff, now);

    return (
      <ListGroup.Item
        variant="primary"
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <LinkContainer to={`/nearby/stops/${id}/arrival/${arrival.id}`}>
            <a className="fw-bold">{arrival.shortSign}</a>
          </LinkContainer>
          <div>
            {formattedEstimatedTime} / {scheduledTime}
          </div>
        </div>
        <Badge bg="primary" pill={true}>
          {timeDiff} min
        </Badge>
      </ListGroup.Item>
    );
  });
}

export function ArrivalList({ data }: ArrivalsTableParams) {
  const now = moment();
  const sortedArrivals = sortArrivalsByEstimated(data.arrival);
  const arrivalsList = getArrivalsList(sortedArrivals, now);

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
