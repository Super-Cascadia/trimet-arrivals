import { createSelector } from "reselect";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import { RootState } from "../../reducers";

const routeById = (state: RootState, id: number) =>
  state.routeDataReducer.routes[id];

const allRoutes = (state: RootState) => state.routeDataReducer.routes;

export const routeSelector = createSelector(
  routeById,
  (route: TrimetRoute) => route
);
export const allRoutesSelector = createSelector(
  allRoutes,
  (routes: TrimetRoute[]) => routes
);
