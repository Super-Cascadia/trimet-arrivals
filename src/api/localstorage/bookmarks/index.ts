import { omit } from "lodash";
import { StopLocation } from "../../trimet/types";

const BOOKMARKS_KEY = "bookmarks";

interface StoredBookmarks {
  [locationId: number]: StopLocation;
}

function fetchStoredBookmarks(): StoredBookmarks {
  return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || {};
}

function updateBookmarks(existingBookmarks) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(existingBookmarks));
}

export function storeLocationBookmark(stopLocation: StopLocation) {
  const existingBookmarks = fetchStoredBookmarks();

  existingBookmarks[stopLocation.locid] = stopLocation;

  updateBookmarks(existingBookmarks);
}

export function getStoredBookmarks(): StoredBookmarks {
  return JSON.parse(localStorage.getItem(BOOKMARKS_KEY));
}

export function removeStoredBookmark(locationId: number) {
  const bookmarks = fetchStoredBookmarks();

  const updatedBookmarks = omit(bookmarks, locationId);

  updateBookmarks(updatedBookmarks);
}
