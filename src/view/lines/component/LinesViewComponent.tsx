import { isEmpty } from "lodash";
import React from "react";
import FontAwesome from "react-fontawesome";
import { NavLink } from "react-router-dom";
import { LinesViewSubRoutes } from "../../../routes/LinesSubRoutes";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import "./LinesViewComponent.scss";

interface Props {
  loadAllRoutes: () => {};
  routes: RouteDataDictionary;
}

export default class LinesViewComponent extends React.Component<Props> {
  private static getRouteNav() {
    return (
      <nav className="nearby-routes-nav lines-view-nav">
        <NavLink to="/lines">
          <FontAwesome className="route" name="route" />
          All
        </NavLink>
        <NavLink to="/lines/max">
          <FontAwesome className="train" name="train" />
          Max
        </NavLink>
        <NavLink to="/lines/streetcar">
          <FontAwesome className="train" name="train" />
          Streetcar
        </NavLink>
        <NavLink to="/lines/bus">
          <FontAwesome className="bus" name="bus" />
          Bus
        </NavLink>
        <NavLink to="/lines/wes">
          <FontAwesome className="subway" name="subway" />
          WES
        </NavLink>
        <NavLink to="/lines/tram">
          <FontAwesome className="tram" name="tram" />
          Tram
        </NavLink>
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
