import { Location, StopData } from "../../../api/trimet/interfaces/types";
import { LOAD_STOP_COMPLETE } from "../../constants";
import formatStopLocations from "../util/formatStopLocations";
import {
  getRoutesFromStops,
  RouteDirectionDict
} from "../util/getRoutesFromStopLocations";

export interface NearbyRoutesDataReducerState {
  nearbyRoutes: RouteDirectionDict;
}

const initialState = {
  routes: {}
};

interface Payload {
  stopData: StopData;
  radius: number;
  location: Location;
}

interface Action {
  payload?: Payload;
  type: string;
}

function getLoadStopCompleteState(action: Action, state) {
  const { payload } = action;
  const { location, stopData } = payload;
  const currentLocation = location.coords;
  const stopLocations = formatStopLocations(stopData.location, currentLocation);
  const nearbyRoutes = getRoutesFromStops(stopLocations);

  return {
    ...state,
    nearbyRoutes
  };
}

const nearbyRoutesDataReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_STOP_COMPLETE:
      return getLoadStopCompleteState(action, state);
    default:
      return {
        ...state
      };
  }
};

export default nearbyRoutesDataReducer;