// tslint:disable:no-submodule-imports
import { isEmpty, keys } from "lodash";
import { call, put, select } from "redux-saga/effects";
import {
  removeAllStoredBookmarksInSection,
  removeStoredBookmarkFromSection,
  removeStoredBookmarkSection,
  storeBookmarkSection,
  updateStoredBookmarkSection,
  updateStoredBookmarkSectionName
} from "../../api/localstorage/bookmarkSections";
import {
  CREATE_BOOKMARK_SECTION,
  REMOVE_ALL_BOOKMARKS_FROM_SECTION,
  REMOVE_BOOKMARK_FROM_SECTION,
  REMOVE_BOOKMARK_SECTION,
  UPDATE_BOOKMARK_SECTION_NAME,
  UPDATE_BOOKMARK_SECTION_NAME_INPUT,
  UPDATE_BOOKMARKS_SECTION_CONTENTS
} from "../constants/bookmarkSections";
import { logError } from "./util";

export function getNextId({ bookmarkSectionReducer }): number {
  if (isEmpty(bookmarkSectionReducer.bookmarkSections)) {
    return 0;
  }

  const bookmarksByKeys = keys(bookmarkSectionReducer.bookmarkSections);
  const lastKey = bookmarksByKeys[bookmarksByKeys.length - 1];

  return parseInt(lastKey, 10) + 1;
}

export function getBookmarkName({ bookmarkSectionReducer }) {
  return bookmarkSectionReducer.bookmarkInputSectionName;
}

export function buildBookmarkSection(bookmarkName: string) {
  return {
    bookmarkedStops: [],
    name: bookmarkName,
    order: 0
  };
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
      payload: { name },
      type: UPDATE_BOOKMARK_SECTION_NAME_INPUT
    });
  } catch (e) {
    logError(e);
  }
}

export function* createBookmarkSection() {
  try {
    const nextId = yield select(getNextId);
    const bookmarkName = yield select(getBookmarkName);
    const bookmarkSection = yield buildBookmarkSection(bookmarkName);

    yield put({
      payload: { nextId, bookmarkSection },
      type: CREATE_BOOKMARK_SECTION
    });

    yield call(storeBookmarkSection, nextId, bookmarkSection);
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

    yield call(removeStoredBookmarkSection, bookmarkSectionId);
  } catch (e) {
    logError(e);
  }
}

export function* updateSelectedBookmarkSection(action) {
  const { selectedBookmarkSection, stopId } = action.payload;

  try {
    yield put({
      payload: { selectedBookmarkSection, stopId },
      type: UPDATE_BOOKMARKS_SECTION_CONTENTS
    });

    yield call(updateStoredBookmarkSection, selectedBookmarkSection, stopId);
  } catch (e) {
    logError(e);
  }
}

export function* removeBookmarkFromSection(action) {
  const { bookmarkSectionId, stopId } = action.payload;

  try {
    yield put({
      payload: { bookmarkSectionId, stopId },
      type: REMOVE_BOOKMARK_FROM_SECTION
    });

    yield call(removeStoredBookmarkFromSection, bookmarkSectionId, stopId);
  } catch (e) {
    logError(e);
  }
}

export function* removeAllBookmarksInSection(action) {
  const { bookmarkSectionId } = action.payload;

  try {
    yield put({
      payload: { bookmarkSectionId },
      type: REMOVE_ALL_BOOKMARKS_FROM_SECTION
    });

    yield call(removeAllStoredBookmarksInSection, bookmarkSectionId);
  } catch (e) {
    logError(e);
  }
}

export function* updateBookmarkSectionName(action) {
  const { bookmarkSectionId, bookmarkSectionName } = action.payload;

  try {
    yield put({
      payload: { bookmarkSectionId, bookmarkSectionName },
      type: UPDATE_BOOKMARK_SECTION_NAME
    });

    yield call(
      updateStoredBookmarkSectionName,
      bookmarkSectionId,
      bookmarkSectionName
    );
  } catch (e) {
    logError(e);
  }
}