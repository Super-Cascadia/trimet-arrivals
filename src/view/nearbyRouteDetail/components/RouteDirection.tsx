import _ from "lodash";
import React from "react";
import {
  RouteDirectionStop,
  RouteStopDirection
} from "../../../api/trimet/interfaces/routes";
import "./NearbyRouteDetail.scss";

interface Props {
  direction: RouteStopDirection;
}

interface State {
  open: boolean;
}

export default class RouteDirection extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.toggleOpenState = this.toggleOpenState.bind(this);
  }

  public toggleOpenState() {
    const { open } = this.state;
    this.setState({ open: !open });
  }

  public render() {
    const { direction } = this.props;
    const { open } = this.state;

    return (
      <div>
        <div className="route-directions-header">
          {direction.desc}
          <button onClick={this.toggleOpenState}>
            {open ? "Close" : "Open"}
          </button>
        </div>
        {open && <ul>{this.getRouteDirectionStops(direction.stop)}</ul>}
      </div>
    );
  }

  public getRouteDirectionStops(stops: RouteDirectionStop[]) {
    return _.map(stops, stop => {
      return (
        <li>
          {stop.desc}
          {stop.locid}
          {stop.dir}
        </li>
      );
    });
  }
}
