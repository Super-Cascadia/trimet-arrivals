import { map } from "lodash";
import React from "react";
import FontAwesome from "react-fontawesome";
import { RouteStopDirection } from "../../../api/trimet/interfaces/routes";

function routeDirections(directions: RouteStopDirection[]) {
  return map(directions, routeDirection => {
    return (
      <li className="route-direction">
        <span className="direction-circle-wrapper">
          <FontAwesome name="arrow-circle-right" />
        </span>
        <span>{routeDirection.desc}</span>
      </li>
    );
  });
}

interface Prop {
  directions: RouteStopDirection[];
}

export default function RouteDirections({ directions }: Prop) {
  return (
    <ul className="route-directions-wrapper">{routeDirections(directions)}</ul>
  );
}
