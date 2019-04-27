import { filter, find, omit, slice } from "lodash";
import { StopLocation } from "../../api/trimet/types";
import {
  CREATE_BOOKMARK_SECTION,
  LOAD_BOOKMARK_SECTIONS_COMPLETE,
  REMOVE_BOOKMARK_FROM_SECTION,
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
    stopId?: number;
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
  const { selectedBookmarkSection, stopId } = action.payload;
  const bookmarkSection = bookmarkSections[selectedBookmarkSection];
  const bookmarkedStops = bookmarkSection.bookmarkedStops;
  const bookmarkInSection = find(bookmarkedStops, id => id === stopId);

  if (!bookmarkInSection) {
    const updatedBookmarks = [...slice(bookmarkedStops), stopId];

    return {
      ...state,
      bookmarkSections: {
        ...state.bookmarkSections,
        [selectedBookmarkSection]: {
          ...bookmarkSection,
          bookmarkedStops: updatedBookmarks
        }
      }
    };
  }

  return {
    ...state
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

function removeBookmarkFromSection(
  state: BookmarkSectionReducerState,
  action: Action
) {
  const { bookmarkSections } = state;
  const { bookmarkSectionId, stopId } = action.payload;
  const bookmarkSection = bookmarkSections[bookmarkSectionId];
  const bookmarkedStops = bookmarkSection.bookmarkedStops;
  const bookmarkInSection = find(bookmarkedStops, stop => stop === stopId);

  if (bookmarkInSection) {
    const updatedBookmarks = filter(bookmarkedStops, id => {
      return id !== stopId;
    });

    return {
      ...state,
      bookmarkSections: {
        ...state.bookmarkSections,
        [bookmarkSectionId]: {
          ...bookmarkSection,
          bookmarkedStops: [...updatedBookmarks]
        }
      }
    };
  }

  return {
    ...state
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
    case REMOVE_BOOKMARK_FROM_SECTION:
      return removeBookmarkFromSection(state, action);
    default:
      return {
        ...state
      };
  }
};

export default bookmarkSectionReducer;
