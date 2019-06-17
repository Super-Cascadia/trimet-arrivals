import { RootState } from "../reducers";
import {
  allStopLocationsSelector,
  stopLocationSelector,
  stopsLoadingSelector,
  timeOfLastLoadSelector
} from "./stopSelectors";

describe("stopSelectors", () => {
  describe("nearbyActiveViewSelector", () => {
    it("selects loading state for all stops", () => {
      const state = {
        stopsReducer: {
          loading: true
        }
      };

      const result = stopsLoadingSelector(state as RootState);

      expect(result).toBe(true);
    });
  });

  describe("allStopLocationsSelector", () => {
    it("selects all of the stop locations", () => {
      const state = {
        stopsReducer: {
          stopLocations: {
            123: {
              foo: "bar"
            }
          }
        }
      };

      const result = allStopLocationsSelector(state as RootState);

      expect(result).toEqual({ 123: { foo: "bar" } });
    });
  });

  describe("timeOfLastLoadSelector", () => {
    it("selects the time of last load", () => {
      const state = {
        stopsReducer: {
          timeOfLastLoad: 123
        }
      };

      const result = timeOfLastLoadSelector(state as RootState);

      expect(result).toEqual(123);
    });
  });

  describe("stopLocationSelector", () => {
    it("selects the stop locations for a specified locationId", () => {
      const state = {
        stopsReducer: {
          stopLocations: {
            123: { 123: { foo: "bar" } }
          }
        }
      };

      const result = stopLocationSelector(state as RootState, 123);

      expect(result).toEqual({ 123: { foo: "bar" } });
    });
  });
});
