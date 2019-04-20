import { isEmpty, keys, omit, omitBy, sortBy } from "lodash";
import { StopLocation } from "../../api/trimet/types";
import {
  CREATE_BOOKMARK_SECTION,
  CREATE_STOP_BOOKMARK,
  LOAD_BOOKMARKS_COMPLETE,
  REMOVE_BOOKMARK_SECTION,
  REMOVE_STOP_BOOKMARK,
  UPDATE_BOOKMARK_SECTION_NAME_INPUT,
  UPDATE_BOOKMARKS_SECTION_CONTENTS
} from "../constants";
import { RootState } from "./index";

export interface StopLocations {
  [locationId: number]: StopLocation;
}

export interface BookmarkSectionProps {
  name: string;
  order: number;
  bookmarkedStops: number[];
}

export interface BookmarkSectionsProps {
  [id: number]: BookmarkSectionProps;
}

export interface BookmarksReducerState {
  bookmarks: StopLocations;
  bookmarkInputSectionName: string;
  bookmarkSections: BookmarkSectionsProps;
}

interface Action {
  type: string;
  payload: {
    selectedBookmarkSection?: number;
    stopLocation?: StopLocation;
    locationId?: number;
    name?: string;
    nextId?: number;
    bookmarkSection?: BookmarkSectionProps;
    bookmarkSectionId?: number;
    bookmarkSections?: any;
    bookmarks?: {
      [locationId: number]: StopLocation;
    };
  };
}

const InitialState = {
  bookmarkInputSectionName: "",
  bookmarkSections: {},
  bookmarks: {}
};

function removeStopBookmark(state: BookmarksReducerState, action: Action) {
  const newBookmarks = omitBy({ ...state.bookmarks }, (item: StopLocation) => {
    return item.locid === action.payload.locationId;
  });

  return {
    ...state,
    bookmarks: newBookmarks
  };
}

function createStopBookmark(state: BookmarksReducerState, action: Action) {
  return {
    ...state,
    bookmarks: {
      ...state.bookmarks,
      [action.payload.stopLocation.locid]: {
        ...action.payload.stopLocation
      }
    }
  };
}

function loadBookmarksComplete(state: BookmarksReducerState, action: Action) {
  return {
    ...state,
    bookmarkSections: {
      ...action.payload.bookmarkSections
    },
    bookmarks: {
      ...action.payload.bookmarks
    }
  };
}

function updateBookmarkSectionName(
  state: BookmarksReducerState,
  action: Action
) {
  return {
    ...state,
    bookmarkInputSectionName: action.payload.name
  };
}

function createBookmarkSection(state: BookmarksReducerState, action: Action) {
  const { nextId, bookmarkSection } = action.payload;

  return {
    ...state,
    bookmarkInputSectionName: "",
    bookmarkSections: {
      ...state.bookmarkSections,
      [nextId]: bookmarkSection
    }
  };
}

function removeBookmarkSection(state: BookmarksReducerState, action: Action) {
  const updatedBookmarkSections = omit(
    state.bookmarkSections,
    action.payload.bookmarkSectionId
  );

  return {
    ...state,
    bookmarkSections: {
      ...updatedBookmarkSections
    }
  };
}

function updateBookmarkSectionContents(
  state: BookmarksReducerState,
  action: Action
) {
  const { bookmarkSections } = state;
  const { selectedBookmarkSection, stopLocation } = action.payload;
  const bookmarkSection = bookmarkSections[selectedBookmarkSection];

  bookmarkSection.bookmarkedStops.push(stopLocation.locid);

  return {
    ...state,
    bookmarkSections: {
      ...state.bookmarkSections,
      [selectedBookmarkSection]: {
        ...bookmarkSection
      }
    }
  };
}

const bookmarksReducer = (state = InitialState, action: Action) => {
  switch (action.type) {
    case CREATE_STOP_BOOKMARK:
      return createStopBookmark(state, action);
    case REMOVE_STOP_BOOKMARK:
      return removeStopBookmark(state, action);
    case LOAD_BOOKMARKS_COMPLETE:
      return loadBookmarksComplete(state, action);
    case UPDATE_BOOKMARK_SECTION_NAME_INPUT:
      return updateBookmarkSectionName(state, action);
    case CREATE_BOOKMARK_SECTION:
      return createBookmarkSection(state, action);
    case REMOVE_BOOKMARK_SECTION:
      return removeBookmarkSection(state, action);
    case UPDATE_BOOKMARKS_SECTION_CONTENTS:
      return updateBookmarkSectionContents(state, action);
    default:
      return {
        ...state
      };
  }
};

export default bookmarksReducer;
