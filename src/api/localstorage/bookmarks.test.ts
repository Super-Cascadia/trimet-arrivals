import { BOOKMARKS, removeStoredBookmark } from "./bookmarks";
import { fetchLocalStorageItemByKey, updateStoredItemByKey } from "./util";

jest.mock("./util");

const localStoreContents = {
  1: { locid: 123 },
  2: { locid: 456 }
};
fetchLocalStorageItemByKey.mockReturnValue(localStoreContents);
updateStoredItemByKey.mockReturnValue({});

describe("Bookmarks.ts", () => {
  describe("removeStoredBookmark", () => {
    it("updateStoredItemByKey with updated bookmarks", () => {
      removeStoredBookmark(1);

      expect(fetchLocalStorageItemByKey).toHaveBeenCalledWith(BOOKMARKS);
      expect(updateStoredItemByKey).toHaveBeenCalledWith(BOOKMARKS, {
        2: { locid: 456 }
      });
    });
  });
});
