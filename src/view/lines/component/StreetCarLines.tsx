import React from "react";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import { getRoutes, getStreetCarLines } from "./AllLines";

export function StreetCarLines({ routes }: { routes: RouteDataDictionary }) {
  const streetCarLines = getStreetCarLines(routes);

  return (
    <div>
      <h2>Street Car Lines</h2>
      {getRoutes(streetCarLines)}
    </div>
  );
}
