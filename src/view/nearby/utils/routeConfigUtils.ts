/**
 * Utility functions for processing TriMet route configuration data.
 */

import { ArrivalLocation } from "../../../api/trimet/interfaces/arrivals";
import { RouteDataResultSet } from "../../../api/trimet/interfaces/routes";

export interface RouteConfigData {
  dirDesc: string;
  fromStop: ArrivalLocation | null;
  toStop: ArrivalLocation | null;
  intermediateStops: Array<{ locid: number; desc: string }>;
}

/**
 * Processes route config data to extract stop information and intermediate stops.
 * 
 * @param routeData - Route config response from TriMet API
 * @param direction - Direction number (0 or 1)
 * @param fromStopId - Stop ID for origin
 * @param toStopId - Stop ID for destination
 * @returns Object containing direction description and stop locations
 */
export function processRouteConfig(
  routeData: RouteDataResultSet,
  direction: number,
  fromStopId: number,
  toStopId: number
): RouteConfigData {
  const route = routeData.route?.[0];
  const matchingDir = route?.dir?.find(d => d.dir === direction);
  const stops = matchingDir?.stop || [];

  const fromStopRaw = stops.find(s => s.locid === fromStopId);
  const toStopRaw = stops.find(s => s.locid === toStopId);

  const dirDesc = matchingDir?.desc || "";
  let fromStop: ArrivalLocation | null = null;
  let toStop: ArrivalLocation | null = null;
  let intermediateStops: Array<{ locid: number; desc: string }> = [];

  if (fromStopRaw && toStopRaw) {
    fromStop = {
      id: fromStopRaw.locid,
      desc: fromStopRaw.desc,
      lat: fromStopRaw.lat,
      lng: fromStopRaw.lng,
      dir: String(matchingDir?.dir || direction),
      passengerCode: ""
    };

    toStop = {
      id: toStopRaw.locid,
      desc: toStopRaw.desc,
      lat: toStopRaw.lat,
      lng: toStopRaw.lng,
      dir: String(matchingDir?.dir || direction),
      passengerCode: ""
    };

    // Compute intermediate stops between origin and destination
    const fromSeq = fromStopRaw.seq;
    const toSeq = toStopRaw.seq;
    const start = Math.min(fromSeq, toSeq);
    const end = Math.max(fromSeq, toSeq);
    intermediateStops = stops
      .filter(s => s.seq > start && s.seq < end)
      .map(s => ({ locid: s.locid, desc: s.desc }));
  }

  return { dirDesc, fromStop, toStop, intermediateStops };
}
