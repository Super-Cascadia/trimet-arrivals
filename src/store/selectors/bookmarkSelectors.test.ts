import { RootState } from "../reducers";
import {
  bookmarkCountSelector,
  bookmarkedStopLocationSelector,
  bookmarkedStopLocationsSelector,
  stopIsBookmarkedSelector
} from "./bookmarkSelectors";

describe("bookmarkSelectors", () => {
  describe("bookmarkedStopLocationsSelector", () => {
    it("returns all bookmarks", () => {
      const state = {
        bookmarksReducer: {
          bookmarks: {
            123: {
              locid: 123
            }
          }
        }
      };

      const result = bookmarkedStopLocationsSelector(state as RootState);

      expect(result).toEqual({ 123: { locid: 123 } });
    });
  });

  describe("bookmarkedStopLocationSelector", () => {
    it("returns all bookmarks", () => {
      const state = {
        bookmarksReducer: {
          bookmarks: {
            123: {
              locid: 123
            },
            234: {
              locid: 234
            }
          }
        }
      };

      const result = bookmarkedStopLocationSelector(state as RootState);

      expect(result).toEqual([{ locid: 123 }, { locid: 234 }]);
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
