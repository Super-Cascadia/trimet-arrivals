import { createSelector } from "reselect";
import { RootState } from "../reducers";

const stopsLoading = (state: RootState, locationId: number) =>
  state.arrivalsReducer.loading[locationId];

export const arrivalsLoadingSelector = createSelector(
  stopsLoading,
  (loading: boolean) => loading
);
