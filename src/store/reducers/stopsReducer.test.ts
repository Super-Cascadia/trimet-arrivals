import stopsReducer from "./stopsReducer";
import {
  LOAD_ARRIVALS_COMPLETE,
  LOAD_STOP_COMPLETE,
  LOAD_STOPS
} from "../constants";
import { StopData, StopLocation } from "../../api/trimet/types";

describe("stopsReducer", () => {
  describe("default behavior", () => {
    it("returns the present state", () => {
      const initialState = {
        loading: true,
        timeOfLastLoad: ""
      };

      const action = {
        type: "FOO"
      };

      const result = stopsReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.timeOfLastLoad).toBe("");
    });
  });

  describe("LOAD_STOPS", () => {
    it("updates the loading state", () => {
      const initialState = {
        loading: false,
        timeOfLastLoad: ""
      };

      const action = {
        type: LOAD_STOPS
      };

      const result = stopsReducer(initialState, action);

      expect(result.loading).toBe(true);
    });
  });

  describe("LOAD_STOP_COMPLETE", () => {
    const initialState = {
      loading: true,
      timeOfLastLoad: ""
    };

    const action = {
      type: LOAD_STOP_COMPLETE,
      payload: {
        stopData: {
          location: [
            {
              locid: 123
            } as StopLocation,
            {
              locid: 456
            } as StopLocation
          ]
        } as StopData
      }
    };

    const result = stopsReducer(initialState, action);

    it("updates the loading state to false", () => {
      expect(result.loading).toBe(false);
    });

    xit("updates the timeOfLastLoad to current time in a formatted state", () => {
      expect(result.timeOfLastLoad).toBe("123");
    });

    it("formats the stop locations into a dictionary format", () => {
      expect(result.stopLocations).toEqual({
        123: {
          locid: 123
        },
        456: {
          locid: 456
        }
      });
    });
  });

  describe("LOAD_ARRIVALS_COMPLETE", function() {
    const initialState = {
      loading: true,
      timeOfLastLoad: ""
    };

    const action = {
      type: LOAD_ARRIVALS_COMPLETE
    };

    const result = stopsReducer(initialState, action);

    it("loading prop should stay the same", () => {
      expect(result.loading).toBe(true);
    });

    xit("updates the timeOfLastLoad to current time in a formatted state", () => {
      expect(result.timeOfLastLoad).toBe("123");
    });
  });
});
