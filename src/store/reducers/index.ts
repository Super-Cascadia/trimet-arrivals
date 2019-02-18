import { combineReducers } from "redux";
import arrivalsReducer, { ArrivalsReducerState } from "./arrivalsReducer";
import stopsReducer, { StopsReducerState } from "./stopsReducer";

export interface RootState {
  stopsReducer: StopsReducerState;
  arrivalsReducer: ArrivalsReducerState;
}

const app = combineReducers<RootState>({
  stopsReducer,
  arrivalsReducer
} as any);

export default app;
