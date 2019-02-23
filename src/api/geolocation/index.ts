import { Location } from "../trimet/types";
import { fixtureEnabled, useDefaultPortlandLocation } from "../util";
import { geoLocationFixtureData } from "./fixture";

export function getCurrentPosition(): Promise<Location> {
  if (useDefaultPortlandLocation()) {
    return Promise.resolve({
      coords: {
        latitude: 45.5122,
        longitude: -122.6587
      }
    });
  }

  if (fixtureEnabled()) {
    return geoLocationFixtureData();
  }

  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition((location: Location) => {
      resolve(location);
    });
  });
}
