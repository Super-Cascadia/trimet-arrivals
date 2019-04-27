import { filter, find, omit } from "lodash";
import { BookmarkSectionsProps } from "../../store/reducers/bookmarkSectionReducer";
import { fetchLocalStorageItemByKey, updateStoredItemByKey } from "./util";

const BOOKMARK_SECTIONS = "BOOKMARK_SECTIONS";

export function fetchStoredBookmarkSections(): BookmarkSectionsProps {
  return fetchLocalStorageItemByKey(BOOKMARK_SECTIONS);
}

function updateStoredBookmarkSections(bookmarkSections) {
  updateStoredItemByKey(BOOKMARK_SECTIONS, bookmarkSections);
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
  stopId: number
) {
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
    bookmarkSections[bookmarkSectionId].bookmarkedStops = filter(
      bookmarkSectionStops,
      id => id !== stopId
    );

    updateStoredBookmarkSections(bookmarkSections);
  }
}
