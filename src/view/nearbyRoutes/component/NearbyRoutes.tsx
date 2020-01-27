import { map } from "lodash";
import React from "react";
import RouteListItem from "../../../component/route/RouteListItem";
import {
  RouteAndRouteDirections,
  RouteDirectionDict
} from "../../../store/reducers/util/getRoutesFromStopLocations";
import "./NearbyRoutes.scss";

interface Props {
  nearbyRoutes: RouteDirectionDict;
}

export default class NearbyRoutes extends React.Component<Props> {
  public static getRoutes(routes: RouteDirectionDict) {
    return map(routes, (route: RouteAndRouteDirections) => {
      return <RouteListItem route={route} />;
    });
  }

  public render() {
    return (
      <div id="nearby-view-routes">
        {NearbyRoutes.getRoutes(this.props.nearbyRoutes)}
      </div>
    );
  }
}
