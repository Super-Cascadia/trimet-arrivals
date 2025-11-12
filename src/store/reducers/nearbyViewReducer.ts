export const SHOW_NEARBY_STOPS = "SHOW_NEARBY_STOPS";
export const SHOW_NEARBY_ROUTES = "SHOW_NEARBY_ROUTES";
export const UPDATE_VIEW = "UPDATE_VIEW";

const initialState = {
  activeView: SHOW_NEARBY_STOPS
};

interface Action {
  type: string;
  payload: {
    activeView: string;
  };
}

export interface NearbyReducerState {
  activeView: string;
}

const nearbyViewReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case UPDATE_VIEW:
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

export default nearbyViewReducer;
