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
import { Route } from "../../api/trimet/types";
import "./RouteIndicator.scss";

interface Props {
  routeId: number;
  route: Route;
  className?: string;
  onClick: (route: Route) => void;
  verbose?: boolean;
}

function getRouteDisplay(route: number, verboseRouteDisplay: boolean) {
  const routeFound = ROUTE_DISPLAY[route];

  if (!routeFound) {
    if (route) {
      return (
        <span>
          <FontAwesome name="bus" className="train-route-indicator" />
          <span>
            {route} {verboseRouteDisplay && "Bus"}
          </span>
        </span>
      );
    }
    return route || "-";
  } else {
    return (
      <span>
        <FontAwesome name="train" className="train-route-indicator" />
        <span>{routeFound}</span>
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
