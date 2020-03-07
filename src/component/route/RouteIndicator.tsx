import React from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { ROUTE_DISPLAY } from "../../api/trimet/constants";
import { TrimetRoute } from "../../api/trimet/interfaces/types";
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

export default class RouteIndicator extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    const { routeId, verbose, routeColor = "3D8FAE" } = this.props;

    return (
      <Link to={`/lines/${routeId}`}>
        <span
          className="route-indicator"
          style={{ backgroundColor: `#${routeColor}` }}
        >
          {getRouteDisplay(routeId, verbose)}
        </span>
      </Link>
    );
  }
}
