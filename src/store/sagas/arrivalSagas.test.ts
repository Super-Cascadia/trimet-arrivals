// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
import { getArrivals } from "../../api/trimet/arrivals";
// tslint:enable:no-submodule-imports
import { LOAD_ARRIVALS, LOAD_ARRIVALS_COMPLETE } from "../constants";
import { loadArrivalData } from "./arrivalSagas";

describe("arrivalSagas", () => {
  describe("loadArrivalData", () => {
    const arrivalData = loadArrivalData({
      payload: { locationId: 123 }
    });

    it("dispatches the load arrivals event", () => {
      expect(arrivalData.next().value).toEqual(
        put({
          payload: {
            locationId: 123
          },
          type: LOAD_ARRIVALS
        })
      );
    });

    it("calls getArrivals api", () => {
      expect(arrivalData.next().value).toEqual(call(getArrivals, "123", 45));
    });

    it("dispatches the load arrivals complete vent", () => {
      expect(arrivalData.next({}).value).toEqual(
        put({
          payload: {
            arrivalData: {},
            locationId: 123
          },
          type: LOAD_ARRIVALS_COMPLETE
        })
      );
    });
  });
});
