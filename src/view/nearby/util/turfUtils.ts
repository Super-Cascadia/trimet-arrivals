import { distance, point } from "@turf/turf";
import { round } from "lodash";

const MILE_IN_FEET = 5280;

export function getDistance(
  currentLocation: number[],
  arrivalLocation: number[]
): number {
  const from = point([currentLocation[0], currentLocation[1]]);
  const to = point([arrivalLocation[0], arrivalLocation[1]]);
  return distance(from, to, { units: "miles" });
}

export function getNormalizedDistanceString(
  currentLocation: number[],
  arrivalLocation: number[]
) {
  const distanceFromCurrentLocation = getDistance(
    currentLocation,
    arrivalLocation
  );

  if (distanceFromCurrentLocation < 1) {
    const distanceInFeet = round(MILE_IN_FEET * distanceFromCurrentLocation, 2);

    return `${distanceInFeet} feet away`;
  } else {
    const roundedMiles = round(distanceFromCurrentLocation, 2);

    return `${roundedMiles} miles away`;
  }
}
