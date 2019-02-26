import { sortBy } from "lodash";
import { Moment } from "moment";
import React from "react";
import { Arrival, Route, StopLocation } from "../../../api/trimet/types";
import ArrivalRow from "./ArrivalRow";
import "./Arrivals.css";

interface Props {
  arrivals: Arrival[];
  now: Moment;
  onClick: (route: Route) => void;
  stopLocation: StopLocation;
}

function sortArrivalsByEstimatedTime(arrivals: Arrival[]): Arrival[] {
  return sortBy(arrivals, (arrival: Arrival) => arrival.estimated);
}

function getArrivalRoute(routes: Route[], routeId: number) {
  return routes.find((route: Route) => route.route === routeId);
}

export default class ArrivalRows extends React.Component<Props> {
  public static getRows(
    arrivals: Arrival[],
    now,
    onClick,
    stopLocation: StopLocation
  ) {
    return sortArrivalsByEstimatedTime(arrivals).map((arrival: Arrival) => {
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
    const { arrivals, now, onClick, stopLocation } = this.props;

    return (
      <tbody>{ArrivalRows.getRows(arrivals, now, onClick, stopLocation)}</tbody>
    );
  }
}
