import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import NearbyRoutesContainer from "../view/routes/container/NearbyRoutesContainer";
import StopsContainer from "../view/stops/containers/StopsContainer";

export default function NearbySubRoutes() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        <NearbyRoutesContainer />
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
