import { map } from "lodash";
import React from "react";
import { Route } from "../../../api/trimet/interfaces/routes";
import RouteListItem from "../../../component/route/RouteListItem";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import "./NearbyRoutes.scss";

interface Props {
  nearbyRoutes: RouteDataDictionary;
}

export default class NearbyRoutes extends React.Component<Props> {
  public static getRoutes(routes: RouteDataDictionary) {
    return map(routes, (route: Route) => {
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
