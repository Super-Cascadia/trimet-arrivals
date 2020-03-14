import React from "react";
import FontAwesome from "react-fontawesome";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import { getMaxLines, getRoutes } from "./AllLines";

export function MaxLines({ routes }: { routes: RouteDataDictionary }) {
  const lines = getMaxLines(routes);

  return (
    <div>
      <h2>
        <FontAwesome className="train" name="train" />
        Max Light Rail
      </h2>
      {getRoutes(lines)}
    </div>
  );
}
