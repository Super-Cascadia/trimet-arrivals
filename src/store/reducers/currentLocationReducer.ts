import { CURRENT_LOCATION_LOAD_COMPLETE } from "../constants";

interface Action {
  type: string;
  payload: {
    location: {
      coords: {
        latitude: number;
        longitude: number;
      };
    };
  };
}

const InitialState = {
  coordinates: null
};

export interface CurrentLocationReducerState {
  coordinates: number[];
}

function updateCoordinates(state: CurrentLocationReducerState, action: Action) {
  const { latitude, longitude } = action.payload.location.coords;
  return {
    ...state,
    coordinates: [longitude, latitude]
  };
}

const currentLocationReducer = (state = InitialState, action: Action) => {
  switch (action.type) {
    case CURRENT_LOCATION_LOAD_COMPLETE:
      return updateCoordinates(state, action);
    default:
      return {
        ...state
      };
  }
};

export default currentLocationReducer;
