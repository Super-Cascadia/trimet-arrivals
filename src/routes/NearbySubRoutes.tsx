import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { StopLocationsDictionary } from "../store/reducers/stopsReducer";
import NearbyRoutesRoute from "./NearbyRoutesRoute";
import NearbyStopsRoute from "./NearbyStopsRoute";

interface Props {
  stopLocations: StopLocationsDictionary;
}

export default function NearbySubRoutes({ stopLocations }: Props) {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        <NearbyRoutesRoute />
      </Route>
      <Route path={`${path}/routes`}>
        <NearbyRoutesRoute />
      </Route>
      <Route path={`${path}/stops`}>
        <NearbyStopsRoute stopLocations={stopLocations} />
      </Route>
    </Switch>
  );
}
