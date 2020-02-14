import cx from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";
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
} from "../../api/trimet/constants";
import { TrimetRoute } from "../../api/trimet/interfaces/routes";
import RouteDirections from "../../view/nearbyRoutes/component/RouteDirections";
import RouteIndicator from "./RouteIndicator";

export function getRouteIndicatorClassName(route: number, className: string) {
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

export default function RouteListItem({ route }: { route: TrimetRoute }) {
  const routeId = route.id;
  const classNames = getRouteIndicatorClassName(routeId, "route-header");

  // tslint:disable-next-line:no-empty
  const onClick = () => {};

  return (
    <div
      className={classNames}
      style={{ backgroundColor: `#${route.routeColor}` }}
    >
      <h3 className="route-directions-indicator-wrapper">
        <NavLink to={`/lines/${routeId}`}>
          <RouteIndicator
            routeId={routeId}
            route={undefined}
            onClick={onClick}
            verbose={true}
          />
        </NavLink>
        <RouteDirections directions={route.dir} />
      </h3>
    </div>
  );
}
