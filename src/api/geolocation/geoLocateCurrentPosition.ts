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

  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition((location: Location) => {
      resolve(location);
    });
  });
}
