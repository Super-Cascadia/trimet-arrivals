import React from "react";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import { getMaxLines, getRoutes } from "./AllLines";

export function MaxLines({ routes }: { routes: RouteDataDictionary }) {
  const lines = getMaxLines(routes);

  return (
    <div>
      <h2>Max Lines</h2>
      {getRoutes(lines)}
    </div>
  );
}
