import { Map } from "mapbox-gl";
import * as mapboxgl from "mapbox-gl";
import { Dictionary } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import geoLocateCurrentPosition from "../../../api/geolocation/geoLocateCurrentPosition";
import { RootState } from "../../../store/reducers";
import {
  Location,
  StopData,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../api/trimet/stops";
import {
  getNearbyRouteIds,
  getStopLocations,
  processRoutes
} from "../util/dataUtils";
import { setMapZoom } from "../util/mapbox/mapZoom";
import {
  initializeCurrentLocationMarker,
  setCurrentLocationMarker
} from "../util/mapbox/currentLocation";
import { initializeMap } from "../util/mapbox/initializeMap";
import {
  removeRoutes,
  setRoutes as setRoutesOnMap
} from "../util/mapbox/routeLines";
import {
  removeCurrentLocationMarkers,
  removeStopLocationLayers,
  setNearbyStops,
  updateStopMarkerColor,
  setLabeledStops
} from "../util/mapbox/stopLocationMarker.util";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import { ArrivalLocation } from "../../../api/trimet/interfaces/arrivals";
import { NearbyViewComponentOutletContextProps } from "../context/NearbyViewContext";
import { removeDroppedMarker, setDroppedMarkerOnMap } from "../util/mapbox/droppedMarker";
import { calculateRadiusFromMap } from "../util/mapbox/mapCalculations";
import { drawRouteSegment, removeRouteSegment } from "../util/mapbox/routeSegments";
import { drawRouteStopMarkers, removeRouteStopMarkers } from "../util/mapbox/routeStopMarkers";

const DEFAULT_RADIUS = 1000;

/**
 * Custom hook for managing the nearby map view logic in the TriMet Arrivals app.
 * 
 * This hook orchestrates all map-related functionality including:
 * - Initializing and managing Mapbox GL map instance
 * - Fetching and displaying nearby transit stops and routes
 * - Handling user location (both geolocation and dropped markers)
 * - Managing map zoom, radius, and search area updates
 * - Coordinating map interactions (stop clicks, route displays, etc.)
 * - Handling theme changes and map style updates
 * 
 * @returns {Object} An object containing:
 *   - context: Props to be passed to child components via outlet context
 *   - mapRef: Reference to the Mapbox GL map instance
 *   - mapContainerRef: Reference to the map container DOM element
 *   - zoom: Current map zoom level
 *   - activeLocation: Current search location [lng, lat] (either user location or dropped marker)
 *   - showMap: Boolean indicating if map should be displayed
 *   - isOnDetailPage: Function to check if currently on a detail page
 *   - isUsingDroppedMarker: Boolean indicating if using dropped marker instead of geolocation
 *   - droppedMarkerLocation: Coordinates of dropped marker if set
 *   - handleResetToGeoLocation: Function to reset to user's geolocation
 *   - handlePlaceMarker: Function to place a marker at map center
 *   - lng: Current longitude
 *   - lat: Current latitude
 * 
 * @example
 * const {
 *   context,
 *   mapRef,
 *   mapContainerRef,
 *   zoom,
 *   activeLocation,
 *   showMap
 * } = useNearbyMapLogic();
 */
export function useNearbyMapLogic() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<Map>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useSelector((state: RootState) => state.themeReducer.theme);
  const [zoom, setZoom] = useState(16);
  const [radiusSize, setRadiusSize] = useState<number>(DEFAULT_RADIUS);
  const [nearbyStops, setNearbyStopData] = useState<StopData>(undefined);
  const [nearbyRoutes, setNearbyRoutesData] = useState<
    Dictionary<TrimetRoute[]>
  >(undefined);
  const [userLocation, setUserLocation] = useState<Location>(undefined);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [displayedRouteIds, setDisplayedRouteIds] = useState<string[]>([]);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const droppedMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const isRadiusChanging = useRef(false);
  const [droppedMarkerLocation, setDroppedMarkerLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [isUsingDroppedMarker, setIsUsingDroppedMarker] = useState(false);

  const currentLocation = [
    userLocation?.coords?.longitude,
    userLocation?.coords?.latitude
  ];

  // Use dropped marker location if available, otherwise use geo location
  const activeLocation = isUsingDroppedMarker && droppedMarkerLocation
    ? [droppedMarkerLocation.lng, droppedMarkerLocation.lat]
    : currentLocation;

  const lng = activeLocation[0];
  const lat = activeLocation[1];

  const nearbyRouteIds = nearbyRoutes && getNearbyRouteIds(nearbyRoutes);
  const stopLocations = nearbyStops && getStopLocations(nearbyStops);
  const showMap = activeLocation && activeLocation[0] !== undefined && nearbyRouteIds && stopLocations;
  
  // Helper function to check if we're on a route detail page
  const isOnRouteDetailPage = () => {
    // Match patterns like /nearby/simple-routes/:id (with query params)
    return /\/nearby\/simple-routes\/\d+/.test(location.pathname);
  };
  
  // Helper function to check if we're on any detail/sub page (not the main list views)
  const isOnDetailPage = () => {
    // Show location search only on main list pages:
    // /nearby, /nearby/simple-routes, /nearby/stops, /nearby/routes
    // Hide on detail pages:
    // /nearby/simple-routes/:id, /nearby/stops/:id, /nearby/routes/:id, /nearby/directions
    const path = location.pathname;
    return (
      /\/nearby\/simple-routes\/\d+/.test(path) ||
      /\/nearby\/stops\/\d+/.test(path) ||
      /\/nearby\/routes\/\d+/.test(path) ||
      path.includes('/nearby/directions')
    );
  };

  function fetchInitialData(location) {
    return getNearbyStops(location, radiusSize).then((stopData: StopData) => {
      const routes = processRoutes(stopData);
      setNearbyStopData(stopData);
      setNearbyRoutesData(routes);
    });
  }

  // Minimum loading time
  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingTime(false), 250);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup zoom timeout on unmount
  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  // Initial Load
  useEffect(() => {
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);

      if (!isNaN(lat) && !isNaN(lng)) {
        setDroppedMarkerLocation({ lng, lat });
        setIsUsingDroppedMarker(true);

        const location = {
          coords: { latitude: lat, longitude: lng }
        } as Location;

        fetchInitialData(location).catch((error) => {
          console.error("Error fetching initial data for dropped marker:", error);
        });

        // Also try to get real user location
        geoLocateCurrentPosition()
          .then((location: Location) => {
            setUserLocation(location);
          })
          .catch((error) => {
            console.error("Error getting user location:", error);
          });
        return;
      }
    }

    if (userLocation) {
      fetchInitialData(userLocation).catch((error) => {
        console.error("Error fetching initial data:", error);
      });
    } else {
      geoLocateCurrentPosition()
        .then((location: Location) => {
          setUserLocation(location);
          return fetchInitialData(location);
        })
        .catch((error) => {
          console.error("Error during initial load:", error);
        });
    }
  }, []);

  // Radius Size Change
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    
    // Skip updating map stops on route detail pages - they manage their own markers
    if (isOnRouteDetailPage()) {
      console.log("Skipping radius change update - on route detail page");
      return;
    }
    
    // Skip updating if on simple routes or stops page - let those components manage their own markers
    const currentPath = window.location.pathname;
    if (currentPath === '/nearby/simple-routes' || currentPath.includes('/trimet-arrivals/nearby/simple-routes') ||
        currentPath === '/nearby/stops' || currentPath.includes('/trimet-arrivals/nearby/stops')) {
      console.log("Skipping radius change update - on simple routes or stops page, updating data only");
      // Still update the data but don't touch the map markers
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
      
      getNearbyStops(searchLocation, radiusSize)
        .then((stopData: StopData) => {
          const routes = processRoutes(stopData);
          setNearbyStopData(stopData);
          setNearbyRoutesData(routes);
        })
        .catch((error) => {
          console.error("Error updating radius data:", error);
        });
      return;
    }
    
    console.log("radius size change", radiusSize);
    
    // Set flag to prevent zoom handler from triggering
    isRadiusChanging.current = true;
    setMapZoom(mapRef, radiusSize, setZoom);

    // Use the appropriate location based on mode
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
        
        // Display nearby stops
        setNearbyStops(
          mapRef.current,
          stopLocations,
          Object.keys(nearbyRouteIds),
          handleStopMarkerClick
        );
        
        // Set the appropriate marker based on mode
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
        
        // Clear flag after a short delay to allow zoom animation to complete
        setTimeout(() => {
          isRadiusChanging.current = false;
        }, 500);
      })
      .catch((error) => {
        console.error("Error updating radius:", error);
        isRadiusChanging.current = false;
      });
  }, [radiusSize]);

  // Theme Change
  useEffect(() => {
    if (mapRef.current) {
      const style = theme === "dark"
        ? "mapbox://styles/mapbox/dark-v10"
        : "mapbox://styles/mapbox/streets-v11";
      
      mapRef.current.setStyle(style);
      
      mapRef.current.once('style.load', () => {
        console.log("Map style loaded, restoring layers");
        
        // Restore stops
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
        
        // Restore location marker
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
        
        // Restore displayed routes would be complex, clearing them for now
        setDisplayedRouteIds([]);
      });
    }
  }, [theme]);

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

      // mapRef.current = setNearbyStops(mapRef.current, stopLocations, Object.keys(nearbyRouteIds), handleStopMarkerClick);
      setIsMapLoaded(true);
      // setRoutesOnMap(mapRef.current, nearbyRouteIds);
    });

    // Add zoom event listener with debounce
    mapRef.current.on("zoomend", () => {
      const currentZoom = mapRef.current.getZoom();
      setZoom(currentZoom);
      
      // Skip if this is a programmatic zoom from radius change
      if (isRadiusChanging.current) {
        console.log("Skipping zoom update - radius is changing");
        return;
      }
      
      // Clear existing timeout
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
      
      // Set new timeout to update search area after 2 seconds
      zoomTimeoutRef.current = setTimeout(() => {
        handleZoomSearchUpdate();
      }, 2000);
    });
  }

  function handleZoomSearchUpdate() {
    if (!mapRef.current || !userLocation) {
      return;
    }
    
    // Skip updating map stops on route detail pages - they manage their own markers
    if (isOnRouteDetailPage()) {
      console.log("Skipping zoom search update - on route detail page");
      return;
    }
    
    // Skip updating if on simple routes or stops page - let those components manage their own markers
    const currentPath = window.location.pathname;
    if (currentPath === '/nearby/simple-routes' || currentPath.includes('/trimet-arrivals/nearby/simple-routes') ||
        currentPath === '/nearby/stops' || currentPath.includes('/trimet-arrivals/nearby/stops')) {
      console.log("Skipping zoom search update - on simple routes or stops page");
      return;
    }

    console.log("Updating search area after zoom");
    
    // Determine which location to use for the search - maintain current mode
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
    
    const updatedLocation = searchLocation;

    getNearbyStops(updatedLocation, radiusSize)
      .then((stopData: StopData) => {
        const routes = processRoutes(stopData);
        const nearbyRouteIds = getNearbyRouteIds(routes);
        const stopLocations = getStopLocations(stopData);

        removeStopLocationLayers(mapRef.current);
        removeCurrentLocationMarkers(mapRef.current);
        removeRoutes(mapRef.current, Object.keys(nearbyRouteIds));

        setNearbyStopData(stopData);
        setNearbyRoutesData(routes);
        
        // Display nearby stops
        setNearbyStops(
          mapRef.current,
          stopLocations,
          Object.keys(nearbyRouteIds),
          handleStopMarkerClick
        );
        
        // Update the appropriate marker based on mode
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

  function handleDropMarker(lng: number, lat: number) {
    console.log("Dropping marker at", lng, lat);
    setDroppedMarkerLocation({ lng, lat });
    setIsUsingDroppedMarker(true);
    setSearchParams({ lat: lat.toString(), lng: lng.toString() });
    
    // Skip updating map stops on route detail pages - they manage their own markers
    if (isOnRouteDetailPage()) {
      console.log("Skipping marker drop update - on route detail page");
      droppedMarkerRef.current = setDroppedMarkerOnMap(
        mapRef.current,
        lng,
        lat,
        radiusSize,
        handleDropMarker
      );
      return;
    }
    
    // Update search area based on dropped marker
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
        
        // Display nearby stops
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
      
      // Re-add current location marker
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
  
  function handlePlaceMarker() {
    if (!mapRef.current || !userLocation) return;
    
    // Place marker at map center
    const center = mapRef.current.getCenter();
    handleDropMarker(center.lng, center.lat);
  }

  function handleRadiusSelectionChange(e) {
    console.log("handle radius selection change", e.target.value);
    setRadiusSize(e.target.value);
  }

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

  function handleFindNearMe() {
    console.log("find near me clicked");
    
    // Clear any dropped markers
    if (isUsingDroppedMarker) {
      setIsUsingDroppedMarker(false);
      setDroppedMarkerLocation(null);
      setSearchParams({});
      if (mapRef.current) {
        removeDroppedMarker(mapRef.current, droppedMarkerRef.current);
      }
    }
    
    if (!mapRef.current || !userLocation) {
      return;
    }
    
    // Skip updating map stops on route detail pages - they manage their own markers
    if (isOnRouteDetailPage()) {
      console.log("Skipping find near me update - on route detail page");
      return;
    }
    
    const distanceFeet = calculateRadiusFromMap(mapRef.current);
    
    console.log("Calculated search radius:", distanceFeet, "feet");
    
    // Update radius size
    setRadiusSize(Math.round(distanceFeet));
    
    // Fly to user location
    flyToCenter(userLocation.coords.longitude, userLocation.coords.latitude);
    
    // Fetch data at user location with new radius
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
        
        // Display nearby stops
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

  function handleStopMarkerClick(data: any) {
    console.log("handle stop marker click", data);
    navigate(`/nearby/stops/${data.properties.locid}`);
  }

  function flyToCenter(lng: number, lat: number) {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });
    }
  }

  function fitRouteBounds(fromLng: number, fromLat: number, toLng?: number, toLat?: number) {
    if (!mapRef.current) return;
    
    // Validate coordinates
    if (typeof fromLng !== 'number' || typeof fromLat !== 'number' || 
        isNaN(fromLng) || isNaN(fromLat)) {
      console.error('Invalid from coordinates:', { fromLng, fromLat });
      return;
    }
    
    if (toLng !== undefined && toLat !== undefined) {
      // Validate destination coordinates
      if (typeof toLng !== 'number' || typeof toLat !== 'number' || 
          isNaN(toLng) || isNaN(toLat)) {
        console.error('Invalid to coordinates:', { toLng, toLat });
        flyToCenter(fromLng, fromLat);
        return;
      }
      
      // Fit bounds to show both from and to stops
      // Calculate southwest and northeast corners
      const minLng = Math.min(fromLng, toLng);
      const maxLng = Math.max(fromLng, toLng);
      const minLat = Math.min(fromLat, toLat);
      const maxLat = Math.max(fromLat, toLat);
      
      // Pass bounds directly as nested array to fitBounds
      mapRef.current.fitBounds(
        [
          [minLng, minLat], // Southwest corner
          [maxLng, maxLat]  // Northeast corner
        ],
        {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15,
          duration: 1000
        }
      );
    } else {
      // Just center on the from stop
      flyToCenter(fromLng, fromLat);
    }
  }

  async function handleRouteArrivalsOpened(
    routeId: string,
    direction: string,
    stop: string,
    stopLocation: ArrivalLocation,
    destinationStopLocation?: ArrivalLocation
  ) {
    console.log("route arrivals opened", routeId, direction);
    const selectedRouteDictionary = {
      [parseInt(routeId, 10)]: {
        directions: [parseInt(direction, 10)]
      }
    } as NearbyRoutesDictionary;
    
    // Only add route if it's not already displayed
    const routeLayerId = `route-${routeId}_${direction}`;
    if (!displayedRouteIds.includes(routeLayerId)) {
      const routeIds = await setRoutesOnMap(
        mapRef.current,
        selectedRouteDictionary
      );
      setDisplayedRouteIds(routeIds);
    }
    
    // Remove ALL nearby stop location layers 
    removeStopLocationLayers(mapRef.current);
    
    // Draw route stop markers
    drawRouteStopMarkers(mapRef.current, stopLocation, destinationStopLocation);
    
    // If both from and to stops are selected, draw a solid blue line between them
    if (destinationStopLocation) {
      drawRouteSegment(mapRef.current, routeId, direction, stopLocation, destinationStopLocation);
    } else {
      removeRouteSegment(mapRef.current);
    }
    
    // Fit bounds to show the route between from and to stops
    if (destinationStopLocation) {
      console.log('Fitting bounds with:', {
        from: { lng: stopLocation.lng, lat: stopLocation.lat },
        to: { lng: destinationStopLocation.lng, lat: destinationStopLocation.lat }
      });
      fitRouteBounds(
        stopLocation.lng,
        stopLocation.lat,
        destinationStopLocation.lng,
        destinationStopLocation.lat
      );
    } else {
      flyToCenter(stopLocation.lng, stopLocation.lat);
    }
  }

  function handleStopOpened(stopLocation: ArrivalLocation) {
    console.log("stop opened", stopLocation);
    
    // Remove existing stop location layers
    removeStopLocationLayers(mapRef.current);
    
    // Draw route stop markers (only one in this case)
    drawRouteStopMarkers(mapRef.current, stopLocation);
    
    flyToCenter(stopLocation.lng, stopLocation.lat);
  }

  function handleSimpleRoutesOpened(labeledStops?: Array<{locid: number, label: string, lng: number, lat: number}>) {
    console.log('[handleSimpleRoutesOpened] Called with labeledStops:', labeledStops);
    console.log('[handleSimpleRoutesOpened] mapRef.current exists:', !!mapRef.current);
    console.log('[handleSimpleRoutesOpened] mapRef.current.isStyleLoaded():', mapRef.current?.isStyleLoaded());
    
    if (!mapRef.current) {
      console.warn('[handleSimpleRoutesOpened] Map not available, exiting early');
      return;
    }
    
    const processMarkers = () => {
      console.log('[handleSimpleRoutesOpened.processMarkers] Starting to process markers');
      console.log('[handleSimpleRoutesOpened.processMarkers] Map loaded:', mapRef.current?.loaded());
      console.log('[handleSimpleRoutesOpened.processMarkers] Style loaded:', mapRef.current?.isStyleLoaded());
    
      // Remove route-specific stop markers
      console.log('[handleSimpleRoutesOpened.processMarkers] Removing existing layers');
      removeRouteStopMarkers(mapRef.current);
      
      // Remove route segment layer
      removeRouteSegment(mapRef.current);
      
      console.log('[handleSimpleRoutesOpened.processMarkers] Removing stop location layers');
      mapRef.current = removeStopLocationLayers(mapRef.current);
      
      console.log('[handleSimpleRoutesOpened.processMarkers] Removing routes');
      mapRef.current = removeRoutes(mapRef.current, displayedRouteIds);
      setDisplayedRouteIds([]);
      
      // Add stops after cleanup is complete
      if (labeledStops && labeledStops.length > 0) {
        // Use labeled stops
        console.log('[handleSimpleRoutesOpened.processMarkers] Adding labeled stops to map:', labeledStops.length, 'stops');
        mapRef.current = setLabeledStops(
          mapRef.current,
          labeledStops,
          handleStopMarkerClick
        );
        console.log('[handleSimpleRoutesOpened.processMarkers] Labeled stops added successfully');
      } else {
        // Fallback to regular stops
        console.log('[handleSimpleRoutesOpened.processMarkers] No labeled stops, using regular stops');
        mapRef.current = setNearbyStops(
          mapRef.current,
          stopLocations,
          nearbyRouteIds ? Object.keys(nearbyRouteIds) : [],
          handleStopMarkerClick
        );
        console.log('[handleSimpleRoutesOpened.processMarkers] Regular stops added');
      }
      
      if (labeledStops && labeledStops.length > 0) {
        const firstStop = labeledStops[0];
        flyToCenter(firstStop.lng, firstStop.lat);
      }
    };
    
    // Wait for style to load before processing markers
    if (!mapRef.current.isStyleLoaded()) {
      console.log('[handleSimpleRoutesOpened] Style not loaded, waiting for styledata event');
      mapRef.current.once('styledata', processMarkers);
    } else {
      console.log('[handleSimpleRoutesOpened] Style already loaded, processing immediately');
      processMarkers();
    }
  }

  function highlightStopMarker(stopId: string | null) {
    if (!mapRef.current) return;
    
    // Check if the stop location layer exists (it won't exist on detail pages)
    if (!mapRef.current.getLayer("stopLocationLayer")) {
      return;
    }
    
    if (stopId) {
      // Highlight the hovered stop
      updateStopMarkerColor(mapRef.current, stopId, "#ff6b6b");
    } else {
      // Reset all markers to default color
      mapRef.current.setPaintProperty("stopLocationLayer", "circle-color", "#4264fb");
    }
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
