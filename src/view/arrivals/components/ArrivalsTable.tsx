import classNames from "classnames";
import { Moment } from "moment";
import React from "react";
import { Arrival, Route, StopLocation } from "../../../api/trimet/types";
import ArrivalRows from "./ArrivalRows";
import "./Arrivals.css";

interface Props {
  arrivals: Arrival[];
  loading: boolean;
  now: Moment;
  onRouteIndicatorClick: (route: Route) => void;
  stopLocation: StopLocation;
}

export default class ArrivalsTable extends React.Component<Props> {
  public render() {
    const {
      arrivals,
      loading,
      now,
      onRouteIndicatorClick: onClick,
      stopLocation
    } = this.props;

    if (!arrivals) {
      return null;
    }

    const classes = classNames("arrivals-table", {
      "arrivals-loading": loading
    });

    return (
      <table className={classes}>
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
          showAllArrivals={false}
        />
      </table>
    );
  }
}
