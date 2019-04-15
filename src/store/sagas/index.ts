// tslint:disable:no-submodule-imports
import { takeEvery } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import {
  BOOKMARK_SECTION_NAME_UPDATE_REQUEST,
  BOOKMARK_STOP_REQUEST,
  CHANGE_VIEW_REQUEST,
  CREATE_BOOKMARK_SECTION_REQUEST,
  INITIAL_LOAD_REQUEST,
  LOAD_ARRIVALS_DATA_REQUEST,
  LOAD_STOP_DATA_REQUEST,
  REMOVE_BOOKMARK_STOP_REQUEST
} from "../constants";
import { loadArrivalData } from "./arrivalSagas";
import {
  bookmarkStop,
  createBookmarkSection,
  removeStopBookmark,
  updateSectionInputName
} from "./bookmarkSagas";
import { loadStopData } from "./stopSagas";
import { changeView, initialLoad } from "./viewSagas";

export function* rootSaga() {
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
}
