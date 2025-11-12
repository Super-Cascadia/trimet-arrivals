import _ from "lodash";
import {
  Location,
  StopData,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { LOAD_STOP_COMPLETE } from "../../constants";

export interface NearbyRoutesDictionary {
  [routeId: number]: {
    directions: number[];
  };
}

export interface NearbyRoutesViewReducerState {
  nearbyRoutes: NearbyRoutesDictionary;
}

const initialState = {
  nearbyRoutes: []
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

function getRouteIdsFromStops(stopData: StopData): NearbyRoutesDictionary {
  const allRoutes = _.map(stopData.location, (stop: StopLocation) => {
    return stop.route;
  });

  const flatListOfRoutes = _.flatten(allRoutes);
  const groupedByRoute = _.groupBy(
    flatListOfRoutes,
    (route: TrimetRoute) => route.route
  );

  return _.reduce(
    groupedByRoute,
    (acc, routes, key) => {
      const mappedDirections = _.map(routes, route => route.dir[0].dir);

      return {
        ...acc,
        [key]: {
          directions: _.sortBy(_.uniq(mappedDirections))
        }
      };
    },
    {}
  );
}

function handleLoadStopComplete(
  state: NearbyRoutesViewReducerState,
  action: Action
) {
  const nearbyRoutes = getRouteIdsFromStops(action.payload.stopData);

  return {
    ...state,
    nearbyRoutes
  };
}

const nearbyRoutesViewReducer = (
  state: NearbyRoutesViewReducerState = initialState,
  action: Action
) => {
  switch (action.type) {
    case LOAD_STOP_COMPLETE:
      return handleLoadStopComplete(state, action);
    default:
      return {
        ...state
      };
  }
};

export default nearbyRoutesViewReducer;
