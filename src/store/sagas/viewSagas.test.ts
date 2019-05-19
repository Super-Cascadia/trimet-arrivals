// tslint:disable:no-submodule-imports
import { put } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import { CHANGE_VIEW } from "../constants";
import { changeView } from "./viewSagas";

describe("viewSagas", () => {
  describe("changeView", () => {
    const changeViewData = changeView({
      payload: { activeView: "foo" }
    });

    it("dispatches the load arrivals event", () => {
      expect(changeViewData.next().value).toEqual(
        put({
          payload: {
            activeView: "foo"
          },
          type: CHANGE_VIEW
        })
      );
    });
  });
});
