export const SHOW_NEARBY_STOPS = "SHOW_NEARBY_STOPS";
export const SHOW_NEARBY_ROUTES = "SHOW_NEARBY_ROUTES";

const initialState = {
  activeView: SHOW_NEARBY_STOPS
};

interface Action {
  type: string;
}

export interface NearbyReducerState {
  activeView: string;
}

const nearbyViewReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case SHOW_NEARBY_STOPS:
      return {
        ...state,
        activeView: SHOW_NEARBY_STOPS
      };
    case SHOW_NEARBY_ROUTES:
      return {
        ...state,
        activeView: SHOW_NEARBY_ROUTES
      };
    default:
      return {
        ...state
      };
  }
};

export default nearbyViewReducer;
