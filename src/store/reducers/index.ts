import { combineReducers } from "redux";
import arrivalsReducer, { ArrivalsReducerState } from "./arrivalsReducer";
import bookmarksReducer, { BookmarksReducerState } from "./bookmarksReducer";
import stopsReducer, { StopsReducerState } from "./stopsReducer";
import viewReducer, { ViewReducerState } from "./viewReducer";

export interface RootState {
  stopsReducer: StopsReducerState;
  arrivalsReducer: ArrivalsReducerState;
  viewReducer: ViewReducerState;
  bookmarksReducer: BookmarksReducerState;
}

const app = combineReducers<RootState>({
  arrivalsReducer,
  bookmarksReducer,
  stopsReducer,
  viewReducer
} as any);

export default app;
