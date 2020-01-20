import { API, BASE_URL } from "./constants";
import { RouteData } from "./interfaces/routes";
import { getTrimetData } from "./util";

const ARRIVALS_BASE_URL = `${BASE_URL}V1/routeConfig/route/70/dir/true/stops/true/`;

function getURL(id: number): string {
  return `${ARRIVALS_BASE_URL}json/true/route/${id}/dir/true/stops/true/${API}`;
}

export async function getRouteById(id: number): Promise<RouteData> {
  const request = getURL(id);

  return getTrimetData<RouteData>(request);
}
