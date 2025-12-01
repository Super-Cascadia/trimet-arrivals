import { MutableRefObject, useEffect } from "react";
import { Map } from "mapbox-gl";
import { StopData, Location } from "../../../../api/trimet/interfaces/types";
import { getNearbyRouteIds, getStopLocations } from "../../util/dataUtils";
import { setNearbyStops } from "../../util/mapbox/stopLocationMarker.util";
import { setDroppedMarkerOnMap } from "../../util/mapbox/droppedMarker";
import { setCurrentLocationMarker } from "../../util/mapbox/currentLocation";

/**
 * Hook to handle map theme changes.
 * Re-applies map style and restores layers/markers when theme changes.
 * 
 * @param mapRef - Reference to the Mapbox map instance.
 * @param theme - Current application theme ('light' or 'dark').
 * @param nearbyStops - Current nearby stops data.
 * @param nearbyRoutes - Current nearby routes data.
 * @param isUsingDroppedMarker - Whether a dropped marker is active.
 * @param droppedMarkerLocation - Location of the dropped marker.
 * @param userLocation - Current user location.
 * @param radiusSize - Current search radius.
 * @param handleStopMarkerClick - Callback for stop marker clicks.
 * @param handleDropMarker - Callback for dropped marker placement.
 * @param droppedMarkerRef - Reference to the dropped marker instance.
 * @param setDisplayedRouteIds - Setter for displayed route IDs.
 */
export function useMapTheme(
  mapRef: MutableRefObject<Map>,
  theme: string,
  nearbyStops: StopData | undefined,
  nearbyRoutes: any,
  isUsingDroppedMarker: boolean,
  droppedMarkerLocation: { lng: number, lat: number } | null,
  userLocation: Location | null,
  radiusSize: number,
  handleStopMarkerClick: (data: any) => void,
  handleDropMarker: (lng: number, lat: number) => void,
  droppedMarkerRef: MutableRefObject<any>,
  setDisplayedRouteIds: (ids: string[]) => void
) {
  useEffect(() => {
    if (mapRef.current) {
      const style = theme === "dark"
        ? "mapbox://styles/mapbox/dark-v10"
        : "mapbox://styles/mapbox/streets-v11";
      
      mapRef.current.setStyle(style);
      
      mapRef.current.once('style.load', () => {
        console.log("Map style loaded, restoring layers");
        
        if (nearbyStops) {
          const stopLocations = getStopLocations(nearbyStops);
          const nearbyRouteIds = nearbyRoutes ? getNearbyRouteIds(nearbyRoutes) : {};
          
          setNearbyStops(
            mapRef.current,
            stopLocations,
            Object.keys(nearbyRouteIds),
            handleStopMarkerClick
          );
        }
        
        if (isUsingDroppedMarker && droppedMarkerLocation) {
          droppedMarkerRef.current = setDroppedMarkerOnMap(
            mapRef.current,
            droppedMarkerLocation.lng,
            droppedMarkerLocation.lat,
            radiusSize,
            handleDropMarker
          );
        } else if (userLocation) {
          setCurrentLocationMarker(
            mapRef.current,
            userLocation.coords.longitude,
            userLocation.coords.latitude,
            radiusSize
          );
        }
        
        setDisplayedRouteIds([]);
      });
    }
  }, [theme]);
}
