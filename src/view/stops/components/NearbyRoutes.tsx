import cx from "classnames";
import { map } from "lodash";
import React from "react";
import FontAwesome from "react-fontawesome";
import {
  BLUE_LINE_NUMBER,
  GREEN_LINE_NUMBER,
  ORANGE_LINE_NUMBER,
  RED_LINE_NUMBER,
  STREETCAR_A_LOOP,
  STREETCAR_B_LOOP,
  STREETCAR_CL_LINE_SHUTTLE,
  STREETCAR_S_LINE,
  YELLOW_LINE_NUMBER
} from "../../../api/trimet/constants";
import RouteIndicator from "../../../component/route/RouteIndicator";
import {
  RouteAndRouteDirections,
  RouteDirectionDict,
  RouteDirectionsDict
} from "../../../store/reducers/util/getRoutesFromStopLocations";
import "./NearbyRoutes.scss";

interface Props {
  nearbyRoutes: RouteDirectionDict;
}

function getRouteIndicatorClassName(route: number, className: string) {
  const style = {
    "route-blue": route === BLUE_LINE_NUMBER,
    "route-cyan":
      route === STREETCAR_A_LOOP || route === STREETCAR_CL_LINE_SHUTTLE,
    "route-green": route === GREEN_LINE_NUMBER,
    "route-lightgreen": route === STREETCAR_S_LINE,
    "route-orange": route === ORANGE_LINE_NUMBER,
    "route-pink": route === STREETCAR_B_LOOP,
    "route-red": route === RED_LINE_NUMBER,
    "route-yellow": route === YELLOW_LINE_NUMBER
  };

  return cx("nearby-route", className, style);
}

export default class NearbyRoutes extends React.Component<Props> {
  public static getRoutes(routes: RouteDirectionDict) {
    return map(routes, (route: RouteAndRouteDirections) => {
      const classNames = getRouteIndicatorClassName(
        route.routeInfo.id,
        "route-header"
      );

      return (
        <div className={classNames}>
          <h3 className="route-directions-indicator-wrapper">
            <RouteIndicator
              routeId={route.routeInfo.id}
              route={undefined}
              onClick={undefined}
              verbose={true}
            />
          </h3>
          <ul className="route-directions-wrapper">
            {NearbyRoutes.routeDirections(route.routeDirections)}
          </ul>
        </div>
      );
    });
  }

  public static routeDirections(routeDirections: RouteDirectionsDict) {
    return map(routeDirections, (routeDirection, directionId) => {
      return (
        <li className="route-direction">
          <span className="direction-circle-wrapper">
            <FontAwesome name="arrow-circle-right" />
          </span>
          <span>{routeDirection.description}</span>
        </li>
      );
    });
  }

  public render() {
    return (
      <div id="nearby-view-routes">
        {NearbyRoutes.getRoutes(this.props.nearbyRoutes)}
      </div>
    );
  }
}
