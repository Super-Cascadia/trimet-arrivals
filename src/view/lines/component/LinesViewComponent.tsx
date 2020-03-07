import { isEmpty } from "lodash";
import React from "react";
import { NavLink } from "react-router-dom";
import { LinesViewSubRoutes } from "../../../routes/LinesSubRoutes";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";

interface Props {
  loadAllRoutes: () => {};
  routes: RouteDataDictionary;
}

export default class LinesViewComponent extends React.Component<Props> {
  private static getRouteNav() {
    return (
      <nav>
        <NavLink to="/lines">All</NavLink>
        <NavLink to="/lines/max">Max</NavLink>
        <NavLink to="/lines/streetcar">Streetcar</NavLink>
        <NavLink to="/lines/bus">Bus</NavLink>
        <NavLink to="/lines/wes">WES Rail</NavLink>
        <NavLink to="/lines/tram">Aerial Tram</NavLink>
      </nav>
    );
  }

  public componentDidMount(): void {
    this.props.loadAllRoutes();
  }

  public render() {
    const { routes } = this.props;

    if (isEmpty(routes)) {
      return "Loading...";
    }

    return (
      <div id="lines-view">
        {LinesViewComponent.getRouteNav()}
        <LinesViewSubRoutes routes={routes} />
      </div>
    );
  }
}
