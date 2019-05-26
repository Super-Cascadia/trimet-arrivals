import {
  BOOKMARK_SECTIONS,
  removeAllStoredBookmarksInSection,
  removeStoredBookmarkFromSection,
  removeStoredBookmarkSection,
  storeBookmarkSection,
  updateStoredBookmarkSection,
  updateStoredBookmarkSectionName
} from "./bookmarkSections";
import { fetchLocalStorageItemByKey, updateStoredItemByKey } from "./util";

jest.mock("./util");

describe("bookmarkSections.localstorage", () => {
  afterEach(() => {
    fetchLocalStorageItemByKey.mockReset();
    updateStoredItemByKey.mockReset();
  });

  beforeEach(() => {
    const localStoreContents = {
      1: {
        bookmarkedStops: [123, 456],
        name: "Original Section",
        order: 1
      }
    };

    fetchLocalStorageItemByKey.mockReturnValue(localStoreContents);
    updateStoredItemByKey.mockReturnValue({});
  });

  describe("storeBookmarkSection", () => {
    const bookmarkSection = {
      bookmarkedStops: [],
      name: "New Section",
      order: 2
    };

    it("fetches stored bookmarks", () => {
      storeBookmarkSection(2, bookmarkSection);

      expect(fetchLocalStorageItemByKey).toHaveBeenCalledWith(
        BOOKMARK_SECTIONS
      );
    });

    it("updates stored bookmarks with the new bookmark section", () => {
      storeBookmarkSection(2, bookmarkSection);

      expect(updateStoredItemByKey).toHaveBeenCalledWith(BOOKMARK_SECTIONS, {
        1: {
          bookmarkedStops: [123, 456],
          name: "Original Section",
          order: 1
        },
        2: {
          bookmarkedStops: [],
          name: "New Section",
          order: 2
        }
      });
    });
  });

  describe("removeStoredBookmarkSection", () => {
    it("fetches stored bookmarks", () => {
      removeStoredBookmarkSection(1);
      expect(fetchLocalStorageItemByKey).toHaveBeenCalledWith(
        BOOKMARK_SECTIONS
      );
    });

    it("updates stored bookmarks with the new bookmark section", () => {
      removeStoredBookmarkSection(1);
      expect(updateStoredItemByKey).toHaveBeenCalledWith(BOOKMARK_SECTIONS, {});
    });
  });

  describe("updateStoredBookmarkSection", () => {
    it("fetches stored bookmarks", () => {
      updateStoredBookmarkSection(1, 789);
      expect(fetchLocalStorageItemByKey).toHaveBeenCalledWith(
        BOOKMARK_SECTIONS
      );
    });

    it("adds the included stopId to the bookmark section", () => {
      updateStoredBookmarkSection(1, 789);
      expect(updateStoredItemByKey).toHaveBeenCalledWith(BOOKMARK_SECTIONS, {
        1: {
          bookmarkedStops: [123, 456, 789],
          name: "Original Section",
          order: 1
        }
      });
    });
  });

  describe("removeStoredBookmarkFromSection", () => {
    it("fetches stored bookmarks", () => {
      removeStoredBookmarkFromSection(1, 123);
      expect(fetchLocalStorageItemByKey).toHaveBeenCalledWith(
        BOOKMARK_SECTIONS
      );
    });

    it("removes the included stopId from the bookmark section", () => {
      removeStoredBookmarkFromSection(1, 123);
      expect(updateStoredItemByKey).toHaveBeenCalledWith(BOOKMARK_SECTIONS, {
        1: { bookmarkedStops: [456], name: "Original Section", order: 1 }
      });
    });
  });

  describe("removeAllStoredBookmarksInSection", () => {
    it("fetches stored bookmarks", () => {
      removeAllStoredBookmarksInSection(1);
      expect(fetchLocalStorageItemByKey).toHaveBeenCalledWith(
        BOOKMARK_SECTIONS
      );
    });

    it("removes the included stopId from the bookmark section", () => {
      removeAllStoredBookmarksInSection(1);
      expect(updateStoredItemByKey).toHaveBeenCalledWith(BOOKMARK_SECTIONS, {
        1: { bookmarkedStops: [], name: "Original Section", order: 1 }
      });
    });
  });

  describe("updateStoredBookmarkSectionName", () => {
    it("fetches stored bookmarks", () => {
      updateStoredBookmarkSectionName(1, "foo");
      expect(fetchLocalStorageItemByKey).toHaveBeenCalledWith(
        BOOKMARK_SECTIONS
      );
    });

    it("removes the included stopId from the bookmark section", () => {
      updateStoredBookmarkSectionName(1, "foo");
      expect(updateStoredItemByKey).toHaveBeenCalledWith(BOOKMARK_SECTIONS, {
        1: { bookmarkedStops: [123, 456], name: "foo", order: 1 }
      });
    });
  });
});
