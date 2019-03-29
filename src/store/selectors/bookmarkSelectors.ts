import { createSelector } from "reselect";
import { RootState } from "../reducers";

const selectBookmarks = (state: RootState) => state.bookmarksReducer.bookmarks;

export const bookmarksSelector = createSelector(
  selectBookmarks,
  (bookmarks: []) => bookmarks
);
