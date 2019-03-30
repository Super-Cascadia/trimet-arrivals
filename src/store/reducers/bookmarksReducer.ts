import { omitBy } from "lodash";
import { StopLocation } from "../../api/trimet/types";
import { CREATE_STOP_BOOKMARK, REMOVE_STOP_BOOKMARK } from "../constants";

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
  };
}

const InitialState = {
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

const bookmarksReducer = (state = InitialState, action: Action) => {
  switch (action.type) {
    case CREATE_STOP_BOOKMARK:
      return createStopBookmark(state, action);
    case REMOVE_STOP_BOOKMARK:
      return removeStopBookmark(state, action);
    default:
      return {
        ...state
      };
  }
};

export default bookmarksReducer;
