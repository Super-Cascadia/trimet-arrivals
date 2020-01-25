import _ from "lodash";
import React from "react";
import {
  RouteDirectionStop,
  RouteStopDirection
} from "../../../api/trimet/interfaces/routes";
import "./NearbyRouteDetail.scss";

interface Props {
  direction: RouteStopDirection;
}

export default class RouteDirection extends React.Component<Props> {
  public render() {
    const { direction } = this.props;

    return (
      <div>
        <div className="route-directions-header">{direction.desc}</div>
        <ul>{this.getRouteDirectionStops(direction.stop)}</ul>
      </div>
    );
  }

  public getRouteDirectionStops(stops: RouteDirectionStop[]) {
    return _.map(stops, stop => {
      return (
        <li>
          {stop.desc}
          {stop.locid}
          {stop.dir}
        </li>
      );
    });
  }
}
