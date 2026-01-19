import { Map } from "mapbox-gl";
import * as turf from "@turf/turf";

export function calculateRadiusFromMap(map: Map): number {
  // Get the bounds of the map
  const bounds = map.getBounds();
  const center = map.getCenter();

  // Calculate the vertical distance in the map (from center to top)
  const northEast = bounds.getNorthEast();

  // Use turf to calculate distance
  const centerPoint = turf.point([center.lng, center.lat]);
  const topPoint = turf.point([center.lng, northEast.lat]);

  // Distance from center to top in miles
  const distanceMiles = turf.distance(centerPoint, topPoint, { units: "miles" });

  // Convert to feet and multiply by 1.5 (50% larger)
  const distanceFeet = distanceMiles * 5280 * 1.5;

  return Math.round(distanceFeet);
}
