import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { TrimetArrivalData } from "../../../store/reducers/data/arrivalsDataReducer";
import StopLocationArrivalsTable from "./StopLocationArrivalsTable";

interface Props {
  arrivals: TrimetArrivalData;
}

function StopLocationArrivals({ arrivals }: Props) {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        <StopLocationArrivalsTable arrivals={arrivals} />
      </Route>
      <Route path={`${path}/route/:routeId`}>
        <StopLocationArrivalsTable arrivals={arrivals} />
      </Route>
    </Switch>
  );
}

export default StopLocationArrivals;
