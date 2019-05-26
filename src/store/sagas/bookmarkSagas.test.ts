// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import {
  removeStoredBookmark,
  storeLocationBookmark
} from "../../api/localstorage/bookmarks.localstorage";
import { CREATE_STOP_BOOKMARK, REMOVE_STOP_BOOKMARK } from "../constants";
import { bookmarkStop, removeStopBookmark } from "./bookmarkSagas";

describe("sagas", () => {
  describe("bookmarkStop", () => {
    const bookmarkStopData = bookmarkStop({
      payload: { stopLocation: {} }
    });

    it("dispatches the load arrivals event", () => {
      expect(bookmarkStopData.next().value).toEqual(
        put({
          payload: {
            stopLocation: {}
          },
          type: CREATE_STOP_BOOKMARK
        })
      );
    });

    it("makes a call add the bookmarked stopLocation to local storage", () => {
      expect(bookmarkStopData.next().value).toEqual(
        call(storeLocationBookmark, {})
      );
    });
  });

  describe("removeStopBookmark", () => {
    const removeStopBookmarkData = removeStopBookmark({
      payload: { locationId: 123 }
    });

    it("dispatches the remove stop bookmark event", () => {
      expect(removeStopBookmarkData.next().value).toEqual(
        put({
          payload: {
            locationId: 123
          },
          type: REMOVE_STOP_BOOKMARK
        })
      );
    });

    it("makes a call to remove the bookmarked stoplocation from local storage", () => {
      expect(removeStopBookmarkData.next().value).toEqual(
        call(removeStoredBookmark, 123)
      );
    });
  });
});
