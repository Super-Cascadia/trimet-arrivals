import classNames from "classnames";
import { Moment } from "moment";
import React from "react";
import { Table } from "react-bootstrap";
import { Arrival } from "../../../api/trimet/interfaces/arrivals";
import {
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import ArrivalRows from "./ArrivalRows";
import "./Arrivals.css";

interface Props {
  arrivals: Arrival[];
  loading: boolean;
  now: Moment;
  onRouteIndicatorClick: (route: TrimetRoute) => void;
  stopLocation: StopLocation;
  showMore: boolean;
}

export default class ArrivalsTable extends React.Component<Props> {
  public render() {
    const {
      arrivals,
      loading,
      now,
      onRouteIndicatorClick: onClick,
      stopLocation,
      showMore
    } = this.props;

    if (!arrivals) {
      return null;
    }

    const classes = classNames("arrivals-table", {
      "arrivals-loading": loading
    });

    return (
      <Table>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Arrival</th>
            <th>On Time</th>
            <th>Estimated / Scheduled</th>
            <th>Distance</th>
          </tr>
        </thead>
        <ArrivalRows
          arrivals={arrivals}
          onClick={onClick}
          stopLocation={stopLocation}
          now={now}
          showAllArrivals={showMore}
        />
      </Table>
    );
  }
}
