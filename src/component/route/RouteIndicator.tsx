import { get } from "lodash";
import React from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { ROUTE_DISPLAY } from "../../api/trimet/constants";
import { TrimetRoute } from "../../api/trimet/interfaces/types";
import { maxLightRail } from "../../data/trimet/schedules/maxLightRail";
import FrequentServiceIndicator from "./FrequentServiceIndicator";
import "./RouteIndicator.scss";

interface Props {
  routeId: number;
  route: TrimetRoute;
  verbose?: boolean;
  routeColor?: string;
}

function getRouteDisplay(routeId: number, verboseRouteDisplay: boolean) {
  const routeFound = ROUTE_DISPLAY[routeId];

  if (!routeFound) {
    if (routeId) {
      return (
        <span>
          <FontAwesome name="bus" className="train-route-indicator" />
          <span className="route-indicator-text">
            {routeId} {verboseRouteDisplay && "Bus"}
          </span>
        </span>
      );
    }
    return routeId || "-";
  } else {
    return (
      <span>
        <FontAwesome name="train" className="train-route-indicator" />
        <span className="route-indicator-text">{routeFound}</span>
      </span>
    );
  }
}

function getFrequentServiceIndicator(routeId: number) {
  const frequentService = get(
    maxLightRail,
    `[${routeId}].frequentService`,
    false
  );

  return <FrequentServiceIndicator frequentService={frequentService} />;
}

export default function RouteIndicator(props: Props) {
  const { routeId, verbose, routeColor = "3D8FAE" } = props;

  return (
    <Link to={`/lines/${routeId}`}>
      <span
        className="route-indicator"
        style={{ backgroundColor: `#${routeColor}` }}
      >
        {getRouteDisplay(routeId, verbose)}
        {getFrequentServiceIndicator(routeId)}
      </span>
    </Link>
  );
}
