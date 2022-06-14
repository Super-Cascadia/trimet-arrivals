import { fixtureEnabled } from "../util";
import { API, BASE_URL } from "./constants";
import { arrivalsFixtureData } from "./fixture";
import { ArrivalData } from "./interfaces/arrivals";
import { getTrimetData } from "./util";

const ARRIVALS_BASE_URL = `${BASE_URL}V2/vehicles/`;

function getURL(locIDs: string, minutes: number): string {
  return `${ARRIVALS_BASE_URL}json/true/locIDs/${locIDs}/arrivals/4/showPosition/true/minutes/${minutes}/${API}`;
}

export async function getVehicles(
  locIDs: string,
  minutes: number
): Promise<ArrivalData> {
  if (fixtureEnabled()) {
    return arrivalsFixtureData();
  }

  const request = getURL(locIDs, minutes);

  return getTrimetData<ArrivalData>(request);
}
