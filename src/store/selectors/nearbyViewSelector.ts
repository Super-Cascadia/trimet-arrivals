import { createSelector } from "reselect";
import { RootState } from "../reducers";

const activeView = (state: RootState) => state.nearbyReducer.activeView;

export const nearbyActiveViewSelector = createSelector(
  activeView,
  (view: string) => view
);
