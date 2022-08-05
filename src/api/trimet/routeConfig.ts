import { fixtureEnabled } from "../util";
import { API, BASE_URL } from "./constants";
import { allRoutesFixtureData, routeFixtureById } from "./fixture/allRoutes";
import { RouteDataResultSet } from "./interfaces/routes";
import { getTrimetData } from "./util";

const ROUTE_BASE_URL = `${BASE_URL}V1/routeConfig/`;

function getRouteByIdUrl(id: number): string {
  return `${ROUTE_BASE_URL}json/true/route/${id}/dir/true/stops/true/${API}`;
}

function getRouteByIdAndDirectionUrl(id: number, direction: number): string {
  return `${ROUTE_BASE_URL}json/true/route/${id}/dir/${direction}/stops/true/${API}`;
}

function getAllRoutesUrl(): string {
  return `${ROUTE_BASE_URL}json/true/dir/true/stops/true/${API}`;
}

function getSubsequentRouteStopsUrl(
  id: number,
  direction: number,
  locId: number
): string {
  return `${ROUTE_BASE_URL}json/true/route/${id}/dir/${direction}/stops/true/startSeq/${locId}/${API}`;
}

export async function getRouteById(id: number): Promise<RouteDataResultSet> {
  const request = getRouteByIdUrl(id);

  return getTrimetData<RouteDataResultSet>(request);
}

export async function getRouteByIdAndDirection(
  id: number,
  direction: number
): Promise<RouteDataResultSet> {
  const request = getRouteByIdAndDirectionUrl(id, direction);

  return getTrimetData<RouteDataResultSet>(request);
}

export async function getAllRoutes(): Promise<RouteDataResultSet> {
  if (fixtureEnabled()) {
    return allRoutesFixtureData();
  }

  const request = getAllRoutesUrl();

  return getTrimetData<RouteDataResultSet>(request);
}

export async function getSubsequentRouteStops(
  id: number,
  direction: number,
  locid: number
): Promise<RouteDataResultSet> {
  const request = getSubsequentRouteStopsUrl(id, direction, locid);

  return getTrimetData<RouteDataResultSet>(request);
}
