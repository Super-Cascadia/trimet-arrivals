import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import NearbyRoutesRoute from "./NearbyRoutesRoute";
import NearbyStopsRoute from "./NearbyStopsRoute";

export default function NearbySubRoutes() {
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
        <NearbyStopsRoute />
      </Route>
    </Switch>
  );
}
