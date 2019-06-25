import { getDistance } from "geolib";
import { map, mapKeys } from "lodash";
import moment from "moment";
import {
  Coords,
  Location,
  StopData,
  StopLocation
} from "../../api/trimet/types";
import {
  LOAD_ARRIVALS_COMPLETE,
  LOAD_STOP_COMPLETE,
  LOAD_STOPS
} from "../constants";
import {
  getRoutesFromStops2,
  RouteDirectionDict
} from "./util/getRoutesFromStopLocations";

export interface StopsReducerState {
  loading: boolean;
  stopLocations: StopLocationsDictionary;
  nearbyRoutes: RouteDirectionDict;
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

export interface StopLocationsDictionary {
  [locationId: number]: StopLocation;
}

export interface StopLocationWithDistance extends StopLocation {
  distance: number;
  distanceOrder: number;
}

function calculateDistance(
  lng: number,
  lat: number,
  currentLocation: Coords
): number {
  const stopLocation = { latitude: lat, longitude: lng };

  return getDistance(stopLocation, currentLocation);
}

function addDistanceToCurrentLocation(
  stopLocation: StopLocation[],
  currentLocation: Coords
): StopLocationWithDistance[] {
  return map(stopLocation, (location: StopLocation, index) => {
    return {
      ...location,
      distance: calculateDistance(location.lng, location.lat, currentLocation),
      distanceOrder: index
    };
  });
}

function formatStopLocations(
  stopLocation: StopLocation[],
  currentLocation: Coords
): StopLocationsDictionary {
  const stopLocationsWithDistance = addDistanceToCurrentLocation(
    stopLocation,
    currentLocation
  );

  return mapKeys(stopLocationsWithDistance, (location: StopLocation) => {
    return location.locid;
  });
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
  const nearbyRoutes = getRoutesFromStops2(stopLocations);

  return {
    ...state,
    loading: false,
    nearbyRoutes,
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
