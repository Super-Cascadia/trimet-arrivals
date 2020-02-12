import cx from "classnames";
import React from "react";
import FontAwesome from "react-fontawesome";
import {
  BLUE_LINE_NUMBER,
  GREEN_LINE_NUMBER,
  ORANGE_LINE_NUMBER,
  RED_LINE_NUMBER,
  ROUTE_DISPLAY,
  STREETCAR_A_LOOP,
  STREETCAR_B_LOOP,
  STREETCAR_CL_LINE_SHUTTLE,
  STREETCAR_S_LINE,
  YELLOW_LINE_NUMBER
} from "../../api/trimet/constants";
import { TrimetRoute } from "../../api/trimet/interfaces/types";
import "./RouteIndicator.scss";

interface Props {
  routeId: number;
  route: TrimetRoute;
  className?: string;
  onClick: (route: TrimetRoute) => void;
  verbose?: boolean;
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

function getRouteIndicatorClassName(route: number, className: string) {
  const style = {
    "route-indicator-blue": route === BLUE_LINE_NUMBER,
    "route-indicator-cyan":
      route === STREETCAR_A_LOOP || route === STREETCAR_CL_LINE_SHUTTLE,
    "route-indicator-green": route === GREEN_LINE_NUMBER,
    "route-indicator-lightgreen": route === STREETCAR_S_LINE,
    "route-indicator-orange": route === ORANGE_LINE_NUMBER,
    "route-indicator-pink": route === STREETCAR_B_LOOP,
    "route-indicator-red": route === RED_LINE_NUMBER,
    "route-indicator-yellow": route === YELLOW_LINE_NUMBER
  };

  return cx("route-indicator", className, style);
}

export default class RouteIndicator extends React.PureComponent<Props> {
  private onClick: () => void;

  constructor(props) {
    super(props);

    this.onClick = () => this.props.onClick(this.props.route);
  }

  public render() {
    const { routeId, className, verbose } = this.props;
    const classNames = getRouteIndicatorClassName(routeId, className);

    return (
      <span className={classNames} onClick={this.onClick}>
        {getRouteDisplay(routeId, verbose)}
      </span>
    );
  }
}
