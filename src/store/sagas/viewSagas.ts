// tslint:disable:no-submodule-imports
import { put } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import { CHANGE_VIEW } from "../constants";

interface ChangeViewAction {
  payload: {
    activeView: string;
  };
}

export function* changeView(action: ChangeViewAction) {
  try {
    yield put({
      payload: { activeView: action.payload.activeView },
      type: CHANGE_VIEW
    });
  } catch (e) {
    // console.error(e)
  }
}
