import { Location } from "../trimet/types";
import { fixtureEnabled } from "../util";
import { geoLocationFixtureData } from "./fixture";

export function getCurrentPosition() {
  if (fixtureEnabled()) {
    return geoLocationFixtureData();
  }

  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition((location: Location) => {
      resolve(location);
    });
  });
}
