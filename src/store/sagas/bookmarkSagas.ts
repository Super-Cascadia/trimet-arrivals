// tslint:disable:no-submodule-imports
import { put } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import { StopLocation } from "../../api/trimet/types";
import { CREATE_STOP_BOOKMARK, REMOVE_STOP_BOOKMARK } from "../constants";

interface BookmarkStopAction {
  payload: {
    stopLocation: StopLocation;
  };
}

export function* bookmarkStop(action: BookmarkStopAction) {
  try {
    yield put({
      payload: { stopLocation: action.payload.stopLocation },
      type: CREATE_STOP_BOOKMARK
    });
  } catch (e) {
    // console.error(e)
  }
}

interface RemoveStopBookmarkAction {
  payload: {
    locationId: number;
  };
}

export function* removeStopBookmark(action: RemoveStopBookmarkAction) {
  try {
    yield put({
      payload: { locationId: action.payload.locationId },
      type: REMOVE_STOP_BOOKMARK
    });
  } catch (e) {
    // console.error(e)
  }
}
