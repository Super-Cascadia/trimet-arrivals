import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import "./NearbySubNav.scss";

interface Props {
  stopCount: number;
  routeCount: number;
}

export default function NearbySubNav({ stopCount, routeCount }: Props) {
  const { url } = useRouteMatch();

  return (
    <nav className="nearby-routes-nav">
      <NavLink to={`${url}/routes`}>Routes ({routeCount})</NavLink>
      <NavLink to={`${url}/stops`}>Stops ({stopCount})</NavLink>
    </nav>
  );
}
