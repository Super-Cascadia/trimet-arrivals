import { map } from "lodash";
import React from "react";
import { StopLocation, TrimetRoute } from "../../../api/trimet/types";
import { StopLocationsDictionary } from "../../../store/reducers/stopsReducer";
import "../../nearby/components/NearbyViewComponent.scss";
import StopContainer from "../containers/StopContainer";

interface Props {
  stopLocations: StopLocationsDictionary;
  showArrivals: boolean;
  onRouteIndicatorClick: (route: TrimetRoute) => void;
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
      <div className="stops-wrapper">
        {Stops.getLocationInfo(
          stopLocations,
          showArrivals,
          onRouteIndicatorClick
        )}
      </div>
    );
  }
}
