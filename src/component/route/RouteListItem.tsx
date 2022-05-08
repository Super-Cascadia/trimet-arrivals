import cx from "classnames";
import { get, isEmpty } from "lodash";
import React from "react";
import { Card, Col } from "react-bootstrap";
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
import { TrimetRoute } from "../../api/trimet/interfaces/types";
import { maxLightRail } from "../../data/trimet/schedules/maxLightRail";
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
  if (isEmpty(route)) {
    return null;
  }

  const routeId = route.route;
  // tslint:disable-next-line:no-empty
  const onClick = () => {};

  const bg = color => {
    // console.log("color", color, route);
    switch (color) {
      case "D81526":
        return "danger";
      case "084C8D":
        return "primary";
      case "F8C213":
        return "warning";
      case "008852":
        return "success";
      case "F58220":
        return "secondary";
      case "0093B2":
        return "info";
      case "000000":
        return "dark";
      case "CE0F69":
        return "light";
      case "84BD00":
        return "light";
      default:
        return "light";
    }
  };

  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title>
            <NavLink to={`/lines/${routeId}`}>
              <RouteIndicator
                routeId={routeId}
                route={undefined}
                verbose={true}
                routeColor={""}
              />
            </NavLink>
            {route.route}
          </Card.Title>
          <Card.Text>{route.desc}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}
