// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
import { Route } from "../../api/trimet/interfaces/routes";
import { getAllRoutes, getRouteById } from "../../api/trimet/routeConfig";
import {
  LOAD_ALL_ROUTES_COMPLETE,
  LOAD_ROUTE_COMPLETE,
  LOAD_ROUTE_DATA
} from "../constants";

interface LoadByIdAction {
  payload: {
    id: number;
  };
}

export function* loadRouteDataById(action: LoadByIdAction) {
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

export function* loadAllRouteData() {
  try {
    const { route } = yield call(getAllRoutes);
    yield put({
      payload: { routes: route },
      type: LOAD_ALL_ROUTES_COMPLETE
    });
  } catch (e) {
    // console.error(e);
  }
}
