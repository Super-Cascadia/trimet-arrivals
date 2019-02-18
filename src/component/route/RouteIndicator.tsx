import React from "react";
import cx from "classnames";
import "./RouteIndicator.css";
import FontAwesome from "react-fontawesome";
import {
  BLUE_LINE_NUMBER,
  RED_LINE_NUMBER,
  ROUTE_DISPLAY
} from "../../api/trimet/constants";

interface Props {
  routeId: number;
  className?: string;
}

function getRouteDisplay(route: number) {
  let routeFound = ROUTE_DISPLAY[route];

  if (!routeFound) {
    return route || "-";
  } else {
    return <FontAwesome name="train" />;
  }
}

function getRouteIndicatorClassName(route: number, className: string) {
  return cx("route-indicator", className, {
    "route-indicator-green": route === 123,
    "route-indicator-yellow": route === 123,
    "route-indicator-red": route === RED_LINE_NUMBER,
    "route-indicator-blue": route === BLUE_LINE_NUMBER,
    "route-indicator-orange": route === 123
  });
}

export default class RouteIndicator extends React.PureComponent<Props> {
  static defaultProps = {
    className: ""
  };

  render() {
    const { routeId, className } = this.props;
    const classNames = getRouteIndicatorClassName(routeId, className);

    return <span className={classNames}>{getRouteDisplay(routeId)}</span>;
  }
}
