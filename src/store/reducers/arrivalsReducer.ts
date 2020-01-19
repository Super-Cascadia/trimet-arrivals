import { groupBy } from "lodash";
import { Arrival, ArrivalData } from "../../api/trimet/interfaces/types";
import { LOAD_ARRIVALS, LOAD_ARRIVALS_COMPLETE } from "../constants";

export interface StopLoadingState {
  [locationId: number]: boolean;
}

export interface ArrivalsReducerState {
  loading: boolean;
  arrivals: LocationArrivals;
  stopLoadingState: StopLoadingState;
}

interface Payload {
  arrivalData: ArrivalData;
  locationId: number;
}

interface Action {
  payload?: Payload;
  type: string;
}

export interface LocationArrivals {
  [index: string]: Arrival[];
}

function getArrivals(arrivals: Arrival[]): LocationArrivals {
  return groupBy(arrivals, (arrival: Arrival) => {
    return arrival.locid;
  });
}

const initialState = {
  arrivals: {},
  loading: {}
};

function setLatestStopLoadingState(
  state: StopLoadingState,
  locationId: number,
  newState: boolean
): StopLoadingState {
  return {
    ...state,
    [locationId]: newState
  };
}

function updateArrivalsState(
  state: LocationArrivals,
  newArrivals: LocationArrivals
): LocationArrivals {
  return {
    ...state,
    ...newArrivals
  };
}

const arrivalsReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_ARRIVALS:
      return {
        ...state,
        loading: setLatestStopLoadingState(
          state.loading,
          action.payload.locationId,
          true
        )
      };
    case LOAD_ARRIVALS_COMPLETE:
      const arrivals = getArrivals(action.payload.arrivalData.arrival);

      return {
        ...state,
        arrivals: updateArrivalsState(state.arrivals, arrivals),
        loading: setLatestStopLoadingState(
          state.loading,
          action.payload.locationId,
          false
        )
      };
    default:
      return {
        ...state
      };
  }
};

export default arrivalsReducer;
