import { isEmpty, map } from "lodash";
import { createSelector } from "reselect";
import { StopLocation } from "../../api/trimet/types";
import { RootState } from "../reducers";
import { StopLocations } from "../reducers/bookmarksReducer";

export const selectBookmarks = (state: RootState) =>
  state.bookmarksReducer.bookmarks;
const selectBookmarkedStop = (state: RootState, locationId: number) =>
  state.bookmarksReducer.bookmarks[locationId];

export const bookmarkedStopLocationsSelector = createSelector(
  selectBookmarks,
  (bookmarks: StopLocations) => bookmarks
);

export const bookmarkedStopLocationSelector = createSelector(
  selectBookmarks,
  (bookmarks: StopLocations) =>
    map(bookmarks, (stopLocation: StopLocation) => stopLocation)
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
