import { Map } from "mapbox-gl";
import * as mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../../store/reducers";
import { Location } from "../../../api/trimet/interfaces/types";
import { getNearbyRouteIds, getStopLocations } from "../util/dataUtils";
import { NearbyViewComponentOutletContextProps } from "../context/NearbyViewContext";
import { useMapLocation } from "./map/useMapLocation";
import { useMapData } from "./map/useMapData";
import { useMapRouteOperations } from "./map/useMapRouteOperations";
import { useMapUpdate } from "./map/useMapUpdate";
import { useMapInteractions } from "./map/useMapInteractions";
import { useMapTheme } from "./map/useMapTheme";
import { useMapInitialization } from "./map/useMapInitialization";
import { useMapRadius } from "./map/useMapRadius";
import { setDroppedMarkerOnMap } from "../util/mapbox/droppedMarker";

/**
 * Custom hook for managing the nearby map view logic in the TriMet Arrivals app.
 * Orchestrates map initialization, data fetching, and user interactions.
 * 
 * @returns Map logic and context
 */
export function useNearbyMapLogic() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<Map>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector((state: RootState) => state.themeReducer.theme);
  
  // Custom hooks for state management
  const {
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
  } = useMapLocation();

  const {
    radiusSize,
    setRadiusSize,
    nearbyStops,
    setNearbyStopData,
    nearbyRoutes,
    setNearbyRoutesData,
    fetchInitialData
  } = useMapData();

  // Local state and refs
  const [zoom, setZoom] = useState(16);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const droppedMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const isRadiusChanging = useRef(false);

  // Derived data
  const nearbyRouteIds = nearbyRoutes && getNearbyRouteIds(nearbyRoutes);
  const stopLocations = nearbyStops && getStopLocations(nearbyStops);
  const showMap = activeLocation && activeLocation[0] !== undefined && nearbyRouteIds && stopLocations;

  /**
   * Handles click events on stop markers.
   * Navigates to the stop detail page.
   * 
   * @param data - The data associated with the clicked marker, containing properties like locid.
   */
  function handleStopMarkerClick(data: any) {
    console.log("handle stop marker click", data);
    navigate(`/nearby/stops/${data.properties.locid}`);
  }

  // Route operations hook
  const {
    displayedRouteIds,
    setDisplayedRouteIds,
    handleRouteArrivalsOpened,
    handleStopOpened,
    handleSimpleRoutesOpened,
    highlightStopMarker,
    flyToCenter
  } = useMapRouteOperations(mapRef, nearbyRouteIds, stopLocations, handleStopMarkerClick);

  /**
   * Checks if the current route is a route detail page.
   * Used to conditionally skip map updates that might conflict with the detail view.
   * 
   * @returns True if on a route detail page, false otherwise.
   */
  const isOnRouteDetailPage = () => {
    return /\/nearby\/simple-routes\/\d+/.test(location.pathname);
  };
  
  /**
   * Checks if the current route is any detail or sub-page (not the main list views).
   * Used to determine if the map should be shown or if certain interactions should be enabled.
   * 
   * @returns True if on a detail page, false otherwise.
   */
  const isOnDetailPage = () => {
    const path = location.pathname;
    return (
      /\/nearby\/simple-routes\/\d+/.test(path) ||
      /\/nearby\/stops\/\d+/.test(path) ||
      /\/nearby\/routes\/\d+/.test(path) ||
      path.includes('/nearby/directions')
    );
  };

  /**
   * Handles placing a dropped marker on the map.
   * Updates the search location to the marker's coordinates and fetches nearby data.
   * 
   * @param lng - Longitude of the dropped marker.
   * @param lat - Latitude of the dropped marker.
   */
  function handleDropMarker(lng: number, lat: number) {
    console.log("Dropping marker at", lng, lat);
    setDroppedMarkerLocation({ lng, lat });
    setIsUsingDroppedMarker(true);
    setSearchParams({ lat: lat.toString(), lng: lng.toString() });
    
    if (isOnRouteDetailPage()) {
      droppedMarkerRef.current = setDroppedMarkerOnMap(
        mapRef.current,
        lng,
        lat,
        radiusSize,
        handleDropMarker
      );
      return;
    }
    
    const markerLocation = {
      ...userLocation,
      coords: {
        ...userLocation?.coords,
        latitude: lat,
        longitude: lng
      }
    };

    updateMapData(markerLocation, radiusSize, true, { lng, lat }, droppedMarkerRef)
      .catch((error) => {
        console.error("Error updating search area for dropped marker:", error);
      });
  }

  // Map update hook
  const { updateMapData } = useMapUpdate(
    mapRef,
    setNearbyStopData,
    setNearbyRoutesData,
    handleStopMarkerClick,
    handleDropMarker
  );

  // Map interactions hook
  const {
    handleResetToGeoLocation,
    handlePlaceMarker,
    handleRefresh,
    handleFindNearMe
  } = useMapInteractions(
    mapRef,
    userLocation,
    isUsingDroppedMarker,
    setIsUsingDroppedMarker,
    setDroppedMarkerLocation,
    setSearchParams,
    droppedMarkerRef,
    fetchInitialData,
    flyToCenter,
    setRadiusSize,
    updateMapData,
    setNearbyStopData,
    setNearbyRoutesData
  );

  // Minimum loading time effect
  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingTime(false), 250);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup zoom timeout
  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  // Initial Data Load Effect
  useEffect(() => {
    if (activeLocation && !nearbyStops) {
      const loc = {
        coords: { latitude: lat, longitude: lng }
      } as Location;
      
      fetchInitialData(loc).catch((error) => {
        console.error("Error fetching initial data:", error);
      });
    }
  }, [activeLocation]);

  // Radius Size Change Effect
  useMapRadius(
    mapRef,
    radiusSize,
    isOnRouteDetailPage,
    isUsingDroppedMarker,
    droppedMarkerLocation,
    userLocation,
    fetchInitialData,
    isRadiusChanging,
    setZoom,
    updateMapData,
    droppedMarkerRef
  );

  // Theme Change Effect
  useMapTheme(
    mapRef,
    theme,
    nearbyStops,
    nearbyRoutes,
    isUsingDroppedMarker,
    droppedMarkerLocation,
    userLocation,
    radiusSize,
    handleStopMarkerClick,
    handleDropMarker,
    droppedMarkerRef,
    setDisplayedRouteIds
  );

  /**
   * Updates the search area and fetches new data after a zoom event.
   * Debounced to prevent excessive API calls.
   */
  function handleZoomSearchUpdate() {
    if (!mapRef.current || !userLocation) return;
    
    if (isOnRouteDetailPage()) return;
    
    const currentPath = window.location.pathname;
    if (currentPath === '/nearby/simple-routes' || currentPath.includes('/trimet-arrivals/nearby/simple-routes') ||
        currentPath === '/nearby/stops' || currentPath.includes('/trimet-arrivals/nearby/stops')) {
      return;
    }

    console.log("Updating search area after zoom");
    
    const searchLocation = isUsingDroppedMarker && droppedMarkerLocation
      ? {
          ...userLocation,
          coords: {
            ...userLocation.coords,
            latitude: droppedMarkerLocation.lat,
            longitude: droppedMarkerLocation.lng
          }
        }
      : userLocation;
    
    updateMapData(searchLocation, radiusSize, isUsingDroppedMarker, droppedMarkerLocation, droppedMarkerRef)
      .catch((error) => {
        console.error("Error updating search area after zoom:", error);
      });
  }

  // Map initialization hook
  const { initializeMapboxMap } = useMapInitialization(
    mapRef,
    mapContainerRef,
    lng,
    lat,
    zoom,
    theme,
    isUsingDroppedMarker,
    droppedMarkerLocation,
    radiusSize,
    handleDropMarker,
    droppedMarkerRef,
    setZoom,
    isRadiusChanging,
    zoomTimeoutRef,
    handleZoomSearchUpdate
  );

  /**
   * Updates the search radius size based on user selection.
   * 
   * @param e - The change event from the radius selector.
   */
  function handleRadiusSelectionChange(e) {
    console.log("handle radius selection change", e.target.value);
    setRadiusSize(e.target.value);
  }

  const context: NearbyViewComponentOutletContextProps = {
    currentLocation: activeLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    minLoadingTime,
    handleRadiusSelectionChange,
    handleRefresh,
    handleFindNearMe: () => handleFindNearMe(isOnRouteDetailPage),
    initializeMap: initializeMapboxMap,
    handleRouteArrivalsOpened,
    handleStopOpened,
    handleSimpleRoutesOpened,
    highlightStopMarker
  };

  return {
    context,
    mapRef,
    mapContainerRef,
    zoom,
    activeLocation,
    showMap,
    isOnDetailPage,
    isUsingDroppedMarker,
    droppedMarkerLocation,
    handleResetToGeoLocation: () => handleResetToGeoLocation(radiusSize, handleDropMarker),
    handlePlaceMarker: () => handlePlaceMarker(handleDropMarker),
    lng,
    lat
  };
}
