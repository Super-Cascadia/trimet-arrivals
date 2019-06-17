// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
import getCurrentPosition from "../../api/geolocation/getCurrentPosition";
// tslint:enable:no-submodule-imports
import { getNearbyStops } from "../../api/trimet/stops";
import { Location } from "../../api/trimet/types";
import {
  CURRENT_LOCATION_LOAD_COMPLETE,
  LOAD_STOP_COMPLETE,
  LOAD_STOPS
} from "../constants";
import { UPDATE_VIEW } from "../reducers/nearbyViewReducer";

interface Action {
  payload: {
    radiusInFeet: number;
  };
}

export function* loadStopData(action: Action) {
  const radiusInFeet = action.payload.radiusInFeet;

  try {
    yield put({ type: LOAD_STOPS });
    const location: Location = yield call(getCurrentPosition);
    yield put({ payload: { location }, type: CURRENT_LOCATION_LOAD_COMPLETE });
    const stopData = yield call(getNearbyStops, location, radiusInFeet);
    yield put({
      payload: { stopData, location, radiusInFeet },
      type: LOAD_STOP_COMPLETE
    });
  } catch (e) {
    // console.error(e);
  }
}

interface UpdateNearbyActiveViewAction {
  payload: {
    view: string;
  };
}

export function* updateNearbyActiveView(action: UpdateNearbyActiveViewAction) {
  const activeView = action.payload.view;

  try {
    yield put({ type: UPDATE_VIEW, payload: { activeView } });
  } catch (e) {
    // console.error(e);
  }
}
