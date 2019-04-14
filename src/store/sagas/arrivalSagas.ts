// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import { getArrivals } from "../../api/trimet/arrivals";
import { LOAD_ARRIVALS, LOAD_ARRIVALS_COMPLETE } from "../constants";

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
