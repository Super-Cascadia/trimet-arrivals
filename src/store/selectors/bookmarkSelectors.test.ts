import { RootState } from "../reducers";
import {
  bookmarkCountSelector,
  bookmarkedStopLocationsSelector,
  stopIsBookmarkedSelector
} from "./bookmarkSelectors";

describe("bookmarkSelectors", () => {
  describe("bookmarkedStopLocationsSelector", () => {
    it("returns all bookmarks", () => {
      const state = {
        bookmarksReducer: {
          bookmarks: {
            foo: "bar"
          }
        }
      };

      const result = bookmarkedStopLocationsSelector(state as RootState);

      expect(result).toEqual({ foo: "bar" });
    });
  });

  describe("bookmarkCountSelector", () => {
    it("returns a count of all bookmarks", () => {
      const state = {
        bookmarksReducer: {
          bookmarks: {
            123: "bar",
            456: "bar"
          }
        }
      };

      const result = bookmarkCountSelector(state as RootState);

      expect(result).toEqual(2);
    });
  });

  describe("stopIsBookmarkedSelector", () => {
    it("returns true if location id is bookmarked", () => {
      const state = {
        bookmarksReducer: {
          bookmarks: {
            123: "bar",
            456: "bar"
          }
        }
      };

      const result = stopIsBookmarkedSelector(state as RootState, 123);

      expect(result).toEqual(true);
    });
  });
});
