import { Dictionary } from "lodash";
import React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import { StopData, TrimetRoute } from "../api/trimet/interfaces/types";
import NearbyRouteDetailContainer from "../view/nearbyRouteDetail/containers/NearbyRouteDetailContainer";
import NearbyRoutes from "../view/nearbyRoutes/component/NearbyRoutes";
import NearbyStops from "../view/nearbyStops/components/NearbyStops";

function NearbyRouteDetailRouter() {
  const { id } = useParams();

  return <NearbyRouteDetailContainer id={id} />;
}

interface Props {
  nearbyStops: StopData;
  nearbyRoutes: Dictionary<TrimetRoute[]>;
}

export default function NearbySubRoutes({ nearbyStops, nearbyRoutes }: Props) {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        <NearbyRoutes nearbyRoutes={nearbyRoutes} />
      </Route>
      <Route path={`${path}/routes/:id`}>
        <NearbyRouteDetailRouter />
      </Route>
      <Route path={`${path}/routes`}>
        <NearbyRoutes nearbyRoutes={nearbyRoutes} />
      </Route>
      <Route path={`${path}/stops`}>
        <NearbyStops nearbyStops={nearbyStops} />
      </Route>
    </Switch>
  );
}
