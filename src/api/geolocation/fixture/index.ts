import { Location } from "../../trimet/interfaces/types";

export function geoLocationFixtureData(): Promise<Location> {
  return Promise.resolve({
    coords: {
      latitude: 123,
      longitude: 456
    }
  });
}
