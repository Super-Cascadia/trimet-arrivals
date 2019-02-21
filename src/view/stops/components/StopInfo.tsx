import { map } from "lodash";
import React from "react";
import { Route, StopLocation } from "../../../api/trimet/types";
import RouteIndicator from "../../../component/route/RouteIndicator";

function getStopRoutes(routes: Route[], onClick) {
  return map(routes, (route: Route) => {
    // if (route.route === 291) {
    //   console.log(route)
    // }

    return (
      <RouteIndicator
        key={route.route}
        routeId={route.route}
        route={route}
        onClick={onClick}
        className="header-router-indicator"
      />
    );
  });
}

interface Props {
  stopLocation: StopLocation;
  onClick: (route: Route) => void;
}

export default function StopInfo({ stopLocation, onClick }: Props) {
  if (!stopLocation) {
    return null;
  }

  return (
    <h2>
      <span className="route-indicators">
        {getStopRoutes(stopLocation.route, onClick)}
      </span>
      <span className="stop-info">
        {stopLocation.locid} - {stopLocation.desc} - {stopLocation.dir}
      </span>
    </h2>
  );
}
