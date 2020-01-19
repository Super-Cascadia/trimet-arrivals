import { fixtureEnabled } from "../util";
import { API, BASE_URL } from "./constants";
import { arrivalsFixtureData } from "./fixture";
import { ArrivalData } from "./interfaces/types";
import { getTrimetData } from "./util";

const ARRIVALS_BASE_URL = `${BASE_URL}V2/arrivals/`;

function getURL(locIDs: string, minutes: number): string {
  return `${ARRIVALS_BASE_URL}json/true/locIDs/${locIDs}/showPosition/true/minutes/${minutes}/${API}`;
}

export async function getArrivals(
  locIDs: string,
  minutes: number
): Promise<ArrivalData> {
  if (fixtureEnabled()) {
    return arrivalsFixtureData();
  }

  const request = getURL(locIDs, minutes);

  return getTrimetData<ArrivalData>(request);
}
