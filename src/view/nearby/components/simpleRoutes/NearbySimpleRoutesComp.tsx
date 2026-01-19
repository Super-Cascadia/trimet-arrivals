import React from "react";
import { useOutletContext } from "react-router";
import { size } from "lodash";
import { Alert } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import NearbySimpleRoutes from "./NearbySimpleRoutes";
import { NearbyViewComponentOutletContextProps } from "../../context/NearbyViewContext";
import { LocationStatusAlert } from "../nearbyView/LocationStatusAlert";
import { isWithinServiceArea } from "../../util/serviceAreaUtils";

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
    highlightStopMarker,
    onEnableMarkerPlacement,
    isUsingDroppedMarker,
    droppedMarkerLocation,
    handleResetToGeoLocation,
    handlePlaceMarker,
    handlePlaceMarkerInServiceArea,
    handleFlyToCurrentLocation
  } = useOutletContext<NearbyViewComponentOutletContextProps>();

  const stopCount = nearbyStops?.location?.length;
  const routeCount = size(nearbyRoutes);

  // Check if current location is within service area
  const isCurrentLocationOutsideServiceArea = React.useMemo(() => {
    if (!currentLocation || currentLocation.length < 2) return false;
    const [lng, lat] = currentLocation;
    return lng !== undefined && lat !== undefined && !isWithinServiceArea(lat, lng);
  }, [currentLocation]);

  return (
    <div>
      <br />
      {isCurrentLocationOutsideServiceArea && (
        <Alert variant="warning" className="mb-3 py-2 px-3">
          <div className="d-flex align-items-center gap-2">
            <FontAwesome name="exclamation-triangle" className="flex-shrink-0" />
            <div className="flex-grow-1">
              <small>
                <strong>Outside Service Area</strong>
                <br />
                Use map tools to drop marker within coverage zone
              </small>
            </div>
          </div>
        </Alert>
      )}
      {handleResetToGeoLocation && handlePlaceMarker && (
        <LocationStatusAlert
          isUsingDroppedMarker={isUsingDroppedMarker || false}
          droppedMarkerLocation={droppedMarkerLocation || null}
          handleResetToGeoLocation={handleResetToGeoLocation}
          handlePlaceMarker={handlePlaceMarker}
        />
      )}
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
        onEnableMarkerPlacement={onEnableMarkerPlacement}
        onPlaceMarkerInServiceArea={handlePlaceMarkerInServiceArea}
        onFlyToCurrentLocation={handleFlyToCurrentLocation}
      />
    </div>
  );
}
