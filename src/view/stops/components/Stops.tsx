import { map } from "lodash";
import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import { StopLocationsDictionary } from "../../../store/reducers/stopsReducer";
import StopContainer from "../StopContainer";
import "../Stops.css";

interface Props {
  stopLocations: StopLocationsDictionary;
  showArrivals: boolean;
}

class Stops extends React.Component<Props> {
  public static getLocationInfo(
    stopLocations: StopLocationsDictionary,
    showArrivals: boolean
  ) {
    return map(stopLocations, (stopLocation: StopLocation, key: number) => {
      return (
        <StopContainer locationId={key} key={key} showArrivals={showArrivals} />
      );
    });
  }

  public render() {
    const { stopLocations, showArrivals } = this.props;

    if (!stopLocations) {
      return null;
    }

    return (
      <div className="stops-wrapper">
        {Stops.getLocationInfo(stopLocations, showArrivals)}
      </div>
    );
  }
}

export default Stops;
