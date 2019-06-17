// tslint:disable:no-submodule-imports
import { takeEvery } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import {
  BOOKMARK_STOP_REQUEST,
  CHANGE_VIEW_REQUEST,
  INITIAL_LOAD_REQUEST,
  LOAD_ARRIVALS_DATA_REQUEST,
  LOAD_STOP_DATA_REQUEST,
  REMOVE_BOOKMARK_STOP_REQUEST,
  UPDATE_VIEW_REQUEST
} from "../constants";
import {
  BOOKMARK_SECTION_NAME_UPDATE_REQUEST,
  BOOKMARK_SECTION_SELECT_REQUEST,
  CREATE_BOOKMARK_SECTION_REQUEST,
  REMOVE_ALL_BOOKMARKS_IN_SECTION_REQUEST,
  REMOVE_BOOKMARK_FROM_SECTION_REQUEST,
  REMOVE_BOOKMARK_SECTION_REQUEST,
  UPDATE_BOOKMARK_SECTION_NAME_REQUEST
} from "../constants/bookmarkSections";
import { loadArrivalData } from "./arrivalSagas";
import { bookmarkStop, removeStopBookmark } from "./bookmarkSagas";
import {
  createBookmarkSection,
  removeAllBookmarksInSection,
  removeBookmarkFromSection,
  removeBookmarkSection,
  updateBookmarkSectionName,
  updateSectionInputName,
  updateSelectedBookmarkSection
} from "./bookmarkSectionSagas";
import { loadStopData, updateNearbyActiveView } from "./stopSagas";
import { changeView, initialLoad } from "./viewSagas";

export function* rootSaga() {
  // @ts-ignore
  yield takeEvery(LOAD_STOP_DATA_REQUEST, loadStopData);
  yield takeEvery(LOAD_ARRIVALS_DATA_REQUEST, loadArrivalData);
  // @ts-ignore
  yield takeEvery(CHANGE_VIEW_REQUEST, changeView);
  yield takeEvery(INITIAL_LOAD_REQUEST, initialLoad);
  // @ts-ignore
  yield takeEvery(BOOKMARK_STOP_REQUEST, bookmarkStop);
  // @ts-ignore
  yield takeEvery(REMOVE_BOOKMARK_STOP_REQUEST, removeStopBookmark);
  // @ts-ignore
  yield takeEvery(BOOKMARK_SECTION_NAME_UPDATE_REQUEST, updateSectionInputName);
  yield takeEvery(CREATE_BOOKMARK_SECTION_REQUEST, createBookmarkSection);
  yield takeEvery(REMOVE_BOOKMARK_SECTION_REQUEST, removeBookmarkSection);
  yield takeEvery(
    BOOKMARK_SECTION_SELECT_REQUEST,
    updateSelectedBookmarkSection
  );
  yield takeEvery(
    REMOVE_BOOKMARK_FROM_SECTION_REQUEST,
    removeBookmarkFromSection
  );
  yield takeEvery(
    REMOVE_ALL_BOOKMARKS_IN_SECTION_REQUEST,
    removeAllBookmarksInSection
  );
  yield takeEvery(
    UPDATE_BOOKMARK_SECTION_NAME_REQUEST,
    updateBookmarkSectionName
  );
  // @ts-ignore
  yield takeEvery(UPDATE_VIEW_REQUEST, updateNearbyActiveView);
}
