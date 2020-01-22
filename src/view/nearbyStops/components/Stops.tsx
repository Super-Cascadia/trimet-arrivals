import { map } from "lodash";
import React from "react";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import "../../nearby/components/NearbyViewComponent.scss";
import StopContainer from "../containers/StopContainer";

interface Props {
  stopLocations: StopLocationsDictionary;
}

export default class Stops extends React.Component<Props> {
  public static getLocationInfo(stopLocations: StopLocationsDictionary) {
    // tslint:disable-next-line:no-empty
    const onRouteIndicatorClick = () => {};

    return map(stopLocations, (stopLocation: StopLocation, key: number) => {
      return (
        <div className="stop-wrapper">
          <StopContainer
            locationId={key}
            key={key}
            showArrivals={false}
            onRouteIndicatorClick={onRouteIndicatorClick}
          />
        </div>
      );
    });
  }

  public render() {
    const { stopLocations } = this.props;

    if (!stopLocations) {
      return null;
    }

    return (
      <div className="stops-wrapper">
        {Stops.getLocationInfo(stopLocations)}
      </div>
    );
  }
}
