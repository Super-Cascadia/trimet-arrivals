import { Location } from "../trimet/interfaces/types";

export default function geoLocateCurrentPosition(): Promise<Location> {
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition((location: Location) => {
      resolve(location);
    });
  });
}
