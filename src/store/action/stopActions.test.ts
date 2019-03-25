import { getArrivals } from "../../api/trimet/arrivals";
import { LOAD_ARRIVALS, LOAD_ARRIVALS_COMPLETE } from "../constants";
import { loadArrivalData } from "./stopActions";

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
        type: LOAD_ARRIVALS
      });
    });

    it("dispatchses the LOAD_ARRIVAL_COMPLETE action", done => {
      getArrivals().then(() => {
        expect(dispatchMock).toHaveBeenCalledWith({
          payload: {
            arrivalData: {
              foo: "bar"
            },
            locationId: 123
          },
          type: LOAD_ARRIVALS_COMPLETE
        });

        done();
      });
    });
  });
});
