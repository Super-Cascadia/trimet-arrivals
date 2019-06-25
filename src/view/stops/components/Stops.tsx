import { map } from "lodash";
import React from "react";
import { Route, StopLocation } from "../../../api/trimet/types";
import { StopLocationsDictionary } from "../../../store/reducers/stopsReducer";
import StopContainer from "../containers/StopContainer";
import "../Stops.scss";
import SubNav from "./SubNav";

interface Props {
  stopLocations: StopLocationsDictionary;
  showArrivals: boolean;
  onRouteIndicatorClick: (route: Route) => void;
  stopCount: number;
  routeCount: number;
}

export default class Stops extends React.Component<Props> {
  public static getLocationInfo(
    stopLocations: StopLocationsDictionary,
    showArrivals: boolean,
    onRouteIndicatorClick
  ) {
    return map(stopLocations, (stopLocation: StopLocation, key: number) => {
      return (
        <div className="stop-wrapper">
          <StopContainer
            locationId={key}
            key={key}
            showArrivals={showArrivals}
            onRouteIndicatorClick={onRouteIndicatorClick}
          />
        </div>
      );
    });
  }

  public render() {
    const { stopLocations, showArrivals, onRouteIndicatorClick } = this.props;

    if (!stopLocations) {
      return null;
    }

    return (
      <div>
        <SubNav
          stopCount={this.props.stopCount}
          routeCount={this.props.routeCount}
        />
        <div className="stops-wrapper">
          {Stops.getLocationInfo(
            stopLocations,
            showArrivals,
            onRouteIndicatorClick
          )}
        </div>
      </div>
    );
  }
}
