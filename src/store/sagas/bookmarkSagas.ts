// tslint:disable:no-submodule-imports
import { isEmpty, keys } from "lodash";
import { call, put, select } from "redux-saga/effects";
import {
  removeStoredBookmark,
  removeStoredBookmarkSection,
  storeBookmarkSection,
  storeLocationBookmark,
  updateStoredBookmarkSection
} from "../../api/localstorage/bookmarks";
// tslint:enable:no-submodule-imports
import { StopLocation } from "../../api/trimet/types";
import { CREATE_STOP_BOOKMARK, REMOVE_STOP_BOOKMARK } from "../constants";
import {
  CREATE_BOOKMARK_SECTION,
  REMOVE_BOOKMARK_SECTION,
  UPDATE_BOOKMARK_SECTION_NAME_INPUT,
  UPDATE_BOOKMARKS_SECTION_CONTENTS
} from "../constants/bookmarkSections";

interface BookmarkStopAction {
  payload: {
    stopLocation: StopLocation;
  };
}

function logError(e) {
  // tslint:disable:no-console
  console.error(e);
  // tslint:enable:no-console
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

function getNextId({ bookmarksReducer }): number {
  if (isEmpty(bookmarksReducer.bookmarkSections)) {
    return 0;
  }

  const bookmarksByKeys = keys(bookmarksReducer.bookmarkSections);
  const lastKey = bookmarksByKeys[bookmarksByKeys.length - 1];

  return parseInt(lastKey, 10) + 1;
}

function getBookmarkName({ bookmarksReducer }) {
  return bookmarksReducer.bookmarkInputSectionName;
}

function buildBookmarkSection(bookmarkName: string) {
  return {
    bookmarkedStops: [],
    name: bookmarkName,
    order: 0
  };
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
