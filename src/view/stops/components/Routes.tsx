import React from "react";
import { RouteDirection } from "../../../store/reducers/stopsReducer";

interface Props {
  nearbyRoutes: RouteDirection[];
}

export default class Routes extends React.Component<Props> {
  public render() {
    return (
      <div id="nearby-view-routes">
        <span>Routes go here</span>
      </div>
    );
  }
}
