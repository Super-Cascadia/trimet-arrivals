import React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import { RouteDataDictionary } from "../store/reducers/data/routeDataReducer";
import LineDetailViewContainer from "../view/lineDetail/container/LineDetailViewContainer";
import { AerialTram } from "../view/lines/component/AerialTram";
import { AllLines } from "../view/lines/component/AllLines";
import { BusLines } from "../view/lines/component/BusLines";
import { MaxLines } from "../view/lines/component/MaxLines";
import { StreetCarLines } from "../view/lines/component/StreetCarLines";
import { WES } from "../view/lines/component/WES";

function LineDetailViewRouter() {
  const { id } = useParams();

  return <LineDetailViewContainer id={id} />;
}

export function LinesViewSubRoutes({
  routes
}: {
  routes: RouteDataDictionary;
}) {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        <AllLines routes={routes} />
      </Route>
      <Route path={`${path}/max`}>
        <MaxLines routes={routes} />
      </Route>
      <Route path={`${path}/streetcar`}>
        <StreetCarLines routes={routes} />
      </Route>
      <Route path={`${path}/bus`}>
        <BusLines routes={routes} />
      </Route>
      <Route path={`${path}/wes`}>
        <WES routes={routes} />
      </Route>
      <Route path={`${path}/tram`}>
        <AerialTram routes={routes} />
      </Route>
      <Route path={`${path}/:id`}>
        <LineDetailViewRouter />
      </Route>
    </Switch>
  );
}
