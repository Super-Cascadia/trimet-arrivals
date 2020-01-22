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

function calculateDistance(
  lng: number,
  lat: number,
  currentLocation: Coords
): number {
  const stopLocation = { latitude: lat, longitude: lng };

  return getDistance(stopLocation, currentLocation);
}

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

export default function formatStopLocations(
  stopLocation: StopLocation[],
  currentLocation: Coords
): StopLocationsDictionary {
  const stopLocationsWithDistance = addDistanceToCurrentLocation(
    stopLocation,
    currentLocation
  );

  return mapKeys(stopLocationsWithDistance, (location: StopLocation) => {
    return location.locid;
  });
}
