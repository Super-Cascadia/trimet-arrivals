import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Location } from "../../../../api/trimet/interfaces/types";
import geoLocateCurrentPosition from "../../../../api/geolocation/geoLocateCurrentPosition";
import { TRIMET_CENTER_LAT, TRIMET_CENTER_LNG, TRIMET_ZOOM } from "../../constants/mapConstants";
import { logger } from "../../../../api/util/logger";

/**
 * Hook to manage user location and dropped marker state.
 * 
 * @returns Location state and helpers
 */
export function useMapLocation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [userLocation, setUserLocation] = useState<Location>(undefined);
  const [droppedMarkerLocation, setDroppedMarkerLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [isUsingDroppedMarker, setIsUsingDroppedMarker] = useState(false);
  const [hasLocationError, setHasLocationError] = useState(false);

  const currentLocation = useMemo(() => [
    userLocation?.coords?.longitude,
    userLocation?.coords?.latitude
  ], [userLocation]);

  // Use dropped marker location if available, otherwise use geo location.
  // If no location is available, return null to indicate service area view
  const activeLocation = useMemo(() => {
    if (isUsingDroppedMarker && droppedMarkerLocation) {
      return [droppedMarkerLocation.lng, droppedMarkerLocation.lat];
    }
    
    if (currentLocation[0] !== undefined && currentLocation[1] !== undefined) {
      return currentLocation;
    }
    
    // Return null to indicate no location is set
    return [undefined, undefined];
  }, [isUsingDroppedMarker, droppedMarkerLocation, currentLocation]);

  const lng = activeLocation[0];
  const lat = activeLocation[1];

  // Initial location load
  useEffect(() => {
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    logger.debug('[useMapLocation] Initializing location', { latParam, lngParam });

    // If URL params exist, use them as dropped marker
    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);

      if (!isNaN(lat) && !isNaN(lng)) {
        logger.info('[useMapLocation] Loading location from URL params', { lat, lng });
        setDroppedMarkerLocation({ lng, lat });
        setIsUsingDroppedMarker(true);
      }
    }

    // Always try to get real user location
    geoLocateCurrentPosition()
      .then((location: Location) => {
        logger.info('[useMapLocation] Successfully obtained user geolocation', {
          lat: location?.coords?.latitude,
          lng: location?.coords?.longitude
        });
        setUserLocation(location);
        setHasLocationError(false);
        // If no URL params exist, set them from the geolocation
        if (!latParam || !lngParam) {
          if (location?.coords?.latitude && location?.coords?.longitude) {
            logger.debug('[useMapLocation] Setting URL params from geolocation');
            setSearchParams({
              lat: location.coords.latitude.toString(),
              lng: location.coords.longitude.toString()
            });
          }
        }
      })
      .catch((error) => {
        logger.error('[useMapLocation] Error getting user location', error);
        setHasLocationError(true);
      });
  }, []);

  return {
    userLocation,
    setUserLocation,
    droppedMarkerLocation,
    setDroppedMarkerLocation,
    isUsingDroppedMarker,
    setIsUsingDroppedMarker,
    activeLocation,
    lng: activeLocation[0] ?? TRIMET_CENTER_LNG,
    lat: activeLocation[1] ?? TRIMET_CENTER_LAT,
    setSearchParams,
    hasLocationError,
    triMetCenterLng: TRIMET_CENTER_LNG,
    triMetCenterLat: TRIMET_CENTER_LAT,
    triMetZoom: TRIMET_ZOOM
  };
}
