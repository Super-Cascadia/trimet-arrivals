import { omit } from "lodash";
import { StopLocation } from "../../trimet/types";

const BOOKMARKS = "BOOKMARKS";
const BOOKMARK_SECTIONS = "BOOKMARK_SECTIONS";

interface StoredBookmarks {
  [locationId: number]: StopLocation;
}

function fetchLocalStorageItemByKey(key: string) {
  return JSON.parse(localStorage.getItem(key)) || {};
}

function updateBookmarksByKey(key: string, content) {
  localStorage.setItem(key, JSON.stringify(content));
}

export function fetchStoredBookmarks(): StoredBookmarks {
  return fetchLocalStorageItemByKey(BOOKMARKS);
}

function updateBookmarks(existingBookmarks) {
  updateBookmarksByKey(BOOKMARKS, existingBookmarks);
}

export function fetchStoredBookmarkSections() {
  return fetchLocalStorageItemByKey(BOOKMARK_SECTIONS);
}

function updateBookmarkSections(bookmarkSections) {
  updateBookmarksByKey(BOOKMARK_SECTIONS, bookmarkSections);
}

export function storeLocationBookmark(stopLocation: StopLocation) {
  const existingBookmarks = fetchStoredBookmarks();

  existingBookmarks[stopLocation.locid] = stopLocation;

  updateBookmarks(existingBookmarks);
}

export function removeStoredBookmark(locationId: number) {
  const bookmarks = fetchStoredBookmarks();
  const updatedBookmarks = omit(bookmarks, locationId);

  updateBookmarks(updatedBookmarks);
}

export function storeBookmarkSection(nextId: number, bookmarkSection) {
  const bookmarkSections = fetchStoredBookmarkSections();

  bookmarkSections[nextId] = bookmarkSection;

  updateBookmarkSections(bookmarkSections);
}

export function removeStoredBookmarkSection(bookmarkSectionId) {
  const bookmarkSections = fetchStoredBookmarkSections();
  const updatedBookmarkSections = omit(bookmarkSections, bookmarkSectionId);

  return updateBookmarkSections(updatedBookmarkSections);
}

export function updateStoredBookmarkSection(
  selectedBookmarkSection: number,
  stopLocation: StopLocation
) {
  return;
}
