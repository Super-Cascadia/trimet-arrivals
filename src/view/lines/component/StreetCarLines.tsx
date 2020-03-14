import React from "react";
import FontAwesome from "react-fontawesome";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import { getRoutes, getStreetCarLines } from "./AllLines";

export function StreetCarLines({ routes }: { routes: RouteDataDictionary }) {
  const streetCarLines = getStreetCarLines(routes);

  return (
    <div className="line-detail-view-wrapper">
      <h2>
        <FontAwesome className="train" name="train" />
        Portland Street Car
      </h2>
      {getRoutes(streetCarLines)}
    </div>
  );
}
