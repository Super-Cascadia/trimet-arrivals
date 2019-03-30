// tslint:disable:no-submodule-imports
import { call, put, takeEvery } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import { getCurrentPosition } from "../api/geolocation";
import { getArrivals } from "../api/trimet/arrivals";
import { getNearbyStops } from "../api/trimet/stops";
import {
  BOOKMARK_STOP_REQUEST,
  CHANGE_VIEW,
  CHANGE_VIEW_REQUEST,
  CREATE_STOP_BOOKMARK,
  LOAD_ARRIVALS,
  LOAD_ARRIVALS_COMPLETE,
  LOAD_ARRIVALS_DATA_REQUEST,
  LOAD_STOP_COMPLETE,
  LOAD_STOP_DATA_REQUEST,
  LOAD_STOPS,
  REMOVE_BOOKMARK_STOP_REQUEST,
  REMOVE_STOP_BOOKMARK
} from "./constants";

export function* rootSaga() {
  yield takeEvery(LOAD_STOP_DATA_REQUEST, loadStopData);
  yield takeEvery(LOAD_ARRIVALS_DATA_REQUEST, loadArrivalData);
  yield takeEvery(CHANGE_VIEW_REQUEST, changeView);
  yield takeEvery(BOOKMARK_STOP_REQUEST, bookmarkStop);
  yield takeEvery(REMOVE_BOOKMARK_STOP_REQUEST, removeStopBookmark);
}

export function* loadStopData(action) {
  const radiusInFeet = action.payload.radiusInFeet;

  try {
    yield put({ type: LOAD_STOPS });
    const location = yield call(getCurrentPosition);
    const stopData = yield call(getNearbyStops, location, radiusInFeet);
    yield put({ payload: { stopData }, type: LOAD_STOP_COMPLETE });
  } catch (e) {
    // console.error(e);
  }
}

export function* loadArrivalData(action) {
  const minutes = 45;
  const locationId = action.payload.locationId;
  const stringNumberLocationId = locationId.toString(10);

  try {
    yield put({ type: LOAD_ARRIVALS, payload: { locationId } });
    const arrivalData = yield call(
      getArrivals,
      stringNumberLocationId,
      minutes
    );
    yield put({
      payload: { arrivalData, locationId },
      type: LOAD_ARRIVALS_COMPLETE
    });
  } catch (e) {
    // console.error(e);
  }
}

export function* changeView(action) {
  try {
    yield put({
      payload: { activeView: action.payload.activeView },
      type: CHANGE_VIEW
    });
  } catch (e) {
    // console.error(e)
  }
}

export function* bookmarkStop(action) {
  try {
    yield put({
      payload: { stopLocation: action.payload.stopLocation },
      type: CREATE_STOP_BOOKMARK
    });
  } catch (e) {
    // console.error(e)
  }
}

export function* removeStopBookmark(action) {
  try {
    yield put({
      payload: { locationId: action.payload.locationId },
      type: REMOVE_STOP_BOOKMARK
    });
  } catch (e) {
    // console.error(e)
  }
}
