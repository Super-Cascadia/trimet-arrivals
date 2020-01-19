import { sortBy } from "lodash";
import { Moment } from "moment";
import React from "react";
import {
  Arrival,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import ArrivalRow from "./ArrivalRow";
import "./Arrivals.css";

function sortArrivalsByEstimatedTime(arrivals: Arrival[]): Arrival[] {
  return sortBy(arrivals, (arrival: Arrival) => arrival.estimated);
}

function getArrivalRoute(routes: TrimetRoute[], routeId: number) {
  return routes.find((route: TrimetRoute) => route.route === routeId);
}

function getVisibleArrivals(
  arrivals: Arrival[],
  showAllArrivals: boolean
): Arrival[] {
  return showAllArrivals ? arrivals : arrivals.slice(0, 5);
}

interface Props {
  arrivals: Arrival[];
  now: Moment;
  onClick: (route: TrimetRoute) => void;
  stopLocation: StopLocation;
  showAllArrivals: boolean;
}

export default class ArrivalRows extends React.Component<Props> {
  public static getRows(
    arrivals: Arrival[],
    now,
    onClick,
    stopLocation: StopLocation,
    showAllArrivals: boolean
  ) {
    const sortedArrivals = sortArrivalsByEstimatedTime(arrivals);
    const visibleArrivals = getVisibleArrivals(sortedArrivals, showAllArrivals);

    return visibleArrivals.map((arrival: Arrival) => {
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

  constructor(props) {
    super(props);
  }

  public render() {
    const {
      arrivals,
      now,
      onClick,
      stopLocation,
      showAllArrivals
    } = this.props;

    return (
      <tbody>
        {ArrivalRows.getRows(
          arrivals,
          now,
          onClick,
          stopLocation,
          showAllArrivals
        )}
      </tbody>
    );
  }
}
