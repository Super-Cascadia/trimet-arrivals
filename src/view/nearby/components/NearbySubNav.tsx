import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

export default function NearbySubNav() {
  const { url } = useRouteMatch();

  return (
    <nav className="nearby-routes-nav">
      <ul>
        <li>
          <Link to={`${url}/routes`}>Routes</Link>
        </li>
        <li>
          <Link to={`${url}/stops`}>Stops</Link>
        </li>
      </ul>
    </nav>
  );
}
