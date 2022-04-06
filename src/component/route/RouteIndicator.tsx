import React from "react";
import { Badge } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { ROUTE_DISPLAY } from "../../api/trimet/constants";
import { TrimetRoute } from "../../api/trimet/interfaces/types";
import "./RouteIndicator.scss";

const DEFAULT_ROUTE_COLOR = "3D8FAE";

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
        <Badge bg="secondary">
          <FontAwesome name="bus" />
          <span>
            {routeId} {verboseRouteDisplay && "Bus"}
          </span>
        </Badge>
      );
    }
    return routeId || "-";
  } else {
    return (
      <Badge bg="secondary">
        <FontAwesome name="train" />
        <span className="route-indicator-text">{routeFound}</span>
      </Badge>
    );
  }
}

export default function RouteIndicator(props: Props) {
  const { routeId, verbose, routeColor = DEFAULT_ROUTE_COLOR } = props;

  return (
    <Link to={`/lines/${routeId}`}>{getRouteDisplay(routeId, verbose)}</Link>
  );
}
