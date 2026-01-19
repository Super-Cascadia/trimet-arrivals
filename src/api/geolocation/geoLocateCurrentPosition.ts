import { Location } from "../trimet/interfaces/types";

/**
 * Retrieves the user's current geographic position using the browser's Geolocation API.
 * 
 * @returns A Promise that resolves with the user's current Location, or rejects with an Error
 * if the geolocation request fails (e.g., user denies permission, timeout, or unavailable).
 */
export default function geoLocateCurrentPosition(): Promise<Location> {

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (location: Location) => {
        resolve(location);
      },
      error => {
        // Reject with the original error to avoid undefined rejection reasons
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    );
  });
}
