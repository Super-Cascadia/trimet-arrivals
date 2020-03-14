import React from "react";
import FontAwesome from "react-fontawesome";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import { getRoutes, getWesCommuterRail } from "./AllLines";

export function WES({ routes }: { routes: RouteDataDictionary }) {
  const wesCommuterRail = getWesCommuterRail(routes);

  return (
    <div className="line-detail-view-wrapper">
      <h2>
        <FontAwesome className="subway" name="subway" />
        WES Commuter Rail
      </h2>
      {getRoutes(wesCommuterRail)}
    </div>
  );
}
