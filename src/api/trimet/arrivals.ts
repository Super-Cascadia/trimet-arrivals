import { fixtureEnabled } from "../util";
import { API, BASE_URL } from "./constants";
import { arrivalsFixtureData } from "./fixture";
import { ArrivalData } from "./interfaces/arrivals";
import { getTrimetData } from "./util";

const ARRIVALS_BASE_URL = `${BASE_URL}V2/arrivals/`;

function getURL(stopLocationIds: string, minutes: number): string {
  return `${ARRIVALS_BASE_URL}json/true/locIDs/${stopLocationIds}/arrivals/4/showPosition/true/minutes/${minutes}/${API}`;
}

export async function getArrivals(
  stopLocationIds: string, // should be an ',' joined string of stop location ids like 123,456,789
  minutes: number
): Promise<ArrivalData> {
  if (fixtureEnabled()) {
    return arrivalsFixtureData();
  }

  const request = getURL(stopLocationIds, minutes);

  return getTrimetData<ArrivalData>(request);
}
