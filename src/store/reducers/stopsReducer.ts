import moment from "moment";
import { ArrivalData } from "../../api/trimet/interfaces/arrivals";
import { Location, StopData } from "../../api/trimet/interfaces/types";
import {
  LOAD_ARRIVALS_COMPLETE,
  LOAD_STOP_COMPLETE,
  LOAD_STOPS
} from "../constants";
import formatStopLocations, {
  StopLocationsDictionary
} from "./util/formatStopLocations";

export interface StopsReducerState {
  loading: boolean;
  stopLocations: StopLocationsDictionary;
  timeOfLastLoad: string;
}

interface Payload {
  stopData?: StopData;
  radius: number;
  location?: Location;
  arrivalData?: ArrivalData;
}

interface Action {
  payload?: Payload;
  type: string;
}

const initialState: StopsReducerState = {
  loading: false,
  stopLocations: {},
  timeOfLastLoad: ""
};

function getLoadStopCompleteState(action: Action, state: StopsReducerState) {
  const { payload } = action;
  const { location, stopData } = payload;
  const currentLocation = location.coords;
  const stopLocations = formatStopLocations(stopData.location, currentLocation);

  return {
    ...state,
    loading: false,
    stopLocations,
    timeOfLastLoad: moment().format("ddd, h:mm:ss a")
  };
}

function getLoadArrivalsCompleteState(
  action: Action,
  state: StopsReducerState
) {
  const { payload } = action;

  const { arrivalData } = payload;
  const location = arrivalData.location;
  const currentLocation = {
    latitude: location[0].lat,
    longitude: location[0].lng
  };

  const stopLocations = formatStopLocations(location, currentLocation);

  return {
    ...state,
    stopLocations,
    timeOfLastLoad: moment().format("ddd, h:mm:ss a")
  };
}

function getLoadStopsCompleteState(state) {
  return {
    ...state,
    loading: true
  };
}

const stopsReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_STOPS:
      return getLoadStopsCompleteState(state);
    case LOAD_STOP_COMPLETE:
      return getLoadStopCompleteState(action, state);
    case LOAD_ARRIVALS_COMPLETE:
      return getLoadArrivalsCompleteState(action, state);
    default:
      return {
        ...state
      };
  }
};

export default stopsReducer;
