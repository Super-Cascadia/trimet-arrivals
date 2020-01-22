import moment from "moment";
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
  stopData: StopData;
  radius: number;
  location: Location;
}

interface Action {
  payload?: Payload;
  type: string;
}

const initialState = {
  loading: false,
  timeOfLastLoad: ""
};

function getLoadStopCompleteState(action: Action, state) {
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

function getLoadArrivalsCompleteState(state) {
  return {
    ...state,
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
      return getLoadArrivalsCompleteState(state);
    default:
      return {
        ...state
      };
  }
};

export default stopsReducer;
