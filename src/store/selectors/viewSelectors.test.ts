import { RootState } from "../reducers";
import { viewSelector } from "./viewSelectors";

describe("viewSelectors", () => {
  describe("viewSelector", () => {
    it("selects active view", () => {
      const state = {
        viewReducer: {
          activeView: "foo"
        }
      };

      const result = viewSelector(state as RootState);

      expect(result).toBe("foo");
    });
  });
});
