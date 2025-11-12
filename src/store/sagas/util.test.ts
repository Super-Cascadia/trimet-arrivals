import { buildBookmarkSection, getBookmarkName, getNextId } from "./util";

describe("util", () => {
  describe("getNextId", () => {
    describe("when the Bookmark Section Reducer has no Bookmark Sections", () => {
      it("returns zero", () => {
        const store = {
          bookmarkSectionReducer: {
            bookmarkSections: {}
          }
        };
        const result = getNextId(store);

        expect(result).toBe(0);
      });
    });

    describe("when the Bookmark Section Reducer has a Bookmark Sections", () => {
      it("returns an integer one greater than the greatest Bookmark Section Id", () => {
        const store = {
          bookmarkSectionReducer: {
            bookmarkSections: {
              1: "foo"
            }
          }
        };
        const result = getNextId(store);

        expect(result).toBe(2);
      });
    });
  });

  describe("getBookmarkName", () => {
    it("returns the Bookmark Section Input Name", () => {
      const store = {
        bookmarkSectionReducer: {
          bookmarkInputSectionName: "foo"
        }
      };

      const result = getBookmarkName(store);

      expect(result).toBe("foo");
    });
  });

  describe("buildBookmarkSection", () => {
    it("returns a BookmarkSection with the provided name", () => {
      const result = buildBookmarkSection("foo");

      expect(result).toEqual({
        bookmarkedStops: [],
        name: "foo",
        order: 0
      });
    });
  });
});
