import { mapKeys } from "lodash";
import moment from "moment";
import { StopData, StopLocation } from "../../api/trimet/types";
import {
  LOAD_ARRIVALS_COMPLETE,
  LOAD_STOP_COMPLETE,
  LOAD_STOPS
} from "../constants";

export interface StopsReducerState {
  loading: boolean;
  stopLocations: StopLocationsDictionary;
  timeOfLastLoad: string;
}

interface Payload {
  stopData: StopData;
}

interface Action {
  payload?: Payload;
  type: string;
}

export interface StopLocationsDictionary {
  [locationId: number]: StopLocation;
}

function getStopLocations(
  stopLocation: StopLocation[]
): StopLocationsDictionary {
  return mapKeys(stopLocation, (location: StopLocation) => {
    return location.locid;
  });
}

const initialState = {
  loading: false,
  timeOfLastLoad: ""
};

const stopsReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_STOPS:
      return {
        ...state,
        loading: true
      };
    case LOAD_STOP_COMPLETE:
      const stopLocations = getStopLocations(action.payload.stopData.location);

      return {
        ...state,
        loading: false,
        stopLocations,
        timeOfLastLoad: moment().format("ddd, h:mm:ss a")
      };
    case LOAD_ARRIVALS_COMPLETE:
      return {
        ...state,
        timeOfLastLoad: moment().format("ddd, h:mm:ss a")
      };
    default:
      return {
        ...state
      };
  }
};

export default stopsReducer;
