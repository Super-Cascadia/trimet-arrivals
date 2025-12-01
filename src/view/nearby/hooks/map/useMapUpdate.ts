import { MutableRefObject } from "react";
import { Map } from "mapbox-gl";
import { StopData, Location } from "../../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../../api/trimet/stops";
import { getNearbyRouteIds, getStopLocations, processRoutes } from "../../util/dataUtils";
import { removeRoutes } from "../../util/mapbox/routeLines";
import { removeCurrentLocationMarkers, removeStopLocationLayers } from "../../util/mapbox/stopLocationMarker.util";
import { removeDroppedMarker } from "../../util/mapbox/droppedMarker";
import { updateLocationMarkers, updateStopMarkers } from "./mapMarkerUtils";

/**
 * Hook to handle updating the map data and markers.
 * 
 * @param mapRef - Reference to the Mapbox map instance.
 * @param setNearbyStopData - State setter for nearby stops.
 * @param setNearbyRoutesData - State setter for nearby routes.
 * @param handleStopMarkerClick - Callback for when a stop marker is clicked.
 * @param handleDropMarker - Callback for when a marker is dropped/dragged.
 * @returns Object containing the updateMapData function.
 */
export function useMapUpdate(
  mapRef: MutableRefObject<Map>,
  setNearbyStopData: (data: StopData) => void,
  setNearbyRoutesData: (data: any) => void,
  handleStopMarkerClick: (data: any) => void,
  handleDropMarker: (lng: number, lat: number) => void
) {
  
  /**
   * Fetches nearby stops and updates the map markers and layers.
   * 
   * @param searchLocation - The location to search around.
   * @param radiusSize - The radius to search within.
   * @param isUsingDroppedMarker - Whether a dropped marker is being used.
   * @param droppedMarkerLocation - The location of the dropped marker.
   * @param droppedMarkerRef - Reference to the dropped marker instance.
   * @returns Promise resolving to the fetched stop data.
   */
  const updateMapData = (
    searchLocation: Location,
    radiusSize: number,
    isUsingDroppedMarker: boolean,
    droppedMarkerLocation: { lng: number, lat: number } | null,
    droppedMarkerRef: MutableRefObject<any>
  ) => {
    return getNearbyStops(searchLocation, radiusSize)
      .then((stopData: StopData) => {
        const routes = processRoutes(stopData);
        const nearbyRouteIds = getNearbyRouteIds(routes);
        const stopLocations = getStopLocations(stopData);

        if (mapRef.current) {
            removeStopLocationLayers(mapRef.current);
            removeCurrentLocationMarkers(mapRef.current);
            removeDroppedMarker(mapRef.current, droppedMarkerRef.current);
            removeRoutes(mapRef.current, Object.keys(nearbyRouteIds));

            setNearbyStopData(stopData);
            setNearbyRoutesData(routes);
            
            updateStopMarkers(
              mapRef.current,
              stopLocations,
              nearbyRouteIds,
              handleStopMarkerClick
            );
            
            updateLocationMarkers(
              mapRef.current,
              isUsingDroppedMarker,
              droppedMarkerLocation,
              { lng: searchLocation.coords.longitude, lat: searchLocation.coords.latitude },
              radiusSize,
              handleDropMarker,
              droppedMarkerRef
            );
        }

        return stopData;
      });
  };

  return { updateMapData };
}
