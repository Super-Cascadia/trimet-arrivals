import { combineReducers } from "redux";
import alertDataReducer, { AlertDataReducerState } from "./alertDataReducer";
import arrivalsReducer, { ArrivalsReducerState } from "./arrivalsReducer";
import bookmarkSectionReducer, {
  BookmarkSectionReducerState
} from "./bookmarkSectionReducer";
import bookmarksReducer, { BookmarksReducerState } from "./bookmarksReducer";
import currentLocationReducer, {
  CurrentLocationReducerState
} from "./currentLocationReducer";
import nearbyRoutesReducer, {
  NearbyRoutesReducerState
} from "./nearbyRoutesReducer";
import nearbyViewReducer, { NearbyReducerState } from "./nearbyViewReducer";
import routeReducer, { RouteReducerState } from "./routeReducer";
import stopsReducer, { StopsReducerState } from "./stopsReducer";
import viewReducer, { ViewReducerState } from "./viewReducer";

export interface RootState {
  alertDataReducer: AlertDataReducerState;
  stopsReducer: StopsReducerState;
  arrivalsReducer: ArrivalsReducerState;
  viewReducer: ViewReducerState;
  bookmarksReducer: BookmarksReducerState;
  bookmarkSectionReducer: BookmarkSectionReducerState;
  currentLocationReducer: CurrentLocationReducerState;
  nearbyReducer: NearbyReducerState;
  routeReducer: RouteReducerState;
  nearbyRoutesReducer: NearbyRoutesReducerState;
}

const app = combineReducers<RootState>({
  alertDataReducer,
  arrivalsReducer,
  bookmarkSectionReducer,
  bookmarksReducer,
  currentLocationReducer,
  nearbyReducer: nearbyViewReducer,
  nearbyRoutesReducer,
  routeReducer,
  stopsReducer,
  viewReducer
} as any);

export default app;
