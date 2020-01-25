import _ from "lodash";
import React from "react";
import {
  Route,
  RouteDirectionStop,
  RouteStopDirection
} from "../../../api/trimet/interfaces/routes";
import RouteDescription from "../../../component/route/RouteDescription";
import RouteIndicator from "../../../component/route/RouteIndicator";
import { getRouteIndicatorClassName } from "../../nearbyRoutes/component/NearbyRoutes";
import "./NearbyRouteDetail.scss";

interface Props {
  id: number;
  loadRouteData: (id: number) => {};
  route: Route;
}

export default class NearbyRouteDetail extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.loadRouteData(this.props.id);
  }

  public render() {
    const { route } = this.props;

    if (!route) {
      return <div>Loading</div>;
    }

    // tslint:disable-next-line:no-empty
    const foo = () => {};
    const classNames = getRouteIndicatorClassName(route.id, "route-header");

    return (
      <div>
        <div className={classNames}>
          <RouteIndicator
            key={route.route}
            routeId={route.route}
            route={undefined}
            onClick={foo}
            verbose={true}
            className="header-router-indicator"
          />
        </div>
        <div className="route-directions-stops-wrapper">
          {this.getRouteDirections(route.dir)}
        </div>
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

  private getRouteDirections(directions: RouteStopDirection[]) {
    return _.map(directions, (direction: RouteStopDirection) => {
      return (
        <div>
          <div className="route-directions-header">{direction.desc}</div>
          <ul>{this.getRouteDirectionStops(direction.stop)}</ul>
        </div>
      );
    });
  }
}
