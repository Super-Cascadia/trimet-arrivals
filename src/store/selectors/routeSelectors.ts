import { createSelector } from "reselect";
import { Route } from "../../api/trimet/interfaces/routes";
import { RootState } from "../reducers";

const routeById = (state: RootState, id: number) =>
  state.routeReducer.routes[id];

export const routeSelector = createSelector(routeById, (route: Route) => route);
