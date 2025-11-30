import { Map } from "mapbox-gl";
import * as mapboxgl from "mapbox-gl";
import { Dictionary } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import * as turf from "@turf/turf";
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
  updateStopMarkerColor
} from "../util/mapbox/stopLocationMarker.util";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import { ArrivalLocation } from "../../../api/trimet/interfaces/arrivals";
import { NearbyViewComponentOutletContextProps } from "../context/NearbyViewContext";

const DEFAULT_RADIUS = 1000;

export function useNearbyMapLogic() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<Map>(null);
  const navigate = useNavigate();
  const location = useLocation();
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
  const showMap = currentLocation && nearbyRouteIds && stopLocations;
  
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
              ...userLocation.coords,
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
        removeDroppedMarker(mapRef.current);
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
          setDroppedMarkerOnMap(droppedMarkerLocation.lng, droppedMarkerLocation.lat, radiusSize);
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
          setDroppedMarkerOnMap(droppedMarkerLocation.lng, droppedMarkerLocation.lat, radiusSize);
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
    mapRef.current = initializeCurrentLocationMarker(
      mapRef.current,
      lng,
      lat,
      radiusSize
    );

    mapRef.current.on("load", () => {
      console.info("effect: initialize map markers and routes");
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
          setDroppedMarkerOnMap(droppedMarkerLocation.lng, droppedMarkerLocation.lat, radiusSize);
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
    
    // Skip updating map stops on route detail pages - they manage their own markers
    if (isOnRouteDetailPage()) {
      console.log("Skipping marker drop update - on route detail page");
      setDroppedMarkerOnMap(lng, lat, radiusSize);
      return;
    }
    
    // Update search area based on dropped marker
    const markerLocation = {
      ...userLocation,
      coords: {
        ...userLocation.coords,
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
        removeDroppedMarker(mapRef.current);
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
        
        setDroppedMarkerOnMap(lng, lat, radiusSize);
      })
      .catch((error) => {
        console.error("Error updating search area for dropped marker:", error);
      });
  }

  function handleResetToGeoLocation() {
    console.log("Resetting to geo location");
    setIsUsingDroppedMarker(false);
    setDroppedMarkerLocation(null);
    
    if (userLocation) {
      removeDroppedMarker(mapRef.current);
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

  function setDroppedMarkerOnMap(lng: number, lat: number, radiusSize: number) {
    if (!mapRef.current) return;
    
    removeDroppedMarker(mapRef.current);
    
    // Create a draggable marker using Mapbox GL JS Marker
    const el = document.createElement('div');
    el.className = 'dropped-marker-pin';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.borderRadius = '50% 50% 50% 0';
    el.style.background = '#FF6B6B';
    el.style.position = 'absolute';
    el.style.transform = 'rotate(-45deg)';
    el.style.border = '3px solid #ffffff';
    el.style.cursor = 'move';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    
    const marker = new mapboxgl.Marker({
      element: el,
      draggable: true
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
    
    // Store marker reference
    droppedMarkerRef.current = marker;
    
    // Handle drag events
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      handleDropMarker(lngLat.lng, lngLat.lat);
    });
    
    // Add radius circle around dropped marker
    const radiusCircle = turf.circle([lng, lat], radiusSize, {
      steps: 26,
      units: "feet"
    });
    
    mapRef.current.addSource("droppedMarkerRadius", {
      type: "geojson",
      data: radiusCircle
    });
    
    // Add fill layer for the radius
    mapRef.current.addLayer({
      id: "droppedMarkerRadiusLayer",
      type: "fill",
      source: "droppedMarkerRadius",
      paint: {
        "fill-color": "#FF6B6B",
        "fill-opacity": 0.08
      }
    });
    
    // Add outline stroke for the radius
    mapRef.current.addLayer({
      id: "droppedMarkerRadiusOutlineLayer",
      type: "line",
      source: "droppedMarkerRadius",
      paint: {
        "line-color": "#FF6B6B",
        "line-width": 2,
        "line-opacity": 0.6
      }
    });
  }

  function removeDroppedMarker(map: Map) {
    if (!map) return;
    
    // Remove the draggable marker
    if (droppedMarkerRef.current) {
      droppedMarkerRef.current.remove();
      droppedMarkerRef.current = null;
    }
    
    if (map.getLayer("droppedMarkerRadiusOutlineLayer")) {
      map.removeLayer("droppedMarkerRadiusOutlineLayer");
    }
    if (map.getLayer("droppedMarkerRadiusLayer")) {
      map.removeLayer("droppedMarkerRadiusLayer");
    }
    if (map.getSource("droppedMarkerRadius")) {
      map.removeSource("droppedMarkerRadius");
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
      if (mapRef.current) {
        removeDroppedMarker(mapRef.current);
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
    
    // Calculate radius based on map height (50% larger than map height)
    const mapContainer = mapRef.current.getContainer();
    const mapHeight = mapContainer.clientHeight;
    
    // Get the bounds of the map
    const bounds = mapRef.current.getBounds();
    const center = mapRef.current.getCenter();
    
    // Calculate the vertical distance in the map (from center to top)
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    
    // Use turf to calculate distance
    const centerPoint = turf.point([center.lng, center.lat]);
    const topPoint = turf.point([center.lng, northEast.lat]);
    
    // Distance from center to top in miles
    const distanceMiles = turf.distance(centerPoint, topPoint, { units: "miles" });
    
    // Convert to feet and multiply by 1.5 (50% larger)
    const distanceFeet = distanceMiles * 5280 * 1.5;
    
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
    
    // Remove existing route-specific stop markers if they exist
    if (mapRef.current.getLayer("routeStopMarkersLayer-label")) {
      mapRef.current.removeLayer("routeStopMarkersLayer-label");
    }
    if (mapRef.current.getLayer("routeStopMarkersLayer")) {
      mapRef.current.removeLayer("routeStopMarkersLayer");
    }
    if (mapRef.current.getSource("routeStopMarkersSource")) {
      mapRef.current.removeSource("routeStopMarkersSource");
    }
    
    // Create stop markers for from and to locations
    const stopFeatures = [];
    
    // Add from stop (red)
    stopFeatures.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [stopLocation.lng, stopLocation.lat]
      },
      properties: {
        locid: stopLocation.id,
        color: "#ff0000",
        type: "from"
      }
    });
    
    // Add destination stop (green) if provided
    if (destinationStopLocation) {
      stopFeatures.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [destinationStopLocation.lng, destinationStopLocation.lat]
        },
        properties: {
          locid: destinationStopLocation.id,
          color: "#00ff00",
          type: "to"
        }
      });
    }
    
    // Add source and layer for route-specific stop markers (using unique IDs)
    mapRef.current.addSource("routeStopMarkersSource", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: stopFeatures
      }
    });
    
    mapRef.current.addLayer({
      id: "routeStopMarkersLayer",
      type: "circle",
      source: "routeStopMarkersSource",
      paint: {
        "circle-color": ["get", "color"],
        "circle-radius": 10,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2
      }
    });
    
    // Add text labels for stop markers
    if (mapRef.current.getLayer("routeStopMarkersLayer-label")) {
      mapRef.current.removeLayer("routeStopMarkersLayer-label");
    }
    
    mapRef.current.addLayer({
      id: "routeStopMarkersLayer-label",
      type: "symbol",
      source: "routeStopMarkersSource",
      layout: {
        "text-field": ["to-string", ["get", "locid"]],
        "text-size": 11,
        "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
        "text-anchor": "center",
        "text-allow-overlap": true,
        "text-ignore-placement": true,
        "text-optional": false
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#000000",
        "text-halo-width": 1,
        "text-halo-blur": 0.5
      }
    });
    
    // If both from and to stops are selected, draw a solid blue line between them
    if (destinationStopLocation) {
      // Remove existing route segment layer if it exists
      if (mapRef.current.getLayer("routeSegmentLayer")) {
        mapRef.current.removeLayer("routeSegmentLayer");
      }
      if (mapRef.current.getSource("routeSegmentSource")) {
        mapRef.current.removeSource("routeSegmentSource");
      }
      
      // Get the route geometry from the map source
      const routeSourceId = `route-${routeId}_${direction}`;
      const routeSource = mapRef.current.getSource(routeSourceId);
      
      if (routeSource && (routeSource as any)._data) {
        const routeGeometry = (routeSource as any)._data.geometry;
        
        if (routeGeometry && routeGeometry.type === "LineString" && routeGeometry.coordinates) {
          // Find the closest points on the route to our stops
          const fromPoint = turf.point([stopLocation.lng, stopLocation.lat]);
          const toPoint = turf.point([destinationStopLocation.lng, destinationStopLocation.lat]);
          const routeLine = turf.lineString(routeGeometry.coordinates);
          
          // Get the closest points on the line to our stops
          const fromSnapped = turf.nearestPointOnLine(routeLine, fromPoint);
          const toSnapped = turf.nearestPointOnLine(routeLine, toPoint);
          
          // Get the indices of these points
          const fromIndex = fromSnapped.properties.index || 0;
          const toIndex = toSnapped.properties.index || 0;
          
          // Extract the segment between the two points
          const startIndex = Math.min(fromIndex, toIndex);
          const endIndex = Math.max(fromIndex, toIndex);
          const segmentCoords = routeGeometry.coordinates.slice(startIndex, endIndex + 1);
          
          // Create the segment geometry
          const segmentFeature = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: segmentCoords
            },
            properties: {}
          };
          
          mapRef.current.addSource("routeSegmentSource", {
            type: "geojson",
            data: segmentFeature as any
          });
          
          mapRef.current.addLayer({
            id: "routeSegmentLayer",
            type: "line",
            source: "routeSegmentSource",
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#0080ff",
              "line-width": 6,
              "line-opacity": 1.0
            }
          });
        }
      }
    } else {
      // Remove segment layer if destination is not selected
      if (mapRef.current.getLayer("routeSegmentLayer")) {
        mapRef.current.removeLayer("routeSegmentLayer");
      }
      if (mapRef.current.getSource("routeSegmentSource")) {
        mapRef.current.removeSource("routeSegmentSource");
      }
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
    
    // Remove existing route-specific stop markers if they exist
    if (mapRef.current.getLayer("routeStopMarkersLayer-label")) {
      mapRef.current.removeLayer("routeStopMarkersLayer-label");
    }
    if (mapRef.current.getLayer("routeStopMarkersLayer")) {
      mapRef.current.removeLayer("routeStopMarkersLayer");
    }
    if (mapRef.current.getSource("routeStopMarkersSource")) {
      mapRef.current.removeSource("routeStopMarkersSource");
    }
    
    // Create stop marker for this location
    const stopFeatures = [{
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [stopLocation.lng, stopLocation.lat]
      },
      properties: {
        locid: stopLocation.id,
        color: "#ff0000"
      }
    }];
    
    // Add source and layer for route-specific stop markers
    mapRef.current.addSource("routeStopMarkersSource", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: stopFeatures
      }
    });
    
    mapRef.current.addLayer({
      id: "routeStopMarkersLayer",
      type: "circle",
      source: "routeStopMarkersSource",
      paint: {
        "circle-color": ["get", "color"],
        "circle-radius": 10,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2
      }
    });
    
    // Add text labels for stop markers
    mapRef.current.addLayer({
      id: "routeStopMarkersLayer-label",
      type: "symbol",
      source: "routeStopMarkersSource",
      layout: {
        "text-field": ["to-string", ["get", "locid"]],
        "text-size": 11,
        "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
        "text-anchor": "center",
        "text-allow-overlap": true,
        "text-ignore-placement": true,
        "text-optional": false
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#000000",
        "text-halo-width": 1,
        "text-halo-blur": 0.5
      }
    });
    
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
      if (mapRef.current.getLayer("routeStopMarkersLayer-label")) {
        console.log('[handleSimpleRoutesOpened.processMarkers] Removing routeStopMarkersLayer-label');
        mapRef.current.removeLayer("routeStopMarkersLayer-label");
      }
      if (mapRef.current.getLayer("routeStopMarkersLayer")) {
        console.log('[handleSimpleRoutesOpened.processMarkers] Removing routeStopMarkersLayer');
        mapRef.current.removeLayer("routeStopMarkersLayer");
      }
      if (mapRef.current.getSource("routeStopMarkersSource")) {
        console.log('[handleSimpleRoutesOpened.processMarkers] Removing routeStopMarkersSource');
        mapRef.current.removeSource("routeStopMarkersSource");
      }
      
      // Remove route segment layer
      if (mapRef.current.getLayer("routeSegmentLayer")) {
        console.log('[handleSimpleRoutesOpened.processMarkers] Removing routeSegmentLayer');
        mapRef.current.removeLayer("routeSegmentLayer");
      }
      if (mapRef.current.getSource("routeSegmentSource")) {
        console.log('[handleSimpleRoutesOpened.processMarkers] Removing routeSegmentSource');
        mapRef.current.removeSource("routeSegmentSource");
      }
      
      console.log('[handleSimpleRoutesOpened.processMarkers] Removing stop location layers');
      mapRef.current = removeStopLocationLayers(mapRef.current);
      
      console.log('[handleSimpleRoutesOpened.processMarkers] Removing routes');
      mapRef.current = removeRoutes(mapRef.current, displayedRouteIds);
      setDisplayedRouteIds([]);
      
      // Add stops after cleanup is complete
      if (labeledStops && labeledStops.length > 0) {
        // Use labeled stops
        console.log('[handleSimpleRoutesOpened.processMarkers] Adding labeled stops to map:', labeledStops.length, 'stops');
        const { setLabeledStops } = require("../util/mapbox/stopLocationMarker.util");
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
