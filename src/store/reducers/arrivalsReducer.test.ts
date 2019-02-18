import { ArrivalData } from "../../api/trimet/types";
import { LOAD_ARRIVALS, LOAD_ARRIVALS_COMPLETE } from "../constants";
import arrivalsReducer from "./arrivalsReducer";

describe("arrivalsReducer", () => {
  describe("default behavior", () => {
    it("returns the present state", () => {
      const initialState = {
        arrivals: {},
        loading: {}
      };

      const action = {
        type: "FOO"
      };

      const result = arrivalsReducer(initialState, action);

      expect(result.arrivals).toEqual({});
      expect(result.loading).toEqual({});
    });
  });

  describe("LOAD_ARRIVALS", () => {
    const initialState = {
      arrivals: {},
      loading: {}
    };

    const action = {
      payload: {
        arrivalData: {
          arrival: {}
        },
        locationId: 123
      },
      type: LOAD_ARRIVALS,
    };

    const result = arrivalsReducer(initialState, action);

    it("updates loading state ", () => {
      expect(result.loading).toEqual({ 123: true });
    });

    it("loading remains un populated", () => {
      expect(result.arrivals).toEqual({});
    });
  });

  describe("LOAD_ARRIVALS_COMPLETE", () => {
    const initialState = {
      arrivals: {},
      loading: {}
    };

    const action = {
      payload: {
        arrivalData: {
          arrival: [
            {
              locid: 123
            },
            {
              locid: 456
            }
          ]
        },
        locationId: 123
      },
      type: LOAD_ARRIVALS_COMPLETE,
    };

    const result = arrivalsReducer(initialState, action);

    it("updates loading state ", () => {
      expect(result.loading).toEqual({ 123: false });
    });

    it("loading remains un populated", () => {
      expect(result.arrivals).toEqual({
        123: [{ locid: 123 }],
        456: [{ locid: 456 }]
      });
    });
  });
});
