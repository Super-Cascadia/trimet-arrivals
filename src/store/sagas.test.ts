// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import { getCurrentPosition } from "../api/geolocation";
import { getArrivals } from "../api/trimet/arrivals";
import { getNearbyStops } from "../api/trimet/stops";
import {
  LOAD_ARRIVALS,
  LOAD_ARRIVALS_COMPLETE,
  LOAD_STOP_COMPLETE,
  LOAD_STOPS
} from "./constants";
import { loadArrivalData, loadStopData } from "./sagas";

describe("sagas", () => {
  describe("loadStopData", () => {
    const stopData = loadStopData({
      payload: { radiusInFeet: 123 }
    });

    it("dispatches the load stops event", () => {
      expect(stopData.next().value).toEqual(put({ type: LOAD_STOPS }));
    });

    it("calls current position api", () => {
      expect(stopData.next().value).toEqual(call(getCurrentPosition));
    });

    it("calls nearbyStops api", () => {
      const coords = {
        coords: { latitude: 123, longitude: 123 }
      };
      expect(stopData.next(coords).value).toEqual(
        call(getNearbyStops, coords, 123)
      );
    });

    it("dispatches the load stops complete event", () => {
      expect(stopData.next().value).toEqual(
        put({
          payload: {},
          type: LOAD_STOP_COMPLETE
        })
      );
    });
  });

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
