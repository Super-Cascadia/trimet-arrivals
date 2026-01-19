import { getNearbyStops } from "../../../api/trimet/stops";
import { logger } from "../../../api/util/logger";

/**
 * Check if a stop value represents a current location (coordinates)
 */
export function isCurrentLocationValue(value: string): boolean {
  return value.startsWith('current-');
}

/**
 * Extract coordinates from a current location value
 * @param value - Value in format "current-{lat}-{lng}"
 * @returns {lat, lng} or null if invalid
 */
export function parseCurrentLocationValue(value: string): { lat: number; lng: number } | null {
  if (!isCurrentLocationValue(value)) {
    return null;
  }

  try {
    // Remove "current-" prefix and split by "-"
    const coords = value.substring(8).split('-');
    
    if (coords.length !== 2) {
      logger.error('[locationUtils] Invalid current location format', { value });
      return null;
    }

    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);

    if (isNaN(lat) || isNaN(lng)) {
      logger.error('[locationUtils] Invalid coordinates in current location', { value, lat, lng });
      return null;
    }

    return { lat, lng };
  } catch (error) {
    logger.error('[locationUtils] Error parsing current location value', { value, error });
    return null;
  }
}

/**
 * Find the nearest stop to a current location value
 * @param value - Value in format "current-{lat}-{lng}"
 * @param radiusFeet - Search radius in feet (default 1640 feet = ~500 meters)
 * @returns Stop ID of nearest stop, or null if not found
 */
export async function findNearestStopFromCurrentLocation(
  value: string,
  radiusFeet: number = 1640
): Promise<number | null> {
  const coords = parseCurrentLocationValue(value);
  
  if (!coords) {
    return null;
  }

  try {
    logger.info('[locationUtils] Finding nearest stop to current location', coords);
    
    // Create a Location object for the API
    const location = {
      coords: {
        latitude: coords.lat,
        longitude: coords.lng,
        accuracy: 0,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    };
    
    const stopData = await getNearbyStops(location, radiusFeet);
    
    if (!stopData?.location || stopData.location.length === 0) {
      logger.warn('[locationUtils] No stops found near current location', coords);
      return null;
    }

    // Return the first (closest) stop
    const nearestStop = stopData.location[0];
    logger.info('[locationUtils] Found nearest stop', { 
      stopId: nearestStop.locid, 
      stopDesc: nearestStop.desc 
    });
    
    return nearestStop.locid;
  } catch (error) {
    logger.error('[locationUtils] Error finding nearest stop', { coords, error });
    return null;
  }
}
