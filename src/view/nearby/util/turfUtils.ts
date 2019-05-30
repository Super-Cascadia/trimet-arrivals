import * as turf from "@turf/turf";
import { round } from "lodash";

const MILE_IN_FEET = 5280;

export function getDistance(
  currentLocation: number[],
  arrivalLocation: number[]
): number {
  const from = turf.point([currentLocation[0], currentLocation[1]]);
  const to = turf.point([arrivalLocation[0], arrivalLocation[1]]);
  return turf.distance(from, to, { units: "miles" });
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

export function getNormalizedDistanceFromFeet(feet: number) {
  const diff = feet / MILE_IN_FEET;

  if (diff < 1) {
    return `${round(diff, 2)} feet away`;
  } else {
    return `${round(diff, 2)} miles away`;
  }
}
