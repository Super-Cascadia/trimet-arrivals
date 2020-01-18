import React from "react";
import { StopLocationsDictionary } from "../store/reducers/stopsReducer";
import Stops from "../view/stops/components/Stops";

interface Props {
  stopLocations: StopLocationsDictionary;
}

export default function NearbyStopsRoute({ stopLocations }: Props) {
  // tslint:disable-next-line:no-empty
  const onRouteIndicatorClick = () => {};

  return (
    <Stops
      stopLocations={stopLocations}
      showArrivals={false}
      onRouteIndicatorClick={onRouteIndicatorClick}
    />
  );
}
