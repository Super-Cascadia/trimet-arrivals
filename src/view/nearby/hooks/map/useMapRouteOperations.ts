import { MutableRefObject, useState } from "react";
import { Map } from "mapbox-gl";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";
import { LabeledStop } from "../../../../api/trimet/interfaces/types";
import { NearbyRoutesDictionary } from "../../../../store/reducers/view/nearbyRoutesViewReducer";
import { setRoutes as setRoutesOnMap, removeRoutes } from "../../util/mapbox/routeLines";
import { drawRouteStopMarkers, removeRouteStopMarkers } from "../../util/mapbox/routeStopMarkers";
import { drawRouteSegment, removeRouteSegment } from "../../util/mapbox/routeSegments";
import { removeStopLocationLayers, setLabeledStops, setNearbyStops, updateStopMarkerColor, removeCurrentLocationMarkers } from "../../util/mapbox/stopLocationMarker.util";

/**
 * Hook to manage route and stop operations on the map.
 * 
 * @param mapRef Reference to the Mapbox map instance
 * @param nearbyRouteIds Dictionary of nearby route IDs
 * @param stopLocations Dictionary of stop locations
 * @param handleStopMarkerClick Callback for stop marker click
 * @returns Route operation handlers
 */
export function useMapRouteOperations(
  mapRef: MutableRefObject<Map>,
  nearbyRouteIds: any,
  stopLocations: any,
  handleStopMarkerClick: (data: any) => void
) {
  const [displayedRouteIds, setDisplayedRouteIds] = useState<string[]>([]);

  /**
   * Animates the map to center on the specified coordinates.
   * 
   * @param lng - Longitude to center on.
   * @param lat - Latitude to center on.
   */
  function flyToCenter(lng: number, lat: number) {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        essential: true
      });
    }
  }

  /**
   * Adjusts the map view to fit the bounds of a route segment.
   * If destination coordinates are provided, fits bounds to include both start and end points.
   * Otherwise, centers on the start point.
   * 
   * @param fromLng - Longitude of the starting point.
   * @param fromLat - Latitude of the starting point.
   * @param toLng - Optional longitude of the destination point.
   * @param toLat - Optional latitude of the destination point.
   */
  function fitRouteBounds(fromLng: number, fromLat: number, toLng?: number, toLat?: number) {
    if (!mapRef.current) return;
    
    if (typeof fromLng !== 'number' || typeof fromLat !== 'number' || isNaN(fromLng) || isNaN(fromLat)) {
      console.error('Invalid from coordinates:', { fromLng, fromLat });
      return;
    }
    
    if (toLng !== undefined && toLat !== undefined) {
      if (typeof toLng !== 'number' || typeof toLat !== 'number' || isNaN(toLng) || isNaN(toLat)) {
        console.error('Invalid to coordinates:', { toLng, toLat });
        flyToCenter(fromLng, fromLat);
        return;
      }
      
      const minLng = Math.min(fromLng, toLng);
      const maxLng = Math.max(fromLng, toLng);
      const minLat = Math.min(fromLat, toLat);
      const maxLat = Math.max(fromLat, toLat);
      
      mapRef.current.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15,
          duration: 1000
        }
      );
    } else {
      flyToCenter(fromLng, fromLat);
    }
  }

  /**
   * Handles the display of route arrivals on the map.
   * Draws the route line, stop markers, and optionally a segment between stops.
   * 
   * @param routeId - The ID of the route.
   * @param direction - The direction ID of the route.
   * @param stop - The stop ID.
   * @param stopLocation - Location object for the stop.
   * @param destinationStopLocation - Optional location object for the destination stop.
   */
  async function handleRouteArrivalsOpened(
    routeId: string,
    direction: string,
    stop: string,
    stopLocation: ArrivalLocation,
    destinationStopLocation?: ArrivalLocation
  ) {
    console.log("route arrivals opened", routeId, direction);
    
    if (!mapRef.current) return;

    const processRoute = async () => {
      const selectedRouteDictionary = {
        [parseInt(routeId, 10)]: {
          directions: [parseInt(direction, 10)]
        }
      } as NearbyRoutesDictionary;
      
      const routeLayerId = `route-${routeId}_${direction}`;
      if (!displayedRouteIds.includes(routeLayerId)) {
        const routeIds = await setRoutesOnMap(
          mapRef.current,
          selectedRouteDictionary
        );
        setDisplayedRouteIds(routeIds);
      }
      
      removeStopLocationLayers(mapRef.current);
      drawRouteStopMarkers(mapRef.current, stopLocation, destinationStopLocation);
      
      if (destinationStopLocation) {
        drawRouteSegment(mapRef.current, routeId, direction, stopLocation, destinationStopLocation);
        fitRouteBounds(
          stopLocation.lng,
          stopLocation.lat,
          destinationStopLocation.lng,
          destinationStopLocation.lat
        );
      } else {
        removeRouteSegment(mapRef.current);
        flyToCenter(stopLocation.lng, stopLocation.lat);
      }
    };

    if (!mapRef.current.isStyleLoaded()) {
      mapRef.current.once('styledata', processRoute);
    } else {
      await processRoute();
    }
  }

  /**
   * Handles the display of a single stop on the map.
   * Clears other layers and centers on the selected stop.
   * 
   * @param stopLocation - Location object for the stop.
   */
  function handleStopOpened(stopLocation: ArrivalLocation) {
    console.log("stop opened", stopLocation);
    if (!mapRef.current) return;
    removeStopLocationLayers(mapRef.current);
    drawRouteStopMarkers(mapRef.current, stopLocation);
    flyToCenter(stopLocation.lng, stopLocation.lat);
  }

  /**
   * Handles the display of simple routes or labeled stops.
   * Cleans up existing route layers and displays either labeled stops or nearby stops.
   * 
   * @param labeledStops - Optional array of stops with labels to display.
   */
  function handleSimpleRoutesOpened(labeledStops?: Array<LabeledStop>) {
    if (!mapRef.current) return;
    
    const processMarkers = () => {
      removeRouteStopMarkers(mapRef.current);
      removeRouteSegment(mapRef.current);
      removeStopLocationLayers(mapRef.current);
      removeRoutes(mapRef.current, displayedRouteIds);
      if (displayedRouteIds.length > 0) {
        setDisplayedRouteIds([]);
      }
      
      if (labeledStops && labeledStops.length > 0) {
        setLabeledStops(mapRef.current, labeledStops, handleStopMarkerClick);
        const firstStop = labeledStops[0];
        flyToCenter(firstStop.lng, firstStop.lat);
      } else {
        setNearbyStops(
          mapRef.current,
          stopLocations,
          nearbyRouteIds ? Object.keys(nearbyRouteIds) : [],
          handleStopMarkerClick
        );
      }
    };
    
    if (!mapRef.current.isStyleLoaded()) {
      mapRef.current.once('styledata', processMarkers);
    } else {
      processMarkers();
    }
  }

  /**
   * Highlights a specific stop marker on the map.
   * 
   * @param stopId - The ID of the stop to highlight, or null to reset.
   */
  function highlightStopMarker(stopId: string | null) {
    if (!mapRef.current) return;
    if (!mapRef.current.getLayer("stopLocationLayer")) return;
    
    if (stopId) {
      updateStopMarkerColor(mapRef.current, stopId, "#ff6b6b");
    } else {
      mapRef.current.setPaintProperty("stopLocationLayer", "circle-color", "#4264fb");
    }
  }

  return {
    displayedRouteIds,
    setDisplayedRouteIds,
    handleRouteArrivalsOpened,
    handleStopOpened,
    handleSimpleRoutesOpened,
    highlightStopMarker,
    flyToCenter,
    clearAllMapLayers: () => {
      if (!mapRef.current) return;
      removeRouteStopMarkers(mapRef.current);
      removeRouteSegment(mapRef.current);
      removeStopLocationLayers(mapRef.current);
      removeRoutes(mapRef.current, displayedRouteIds);
      removeCurrentLocationMarkers(mapRef.current);
      if (displayedRouteIds.length > 0) {
        setDisplayedRouteIds([]);
      }
    }
  };
}
