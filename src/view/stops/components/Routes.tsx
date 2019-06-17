import { map } from "lodash";
import React from "react";
import { RouteDirection } from "../../../store/reducers/stopsReducer";

interface Props {
  nearbyRoutes: RouteDirection[];
}

export default class Routes extends React.Component<Props> {
  public static getRoutes(routes: RouteDirection[]) {
    return map(routes, (route: RouteDirection) => {
      return (
        <div>
          {route.routeId} | {route.directionId}
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
