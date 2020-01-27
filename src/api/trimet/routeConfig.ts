import { API, BASE_URL } from "./constants";
import { RouteData } from "./interfaces/routes";
import { getTrimetData } from "./util";

const ROUTE_BASE_URL = `${BASE_URL}V1/routeConfig/`;

function getRouteByIdUrl(id: number): string {
  return `${ROUTE_BASE_URL}json/true/route/${id}/dir/true/stops/true/${API}`;
}

function getAllRoutesUrl(): string {
  return `${ROUTE_BASE_URL}json/true/dir/true/${API}`;
}

export async function getRouteById(id: number): Promise<RouteData> {
  const request = getRouteByIdUrl(id);

  return getTrimetData<RouteData>(request);
}

export async function getAllRoutes(): Promise<RouteData> {
  const request = getAllRoutesUrl();

  return getTrimetData<RouteData>(request);
}
