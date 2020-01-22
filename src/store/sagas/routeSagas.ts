// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
import { Route } from "../../api/trimet/interfaces/routes";
import { getRouteById } from "../../api/trimet/routeConfig";
import { LOAD_ROUTE_COMPLETE, LOAD_ROUTE_DATA } from "../constants";

interface Action {
  payload: {
    id: number;
  };
}

export function* loadRouteData(action: Action) {
  const id = action.payload.id;

  try {
    yield put({ type: LOAD_ROUTE_DATA, payload: { id } });
    const { route }: { route: Route[] } = yield call(getRouteById, id);
    yield put({
      payload: { route, id },
      type: LOAD_ROUTE_COMPLETE
    });
  } catch (e) {
    // console.error(e);
  }
}
