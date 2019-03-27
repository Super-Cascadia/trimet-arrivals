import { combineReducers } from "redux";
import arrivalsReducer, { ArrivalsReducerState } from "./arrivalsReducer";
import stopsReducer, { StopsReducerState } from "./stopsReducer";
import viewReducer, { ViewReducerState } from "./viewReducer";

export interface RootState {
  stopsReducer: StopsReducerState;
  arrivalsReducer: ArrivalsReducerState;
  viewReducer: ViewReducerState;
}

const app = combineReducers<RootState>({
  arrivalsReducer,
  stopsReducer,
  viewReducer
} as any);

export default app;
