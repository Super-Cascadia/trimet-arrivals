import { find, omit, remove } from "lodash";
import { BookmarkSectionsProps } from "../../../store/reducers/bookmarkSectionReducer";
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

export function fetchStoredBookmarkSections(): BookmarkSectionsProps {
  return fetchLocalStorageItemByKey(BOOKMARK_SECTIONS);
}

function updateStoredBookmarkSections(bookmarkSections) {
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

  updateStoredBookmarkSections(bookmarkSections);
}

export function removeStoredBookmarkSection(bookmarkSectionId: number) {
  const bookmarkSections = fetchStoredBookmarkSections();
  const updatedBookmarkSections = omit(bookmarkSections, bookmarkSectionId);

  updateStoredBookmarkSections(updatedBookmarkSections);
}

export function updateStoredBookmarkSection(
  bookmarkSectionId: number,
  stopLocation: StopLocation
) {
  const stopId = stopLocation.locid;
  const bookmarkSections = fetchStoredBookmarkSections();
  const bookmarkSection = bookmarkSections[bookmarkSectionId];
  const bookmarkInSection = find(
    bookmarkSection.bookmarkedStops,
    stop => stop === stopId
  );

  if (!bookmarkInSection) {
    bookmarkSection.bookmarkedStops.push(stopId);
    updateStoredBookmarkSections(bookmarkSections);
  }
}

export function removeStoredBookmarkFromSection(
  bookmarkSectionId: number,
  stopId: number
) {
  const bookmarkSections = fetchStoredBookmarkSections();
  const bookmarkSection = bookmarkSections[bookmarkSectionId];
  const bookmarkSectionStops = bookmarkSection.bookmarkedStops;
  const bookmarkInSection = find(bookmarkSectionStops, stop => stop === stopId);

  if (bookmarkInSection) {
    bookmarkSections[bookmarkSectionId].bookmarkedStops = remove(
      bookmarkSectionStops,
      bookmarkedStopId => {
        return bookmarkedStopId === stopId;
      }
    );

    updateStoredBookmarkSections(bookmarkSections);
  }
}
