// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import { getCurrentPosition } from "../api/geolocation";
import { getNearbyStops } from "../api/trimet/stops";
import { LOAD_STOP_COMPLETE, LOAD_STOPS } from "./constants";
import { loadStopData } from "./sagas";

describe("loadStopData", () => {
  const stopData = loadStopData({
    payload: { radiusInFeet: 123 }
  });

  it("dispatches the load stops event", () => {
    expect(stopData.next().value).toEqual(put({ type: LOAD_STOPS }));
  });

  it("calls current position", () => {
    expect(stopData.next().value).toEqual(call(getCurrentPosition));
  });

  it("calls nearbyStops", () => {
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
