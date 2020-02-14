import _ from "lodash";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import {
  LOAD_ALL_ROUTES_COMPLETE,
  LOAD_ROUTE_COMPLETE,
  LOAD_STOP_COMPLETE
} from "../../constants";

export interface RouteDataDictionary {
  [id: number]: TrimetRoute;
}

export interface RouteDataReducerState {
  routes: RouteDataDictionary;
}

const initialState = {
  routes: {}
};

interface Action {
  type: string;
  payload?: {};
}

interface LoadRouteCompleteAction extends Action {
  type: string;
  payload: {
    route: TrimetRoute;
    id: number;
  };
}

function loadRouteComplete(
  state: RouteDataReducerState,
  action: LoadRouteCompleteAction
) {
  const { id, route } = action.payload;

  return {
    ...state,
    routes: {
      [id]: route[0]
    }
  };
}

interface LoadAllRoutesCompleteAction extends Action {
  type: string;
  payload: {
    routes: TrimetRoute[];
  };
}

function createRoutesDictionary(routes: TrimetRoute[]): RouteDataDictionary {
  return _.mapKeys(routes, (route: TrimetRoute) => {
    return route.id;
  });
}

function loadAllRoutesComplete(
  state: RouteDataReducerState,
  action: LoadAllRoutesCompleteAction
) {
  const { routes } = action.payload;

  const routesDictionary = createRoutesDictionary(routes);

  return {
    ...state,
    routes: {
      ...state.routes,
      ...routesDictionary
    }
  };
}

function handleLoadStopComplete(state, action) {
  return {
    ...state
  };
}

const routeDataReducer = (
  state: RouteDataReducerState = initialState,
  action
) => {
  switch (action.type) {
    case LOAD_STOP_COMPLETE:
      return handleLoadStopComplete(state, action);
    case LOAD_ALL_ROUTES_COMPLETE:
      return loadAllRoutesComplete(state, action);
    case LOAD_ROUTE_COMPLETE:
      return loadRouteComplete(state, action);
    default:
      return {
        ...state
      };
  }
};

export default routeDataReducer;
