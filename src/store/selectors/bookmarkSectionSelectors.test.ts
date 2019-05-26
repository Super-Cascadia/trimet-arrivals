import { bookmarksInSectionSelector } from "./bookmarkSectionSelectors";

describe("bookmarkSectionSelectors", () => {
  describe("bookmarksInSectionSelector", () => {
    it("returns the stop locations for the corresponding bookmark section id", () => {
      const store = {
        bookmarkSectionReducer: {
          bookmarkSections: {
            1: {
              bookmarkedStops: [123]
            }
          }
        },
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

      const result = bookmarksInSectionSelector(store, 1);

      expect(result).toEqual([{ locid: 123 }]);
    });
  });
});
