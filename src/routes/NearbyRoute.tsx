import React from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";

function NearbyStopsRoute() {
  return <div>Stops</div>;
}

function NearbyRoutesRoute() {
  return <div>Nearby Routes</div>;
}

export default function NearbyRoute() {
  const { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Nearby</h2>
      <ul>
        <li>
          <Link to={`${url}/stops`}>Stops</Link>
        </li>
        <li>
          <Link to={`${url}/routes`}>Routes</Link>
        </li>
      </ul>

      <Switch>
        <Route exact={true} path={path}>
          <NearbyStopsRoute />
        </Route>
        <Route path={`${path}/stops`}>
          <NearbyStopsRoute />
        </Route>
        <Route path={`${path}/routes`}>
          <NearbyRoutesRoute />
        </Route>
      </Switch>
    </div>
  );
}
