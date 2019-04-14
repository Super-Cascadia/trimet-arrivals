// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
import {
  removeStoredBookmark,
  storeLocationBookmark
} from "../../api/localstorage/bookmarks";
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
    const stopLocation = action.payload.stopLocation;

    yield put({
      payload: { stopLocation },
      type: CREATE_STOP_BOOKMARK
    });

    yield call(storeLocationBookmark, stopLocation);
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
    const locationId = action.payload.locationId;

    yield put({
      payload: { locationId },
      type: REMOVE_STOP_BOOKMARK
    });

    yield call(removeStoredBookmark, locationId);
  } catch (e) {
    // console.error(e)
  }
}
