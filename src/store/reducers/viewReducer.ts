import { CHANGE_VIEW } from "../constants";

export const NEARBY_STOPS_VIEW = "NEARBY_STOPS_VIEW";
export const BOOKMARKS_VIEW = "BOOKMARKS_VIEW";

export interface ViewReducerState {
  activeView: string;
}

const initialState = {
  activeView: NEARBY_STOPS_VIEW
};

interface Action {
  type: string;
  payload: {
    activeView: string;
  };
}

const viewReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case CHANGE_VIEW:
      return {
        ...state,
        activeView: action.payload.activeView
      };
    default:
      return {
        ...state
      };
  }
};

export default viewReducer;
