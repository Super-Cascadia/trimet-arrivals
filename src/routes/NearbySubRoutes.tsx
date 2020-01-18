import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { StopLocationsDictionary } from "../store/reducers/stopsReducer";
import { RouteDirectionDict } from "../store/reducers/util/getRoutesFromStopLocations";
import NearbyRoutesRoute from "./NearbyRoutesRoute";
import NearbyStopsRoute from "./NearbyStopsRoute";

interface Props {
  nearbyRoutes: RouteDirectionDict;
  stopLocations: StopLocationsDictionary;
}

export default function NearbySubRoutes({
  nearbyRoutes,
  stopLocations
}: Props) {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        <NearbyStopsRoute stopLocations={stopLocations} />
      </Route>
      <Route path={`${path}/routes`}>
        <NearbyRoutesRoute nearbyRoutes={nearbyRoutes} />
      </Route>
      <Route path={`${path}/stops`}>
        <NearbyStopsRoute stopLocations={stopLocations} />
      </Route>
    </Switch>
  );
}
