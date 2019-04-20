import { omit } from "lodash";
import { StopLocation } from "../../api/trimet/types";
import {
  CREATE_BOOKMARK_SECTION,
  LOAD_BOOKMARK_SECTIONS_COMPLETE,
  REMOVE_BOOKMARK_SECTION,
  UPDATE_BOOKMARK_SECTION_NAME_INPUT,
  UPDATE_BOOKMARKS_SECTION_CONTENTS
} from "../constants/bookmarkSections";

export interface BookmarkSectionProps {
  name: string;
  order: number;
  bookmarkedStops: number[];
}

export interface BookmarkSectionsProps {
  [id: number]: BookmarkSectionProps;
}

export interface BookmarkSectionReducerState {
  bookmarkInputSectionName: string;
  bookmarkSections: BookmarkSectionsProps;
}

interface Action {
  type: string;
  payload: {
    selectedBookmarkSection?: number;
    stopLocation?: StopLocation;
    name?: string;
    nextId?: number;
    bookmarkSection?: BookmarkSectionProps;
    bookmarkSectionId?: number;
    bookmarkSections?: any;
  };
}

const InitialState = {
  bookmarkInputSectionName: "",
  bookmarkSections: {}
};

function updateBookmarkSectionName(
  state: BookmarkSectionReducerState,
  action: Action
) {
  return {
    ...state,
    bookmarkInputSectionName: action.payload.name
  };
}

function createBookmarkSection(
  state: BookmarkSectionReducerState,
  action: Action
) {
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

function removeBookmarkSection(
  state: BookmarkSectionReducerState,
  action: Action
) {
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
  state: BookmarkSectionReducerState,
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

function loadBookmarkSectionsComplete(
  state: BookmarkSectionReducerState,
  action: Action
) {
  return {
    ...state,
    bookmarkSections: {
      ...action.payload.bookmarkSections
    }
  };
}

const bookmarkSectionReducer = (state = InitialState, action: Action) => {
  switch (action.type) {
    case UPDATE_BOOKMARK_SECTION_NAME_INPUT:
      return updateBookmarkSectionName(state, action);
    case CREATE_BOOKMARK_SECTION:
      return createBookmarkSection(state, action);
    case REMOVE_BOOKMARK_SECTION:
      return removeBookmarkSection(state, action);
    case UPDATE_BOOKMARKS_SECTION_CONTENTS:
      return updateBookmarkSectionContents(state, action);
    case LOAD_BOOKMARK_SECTIONS_COMPLETE:
      return loadBookmarkSectionsComplete(state, action);
    default:
      return {
        ...state
      };
  }
};

export default bookmarkSectionReducer;
