import React from "react";
import { useOutletContext } from "react-router";
import { size } from "lodash";
import NearbySimpleRoutes from "./NearbySimpleRoutes";
import { NearbyViewComponentOutletContextProps } from "../../context/NearbyViewContext";

export function NearbySimpleRoutesComp() {
  const {
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    minLoadingTime,
    handleRadiusSelectionChange,
    handleSimpleRoutesOpened,
    handleRefresh,
    handleFindNearMe,
    highlightStopMarker
  } = useOutletContext<NearbyViewComponentOutletContextProps>();

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  return (
    <div>
      <br />
      <NearbySimpleRoutes
        nearbyStops={nearbyStops}
        nearbyRoutes={nearbyRoutes}
        radiusSize={radiusSize}
        minLoadingTime={minLoadingTime}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
        handleSimpleRoutesOpened={handleSimpleRoutesOpened}
        routeCount={routeCount}
        stopCount={stopCount}
        handleRefresh={handleRefresh}
        highlightStopMarker={highlightStopMarker}
        handleFindNearMe={handleFindNearMe}
        currentLocation={currentLocation}
      />
    </div>
  );
}
