import { Location } from "../trimet/types";

export function getCurrentPosition() {
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition((location: Location) => {
      resolve(location);
    });
  });
}
