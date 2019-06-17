import { getDistance } from "geolib";
import { concat, map, mapKeys, reduce } from "lodash";
import moment from "moment";
import {
  Coords,
  Direction,
  Location,
  Route,
  StopData,
  StopLocation
} from "../../api/trimet/types";
import {
  LOAD_ARRIVALS_COMPLETE,
  LOAD_STOP_COMPLETE,
  LOAD_STOPS
} from "../constants";

export interface StopsReducerState {
  loading: boolean;
  stopLocations: StopLocationsDictionary;
  nearbyRoutes: RouteDirection[];
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

export interface RouteDirection {
  routeId: number;
  directionId: number;
}

function getDirectionsOnRoute(route: Route, routeId: number): RouteDirection[] {
  return map(route.dir, (direction: Direction) => {
    const directionId = direction.dir;
    return { routeId, directionId };
  });
}

function getRoutes(stopLocation: StopLocation): RouteDirection[] {
  return reduce(
    stopLocation.route,
    (result: RouteDirection[], route: Route) => {
      const routeId = route.route;
      const directions = getDirectionsOnRoute(route, routeId);

      return concat(result, directions);
    },
    []
  );
}

function getRoutesFromStopLocations(
  stopLocations: StopLocationsDictionary
): RouteDirection[] {
  return reduce(
    stopLocations,
    (routeResult: RouteDirection[], stopLocation: StopLocation) => {
      const routes: RouteDirection[] = getRoutes(stopLocation);
      return concat(routeResult, routes);
    },
    []
  );
}

function getLoadStopCompleteState(action: Action, state) {
  const { payload } = action;
  const { location, stopData } = payload;
  const currentLocation = location.coords;
  const stopLocations = formatStopLocations(stopData.location, currentLocation);
  const nearbyRoutes = getRoutesFromStopLocations(stopLocations);

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
