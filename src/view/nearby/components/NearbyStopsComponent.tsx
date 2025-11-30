import React from "react";
import { useOutletContext } from "react-router";
import { size } from "lodash";
import NearbyStops from "./NearbyStops";
import { NearbyViewComponentOutletContextProps } from "../context/NearbyViewContext";

export function NearbyStopsComponent() {
  const {
    currentLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    handleRadiusSelectionChange,
    handleSimpleRoutesOpened,
    handleRefresh,
    handleFindNearMe,
    highlightStopMarker
  } = useOutletContext<NearbyViewComponentOutletContextProps>();

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  // Add stop markers when component mounts or nearbyStops changes
  React.useEffect(() => {
    if (nearbyStops?.location && nearbyStops.location.length > 0) {
      console.log('[NearbyStopsComponent] Setting up stop markers, stops count:', nearbyStops.location.length);
      const labeledStops = nearbyStops.location.map(stop => ({
        locid: stop.locid,
        label: stop.locid.toString(),
        lng: stop.lng,
        lat: stop.lat
      }));
      // Use a small delay to ensure map is fully ready
      setTimeout(() => {
        handleSimpleRoutesOpened(labeledStops);
      }, 100);
    }
  }, [nearbyStops]);
  return (
    <div>
      <br />
      <NearbyStops
        currentLocation={currentLocation}
        radiusSize={radiusSize}
        nearbyStops={nearbyStops}
        stopCount={stopCount}
        routeCount={routeCount}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
        handleRefresh={handleRefresh}
        handleFindNearMe={handleFindNearMe}
        highlightStopMarker={highlightStopMarker}
      />
    </div>
  );
}
