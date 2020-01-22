import { Route } from "../../api/trimet/interfaces/routes";
import { LOAD_ROUTE_COMPLETE } from "../constants";

export interface RouteReducerState {
  routes: {
    [routeId: number]: Route;
  };
}

const initialState = {
  routes: {}
};

interface Action {
  type: string;
  payload: {
    route: Route;
    id: number;
  };
}

function loadRouteComplete(state: {}, action: Action) {
  const { id, route } = action.payload;

  return {
    ...state,
    routes: {
      [id]: route[0]
    }
  };
}

const routeReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_ROUTE_COMPLETE:
      return loadRouteComplete(state, action);
    default:
      return {
        ...state
      };
  }
};

export default routeReducer;
