import { getDistance } from "geolib";
import { map, mapKeys } from "lodash";
import { Coords, StopLocation } from "../../../api/trimet/interfaces/types";

export interface StopLocationsDictionary {
  [locationId: number]: StopLocation;
}

export interface StopLocationWithDistance extends StopLocation {
  distance: number;
  distanceOrder: number;
}

/**
 * Calculates the distance in meters between a stop location and the current location.
 * 
 * @param lng - Longitude of the stop location
 * @param lat - Latitude of the stop location
 * @param currentLocation - Current user coordinates
 * @returns Distance in meters between the two coordinates
 */
function calculateDistance(
  lng: number,
  lat: number,
  currentLocation: Coords
): number {
  const stopLocation = { latitude: lat, longitude: lng };

  return getDistance(stopLocation, currentLocation);
}

/**
 * Adds distance and distanceOrder properties to each stop location based on the current location.
 * 
 * @param stopLocation - Array of stop locations to enrich with distance data
 * @param currentLocation - Current user coordinates to calculate distances from
 * @returns Array of stop locations with added distance and distanceOrder properties
 */
function addDistanceToCurrentLocation(
  stopLocation: StopLocation[],
  currentLocation: Coords
): StopLocationWithDistance[] {
  return map(stopLocation, (location: StopLocation, index) => {
    return {
      ...location,
      distance: calculateDistance(location.lng, location.lat, currentLocation),
      distanceOrder: index
    };
  });
}

/**
 * Formats an array of stop locations into a dictionary with distances calculated from the current location.
 * Each stop is enriched with distance and distanceOrder properties, then indexed by its location ID.
 * 
 * @param stopLocation - Array of stop locations to format
 * @param currentLocation - Current user coordinates to calculate distances from
 * @returns A dictionary mapping location IDs to stop locations with distance information
 */
export default function formatStopLocations(
  stopLocation: StopLocation[],
  currentLocation: Coords
): StopLocationsDictionary {
  const stopLocationsWithDistance = addDistanceToCurrentLocation(
    stopLocation,
    currentLocation
  );

  return mapKeys(stopLocationsWithDistance, (location: StopLocation) => {
    const id = location.locid ? location.locid : location.id;

    return id;
  });
}
