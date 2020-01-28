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
import routeDataReducer, {
  RouteDataReducerState
} from "./data/routeDataReducer";
import nearbyViewReducer, { NearbyReducerState } from "./nearbyViewReducer";
import stopsReducer, { StopsReducerState } from "./stopsReducer";
import nearbyRoutesDataReducer, {
  NearbyRoutesDataReducerState
} from "./view/nearbyRoutesDataReducer";
import nearbyRoutesViewReducer, {
  NearbyRoutesViewReducerState
} from "./view/nearbyRoutesViewReducer";
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
  routeDataReducer: RouteDataReducerState;
  nearbyRoutesDataReducer: NearbyRoutesDataReducerState;
  nearbyRoutesViewReducer: NearbyRoutesViewReducerState;
}

const app = combineReducers<RootState>({
  alertDataReducer,
  arrivalsReducer,
  bookmarkSectionReducer,
  bookmarksReducer,
  currentLocationReducer,
  nearbyRoutesDataReducer,
  nearbyRoutesViewReducer,
  nearbyViewReducer,
  routeDataReducer,
  stopsReducer,
  viewReducer
} as any);

export default app;
