import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import "./NearbySubNav.scss";

interface Props {
  stopCount: number;
  routeCount: number;
}

export default function NearbySubNav({ stopCount, routeCount }: Props) {
  const { url } = useRouteMatch();

  return (
    <nav className="nearby-routes-nav">
      <ul>
        <li>
          <Link to={`${url}/routes`}>Routes ({routeCount})</Link>
        </li>
        <li>
          <Link to={`${url}/stops`}>Stops ({stopCount})</Link>
        </li>
      </ul>
    </nav>
  );
}
