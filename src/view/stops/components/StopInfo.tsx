import { map } from "lodash";
import React from "react";
import { Route, StopLocation } from "../../../api/trimet/types";
import RouteIndicator from "../../../component/route/RouteIndicator";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import "./StopInfo.css";

function getStopRoutes(routes: Route[], onClick) {
  return map(routes, (route: Route) => {
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
    <div className="stop-info-header">
      <h2>
        <StopLocationIndicator locationId={stopLocation.locid} />
        <span className="stop-info">
          {stopLocation.desc} - {stopLocation.dir}
        </span>
      </h2>
      <span className="serving-label">Routes: </span>
      <span className="route-indicators">
        {getStopRoutes(stopLocation.route, onClick)}
      </span>
    </div>
  );
}
