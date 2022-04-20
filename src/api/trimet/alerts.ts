import { API, BASE_URL } from "./constants";
import { AlertsData } from "./interfaces/alertsData";
import { getTrimetData } from "./util";

const ALERTS_BASE_URL = `${BASE_URL}v2/alerts/`;

function getAlertsByRouteURL(id: number): string {
  return `${ALERTS_BASE_URL}json/true/route/${id}/${API}`;
}

function getAlertsByStopURL(id: number): string {
  return `${ALERTS_BASE_URL}json/true/locIDs/${id}/${API}`;
}

export async function getAlertsByRouteId(id: number): Promise<AlertsData> {
  const request = getAlertsByRouteURL(id);

  return getTrimetData<AlertsData>(request);
}

export async function getAlertsByLocationId(id: number): Promise<AlertsData> {
  const request = getAlertsByStopURL(id);

  return getTrimetData<AlertsData>(request);
}

export async function getSytemAlerts(): Promise<AlertsData> {
  return getTrimetData<AlertsData>(`${ALERTS_BASE_URL}json/true/${API}`);
}
