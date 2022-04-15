import React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import LineDetailViewContainer from "../view/lineDetail/container/LineDetailViewContainer";
import { AllLines } from "../view/lines/component/AllLines";
import { BusLines } from "../view/lines/component/BusLines";
import { MaxLines } from "../view/lines/component/MaxLines";
import { StreetCarLines } from "../view/lines/component/StreetCarLines";
import { WES } from "../view/lines/component/WES";

function LineDetailViewRouter() {
  const { id } = useParams();

  return <LineDetailViewContainer id={id} />;
}

export function LinesViewSubRoutes() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        <AllLines />
      </Route>
      <Route path={`${path}/max`}>
        <MaxLines />
      </Route>
      <Route path={`${path}/streetcar`}>
        <StreetCarLines />
      </Route>
      <Route path={`${path}/bus`}>
        <BusLines />
      </Route>
      <Route path={`${path}/wes`}>
        <WES />
      </Route>
      <Route path={`${path}/:id`}>
        <LineDetailViewRouter />
      </Route>
    </Switch>
  );
}
