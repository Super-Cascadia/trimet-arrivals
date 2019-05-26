import { createSelector } from "reselect";
import { RootState } from "../reducers";

const activeView = (state: RootState) => state.viewReducer.activeView;

export const viewSelector = createSelector(
  activeView,
  (active: string) => active
);
