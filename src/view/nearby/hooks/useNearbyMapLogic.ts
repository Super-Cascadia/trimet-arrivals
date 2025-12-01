import { Map } from "mapbox-gl";
import * as mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../../store/reducers";
import { StopData, Location } from "../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../api/trimet/stops";
import { getNearbyRouteIds, getStopLocations, processRoutes } from "../util/dataUtils";
import { setMapZoom } from "../util/mapbox/mapZoom";
import { setCurrentLocationMarker } from "../util/mapbox/currentLocation";
import { initializeMap } from "../util/mapbox/initializeMap";
import { removeRoutes } from "../util/mapbox/routeLines";
import { removeCurrentLocationMarkers, removeStopLocationLayers, setNearbyStops } from "../util/mapbox/stopLocationMarker.util";
import { NearbyViewComponentOutletContextProps } from "../context/NearbyViewContext";
import { removeDroppedMarker, setDroppedMarkerOnMap } from "../util/mapbox/droppedMarker";
import { calculateRadiusFromMap } from "../util/mapbox/mapCalculations";
import { useMapLocation } from "./map/useMapLocation";
import { useMapData } from "./map/useMapData";
import { useMapRouteOperations } from "./map/useMapRouteOperations";

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
      getNearbyStops(searchLocation, radiusSize)
        .then((stopData: StopData) => {
          const routes = processRoutes(stopData);
          const nearbyRouteIds = getNearbyRouteIds(routes);
          const stopLocations = getStopLocations(stopData);

          removeStopLocationLayers(mapRef.current);
          removeCurrentLocationMarkers(mapRef.current);
          removeDroppedMarker(mapRef.current, droppedMarkerRef.current);
          removeRoutes(mapRef.current, Object.keys(nearbyRouteIds));

          setNearbyStopData(stopData);
          setNearbyRoutesData(routes);
          
          setNearbyStops(
            mapRef.current,
            stopLocations,
            Object.keys(nearbyRouteIds),
            handleStopMarkerClick
          );
          
          if (isUsingDroppedMarker && droppedMarkerLocation) {
            droppedMarkerRef.current = setDroppedMarkerOnMap(
              mapRef.current,
              droppedMarkerLocation.lng,
              droppedMarkerLocation.lat,
              radiusSize,
              handleDropMarker
            );
          } else {
            setCurrentLocationMarker(mapRef.current, lng, lat, radiusSize);
          }
          
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

  // Theme Change Effect
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

  /**
   * Initializes the Mapbox map instance.
   * Sets up event listeners for load and zoom events.
   */
  function initializeMapboxMap() {
    console.log("initialize map", lng, lat, zoom);
    mapRef.current = initializeMap(lng, lat, mapContainerRef, zoom, theme);

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
    
    getNearbyStops(searchLocation, radiusSize)
      .then((stopData: StopData) => {
        const routes = processRoutes(stopData);
        const nearbyRouteIds = getNearbyRouteIds(routes);
        const stopLocations = getStopLocations(stopData);

        removeStopLocationLayers(mapRef.current);
        removeCurrentLocationMarkers(mapRef.current);
        removeRoutes(mapRef.current, Object.keys(nearbyRouteIds));

        setNearbyStopData(stopData);
        setNearbyRoutesData(routes);
        
        setNearbyStops(
          mapRef.current,
          stopLocations,
          Object.keys(nearbyRouteIds),
          handleStopMarkerClick
        );
        
        if (isUsingDroppedMarker && droppedMarkerLocation) {
          droppedMarkerRef.current = setDroppedMarkerOnMap(
            mapRef.current,
            droppedMarkerLocation.lng,
            droppedMarkerLocation.lat,
            radiusSize,
            handleDropMarker
          );
        } else {
          setCurrentLocationMarker(mapRef.current, userLocation.coords.longitude, userLocation.coords.latitude, radiusSize);
        }
      })
      .catch((error) => {
        console.error("Error updating search area after zoom:", error);
      });
  }

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

    getNearbyStops(markerLocation, radiusSize)
      .then((stopData: StopData) => {
        const routes = processRoutes(stopData);
        const nearbyRouteIds = getNearbyRouteIds(routes);
        const stopLocations = getStopLocations(stopData);

        removeStopLocationLayers(mapRef.current);
        removeCurrentLocationMarkers(mapRef.current);
        removeDroppedMarker(mapRef.current, droppedMarkerRef.current);
        removeRoutes(mapRef.current, Object.keys(nearbyRouteIds));

        setNearbyStopData(stopData);
        setNearbyRoutesData(routes);
        
        setNearbyStops(
          mapRef.current,
          stopLocations,
          Object.keys(nearbyRouteIds),
          handleStopMarkerClick
        );
        
        droppedMarkerRef.current = setDroppedMarkerOnMap(
          mapRef.current,
          lng,
          lat,
          radiusSize,
          handleDropMarker
        );
      })
      .catch((error) => {
        console.error("Error updating search area for dropped marker:", error);
      });
  }

  /**
   * Resets the map view to the user's geolocation.
   * Removes any dropped markers and clears URL search params.
   */
  function handleResetToGeoLocation() {
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
        setCurrentLocationMarker(
          mapRef.current,
          userLocation.coords.longitude,
          userLocation.coords.latitude,
          radiusSize
        );
        flyToCenter(userLocation.coords.longitude, userLocation.coords.latitude);
      }
    }
  }
  
  /**
   * Places a marker at the center of the current map view.
   * Useful for users to search in a specific area they are looking at.
   */
  function handlePlaceMarker() {
    if (!mapRef.current || !userLocation) return;
    const center = mapRef.current.getCenter();
    handleDropMarker(center.lng, center.lat);
  }

  /**
   * Updates the search radius size based on user selection.
   * 
   * @param e - The change event from the radius selector.
   */
  function handleRadiusSelectionChange(e) {
    console.log("handle radius selection change", e.target.value);
    setRadiusSize(e.target.value);
  }

  /**
   * Refreshes the nearby data for the current user location.
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
   * Finds stops near the user's current location.
   * Calculates the radius based on the current map view bounds.
   * Resets any dropped markers and centers the map on the user.
   */
  function handleFindNearMe() {
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
    
    console.log("Calculated search radius:", distanceFeet, "feet");
    
    setRadiusSize(Math.round(distanceFeet));
    flyToCenter(userLocation.coords.longitude, userLocation.coords.latitude);
    
    getNearbyStops(userLocation, Math.round(distanceFeet))
      .then((stopData: StopData) => {
        const routes = processRoutes(stopData);
        const nearbyRouteIds = getNearbyRouteIds(routes);
        const stopLocations = getStopLocations(stopData);

        removeStopLocationLayers(mapRef.current);
        removeCurrentLocationMarkers(mapRef.current);
        removeRoutes(mapRef.current, Object.keys(nearbyRouteIds));

        setNearbyStopData(stopData);
        setNearbyRoutesData(routes);
        
        setNearbyStops(
          mapRef.current,
          stopLocations,
          Object.keys(nearbyRouteIds),
          handleStopMarkerClick
        );
        
        setCurrentLocationMarker(
          mapRef.current,
          userLocation.coords.longitude,
          userLocation.coords.latitude,
          Math.round(distanceFeet)
        );
      })
      .catch((error) => {
        console.error("Error finding near me:", error);
      });
  }

  const context: NearbyViewComponentOutletContextProps = {
    currentLocation: activeLocation,
    nearbyRoutes,
    nearbyStops,
    radiusSize,
    minLoadingTime,
    handleRadiusSelectionChange,
    handleRefresh,
    handleFindNearMe,
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
    handleResetToGeoLocation,
    handlePlaceMarker,
    lng,
    lat
  };
}