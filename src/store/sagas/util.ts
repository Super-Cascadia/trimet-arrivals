import { isEmpty, keys } from "lodash";

export function logError(e) {
  // tslint:disable:no-console
  console.error(e);
  // tslint:enable:no-console
}

export function getNextId({ bookmarkSectionReducer }): number {
  if (isEmpty(bookmarkSectionReducer.bookmarkSections)) {
    return 0;
  }

  const bookmarksByKeys = keys(bookmarkSectionReducer.bookmarkSections);
  const lastKey = bookmarksByKeys[bookmarksByKeys.length - 1];

  return parseInt(lastKey, 10) + 1;
}

export function getBookmarkName({ bookmarkSectionReducer }) {
  return bookmarkSectionReducer.bookmarkInputSectionName;
}

export function buildBookmarkSection(bookmarkName: string) {
  return {
    bookmarkedStops: [],
    name: bookmarkName,
    order: 0
  };
}
