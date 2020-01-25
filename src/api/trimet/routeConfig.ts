import { API, BASE_URL } from "./constants";
import { RouteData } from "./interfaces/routes";
import { getTrimetData } from "./util";

const ROUTE_BASE_URL = `${BASE_URL}V1/routeConfig/`;

function getURL(id: number): string {
  return `${ROUTE_BASE_URL}json/true/route/${id}/dir/true/stops/true/${API}`;
}

export async function getRouteById(id: number): Promise<RouteData> {
  const request = getURL(id);

  return getTrimetData<RouteData>(request);
}
