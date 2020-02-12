import { fixtureEnabled } from "../util";
import { API, BASE_URL } from "./constants";
import { allRoutesFixtureData, routeFixtureById } from "./fixture/allRoutes";
import { RouteData, RouteDataResultSet } from "./interfaces/routes";
import { getTrimetData } from "./util";

const ROUTE_BASE_URL = `${BASE_URL}V1/routeConfig/`;

function getRouteByIdUrl(id: number): string {
  return `${ROUTE_BASE_URL}json/true/route/${id}/dir/true/stops/true/${API}`;
}

function getAllRoutesUrl(): string {
  return `${ROUTE_BASE_URL}json/true/dir/true/${API}`;
}

export async function getRouteById(id: number): Promise<RouteDataResultSet> {
  if (fixtureEnabled()) {
    return routeFixtureById(id);
  }

  const request = getRouteByIdUrl(id);

  return getTrimetData<RouteDataResultSet>(request);
}

export async function getAllRoutes(): Promise<RouteDataResultSet> {
  if (fixtureEnabled()) {
    return allRoutesFixtureData();
  }

  const request = getAllRoutesUrl();

  return getTrimetData<RouteDataResultSet>(request);
}
