import React from "react";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import { getRoutes, getWesCommuterRail } from "./AllLines";

export function WES({ routes }: { routes: RouteDataDictionary }) {
  const wesCommuterRail = getWesCommuterRail(routes);

  return (
    <div>
      <h2>WES Commuter Rail</h2>
      <br />
      {getRoutes(wesCommuterRail)}
    </div>
  );
}
