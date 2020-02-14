import _ from "lodash";
import React from "react";
import {
  RouteStopDirection,
  TrimetRoute
} from "../../../api/trimet/interfaces/routes";
import "./NearbyRouteDetail.scss";
import RouteDirection from "./RouteDirection";

interface Props {
  route: TrimetRoute;
}

export default class RouteDirections extends React.Component<Props> {
  private static getRouteDirections(directions: RouteStopDirection[]) {
    return _.map(directions, (direction: RouteStopDirection) => {
      return <RouteDirection direction={direction} />;
    });
  }

  public render() {
    const { route } = this.props;

    return (
      <div className="route-directions-stops-wrapper">
        <h3>Route Stops</h3>
        {RouteDirections.getRouteDirections(route.dir)}
      </div>
    );
  }
}
