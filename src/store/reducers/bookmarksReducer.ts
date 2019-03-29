import { omit } from "lodash";
import { StopLocation } from "../../api/trimet/types";
import { CREATE_STOP_BOOKMARK } from "../constants";

export interface BookmarksReducerState {
  bookmarks: [];
}

interface Action {
  type: string;
  payload: {
    stopLocation: StopLocation;
  };
}

const bookmarksReducer = (state, action: Action) => {
  switch (action.type) {
    case CREATE_STOP_BOOKMARK:
      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          [action.payload.stopLocation.locid]: {
            ...action.payload.stopLocation
          }
        }
      };
    default:
      return {
        ...state
      };
  }
};

export default bookmarksReducer;
