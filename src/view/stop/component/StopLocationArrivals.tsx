import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import StopLocationArrivalsTable from "./StopLocationArrivalsTable";

interface Props {
  arrivalData: ArrivalData;
}

function StopLocationArrivals({ arrivalData }: Props) {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        <StopLocationArrivalsTable arrivalData={arrivalData} />
      </Route>
      <Route path={`${path}/route/:routeId`}>
        <StopLocationArrivalsTable arrivalData={arrivalData} />
      </Route>
    </Switch>
  );
}

export default StopLocationArrivals;
