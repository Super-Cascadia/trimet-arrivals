import { getArrivals } from "../../api/trimet/arrivals";
import { getNearbyStops } from "../../api/trimet/stops";
import {
  LOAD_ARRIVALS,
  LOAD_ARRIVALS_COMPLETE,
  LOAD_STOP_COMPLETE,
  LOAD_STOPS
} from "../constants";
import { loadArrivalData, loadStopData } from "./stopActions";

jest.mock("../../api/trimet/util", () => {
  return {
    getTrimetData() {
      return Promise.resolve({ foo: "bar" });
    }
  };
});

jest.mock("../../api/geolocation", () => {
  return {
    getCurrentPosition() {
      return Promise.resolve({ foo: "bar" });
    }
  };
});

jest.mock("../../api/trimet/arrivals", () => {
  return {
    getArrivals() {
      return Promise.resolve({ foo: "bar" });
    }
  };
});

jest.mock("../../api/trimet/stops", () => {
  return {
    getNearbyStops() {
      return Promise.resolve({ foo: "bar" });
    }
  };
});

describe("stopActions", () => {
  describe("loadArrivalData", () => {
    const dispatchMock = jasmine.createSpy("dispatchMock");
    loadArrivalData(123)(dispatchMock);

    it("dispatchses the LOAD_ARRIVAL action", () => {
      expect(dispatchMock).toHaveBeenCalled();
      expect(dispatchMock).toHaveBeenCalledWith({
        payload: {
          locationId: 123
        },
        type: LOAD_ARRIVALS,
      });
    });

    it("dispatchses the LOAD_ARRIVAL_COMPLETE action", done => {
      getArrivals().then(() => {
        expect(dispatchMock).toHaveBeenCalledWith({
          payload: {
            arrivalData: {
              foo: "bar"
            },
            locationId: 123,
          },
          type: LOAD_ARRIVALS_COMPLETE,
        });

        done();
      });
    });
  });

  describe("loadStopData", () => {
    const dispatchMock = jasmine.createSpy("dispatchMock");
    loadStopData(123)(dispatchMock);

    it("dispatches the LOAD_ARRIVAL action", () => {
      expect(dispatchMock).toHaveBeenCalled();
      expect(dispatchMock).toHaveBeenCalledWith({
        type: LOAD_STOPS
      });
    });

    it("dispatchses the LOAD_ARRIVAL_COMPLETE action", done => {
      const location = { coords: { longitude: 123, latitude: 123 } };

      getNearbyStops(location, 123).then(() => {
        expect(dispatchMock).toHaveBeenCalledWith({
          payload: {
            stopData: {
              foo: "bar"
            }
          },
          type: LOAD_STOP_COMPLETE,
        });

        done();
      });
    });
  });
});
