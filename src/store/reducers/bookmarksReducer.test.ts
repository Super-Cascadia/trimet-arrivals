import { CREATE_STOP_BOOKMARK, REMOVE_STOP_BOOKMARK } from "../constants";
import bookmarksReducer from "./bookmarksReducer";

describe("bookmarksReducer", () => {
  describe("when a bookmark is created", () => {
    const action = {
      payload: {
        stopLocation: {
          locid: 123
        }
      },
      type: CREATE_STOP_BOOKMARK
    };

    const state = bookmarksReducer(undefined, action);

    it("adds a bookmark entry to the store", () => {
      expect(state.bookmarks).toEqual({ 123: { locid: 123 } });
    });
  });

  describe("when a bookmark is removed", () => {
    const action = {
      payload: {
        locationId: 123
      },
      type: REMOVE_STOP_BOOKMARK
    };

    const initialState = {
      bookmarks: {
        123: { locid: 123 },
        456: { locid: 456 }
      }
    };

    const state = bookmarksReducer(initialState, action);

    it("removes existing bookmarks with a matching id", () => {
      expect(state.bookmarks).toEqual({ 456: { locid: 456 } });
    });
  });
});
