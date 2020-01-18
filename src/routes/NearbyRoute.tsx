import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import NearbySubNav from "../view/nearby/components/NearbySubNav";
import NearbyRoutesRoute from "./NearbyRoutesRoute";
import NearbyStopsRoute from "./NearbyStopsRoute";

export default function NearbyRoute() {
  const { path } = useRouteMatch();

  return (
    <div>
      <NearbySubNav />
      <Switch>
        <Route exact={true} path={path}>
          <NearbyStopsRoute />
        </Route>
        <Route path={`${path}/routes`}>
          <NearbyRoutesRoute />
        </Route>
        <Route path={`${path}/stops`}>
          <NearbyStopsRoute />
        </Route>
      </Switch>
    </div>
  );
}
