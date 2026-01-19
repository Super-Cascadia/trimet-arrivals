import { fetchLocalStorageItemByKey, updateStoredItemByKey } from "./util";

export const TIME_FORMAT_KEY = "TIME_FORMAT";

export type TimeFormat = "12h" | "24h";

export function fetchStoredTimeFormat(): TimeFormat {
  const stored = fetchLocalStorageItemByKey(TIME_FORMAT_KEY);
  return stored.format || "12h";
}

export function storeTimeFormat(format: TimeFormat) {
  updateStoredItemByKey(TIME_FORMAT_KEY, { format });
}
