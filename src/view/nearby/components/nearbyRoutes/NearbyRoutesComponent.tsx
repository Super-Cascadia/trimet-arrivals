import React from "react";
import { useOutletContext } from "react-router";
import { size } from "lodash";
import NearbyRoutes from "./NearbyRoutes";
import { NearbyViewComponentOutletContextProps } from "../../context/NearbyViewContext";

export function NearbyRoutesComponent() {
  const {
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange,
    handleRefresh,
    handleFindNearMe
  } = useOutletContext<NearbyViewComponentOutletContextProps>();

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  return (
    <NearbyRoutes
      radiusSize={radiusSize}
      nearbyRoutes={nearbyRoutes}
      stopCount={stopCount}
      routeCount={routeCount}
      handleRadiusSelectionChange={handleRadiusSelectionChange}
      handleRefresh={handleRefresh}
      handleFindNearMe={handleFindNearMe}
    />
  );
}
