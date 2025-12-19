import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Location } from "../../../../api/trimet/interfaces/types";
import geoLocateCurrentPosition from "../../../../api/geolocation/geoLocateCurrentPosition";

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

  const currentLocation = useMemo(() => [
    userLocation?.coords?.longitude,
    userLocation?.coords?.latitude
  ], [userLocation]);

  // Use dropped marker location if available, otherwise use geo location
  const activeLocation = useMemo(() => isUsingDroppedMarker && droppedMarkerLocation
    ? [droppedMarkerLocation.lng, droppedMarkerLocation.lat]
    : currentLocation, [isUsingDroppedMarker, droppedMarkerLocation, currentLocation]);

  const lng = activeLocation[0];
  const lat = activeLocation[1];

  // Initial location load
  useEffect(() => {
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);

      if (!isNaN(lat) && !isNaN(lng)) {
        setDroppedMarkerLocation({ lng, lat });
        setIsUsingDroppedMarker(true);
        
        // Also try to get real user location in background
        geoLocateCurrentPosition()
          .then((location: Location) => {
            setUserLocation(location);
          })
          .catch((error) => {
            console.error("Error getting user location:", error);
          });
      }
    } else {
      geoLocateCurrentPosition()
        .then((location: Location) => {
          setUserLocation(location);
        })
        .catch((error) => {
          console.error("Error getting user location:", error);
        });
    }
  }, []);

  return {
    userLocation,
    setUserLocation,
    droppedMarkerLocation,
    setDroppedMarkerLocation,
    isUsingDroppedMarker,
    setIsUsingDroppedMarker,
    activeLocation,
    lng,
    lat,
    setSearchParams
  };
}
