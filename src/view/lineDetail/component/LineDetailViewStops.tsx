import { map } from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import {
  RouteDirectionStop,
  RouteStopDirection,
  TrimetRoute
} from "../../../api/trimet/interfaces/routes";
import "./LineDetailView.scss";

interface Props {
  route: TrimetRoute;
}

export default class LineDetailViewStops extends React.Component<Props> {
  private static getRouteDirectionStops(stops: RouteDirectionStop[]) {
    return map(stops, stop => {
      return (
        <li>
          <Link to={`/stop/${stop.locid}`}>
            {stop.locid} - {stop.desc} - {stop.dir}
          </Link>
        </li>
      );
    });
  }
  public render() {
    const { route } = this.props;

    if (!route.dir) {
      return "Loading TrimetRoute data...";
    }

    return (
      <div id="line-detail-view-stops">
        {this.getRouteDirections(route.dir)}
      </div>
    );
  }

  public getRouteDirections(routeDirections: RouteStopDirection[]) {
    return map(routeDirections, routeDirection => {
      return (
        <div>
          <header>
            <h3>{routeDirection.desc}</h3>
            <ul>
              {LineDetailViewStops.getRouteDirectionStops(routeDirection.stop)}
            </ul>
          </header>
        </div>
      );
    });
  }
}
