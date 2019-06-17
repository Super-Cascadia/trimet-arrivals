import { combineReducers } from "redux";
import arrivalsReducer, { ArrivalsReducerState } from "./arrivalsReducer";
import bookmarkSectionReducer, {
  BookmarkSectionReducerState
} from "./bookmarkSectionReducer";
import bookmarksReducer, { BookmarksReducerState } from "./bookmarksReducer";
import currentLocationReducer, {
  CurrentLocationReducerState
} from "./currentLocationReducer";
import nearbyViewReducer, { NearbyReducerState } from "./nearbyViewReducer";
import stopsReducer, { StopsReducerState } from "./stopsReducer";
import viewReducer, { ViewReducerState } from "./viewReducer";

export interface RootState {
  stopsReducer: StopsReducerState;
  arrivalsReducer: ArrivalsReducerState;
  viewReducer: ViewReducerState;
  bookmarksReducer: BookmarksReducerState;
  bookmarkSectionReducer: BookmarkSectionReducerState;
  currentLocationReducer: CurrentLocationReducerState;
  nearbyReducer: NearbyReducerState;
}

const app = combineReducers<RootState>({
  arrivalsReducer,
  bookmarkSectionReducer,
  bookmarksReducer,
  currentLocationReducer,
  nearbyReducer: nearbyViewReducer,
  stopsReducer,
  viewReducer
} as any);

export default app;
