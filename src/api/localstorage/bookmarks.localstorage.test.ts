import {
  BOOKMARKS,
  removeStoredBookmark,
  storeLocationBookmark
} from "./bookmarks.localstorage";
import { fetchLocalStorageItemByKey, updateStoredItemByKey } from "./util";

jest.mock("./util");

const localStoreContents = {
  123: { locid: 123 },
  456: { locid: 456 }
};
fetchLocalStorageItemByKey.mockReturnValue(localStoreContents);
updateStoredItemByKey.mockReturnValue({});

describe("Bookmarks.ts", () => {
  describe("removeStoredBookmark", () => {
    removeStoredBookmark(123);

    it("fetches stored bookmarks", () => {
      expect(fetchLocalStorageItemByKey).toHaveBeenCalledWith(BOOKMARKS);
    });

    it("updateStoredItemByKey with updated bookmarks", () => {
      expect(updateStoredItemByKey).toHaveBeenCalledWith(BOOKMARKS, {
        456: { locid: 456 }
      });
    });
  });

  describe("storedLocationBookmark", () => {
    storeLocationBookmark({
      locid: 789
    });

    it("fetches stored bookmarks", () => {
      expect(fetchLocalStorageItemByKey).toHaveBeenCalledWith(BOOKMARKS);
    });

    it("updateStoredItemByKey with updated bookmarks", () => {
      expect(updateStoredItemByKey).toHaveBeenCalledWith(BOOKMARKS, {
        123: { locid: 123 },
        456: { locid: 456 },
        789: { locid: 789 }
      });
    });
  });
});
