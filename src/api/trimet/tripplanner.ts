import { BASE_URL, API_ID } from "./constants";
import { XMLParser } from "fast-xml-parser";

const TRIPPLANNER_BASE_URL = `${BASE_URL}V1/trips/tripplanner/`;

export interface TripPlannerOptions {
  fromPlace?: string;
  fromCoord?: string; // "lon,lat" e.g. "-122.72,45.51"
  toPlace?: string;
  toCoord?: string; // "lon,lat"
  date?: string; // e.g. "12-18-2025" or "9/9/2009"
  time?: string; // e.g. "2:00 PM"
  arr?: "D" | "A"; // Depart by / Arrive by
  min?: "T" | "X" | "W"; // Quickest / Fewest Transfers / Shortest Walk
  walk?: number; // miles 0.01 - 0.999
  mode?: "A" | "B" | "T"; // All / Bus / Train
  maxIntineraries?: number; // default 3, max 6
}

// Trip Planner Response Interfaces
export interface Position {
  x: number;
  y: number;
  lat: number;
  lon: number;
}

export interface Location {
  pos: Position;
  description: string;
}

export interface StopLocation extends Location {
  stopId?: number;
  stopSequence?: number;
  "@_xsi:type"?: string;
}

export interface RouteInfo {
  number: number | string;
  internalNumber?: number | string;
  name: string;
  key?: string;
  direction?: string;
  block?: number;
}

export interface TimeDistance {
  date?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  distance?: number;
  numberOfTransfers?: number;
  numberOfTripLegs?: number;
  walkingTime?: number;
  transitTime?: number;
  waitingTime?: number;
}

export interface FareItem {
  "#text": number;
  "@_id": string;
}

export interface Fare {
  regular?: number;
  special?: FareItem | FareItem[];
}

export interface TripLeg {
  "time-distance": TimeDistance;
  from: StopLocation;
  to: StopLocation;
  route?: RouteInfo;
  direction?: string;
  lineURL?: {
    url: string;
    "@_param": string;
  };
  "@_id": string;
  "@_mode": "Walk" | "Bus" | "Rail" | "Transit";
  "@_order": "start" | "end" | "transfer";
  "@_xsi:type"?: string;
  "@_xmlns:ns"?: string;
  "@_xmlns:xsi"?: string;
}

export interface Itinerary {
  "time-distance": TimeDistance;
  fare?: Fare;
  leg: TripLeg[];
  "@_id": string;
  "@_viaRoute"?: string;
}

export interface Itineraries {
  itinerary: Itinerary | Itinerary[];
  "@_count": string;
}

export interface TripPlannerRequest {
  url: string;
  param?: Array<{
    "#text": string | number;
    "@_name": string;
  }>;
}

export interface TripPlannerResponse {
  "?xml"?: {
    "@_version": string;
    "@_encoding": string;
  };
  response: {
    date: string;
    time: string;
    request: TripPlannerRequest;
    from: Location;
    to: Location;
    itineraries: Itineraries;
    "@_success": "true" | "false";
    "@_xmlns": string;
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}

function buildQueryURL(opts: TripPlannerOptions): string {
  const params: string[] = [];
  if (opts.fromPlace) params.push(`fromPlace=${encode(opts.fromPlace)}`);
  if (opts.fromCoord) params.push(`fromCoord=${encode(opts.fromCoord)}`);
  if (opts.toPlace) params.push(`toPlace=${encode(opts.toPlace)}`);
  if (opts.toCoord) params.push(`toCoord=${encode(opts.toCoord)}`);
  if (opts.date) params.push(`date=${encode(opts.date)}`);
  if (opts.time) params.push(`time=${encode(opts.time)}`);
  if (opts.arr) params.push(`arr=${opts.arr}`);
  if (opts.min) params.push(`min=${opts.min}`);
  if (typeof opts.walk === "number") params.push(`walk=${opts.walk}`);
  if (opts.mode) params.push(`mode=${opts.mode}`);
  if (typeof opts.maxIntineraries === "number") params.push(`maxIntineraries=${opts.maxIntineraries}`);

  // Trip Planner only supports XML format per docs
  params.push("format=xml");

  const query = params.join("&");
  // Trip Planner expects appId as a query parameter (case-insensitive)
  return `${TRIPPLANNER_BASE_URL}?${query}&appId=${encode(API_ID)}`;
}

/**
 * Fetches Trip Planner XML and returns a parsed JSON object.
 */
export async function planTrip(opts: TripPlannerOptions): Promise<TripPlannerResponse> {
  const request = buildQueryURL(opts);
  const res = await fetch(request);
  if (!res.ok) {
    throw new Error(`Network response not ok (${res.status} ${res.statusText}) for ${request}`);
  }
  const xml = await res.text();

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const parsed = parser.parse(xml);
  console.log("Parsed Trip Planner response:", parsed);
  return parsed;
}
