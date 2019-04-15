import { isEmpty } from "lodash";
import { createSelector } from "reselect";
import { StopLocation } from "../../api/trimet/types";
import { RootState } from "../reducers";
import { StopLocations } from "../reducers/bookmarksReducer";

const selectBookmarks = (state: RootState) => state.bookmarksReducer.bookmarks;
const selectBookmarkedStop = (state: RootState, locationId: number) =>
  state.bookmarksReducer.bookmarks[locationId];
const selectBookmarkInputSectionName = (state: RootState) =>
  state.bookmarksReducer.bookmarkInputSectionName;
const selectBookmarkSections = (state: RootState) =>
  state.bookmarksReducer.bookmarkSections;

export const bookmarksSelector = createSelector(
  selectBookmarks,
  (bookmarks: StopLocations) => bookmarks
);

export const bookmarkCountSelector = createSelector(
  selectBookmarks,
  (bookmarks: StopLocations) =>
    !isEmpty(bookmarks) && Object.keys(bookmarks).length
);

export const stopIsBookmarkedSelector = createSelector(
  selectBookmarkedStop,
  (stopLocation: StopLocation) => !isEmpty(stopLocation)
);

export const bookmarkInputSectionnameSelector = createSelector(
  selectBookmarkInputSectionName,
  (bookmarkSectionInputName: string) => bookmarkSectionInputName
);

export const bookmarkSectionSelector = createSelector(
  selectBookmarkSections,
  bookmarkSections => bookmarkSections
);
