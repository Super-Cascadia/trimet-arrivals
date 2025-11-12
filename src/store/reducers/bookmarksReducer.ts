import { omitBy } from "lodash";
import { StopLocation } from "../../api/trimet/interfaces/types";
import {
  CREATE_STOP_BOOKMARK,
  LOAD_BOOKMARKS_COMPLETE,
  REMOVE_STOP_BOOKMARK
} from "../constants";

export interface StopLocations {
  [locationId: number]: StopLocation;
}

export interface BookmarksReducerState {
  bookmarks: StopLocations;
}

interface Action {
  type: string;
  payload: {
    stopLocation?: StopLocation;
    locationId?: number;
    bookmarks?: {
      [locationId: number]: StopLocation;
    };
  };
}

const InitialState = {
  bookmarks: {}
};

function removeStopBookmark(state: BookmarksReducerState, action: Action) {
  const { locationId } = action.payload;

  const newBookmarks = omitBy({ ...state.bookmarks }, (item: StopLocation) => {
    const id = item.locid ? item.locid : item.id;

    return id === locationId;
  });

  return {
    ...state,
    bookmarks: newBookmarks
  };
}

function createStopBookmark(state: BookmarksReducerState, action: Action) {
  const { stopLocation } = action.payload;
  const id = stopLocation.locid ? stopLocation.locid : stopLocation.id;

  return {
    ...state,
    bookmarks: {
      ...state.bookmarks,
      [id]: {
        ...stopLocation
      }
    }
  };
}

function loadBookmarksComplete(state: BookmarksReducerState, action: Action) {
  return {
    ...state,
    bookmarks: {
      ...action.payload.bookmarks
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
    default:
      return {
        ...state
      };
  }
};

export default bookmarksReducer;
