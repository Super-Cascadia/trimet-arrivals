import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import NearbyRoutesContainer from "../view/nearbyRoutes/container/NearbyRoutesContainer";
import StopsContainer from "../view/nearbyStops/containers/StopsContainer";

export default function NearbySubRoutes() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        <NearbyRoutesContainer />
      </Route>
      <Route path={`${path}/routes/:id`}>
        <h1>Nearby Route by ID</h1>
      </Route>
      <Route path={`${path}/routes`}>
        <NearbyRoutesContainer />
      </Route>
      <Route path={`${path}/stops`}>
        <StopsContainer />
      </Route>
    </Switch>
  );
}
