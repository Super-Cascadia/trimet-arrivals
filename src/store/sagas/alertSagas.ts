// tslint:disable-next-line:no-submodule-imports
import { call, put } from "redux-saga/effects";
import { getAlertsByRouteId } from "../../api/trimet/alerts";
import { AlertsData } from "../../api/trimet/interfaces/alertsData";
import {
  LOAD_ROUTE_ALERTS_COMPLETE,
  LOAD_ROUTES_ALERT_DATA
} from "../constants";

interface Action {
  payload: {
    id: number;
  };
}

export function* loadRouteAlertData(action: Action) {
  const { id } = action.payload;

  try {
    yield put({ type: LOAD_ROUTES_ALERT_DATA, payload: { id } });
    const alertData: AlertsData = yield call(getAlertsByRouteId, id);
    yield put({
      payload: { alertData, id },
      type: LOAD_ROUTE_ALERTS_COMPLETE
    });
  } catch (e) {
    // console.error(e);
  }
}
