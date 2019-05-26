import {
  BOOKMARK_SECTION_SELECT_REQUEST,
  REMOVE_ALL_BOOKMARKS_IN_SECTION_REQUEST,
  REMOVE_BOOKMARK_FROM_SECTION_REQUEST,
  UPDATE_BOOKMARK_SECTION_NAME_REQUEST
} from "../constants/bookmarkSections";
import {
  addBookmarkToBookmarkSectionRequest,
  bookmarkSectionSelectRequest,
  removeAllBookmarksInSectionRequest,
  removeBookmarkFromSectionRequest,
  updateBookmarkSectionNameRequest
} from "./bookmarkSectionActions";

describe("bookmarkSectionActions", () => {
  describe("removeBookmarkFromSectionRequest", () => {
    it("sends a payload", () => {
      const result = removeBookmarkFromSectionRequest(1, 123);

      expect(result).toEqual({
        payload: { bookmarkSectionId: 1, stopId: 123 },
        type: REMOVE_BOOKMARK_FROM_SECTION_REQUEST
      });
    });
  });

  describe("bookmarkSectionSelectRequest", () => {
    it("sends a payload", () => {
      const result = bookmarkSectionSelectRequest(1, {
        locid: 123
      });

      expect(result).toEqual({
        payload: { selectedBookmarkSection: 1, stopLocation: { locid: 123 } },
        type: BOOKMARK_SECTION_SELECT_REQUEST
      });
    });
  });

  describe("addBookmarkToBookmarkSectionRequest", () => {
    it("sends a payload", () => {
      const result = addBookmarkToBookmarkSectionRequest(1, {
        locid: 123
      });

      expect(result).toEqual({
        payload: { selectedBookmarkSection: 1, stopId: { locid: 123 } },
        type: BOOKMARK_SECTION_SELECT_REQUEST
      });
    });
  });

  describe("removeAllBookmarksInSectionRequest", () => {
    it("sends a payload", () => {
      const result = removeAllBookmarksInSectionRequest(1);

      expect(result).toEqual({
        payload: { bookmarkSectionId: 1 },
        type: REMOVE_ALL_BOOKMARKS_IN_SECTION_REQUEST
      });
    });
  });

  describe("updateBookmarkSectionNameRequest", () => {
    it("sends a payload", () => {
      const result = updateBookmarkSectionNameRequest(1, "foo");

      expect(result).toEqual({
        payload: { bookmarkSectionId: 1, bookmarkSectionName: "foo" },
        type: UPDATE_BOOKMARK_SECTION_NAME_REQUEST
      });
    });
  });
});
