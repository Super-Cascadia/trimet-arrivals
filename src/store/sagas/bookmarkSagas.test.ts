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
    describe("when an error occurs", () => {
      it("catches the error", () => {
        const bookmarkStopDataGenerator = bookmarkStop({
          payload: { stopLocation: {} }
        });

        bookmarkStopDataGenerator.next();

        expect(bookmarkStopDataGenerator.throw("fooo").value).toEqual(
          put({
            error: "fooo",
            type: "API_ERROR"
          })
        );
      });
    });

    describe("when no error occurs", () => {
      const bookmarkStopDataGenerator = bookmarkStop({
        payload: { stopLocation: {} }
      });

      it("dispatches the load arrivals event", () => {
        expect(bookmarkStopDataGenerator.next().value).toEqual(
          put({
            payload: {
              stopLocation: {}
            },
            type: CREATE_STOP_BOOKMARK
          })
        );
      });

      it("makes a call add the bookmarked stopLocation to local storage", () => {
        expect(bookmarkStopDataGenerator.next().value).toEqual(
          call(storeLocationBookmark, {})
        );
      });
    });
  });

  describe("removeStopBookmark", () => {
    describe("when an error occurs", () => {
      it("catches the error", () => {
        const removeStopBookmarkGenerator = removeStopBookmark({
          payload: { stopLocation: {} }
        });

        removeStopBookmarkGenerator.next();

        expect(removeStopBookmarkGenerator.throw("fooo").value).toEqual(
          put({
            error: "fooo",
            type: "API_ERROR"
          })
        );
      });
    });

    describe("when no error occurs", () => {
      const removeStopBookmarkGenerator = removeStopBookmark({
        payload: { locationId: 123 }
      });

      it("dispatches the remove stop bookmark event", () => {
        expect(removeStopBookmarkGenerator.next().value).toEqual(
          put({
            payload: {
              locationId: 123
            },
            type: REMOVE_STOP_BOOKMARK
          })
        );
      });

      it("makes a call to remove the bookmarked stoplocation from local storage", () => {
        expect(removeStopBookmarkGenerator.next().value).toEqual(
          call(removeStoredBookmark, 123)
        );
      });
    });
  });
});
