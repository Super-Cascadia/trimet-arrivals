import React from "react";
import { Route, StopLocation } from "../../../api/trimet/types";
import { map } from "lodash";
import RouteIndicator from "../../../component/route/RouteIndicator";

function getStopRoutes(routes: Route[]) {
  return map(routes, (route: Route) => {
    return (
      <RouteIndicator
        key={route.route}
        routeId={route.route}
        className="header-router-indicator"
      />
    );
  });
}

interface Props {
  stopLocation: StopLocation;
}

export default function StopInfo({ stopLocation }: Props) {
  if (!stopLocation) {
    return null;
  }

  return (
    <h2>
      <span className="route-indicators">
        {getStopRoutes(stopLocation.route)}
      </span>
      <span className="stop-info">
        {stopLocation.locid} - {stopLocation.desc} - {stopLocation.dir}
      </span>
    </h2>
  );
}
