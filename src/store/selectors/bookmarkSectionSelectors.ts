import { createSelector } from "reselect";
import { RootState } from "../reducers";
import {
  BookmarkSectionProps,
  BookmarkSectionsProps
} from "../reducers/bookmarkSectionReducer";

const selectSectionName = (state: RootState) => {
  return state.bookmarkSectionReducer.bookmarkInputSectionName;
};

const selectSections = (state: RootState) => {
  return state.bookmarkSectionReducer.bookmarkSections;
};

const selectSectionById = (state: RootState, id: number) => {
  return state.bookmarkSectionReducer.bookmarkSections[id];
};

export const sectionNameInputSelector = createSelector(
  selectSectionName,
  (bookmarkSectionInputName: string) => bookmarkSectionInputName
);

export const bookmarkSectionSelectors = createSelector(
  selectSections,
  (bookmarkSections: BookmarkSectionsProps) => bookmarkSections
);

export const bookmarkSectionNameSelector = createSelector(
  selectSectionById,
  (section: BookmarkSectionProps) => section.name
);

export const bookmarkSectionStopsSelector = createSelector(
  selectSectionById,
  (section: BookmarkSectionProps) => section.bookmarkedStops
);
