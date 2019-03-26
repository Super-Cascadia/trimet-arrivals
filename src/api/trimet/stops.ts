import { fixtureEnabled } from "../util";
import { API, BASE_URL } from "./constants";
import { stopFixtureData } from "./fixture";
import { Location, StopData } from "./types";
import { getTrimetData } from "./util";

const STOPS_BASE_URL = `${BASE_URL}V1/stops/`;

function getURL(lat: number, long: number, radiusInFeet: number): string {
  const latLng = `${lat},${long}`;
  const feet = `feet/${radiusInFeet}`;

  return `${STOPS_BASE_URL}json/true/showRoutes/true/showRouteDirs/true/ll/${latLng}/${feet}/${API}`;
}

export async function getNearbyStops(
  location: Location,
  radiusInFeet: number
): Promise<StopData> {
  if (fixtureEnabled()) {
    return stopFixtureData();
  }

  const { coords } = location;
  const { latitude, longitude } = coords;
  const request = getURL(latitude, longitude, radiusInFeet);

  return getTrimetData<StopData>(request);
}
