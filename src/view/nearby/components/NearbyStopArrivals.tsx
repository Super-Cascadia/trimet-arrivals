import { map, sortBy } from "lodash";
import moment from "moment";
import React from "react";
import { ListGroup, Tab, Table, Tabs } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import { getFormattedTime } from "../util/timeUtils";
import ArrivalListItem from "./common/ArrivalListItem";

interface StopArrivalsParams {
  data: ArrivalData;
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

function getArrivalsList(sortedArrivals: Arrival[]) {
  const { id } = useParams();

  return map(sortedArrivals, (arrival: Arrival) => {
    return <ArrivalListItem id={id} arrival={arrival} />;
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
