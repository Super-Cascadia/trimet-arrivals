import { createSelector } from "reselect";
import { RootState } from "../reducers";
import { RouteDirectionDict } from "../reducers/util/getRoutesFromStopLocations";

const allNearbyRoutes = (state: RootState) =>
  state.nearbyRoutesDataReducer.nearbyRoutes;

export const allNearbyRoutesSelector = createSelector(
  allNearbyRoutes,
  (nearbyRoutes: RouteDirectionDict) => nearbyRoutes
);
