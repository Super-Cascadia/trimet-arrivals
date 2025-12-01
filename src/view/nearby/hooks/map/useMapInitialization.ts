import { MutableRefObject } from "react";
import { Map } from "mapbox-gl";
import { initializeMap } from "../../util/mapbox/initializeMap";
import { setDroppedMarkerOnMap } from "../../util/mapbox/droppedMarker";
import { setCurrentLocationMarker } from "../../util/mapbox/currentLocation";

/**
 * Hook to handle map initialization.
 * 
 * @param mapRef - Reference to the Mapbox map instance.
 * @param mapContainerRef - Reference to the map container element.
 * @param lng - Initial longitude.
 * @param lat - Initial latitude.
 * @param zoom - Initial zoom level.
 * @param theme - Current theme.
 * @param isUsingDroppedMarker - Whether a dropped marker is active.
 * @param droppedMarkerLocation - Location of the dropped marker.
 * @param radiusSize - Current search radius.
 * @param handleDropMarker - Callback for dropped marker placement.
 * @param droppedMarkerRef - Reference to the dropped marker instance.
 * @param setZoom - Setter for zoom level.
 * @param isRadiusChanging - Ref indicating if radius is currently changing.
 * @param zoomTimeoutRef - Ref for zoom debounce timeout.
 * @param handleZoomSearchUpdate - Callback to update search after zoom.
 * @returns Object containing the initializeMapboxMap function.
 */
export function useMapInitialization(
  mapRef: MutableRefObject<Map>,
  mapContainerRef: MutableRefObject<any>,
  lng: number,
  lat: number,
  zoom: number,
  theme: string,
  isUsingDroppedMarker: boolean,
  droppedMarkerLocation: { lng: number, lat: number } | null,
  radiusSize: number,
  handleDropMarker: (lng: number, lat: number) => void,
  droppedMarkerRef: MutableRefObject<any>,
  setZoom: (zoom: number) => void,
  isRadiusChanging: MutableRefObject<boolean>,
  zoomTimeoutRef: MutableRefObject<NodeJS.Timeout | null>,
  handleZoomSearchUpdate: () => void
) {
  function initializeMapboxMap() {
    console.log("initialize map", lng, lat, zoom);
    mapRef.current = initializeMap(lng, lat, mapContainerRef, zoom, theme as "light" | "dark");

    mapRef.current.on("load", () => {
      console.info("effect: initialize map markers and routes");
      
      if (isUsingDroppedMarker && droppedMarkerLocation) {
        droppedMarkerRef.current = setDroppedMarkerOnMap(
          mapRef.current,
          droppedMarkerLocation.lng,
          droppedMarkerLocation.lat,
          radiusSize,
          handleDropMarker
        );
      } else {
        setCurrentLocationMarker(
          mapRef.current,
          lng,
          lat,
          radiusSize
        );
      }
    });

    mapRef.current.on("zoomend", () => {
      const currentZoom = mapRef.current.getZoom();
      setZoom(currentZoom);
      
      if (isRadiusChanging.current) {
        console.log("Skipping zoom update - radius is changing");
        return;
      }
      
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
      
      zoomTimeoutRef.current = setTimeout(() => {
        handleZoomSearchUpdate();
      }, 2000);
    });
  }

  return { initializeMapboxMap };
}
