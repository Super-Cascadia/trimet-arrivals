import cx from "classnames";
import { get } from "lodash";
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
import { maxLightRail } from "../../data/trimet/schedules/maxLightRail";
import RouteDirections from "../../view/nearbyRoutes/component/RouteDirections";
import FrequentServiceIndicator from "./FrequentServiceIndicator";
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

function getFrequentServiceIndicator(routeId: number) {
  const frequentService = get(
    maxLightRail,
    `[${routeId}].frequentService`,
    false
  );

  return (
    <div className="route-indicator-schedule-wrapper">
      <FrequentServiceIndicator
        small={true}
        frequentService={frequentService}
      />
    </div>
  );
}

export default function RouteListItem({ route }: { route: TrimetRoute }) {
  const routeId = route.id;
  // tslint:disable-next-line:no-empty
  const onClick = () => {};

  return (
    <div
      className="route-header nearby-route"
      style={{ backgroundColor: `#${route.routeColor}` }}
    >
      <div>
        <h3 className="route-directions-indicator-wrapper">
          <NavLink to={`/lines/${routeId}`}>
            <RouteIndicator
              routeId={routeId}
              route={undefined}
              verbose={true}
              routeColor={route.routeColor}
            />
          </NavLink>
        </h3>
        <RouteDirections directions={route.dir} />
      </div>
      {getFrequentServiceIndicator(routeId)}
    </div>
  );
}
