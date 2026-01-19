/**
 * TriMet service area boundaries
 * Covers Portland, Oregon metro area and surrounding suburbs
 */
export const TRIMET_SERVICE_AREA = {
  // Northern boundary (approximately Salem-Keizer area)
  north: 45.7,
  // Southern boundary (approximately Oregon City)
  south: 45.0,
  // Eastern boundary (approximately Gresham-Troutdale)
  east: -122.25,
  // Western boundary (approximately Hillsboro-Forest Grove)
  west: -123.0
};

/**
 * Checks if a coordinate is within the TriMet service area.
 * 
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @returns True if the coordinate is within the service area, false otherwise
 */
export function isWithinServiceArea(latitude: number, longitude: number): boolean {
  if (latitude === undefined || longitude === undefined) {
    return false;
  }

  return (
    latitude >= TRIMET_SERVICE_AREA.south &&
    latitude <= TRIMET_SERVICE_AREA.north &&
    longitude >= TRIMET_SERVICE_AREA.west &&
    longitude <= TRIMET_SERVICE_AREA.east
  );
}

/**
 * Gets the distance from a coordinate to the nearest service area boundary in miles.
 * Returns a negative value if inside the service area.
 * 
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @returns Distance in miles (negative if inside service area)
 */
export function getDistanceToServiceArea(latitude: number, longitude: number): number {
  if (isWithinServiceArea(latitude, longitude)) {
    return -1; // Inside service area
  }

  const latDiff = latitude > TRIMET_SERVICE_AREA.north
    ? latitude - TRIMET_SERVICE_AREA.north
    : TRIMET_SERVICE_AREA.south - latitude;

  const lngDiff = longitude > TRIMET_SERVICE_AREA.east
    ? longitude - TRIMET_SERVICE_AREA.east
    : TRIMET_SERVICE_AREA.west - longitude;

  // Approximate: 1 degree latitude = ~69 miles, 1 degree longitude varies by latitude
  const latMiles = latDiff * 69;
  const lngMiles = lngDiff * 50; // Approximate at Portland latitude

  return Math.sqrt(latMiles * latMiles + lngMiles * lngMiles);
}
