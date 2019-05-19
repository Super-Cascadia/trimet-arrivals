// tslint:disable:no-submodule-imports
import { put } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import { REMOVE_STOP_BOOKMARK } from "../constants";
import { removeStopBookmark } from "./bookmarkSagas";

describe("arrivalSagas", () => {
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
