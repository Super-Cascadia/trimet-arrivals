// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
import {
  fetchStoredBookmarks,
  fetchStoredBookmarkSections
} from "../../api/localstorage/bookmarks";
// tslint:enable:no-submodule-imports
import { CHANGE_VIEW, LOAD_BOOKMARKS_COMPLETE } from "../constants";

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

export function* initialLoad() {
  try {
    const bookmarks = yield call(fetchStoredBookmarks);
    const bookmarkSections = yield call(fetchStoredBookmarkSections);

    yield put({
      payload: { bookmarks, bookmarkSections },
      type: LOAD_BOOKMARKS_COMPLETE
    });
  } catch (e) {
    // console.error(e);
  }
}
