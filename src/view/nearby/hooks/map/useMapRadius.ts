import { MutableRefObject, useEffect } from "react";
import { Map } from "mapbox-gl";
import { Location } from "../../../../api/trimet/interfaces/types";
import { setMapZoom } from "../../util/mapbox/mapZoom";

/**
 * Hook to handle map radius changes.
 * Updates the map zoom and fetches new data when the search radius changes.
 * 
 * @param mapRef - Reference to the Mapbox map instance.
 * @param radiusSize - The new radius size.
 * @param isOnRouteDetailPage - Function to check if on route detail page.
 * @param isUsingDroppedMarker - Whether a dropped marker is active.
 * @param droppedMarkerLocation - Location of the dropped marker.
 * @param userLocation - Current user location.
 * @param fetchInitialData - Function to fetch initial data.
 * @param isRadiusChanging - Ref indicating if radius is currently changing.
 * @param setZoom - Setter for zoom level.
 * @param updateMapData - Function to update map data.
 * @param droppedMarkerRef - Reference to the dropped marker instance.
 */
export function useMapRadius(
  mapRef: MutableRefObject<Map>,
  radiusSize: number,
  isOnRouteDetailPage: () => boolean,
  isUsingDroppedMarker: boolean,
  droppedMarkerLocation: { lng: number, lat: number } | null,
  userLocation: Location | null,
  fetchInitialData: (loc: Location) => Promise<any>,
  isRadiusChanging: MutableRefObject<boolean>,
  setZoom: (zoom: number) => void,
  updateMapData: (loc: Location, radius: number, isUsingDropped: boolean, droppedLoc: any, droppedRef: any) => Promise<any>,
  droppedMarkerRef: MutableRefObject<any>
) {
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (isOnRouteDetailPage()) {
      console.log("Skipping radius change update - on route detail page");
      return;
    }
    
    const currentPath = window.location.pathname;
    if (currentPath === '/nearby/simple-routes' || currentPath.includes('/trimet-arrivals/nearby/simple-routes') ||
        currentPath === '/nearby/stops' || currentPath.includes('/trimet-arrivals/nearby/stops')) {
      console.log("Skipping radius change update - on simple routes or stops page, updating data only");
      const searchLocation = isUsingDroppedMarker && droppedMarkerLocation
        ? {
            ...userLocation,
            coords: {
              ...userLocation?.coords,
              latitude: droppedMarkerLocation.lat,
              longitude: droppedMarkerLocation.lng
            }
          }
        : userLocation;
      
      if (searchLocation) {
        fetchInitialData(searchLocation);
      }
      return;
    }
    
    console.log("radius size change", radiusSize);
    
    isRadiusChanging.current = true;
    setMapZoom(mapRef, radiusSize, setZoom);

    const searchLocation = isUsingDroppedMarker && droppedMarkerLocation
      ? {
          ...userLocation,
          coords: {
            ...userLocation?.coords,
            latitude: droppedMarkerLocation.lat,
            longitude: droppedMarkerLocation.lng
          }
        }
      : userLocation;

    if (searchLocation) {
      updateMapData(searchLocation, radiusSize, isUsingDroppedMarker, droppedMarkerLocation, droppedMarkerRef)
        .then(() => {
          setTimeout(() => {
            isRadiusChanging.current = false;
          }, 500);
        })
        .catch((error) => {
          console.error("Error updating radius:", error);
          isRadiusChanging.current = false;
        });
    }
  }, [radiusSize]);
}
