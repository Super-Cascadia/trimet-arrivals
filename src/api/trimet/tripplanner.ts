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
export async function planTrip(opts: TripPlannerOptions): Promise<any> {
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
