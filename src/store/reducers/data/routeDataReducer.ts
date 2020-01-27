import _ from "lodash";
import { Route } from "../../../api/trimet/interfaces/routes";
import { LOAD_ALL_ROUTES_COMPLETE, LOAD_ROUTE_COMPLETE } from "../../constants";

export interface RouteDataDictionary {
  [id: number]: Route;
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
    route: Route;
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
    routes: Route[];
  };
}

function createRoutesDictionary(routes: Route[]): RouteDataDictionary {
  return _.mapKeys(routes, (route: Route) => {
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

const routeDataReducer = (state = initialState, action) => {
  switch (action.type) {
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
