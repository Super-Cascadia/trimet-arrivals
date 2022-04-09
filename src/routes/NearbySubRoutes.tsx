import React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import NearbyRouteDetailContainer from "../view/nearbyRouteDetail/containers/NearbyRouteDetailContainer";
import NearbyRoutesContainer from "../view/nearbyRoutes/container/NearbyRoutesContainer";
import NearbyStopsContainer from "../view/nearbyStops/containers/NearbyStopsContainer";

function NearbyRouteDetailRouter() {
  const { id } = useParams();

  return <NearbyRouteDetailContainer id={id} />;
}

export default function NearbySubRoutes() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        <NearbyRoutesContainer />
      </Route>
      <Route path={`${path}/routes/:id`}>
        <NearbyRouteDetailRouter />
      </Route>
      <Route path={`${path}/routes`}>
        <NearbyRoutesContainer />
      </Route>
      <Route path={`${path}/stops`}>
        <NearbyStopsContainer />
      </Route>
    </Switch>
  );
}
