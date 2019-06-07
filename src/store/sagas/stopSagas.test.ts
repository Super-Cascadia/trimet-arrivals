// tslint:disable:no-submodule-imports
import { call, put } from "redux-saga/effects";
import getCurrentPosition from "../../api/geolocation/getCurrentPosition";
// tslint:enable:no-submodule-imports
import { CURRENT_LOCATION_LOAD_COMPLETE, LOAD_STOPS } from "../constants";
import { loadStopData } from "./stopSagas";

jest.mock("../../api/geolocation/getCurrentPosition");

describe("stopSagas", () => {
  describe("loadStopData", () => {
    const stopData = loadStopData({
      payload: { radiusInFeet: 123 }
    });

    it("dispatches the load stops event", () => {
      expect(stopData.next().value).toEqual(put({ type: LOAD_STOPS }));
    });

    it("calls current position api", () => {
      getCurrentPosition.mockReturnValue(
        Promise.resolve({
          coords: {
            latitude: 5678,
            longitude: 7838
          }
        })
      );

      getCurrentPosition().then(location => {
        expect(stopData.next().value).toEqual(call(getCurrentPosition));
      });
    });

    it("dispatches the load stops complete event", () => {
      getCurrentPosition().then(location => {
        expect(stopData.next(location).value).toEqual(
          put({
            payload: {
              location: {
                coords: {
                  latitude: 5678,
                  longitude: 7838
                }
              }
            },
            type: CURRENT_LOCATION_LOAD_COMPLETE
          })
        );
      });
    });

    // it("calls nearbyStops api", () => {
    //   const coords = {
    //     coords: { latitude: 123, longitude: 123 }
    //   };
    //   expect(stopData.next(coords).value).toEqual(
    //     call(getNearbyStops, coords, 123)
    //   );
    // });
    //
    // it("dispatches a LOAD_STOPS_COMPLETE event", () => {
    //   const coords = {
    //     coords: { latitude: 123, longitude: 123 }
    //   };
    //   expect(stopData.next(coords).value).toEqual(
    //     call(getNearbyStops, coords, 123)
    //   );
    // });
  });
});
