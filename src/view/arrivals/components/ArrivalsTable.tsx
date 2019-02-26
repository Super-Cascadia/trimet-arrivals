import classNames from "classnames";
import { map, sortBy } from "lodash";
import { Moment } from "moment";
import React from "react";
import { Arrival, Route, StopLocation } from "../../../api/trimet/types";
import ArrivalRow from "./ArrivalRow";
import "./Arrivals.css";

export interface Props {
  arrivals: Arrival[];
  loading: boolean;
  now: Moment;
  onRouteIndicatorClick: (route: Route) => void;
  stopLocation: StopLocation;
}

function sortArrivalsByEstimatedTime(arrivals: Arrival[]): Arrival[] {
  return sortBy(arrivals, (arrival: Arrival) => arrival.estimated);
}

function getArrivalRoute(routes: Route[], routeId: number) {
  return routes.find((route: Route) => route.route === routeId);
}

export default class ArrivalsTable extends React.Component<Props> {
  public static getRows(
    arrivals: Arrival[],
    now,
    onClick,
    stopLocation: StopLocation
  ) {
    return map(sortArrivalsByEstimatedTime(arrivals), (arrival: Arrival) => {
      const {
        scheduled,
        estimated,
        feet,
        route: routeId,
        shortSign,
        id
      } = arrival;

      return (
        <ArrivalRow
          key={id}
          estimated={estimated}
          feet={feet}
          scheduled={scheduled}
          routeId={routeId}
          shortSign={shortSign}
          now={now}
          route={getArrivalRoute(stopLocation.route, routeId)}
          onRouteIndicatorClick={onClick}
        />
      );
    });
  }

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
        <tbody>
          {ArrivalsTable.getRows(arrivals, now, onClick, stopLocation)}
        </tbody>
      </table>
    );
  }
}
