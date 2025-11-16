import { Location } from "../trimet/interfaces/types";

const useDefault = true;

export default function geoLocateCurrentPosition(): Promise<Location> {
  if (useDefault) {
    return Promise.resolve({
      coords: {
        latitude: 45.482635757750785,
        longitude: -122.71025403662343
      }
    });
  }

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
