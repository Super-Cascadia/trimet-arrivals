import { isEmpty, keys, omit, omitBy, sortBy } from "lodash";
import { StopLocation } from "../../api/trimet/types";
import {
  CREATE_BOOKMARK_SECTION,
  CREATE_STOP_BOOKMARK,
  LOAD_BOOKMARKS_COMPLETE,
  REMOVE_BOOKMARK_SECTION,
  REMOVE_STOP_BOOKMARK,
  UPDATE_BOOKMARK_SECTION_NAME_INPUT
} from "../constants";

export interface StopLocations {
  [locationId: number]: StopLocation;
}

export interface BookmarkSection {
  name: string;
  order: number;
  bookmarkedStops: number[];
}

export interface BookmarkSectionsProps {
  [id: number]: BookmarkSection;
}

export interface BookmarksReducerState {
  bookmarks: StopLocations;
  bookmarkInputSectionName: string;
  bookmarkSections: BookmarkSectionsProps;
}

interface Action {
  type: string;
  payload: {
    stopLocation?: StopLocation;
    locationId?: number;
    name?: string;
    bookmarkSectionId?: number;
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

function removeStopBookmark(state, action: Action) {
  const newBookmarks = omitBy({ ...state.bookmarks }, (item: StopLocation) => {
    return item.locid === action.payload.locationId;
  });

  return {
    ...state,
    bookmarks: newBookmarks
  };
}

function createStopBookmark(state, action: Action) {
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

function loadBookmarksComplete(state, action: Action) {
  return {
    ...state,
    bookmarks: {
      ...action.payload.bookmarks
    }
  };
}

function updateBookmarkSectionName(state, action: Action) {
  return {
    ...state,
    bookmarkInputSectionName: action.payload.name
  };
}

function getNextId(state) {
  if (isEmpty(state.bookmarkSections)) {
    return 0;
  }

  const bookmarksByKeys = keys(state.bookmarkSections);
  const lastKey = bookmarksByKeys[bookmarksByKeys.length - 1];

  return lastKey + 1;
}

function createBookmarkSection(state) {
  const name = state.bookmarkInputSectionName;
  const nextId = getNextId(state);

  return {
    ...state,
    bookmarkInputSectionName: "",
    bookmarkSections: {
      ...state.bookmarkSections,
      [nextId]: {
        bookmarkedStops: [],
        name,
        order: 0
      }
    }
  };
}

function removeBookmarkSection(state, action: Action) {
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
      return createBookmarkSection(state);
    case REMOVE_BOOKMARK_SECTION:
      return removeBookmarkSection(state, action);
    default:
      return {
        ...state
      };
  }
};

export default bookmarksReducer;
