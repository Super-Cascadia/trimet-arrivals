// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
import {
  removeStoredBookmark,
  storeLocationBookmark
} from "../../api/localstorage/bookmarks";
// tslint:enable:no-submodule-imports
import { StopLocation } from "../../api/trimet/types";
import {
  CREATE_BOOKMARK_SECTION,
  CREATE_STOP_BOOKMARK,
  REMOVE_BOOKMARK_SECTION,
  REMOVE_STOP_BOOKMARK,
  UPDATE_BOOKMARK_SECTION_NAME_INPUT
} from "../constants";

interface BookmarkStopAction {
  payload: {
    stopLocation: StopLocation;
  };
}

function logError(e) {
  // console.error(e);
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
    logError(e);
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
    logError(e);
  }
}

interface UpdateSectionInputAction {
  payload: {
    name: string;
  };
}

export function* updateSectionInputName(action: UpdateSectionInputAction) {
  try {
    const name = action.payload.name;

    yield put({
      payload: {
        name
      },
      type: UPDATE_BOOKMARK_SECTION_NAME_INPUT
    });
  } catch (e) {
    logError(e);
  }
}

export function* createBookmarkSection() {
  try {
    yield put({
      type: CREATE_BOOKMARK_SECTION
    });
  } catch (e) {
    logError(e);
  }
}

export function* removeBookmarkSection(action) {
  const bookmarkSectionId = action.payload.bookmarkSectionId;

  try {
    yield put({
      payload: { bookmarkSectionId },
      type: REMOVE_BOOKMARK_SECTION
    });
  } catch (e) {
    logError(e);
  }
}
