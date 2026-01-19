import { MutableRefObject } from "react";
import { Map } from "mapbox-gl";
import { Location } from "../../../../api/trimet/interfaces/types";
import { calculateRadiusFromMap } from "../../util/mapbox/mapCalculations";
import { removeDroppedMarker } from "../../util/mapbox/droppedMarker";
import { removeCurrentLocationMarkers } from "../../util/mapbox/stopLocationMarker.util";
import { updateLocationMarkers } from "./mapMarkerUtils";
import { TRIMET_CENTER_LAT, TRIMET_CENTER_LNG } from "../../../../view/nearby/constants/mapConstants";

/**
 * Hook to handle user interactions with the map.
 * 
 * @param mapRef - Reference to the Mapbox map instance.
 * @param userLocation - The current user location.
 * @param isUsingDroppedMarker - Whether a dropped marker is active.
 * @param setIsUsingDroppedMarker - Setter for isUsingDroppedMarker.
 * @param setDroppedMarkerLocation - Setter for droppedMarkerLocation.
 * @param setSearchParams - Setter for URL search params.
 * @param droppedMarkerRef - Reference to the dropped marker.
 * @param fetchInitialData - Function to fetch initial data.
 * @param flyToCenter - Function to center the map.
 * @param setRadiusSize - Setter for radius size.
 * @param updateMapData - Function to update map data.
 * @param setNearbyStopData - Setter for nearby stops (used for clearing).
 * @param setNearbyRoutesData - Setter for nearby routes (used for clearing).
 * @returns Object containing interaction handlers.
 */
export function useMapInteractions(
    mapRef: MutableRefObject<Map>,
    userLocation: Location | null,
    isUsingDroppedMarker: boolean,
    setIsUsingDroppedMarker: (using: boolean) => void,
    setDroppedMarkerLocation: (loc: { lng: number, lat: number } | null) => void,
    setSearchParams: (params: any) => void,
    droppedMarkerRef: MutableRefObject<any>,
    fetchInitialData: (loc: Location) => Promise<any>,
    flyToCenter: (lng: number, lat: number) => void,
    setRadiusSize: (size: number) => void,
    updateMapData: (loc: Location, radius: number, isUsingDropped: boolean, droppedLoc: any, droppedRef: any) => Promise<any>,
    setNearbyStopData: (data: any) => void,
    setNearbyRoutesData: (data: any) => void,
    handleDropMarker: (lng: number, lat: number) => void
) {

    /**
     * Resets the map to the user's geolocation.
     * 
     * @param radiusSize - The current radius size.
     */
    function handleResetToGeoLocation(radiusSize: number, handleDropMarker: (lng: number, lat: number) => void) {
        console.log("Resetting to geo location");
        setIsUsingDroppedMarker(false);
        setDroppedMarkerLocation(null);
        setSearchParams({});
        
        if (userLocation) {
          removeDroppedMarker(mapRef.current, droppedMarkerRef.current);
          fetchInitialData(userLocation).catch((error) => {
            console.error("Error resetting to geo location:", error);
          });
          
          if (mapRef.current) {
            removeCurrentLocationMarkers(mapRef.current);
            updateLocationMarkers(
              mapRef.current,
              false,
              null,
              { lng: userLocation.coords.longitude, lat: userLocation.coords.latitude },
              radiusSize,
              handleDropMarker,
              droppedMarkerRef
            );
            flyToCenter(userLocation.coords.longitude, userLocation.coords.latitude);
          }
        }
    }

    /**
     * Places a marker at the center of the map.
     * 
     * @param handleDropMarker - Callback to execute when marker is placed.
     */
    function handlePlaceMarker(handleDropMarker: (lng: number, lat: number) => void) {
        if (!mapRef.current || !userLocation) return;
        const center = mapRef.current.getCenter();
        handleDropMarker(center.lng, center.lat);
    }

    /**
     * Refreshes the data for the current location.
     */
    function handleRefresh() {
        console.log("handle refresh");
        if (userLocation) {
          setNearbyStopData(undefined);
          setNearbyRoutesData(undefined);
          fetchInitialData(userLocation).catch((error) => {
            console.error("Error refreshing data:", error);
          });
        }
    }

    /**
     * Finds stops near the current map center.
     * 
     * @param isOnRouteDetailPage - Function to check if on route detail page.
     */
    function handleFindNearMe(isOnRouteDetailPage: () => boolean) {
        console.log("find near me clicked");
        
        if (isUsingDroppedMarker) {
          setIsUsingDroppedMarker(false);
          setDroppedMarkerLocation(null);
          setSearchParams({});
          if (mapRef.current) {
            removeDroppedMarker(mapRef.current, droppedMarkerRef.current);
          }
        }
        
        if (!mapRef.current || !userLocation) return;
        
        if (isOnRouteDetailPage()) return;
        
        const distanceFeet = calculateRadiusFromMap(mapRef.current);
        const newRadius = Math.round(distanceFeet);
        
        console.log("Calculated search radius:", distanceFeet, "feet");
        
        setRadiusSize(newRadius);
        flyToCenter(userLocation.coords.longitude, userLocation.coords.latitude);
        
        updateMapData(userLocation, newRadius, false, null, droppedMarkerRef)
          .catch((error) => {
            console.error("Error finding near me:", error);
          });
    }

    return {
        handleResetToGeoLocation,
        handlePlaceMarker,
        handleRefresh,
        handleFindNearMe,
        handlePlaceMarkerInServiceArea: () => {
            if (!mapRef.current) return;
            // Place marker at the center of TriMet service area
            flyToCenter(TRIMET_CENTER_LNG, TRIMET_CENTER_LAT);
            handleDropMarker(TRIMET_CENTER_LNG, TRIMET_CENTER_LAT);
        },
        handleFlyToCurrentLocation: () => {
            if (!mapRef.current || !userLocation) return;
            // Fly to the user's current location
            flyToCenter(userLocation.coords.longitude, userLocation.coords.latitude);
        }
    };
}
