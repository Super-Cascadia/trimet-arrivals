// tslint:disable:no-submodule-imports
import { put } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
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
  });

  describe("removeStopBookmark", () => {
    const removeStopBookmarkData = removeStopBookmark({
      payload: { locationId: 123 }
    });

    it("dispatches the load arrivals event", () => {
      expect(removeStopBookmarkData.next().value).toEqual(
        put({
          payload: {
            locationId: 123
          },
          type: REMOVE_STOP_BOOKMARK
        })
      );
    });
  });
});
