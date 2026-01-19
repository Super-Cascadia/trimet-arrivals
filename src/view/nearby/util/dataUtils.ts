import { Dictionary, flatten, groupBy, map, mapKeys, mapValues } from "lodash";
import {
  Direction,
  StopData,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";

/**
 * Processes stop data to extract and group routes by route number and direction.
 * 
 * @param stopData - The stop data containing locations and their associated routes
 * @returns A dictionary mapping route numbers to arrays of TrimetRoute objects with unique route-direction combinations
 */
export function processRoutes(stopData: StopData): Dictionary<TrimetRoute[]> {
  // Guard against missing or invalid location data
  if (!stopData || !stopData.location || stopData.location.length === 0) {
    return {};
  }
  
  const routes = stopData.location.map((location: StopLocation) => {
    return location.route.map((route: TrimetRoute) => route);
  });
  const mappedKeys = mapKeys(
    flatten(routes),
    (item: TrimetRoute) => `${item.route}-${item.dir[0].dir}`
  );

  return groupBy(mappedKeys, (key: TrimetRoute) => key.route);
}

/**
 * Extracts route IDs and their directions from nearby routes data.
 * 
 * @param nearbyRoutes - A dictionary of TriMet routes grouped by route number
 * @returns A dictionary mapping route IDs to objects containing arrays of direction codes
 */
export function getNearbyRouteIds(
  nearbyRoutes: Dictionary<TrimetRoute[]>
): NearbyRoutesDictionary {
  return mapValues(nearbyRoutes, (routes: TrimetRoute[]) => {
    const directions = map(routes, (route: TrimetRoute) => {
      return map(route.dir, (dir: Direction) => {
        return dir.dir;
      });
    });

    return {
      directions: flatten(directions)
    };
  });
}

/**
 * Converts nearby stop data into a dictionary of stop locations indexed by location ID.
 * 
 * @param nearbyStops - The stop data containing an array of stop locations
 * @returns A dictionary mapping location IDs to their corresponding StopLocation objects
 */
export function getStopLocations(
  nearbyStops: StopData
): StopLocationsDictionary {
  if (!nearbyStops || !nearbyStops.location || nearbyStops.location.length === 0) {
    return {};
  }
  
  return mapKeys(nearbyStops.location, (location: StopLocation) => {
    return location.locid;
  });
}
