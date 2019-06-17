import { map } from "lodash";
import React from "react";
import RouteIndicator from "../../../component/route/RouteIndicator";
import { RouteDirection } from "../../../store/reducers/util/getRoutesFromStopLocations";
import "./Routes.css";

interface Props {
  nearbyRoutes: RouteDirection[];
}

export default class Routes extends React.Component<Props> {
  public static getRoutes(routes: RouteDirection[]) {
    return map(routes, (route: RouteDirection) => {
      return (
        <div className="route-header">
          <RouteIndicator
            routeId={route.routeId}
            route={undefined}
            onClick={undefined}
          />
          {route.directionId} | {route.routeDescription} |{" "}
          {route.routeDirectionDescription}
        </div>
      );
    });
  }

  public render() {
    return (
      <div id="nearby-view-routes">
        {Routes.getRoutes(this.props.nearbyRoutes)}
      </div>
    );
  }
}
