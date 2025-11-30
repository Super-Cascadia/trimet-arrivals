import { each, filter, groupBy } from "lodash";
import moment from "moment";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import {
  StopData,
  StopLocation,
  TrimetRoute,
  Direction
} from "../../../api/trimet/interfaces/types";
import { getDistance, getNormalizedDistanceString } from "./turfUtils";
import { isRouteBookmarkedInGroups } from "../../../api/localstorage/bookmarkGroups.localstorage";

export interface RouteStructure {
  route: TrimetRoute;
  arrivals: Arrival[];
  stop: StopLocation;
  dir: number;
  id: number;
  distance: number;
  distanceString: string;
  allStopsForRoute?: StopLocation[]; // All stops serving this route-direction
  currentStopIndex?: number; // Index of currently displayed stop
  stopLabel?: string; // Letter label (A, B, C, etc.)
  futureArrivals?: Arrival[]; // Arrivals for future days
}

/**
 * Processes arrival data and nearby stops to create structured route information.
 * Groups arrivals by route and direction, calculates distances from current location,
 * and organizes stops for each route-direction combination.
 * 
 * @param arrivalData - Arrival data containing upcoming vehicle arrivals
 * @param nearbyStops - Data about stops in the vicinity
 * @param currentLocation - Current location as [longitude, latitude]
 * @returns Object containing an array of RouteStructure with closest stops prioritized
 */
export function getRouteArrivals(
  arrivalData: ArrivalData,
  nearbyStops: StopData,
  currentLocation: number[]
): {
  closestNearbyRouteStructure: RouteStructure[];
} {
  const groupedArrivals = groupBy(arrivalData?.arrival, "locid");
  const routeDirectionMap = new Map<string, RouteStructure>();

  // First pass: collect all stops for each route-direction
  each(nearbyStops?.location, (stop: StopLocation) => {
    const stopLocation = [stop.lng, stop.lat];
    const distance = getDistance(currentLocation, stopLocation);
    const distanceString = getNormalizedDistanceString(currentLocation, stopLocation);
    
    each(stop?.route, (route: TrimetRoute) => {
      const routeId = route?.route;
      // Iterate all directions to differentiate each direction explicitly
      each(route?.dir, (direction: Direction) => {
        const routeDirection = direction.dir;
        const routeDirectionId = `${routeId}-${routeDirection}`;
        
        const arrivalsForLocation = groupedArrivals[stop.locid];
        const arrivals = filter(arrivalsForLocation, (arrival: Arrival) => {
          return arrival.route === routeId && arrival.dir === routeDirection;
        });
        
        if (!routeDirectionMap.has(routeDirectionId)) {
          // First stop for this route-direction - create entry
          routeDirectionMap.set(routeDirectionId, {
            arrivals,
            dir: routeDirection,
            id: routeId,
            route,
            stop,
            distance,
            distanceString,
            allStopsForRoute: [stop],
            currentStopIndex: 0
          });
        } else {
          // Additional stop for this route-direction - add to array
          const existing = routeDirectionMap.get(routeDirectionId)!;
          existing.allStopsForRoute!.push(stop);
        }
      });
    });
  });

  // Sort stops within each route-direction by distance
  routeDirectionMap.forEach((value) => {
    if (value.allStopsForRoute && value.allStopsForRoute.length > 1) {
      value.allStopsForRoute.sort((a, b) => {
        const distA = getDistance(currentLocation, [a.lng, a.lat]);
        const distB = getDistance(currentLocation, [b.lng, b.lat]);
        return distA - distB;
      });
      // Update the main stop to be the closest one
      value.stop = value.allStopsForRoute[0];
      const closestLocation = [value.stop.lng, value.stop.lat];
      value.distance = getDistance(currentLocation, closestLocation);
      value.distanceString = getNormalizedDistanceString(currentLocation, closestLocation);
    }
  });

  return { closestNearbyRouteStructure: Array.from(routeDirectionMap.values()) };
}

/**
 * Enriches route structures with specific stop selection and arrival filtering.
 * Handles selecting the correct stop based on user interaction (cycling stops)
 * and separates arrivals into current day and future arrivals.
 */
export function enrichRouteStructure(
  routeStructures: RouteStructure[],
  arrivalData: ArrivalData,
  stopIndexMap: Map<string, number>,
  currentLocation: number[]
): RouteStructure[] {
  return routeStructures.map(route => {
    const routeDirectionId = `${route.id}-${route.dir}`;
    const currentIndex = stopIndexMap.get(routeDirectionId) || 0;
    const endOfDay = moment().endOf('day').valueOf();
    
    let selectedStop = route.stop;
    let arrivals = route.arrivals;

    if (route.allStopsForRoute && route.allStopsForRoute.length > 1) {
      // Update to show the currently selected stop
      selectedStop = route.allStopsForRoute[currentIndex];
      
      // Get arrivals for the selected stop
      const groupedArrivals = groupBy(arrivalData?.arrival, "locid");
      const arrivalsForLocation = groupedArrivals[selectedStop.locid];
      arrivals = filter(arrivalsForLocation, (arrival: Arrival) => {
        return arrival.route === route.id && arrival.dir === route.dir;
      });
    }
    
    // Filter arrivals to ensure they are within the current day
    const filteredArrivals = arrivals.filter(arrival => {
      const arrivalTime = arrival.estimated || arrival.scheduled;
      return arrivalTime <= endOfDay;
    });

    // Get future arrivals (after end of day)
    const futureArrivals = arrivals.filter(arrival => {
      const arrivalTime = arrival.estimated || arrival.scheduled;
      return arrivalTime > endOfDay;
    });
      
    const selectedLocation = [selectedStop.lng, selectedStop.lat];
      
    return {
      ...route,
      stop: selectedStop,
      distance: getDistance(currentLocation, selectedLocation),
      distanceString: getNormalizedDistanceString(currentLocation, selectedLocation),
      arrivals: filteredArrivals,
      futureArrivals: futureArrivals,
      currentStopIndex: currentIndex
    };
  });
}

/**
 * Sorts route structures prioritizing bookmarked routes, then by distance.
 */
export function sortRoutesByBookmarkAndDistance(routes: RouteStructure[]): RouteStructure[] {
  return routes.sort((a, b) => {
    const aBookmarked = isRouteBookmarkedInGroups(a.id, a.stop.locid, a.dir);
    const bBookmarked = isRouteBookmarkedInGroups(b.id, b.stop.locid, b.dir);
    
    if (aBookmarked && !bBookmarked) return -1;
    if (!aBookmarked && bBookmarked) return 1;
    
    return a.distance - b.distance;
  });
}
