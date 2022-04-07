import { map } from "lodash";
import React from "react";
import { Table } from "react-bootstrap";
import { Arrival } from "../../../api/trimet/interfaces/arrivals";
import { TrimetArrivalData } from "../../../store/reducers/data/arrivalsDataReducer";
import ArrivalRowContainer from "../container/ArrivalRowContainer";

function getArrivals(arrivals: Arrival[]) {
  return map(arrivals, arrival => {
    return <ArrivalRowContainer arrival={arrival} />;
  });
}

interface Props {
  arrivals: TrimetArrivalData;
}

function StopLocationArrivalsTable({ arrivals }: Props) {
  return (
    <Table striped={true} bordered={true} hover={true} size="lg">
      <thead>
        <tr>
          <td />
          <td>Route</td>
          <td>Arriving In</td>
          <td>Early / Late by</td>
          <td>Scheduled / Estimated Arrivals </td>
          <td>Distance to stop</td>
        </tr>
      </thead>
      <tbody>{getArrivals(arrivals.arrival)}</tbody>
    </Table>
  );
}

export default StopLocationArrivalsTable;
