import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./SubNav.scss";

interface Props {
  stopCount: number;
  routeCount: number;
}

export default class SubNav extends Component<Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    const { stopCount, routeCount } = this.props;

    return (
      <nav className="nearby-routes-nav">
        <ul>
          <li>
            <NavLink to={`/nearby/routes`}>Routes ({routeCount})</NavLink>
          </li>
          <li>
            <NavLink to={`/nearby/stops`}>Stops ({stopCount})</NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}
