import { map } from "lodash";
import React from "react";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import "../../nearby/components/NearbyViewComponent.scss";
import StopContainer from "../containers/StopContainer";

interface Props {
  stopLocations: StopLocationsDictionary;
}

function getLocationInfo(stopLocations: StopLocationsDictionary) {
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

export default function NearbyStops(props: Props) {
  const { stopLocations } = props;

  if (!stopLocations) {
    return null;
  }

  return <div className="stops-wrapper">{getLocationInfo(stopLocations)}</div>;
}
