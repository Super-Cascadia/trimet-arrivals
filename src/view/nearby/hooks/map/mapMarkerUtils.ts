import { MutableRefObject } from "react";
import { Map } from "mapbox-gl";
import { setDroppedMarkerOnMap } from "../../util/mapbox/droppedMarker";
import { setCurrentLocationMarker } from "../../util/mapbox/currentLocation";
import { setNearbyStops } from "../../util/mapbox/stopLocationMarker.util";

/**
 * Updates the location markers on the map (either dropped marker or current location).
 * 
 * @param map - The Mapbox map instance.
 * @param isUsingDroppedMarker - Whether a dropped marker is active.
 * @param droppedMarkerLocation - Location of the dropped marker.
 * @param userLocation - Current user location (or fallback location).
 * @param radiusSize - Current search radius.
 * @param handleDropMarker - Callback for dropped marker placement.
 * @param droppedMarkerRef - Reference to the dropped marker instance.
 */
export function updateLocationMarkers(
  map: Map,
  isUsingDroppedMarker: boolean,
  droppedMarkerLocation: { lng: number, lat: number } | null,
  userLocation: { lng: number, lat: number } | null,
  radiusSize: number,
  handleDropMarker: (lng: number, lat: number) => void,
  droppedMarkerRef: MutableRefObject<any>
) {
  try {
    if (isUsingDroppedMarker && droppedMarkerLocation) {
      droppedMarkerRef.current = setDroppedMarkerOnMap(
        map,
        droppedMarkerLocation.lng,
        droppedMarkerLocation.lat,
        radiusSize,
        handleDropMarker
      );
    } else if (userLocation) {
      setCurrentLocationMarker(
        map,
        userLocation.lng,
        userLocation.lat,
        radiusSize
      );
    }
  } catch (error) {
    console.error("Error updating location markers:", error);
  }
}

/**
 * Updates the stop markers on the map.
 * 
 * @param map - The Mapbox map instance.
 * @param stopLocations - Dictionary of stop locations.
 * @param nearbyRouteIds - Dictionary or array of nearby route IDs.
 * @param handleStopMarkerClick - Callback for stop marker clicks.
 */
export function updateStopMarkers(
  map: Map,
  stopLocations: any,
  nearbyRouteIds: any,
  handleStopMarkerClick: (data: any) => void
) {
  const routeKeys = Array.isArray(nearbyRouteIds) ? nearbyRouteIds : Object.keys(nearbyRouteIds || {});
  
  setNearbyStops(
    map,
    stopLocations,
    routeKeys,
    handleStopMarkerClick
  );
}
