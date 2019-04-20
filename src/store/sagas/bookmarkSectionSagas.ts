// tslint:disable:no-submodule-imports
import { isEmpty, keys } from "lodash";
import { call, put, select } from "redux-saga/effects";
import {
  removeStoredBookmarkSection,
  storeBookmarkSection,
  updateStoredBookmarkSection
} from "../../api/localstorage/bookmarks";
import {
  CREATE_BOOKMARK_SECTION,
  REMOVE_BOOKMARK_SECTION,
  UPDATE_BOOKMARK_SECTION_NAME_INPUT,
  UPDATE_BOOKMARKS_SECTION_CONTENTS
} from "../constants/bookmarkSections";
import { logError } from "./util";

function getNextId({ bookmarksReducer }): number {
  if (isEmpty(bookmarksReducer.bookmarkSections)) {
    return 0;
  }

  const bookmarksByKeys = keys(bookmarksReducer.bookmarkSections);
  const lastKey = bookmarksByKeys[bookmarksByKeys.length - 1];

  return parseInt(lastKey, 10) + 1;
}

function getBookmarkName({ bookmarkSectionReducer }) {
  return bookmarkSectionReducer.bookmarkInputSectionName;
}

function buildBookmarkSection(bookmarkName: string) {
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
    const nextId = yield select(getNextId);
    const bookmarkName = yield select(getBookmarkName);
    const bookmarkSection = buildBookmarkSection(bookmarkName);

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
  const { selectedBookmarkSection, stopLocation } = action.payload;

  try {
    yield put({
      payload: { selectedBookmarkSection, stopLocation },
      type: UPDATE_BOOKMARKS_SECTION_CONTENTS
    });

    yield call(
      updateStoredBookmarkSection,
      selectedBookmarkSection,
      stopLocation
    );
  } catch (e) {
    logError(e);
  }
}
