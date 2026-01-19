import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";

export interface LegRenderData {
  mode: string;
  label: string;
  fromName: string;
  toName: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  distance?: number;
  routeNumber?: string;
  isTransit: boolean;
}

export function getLegRenderData(
  leg: any,
  fromStop: ArrivalLocation | null,
  toStop: ArrivalLocation | null
): LegRenderData {
  const mode = leg["@_mode"] || "Unknown";
  const isTransit =
    mode.toUpperCase() === "BUS" ||
    mode.toUpperCase() === "TRANSIT" ||
    mode.toUpperCase() === "RAIL";

  const routeName = leg.route?.name || "";
  const routeNumber = leg.route?.number || "";
  const routeLabel = isTransit && routeNumber
    ? `Route ${routeNumber}`
    : isTransit && routeName
    ? routeName
    : "";

  const fromName = leg.from?.description || fromStop?.desc || "Origin";
  const toName = leg.to?.description || toStop?.desc || "Destination";

  const timeDistance = leg["time-distance"];
  const duration = timeDistance?.duration || undefined;
  const distance = timeDistance?.distance || undefined;
  const startTime = timeDistance?.startTime || undefined;
  const endTime = timeDistance?.endTime || undefined;

  const modeLabel = mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
  const label = isTransit && routeLabel ? `${routeLabel}` : modeLabel;

  return {
    mode,
    label,
    fromName,
    toName,
    startTime,
    endTime,
    duration,
    distance,
    routeNumber,
    isTransit,
  };
}
