import { fetchLocalStorageItemByKey, updateStoredItemByKey } from "./util";

export const TIMEZONE_KEY = "TIMEZONE";

export type TimezoneType = "local" | "utc";

export function fetchStoredTimezone(): TimezoneType {
  const stored = fetchLocalStorageItemByKey(TIMEZONE_KEY);
  return stored.timezone || "local";
}

export function storeTimezone(timezone: TimezoneType) {
  updateStoredItemByKey(TIMEZONE_KEY, { timezone });
}
