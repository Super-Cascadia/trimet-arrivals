import { API, BASE_URL } from "./constants";
import { ArrivalData } from "./types";
import { getTrimetData } from "./util";

const ARRIVALS_BASE_URL = `${BASE_URL}V2/arrivals/`;

function getURL(locIDs: string, minutes: number): string {
  return `${ARRIVALS_BASE_URL}json/true/locIDs/${locIDs}/showPosition/true/minutes/${minutes}/${API}`;
}

export function getArrivals(
  locIDs: string,
  minutes: number
) {
  const request = getURL(locIDs, minutes);

  return getTrimetData(request);
}
