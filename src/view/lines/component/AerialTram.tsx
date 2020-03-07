import React from "react";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import { getAerialTram, getRoutes } from "./AllLines";

export function AerialTram({ routes }: { routes: RouteDataDictionary }) {
  const aerialTram = getAerialTram(routes);

  return (
    <div>
      <h2>Aerial Tram</h2>
      <br />
      {getRoutes(aerialTram)}
    </div>
  );
}
