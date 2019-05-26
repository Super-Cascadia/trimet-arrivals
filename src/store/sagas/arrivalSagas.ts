// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import { getArrivals } from "../../api/trimet/arrivals";
import { LOAD_ARRIVALS, LOAD_ARRIVALS_COMPLETE } from "../constants";

const MINUTES_TO_POLL_ARRIVALS = 45;

export function* loadArrivalData(action) {
  const locationId = action.payload.locationId;
  const stringNumberLocationId = locationId.toString(10);

  try {
    yield put({ type: LOAD_ARRIVALS, payload: { locationId } });
    const arrivalData = yield call(
      getArrivals,
      stringNumberLocationId,
      MINUTES_TO_POLL_ARRIVALS
    );
    yield put({
      payload: { arrivalData, locationId },
      type: LOAD_ARRIVALS_COMPLETE
    });
  } catch (e) {
    // console.error(e);
  }
}
