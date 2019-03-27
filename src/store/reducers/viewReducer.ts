export const NEARBY_STOPS = "NEARBY_STOPS";

export interface ViewReducerState {
  activeView: string;
}

const initialState = {
  activeView: NEARBY_STOPS
};

interface Action {
  type: string;
}

const viewReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    default:
      return {
        ...state
      };
  }
};

export default viewReducer;
