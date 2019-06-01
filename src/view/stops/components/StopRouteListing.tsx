import { map, split } from "lodash";
import React, { Component } from "react";
import { Route } from "../../../api/trimet/types";
import RouteIndicator from "../../../component/route/RouteIndicator";
import "./StopRouteListing.css";

function getSimpleRouteList(routes: Route[], onClick) {
  return map(routes, (route: Route) => {
    return (
      <RouteIndicator
        key={route.route}
        routeId={route.route}
        route={route}
        onClick={onClick}
        className="header-router-indicator"
      />
    );
  });
}

function getDetailedRouteList(routes: Route[], onClick) {
  return map(routes, (route: Route) => {
    const description = split(route.desc, "-")[1];

    return (
      <li className="route-detail-list-item">
        <RouteIndicator
          key={route.route}
          routeId={route.route}
          route={route}
          onClick={onClick}
          className="header-router-indicator"
        />
        <span className="route-description">
          <span>{description}</span>
          <span className="route-description-divider">-</span>
          <span>{route.dir[0].desc}</span>
        </span>
      </li>
    );
  });
}

interface Props {
  routes: Route[];
  onClick: (route: Route) => void;
}

interface State {
  expanded: boolean;
}

export default class StopRouteListing extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.toggleDetails = this.toggleDetails.bind(this);
  }

  public toggleDetails() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  public render() {
    const { routes, onClick } = this.props;
    const { expanded } = this.state;

    if (expanded) {
      return (
        <div>
          <button onClick={this.toggleDetails}>Details</button>
          <ul className="route-detail-list">
            {getDetailedRouteList(routes, onClick)}
          </ul>
        </div>
      );
    }

    return (
      <div>
        <span className="serving-label">Routes: </span>
        <span className="route-indicators">
          {getSimpleRouteList(routes, onClick)}
        </span>
        <button onClick={this.toggleDetails}>Details</button>
      </div>
    );
  }
}
