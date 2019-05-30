import { createSelector } from "reselect";
import { RootState } from "../../reducers";
import { TrimetArrivalData } from "../../reducers/data/arrivalsDataReducer";

const locationById = (state: RootState, id: number) =>
  state.arrivalsDataReducer.arrivals[id];

export const arrivalsSelector = createSelector(
  locationById,
  (arrivals: TrimetArrivalData) => arrivals
);
