import { map } from "lodash";
import React from "react";
import FontAwesome from "react-fontawesome";
import { RouteDirectionsDict } from "../../../store/reducers/util/getRoutesFromStopLocations";

function routeDirections(directions: RouteDirectionsDict) {
  return map(directions, (routeDirection, directionId) => {
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

interface Prop {
  directions: RouteDirectionsDict;
}

export default function RouteDirections({ directions }: Prop) {
  return (
    <ul className="route-directions-wrapper">{routeDirections(directions)}</ul>
  );
}
