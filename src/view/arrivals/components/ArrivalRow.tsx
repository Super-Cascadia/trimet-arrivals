import moment, { Moment } from "moment";
import React from "react";
import { TrimetRoute } from "../../../api/trimet/types";
import OnTimeIndicator from "../../../component/arrivalIndicator/OnTimeIndicator";
import TimeToArrivalIndicator from "../../../component/arrivalIndicator/TimeToArrivalIndicator";
import RouteIndicator from "../../../component/route/RouteIndicator";
import { getDistanceUntilArrival } from "../util";
import "./Arrivals.css";

interface Props {
  scheduled: number;
  estimated: number;
  feet: number;
  routeId: number;
  shortSign: string;
  now: Moment;
  onRouteIndicatorClick: (route: TrimetRoute) => void;
  route: TrimetRoute;
}

export default class ArrivalRow extends React.Component<Props> {
  public static getEstimatedScheduledTime(
    scheduled: Moment,
    estimated: Moment
  ) {
    const scheduledTime = scheduled.format("h:mm:ss a");
    const estimatedTime = estimated.format("h:mm:ss a");

    return `${estimatedTime} / ${scheduledTime}`;
  }

  public render() {
    const {
      scheduled,
      estimated,
      feet,
      routeId,
      shortSign,
      now,
      onRouteIndicatorClick,
      route
    } = this.props;
    const scheduledMoment = moment(scheduled);
    const estimatedMoment = moment(estimated);
    const distance = getDistanceUntilArrival(feet);

    return (
      <tr>
        <td className="route-indicator-column">
          <RouteIndicator
            routeId={routeId}
            onClick={onRouteIndicatorClick}
            route={route}
          />
        </td>
        <td className="short-sign">{shortSign}</td>
        <td>
          <TimeToArrivalIndicator estimated={estimatedMoment} now={now} />
        </td>
        <td>
          <OnTimeIndicator
            scheduled={scheduledMoment}
            estimated={estimatedMoment}
          />
        </td>
        <td className="estimated-scheduled-time">
          {ArrivalRow.getEstimatedScheduledTime(
            scheduledMoment,
            estimatedMoment
          )}
        </td>
        <td className="distance-in-miles">{Math.round(distance)} miles</td>
      </tr>
    );
  }
}
