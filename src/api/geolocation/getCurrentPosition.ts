import { Location } from "../trimet/types";
import { fixtureEnabled, useDefaultPortlandLocation } from "../util";
import { geoLocationFixtureData } from "./fixture";
import geoLocateCurrentPosition from "./geoLocateCurrentPosition";

function portlandGeoLocation(): Promise<Location> {
  const location: Location = {
    coords: {
      latitude: 45.5122,
      longitude: -122.6587
    }
  };

  return Promise.resolve(location);
}

export default function getCurrentPosition(): Promise<Location> {
  if (useDefaultPortlandLocation()) {
    return portlandGeoLocation();
  }

  if (fixtureEnabled()) {
    return geoLocationFixtureData();
  }

  return geoLocateCurrentPosition();
}
