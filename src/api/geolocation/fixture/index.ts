import { Location } from "../../trimet/types";

export function geoLocationFixtureData(): Promise<Location> {
  return Promise.resolve({
    coords: {
      latitude: 123,
      longitude: 456
    }
  });
}
