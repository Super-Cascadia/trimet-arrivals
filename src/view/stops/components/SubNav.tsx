import React, { Component } from "react";
import {
  SHOW_NEARBY_ROUTES,
  SHOW_NEARBY_STOPS
} from "../../../store/reducers/nearbyViewReducer";
import "./SubNav.scss";

interface Props {
  changeView: (view: string) => void;
  activeView: string;
  stopCount: number;
  routeCount: number;
}

export default class SubNav extends Component<Props> {
  constructor(props) {
    super(props);

    this.showStops = this.showStops.bind(this);
    this.showRoutes = this.showRoutes.bind(this);
  }

  public showStops() {
    this.props.changeView(SHOW_NEARBY_STOPS);
  }

  public showRoutes() {
    this.props.changeView(SHOW_NEARBY_ROUTES);
  }

  public render() {
    const { activeView, stopCount, routeCount } = this.props;

    return (
      <nav className="nearby-routes-nav">
        <ul>
          <li className={activeView === SHOW_NEARBY_STOPS ? "active" : ""}>
            <a onClick={this.showStops}>Stops ({stopCount})</a>
          </li>
          <li className={activeView === SHOW_NEARBY_ROUTES ? "active" : ""}>
            <a onClick={this.showRoutes}>Routes ({routeCount})</a>
          </li>
        </ul>
      </nav>
    );
  }
}
