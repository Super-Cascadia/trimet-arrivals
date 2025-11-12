// tslint:disable:no-submodule-imports
import { call, put, select } from "redux-saga/effects";
// tslint:enable:no-submodule-imports
import {
  removeAllStoredBookmarksInSection,
  removeStoredBookmarkFromSection,
  removeStoredBookmarkSection,
  storeBookmarkSection,
  updateStoredBookmarkSection,
  updateStoredBookmarkSectionName
} from "../../api/localstorage/bookmarkSections";
import {
  CREATE_BOOKMARK_SECTION,
  REMOVE_ALL_BOOKMARKS_FROM_SECTION,
  REMOVE_BOOKMARK_FROM_SECTION,
  REMOVE_BOOKMARK_SECTION,
  UPDATE_BOOKMARK_SECTION_NAME,
  UPDATE_BOOKMARK_SECTION_NAME_INPUT,
  UPDATE_BOOKMARKS_SECTION_CONTENTS
} from "../constants/bookmarkSections";
import {
  createBookmarkSection,
  removeAllBookmarksInSection,
  removeBookmarkFromSection,
  removeBookmarkSection,
  updateBookmarkSectionName,
  updateSectionInputName,
  updateSelectedBookmarkSection
} from "./bookmarkSectionSagas";
import { getBookmarkName, getNextId } from "./util";

describe("bookmarkSectionSagas", () => {
  // describe("updateSectionInputName", () => {
  //   const updateSectionInputNameGenerator = updateSectionInputName({
  //     payload: { name: "foo" }
  //   });
  //   it("dispatches a updated bookmark section name input event", () => {
  //     expect(updateSectionInputNameGenerator.next().value).toEqual(
  //       put({
  //         payload: { name: "foo" },
  //         type: UPDATE_BOOKMARK_SECTION_NAME_INPUT
  //       })
  //     );
  //   });
  // });
  // describe("createBookmarkSection", () => {
  //   describe("when an error occurs", () => {
  //     it("catches the error", () => {
  //       const createBookmarkSectionGenerator = createBookmarkSection({
  //         payload: { name: "foo" }
  //       });
  //       createBookmarkSectionGenerator.next();
  //       expect(createBookmarkSectionGenerator.throw("fooo").value).toEqual(
  //         put({
  //           error: "fooo",
  //           type: "API_ERROR"
  //         })
  //       );
  //     });
  //   });
  //   describe("when no error occurs", () => {
  //     const createBookmarkSectionGenerator = createBookmarkSection({
  //       payload: { name: "foo" }
  //     });
  //     it("determines the next id for a bookmark section", () => {
  //       expect(createBookmarkSectionGenerator.next().value).toEqual(
  //         select(getNextId)
  //       );
  //     });
  //     it("gets the value of the name for the bookmark section", () => {
  //       expect(createBookmarkSectionGenerator.next().value).toEqual(
  //         select(getBookmarkName)
  //       );
  //     });
  //     it("builds the bookmark section model", () => {
  //       expect(createBookmarkSectionGenerator.next().value).toEqual({
  //         bookmarkedStops: [],
  //         name: undefined,
  //         order: 0
  //       });
  //     });
  //     it("dispatches a create bookmark section event", () => {
  //       expect(createBookmarkSectionGenerator.next().value).toEqual(
  //         put({
  //           payload: { nextId: undefined, bookmarkSection: undefined },
  //           type: CREATE_BOOKMARK_SECTION
  //         })
  //       );
  //     });
  //     it("stores the bookmark section in local storage", () => {
  //       expect(createBookmarkSectionGenerator.next().value).toEqual(
  //         call(storeBookmarkSection, undefined, undefined)
  //       );
  //     });
  //   });
  // });
  // describe("removeBookmarkSection", () => {
  //   describe("when an error occurs", () => {
  //     const removeBookmarkSectionGenerator = removeBookmarkSection({
  //       payload: { bookmarkSectionId: 123 }
  //     });
  //     it("dispatches an error event", () => {
  //       removeBookmarkSectionGenerator.next();
  //       expect(removeBookmarkSectionGenerator.throw("fooo").value).toEqual(
  //         put({
  //           error: "fooo",
  //           type: "API_ERROR"
  //         })
  //       );
  //     });
  //   });
  //   describe("when no error occurs", () => {
  //     const removeBookmarkSectionGenerator = removeBookmarkSection({
  //       payload: { bookmarkSectionId: 123 }
  //     });
  //     it("dispatches a remove bookmark section event", () => {
  //       expect(removeBookmarkSectionGenerator.next().value).toEqual(
  //         put({
  //           payload: { bookmarkSectionId: 123 },
  //           type: REMOVE_BOOKMARK_SECTION
  //         })
  //       );
  //     });
  //     it("removes the stored bookmark section from local storage", () => {
  //       expect(removeBookmarkSectionGenerator.next().value).toEqual(
  //         call(removeStoredBookmarkSection, 123)
  //       );
  //     });
  //   });
  // });
  // describe("updateSelectedBookmarkSection", () => {
  //   describe("when an error occurs", () => {
  //     it("catches the error", () => {
  //       const updateSelectedBookmarkSectionGenerator = updateSelectedBookmarkSection(
  //         {
  //           payload: { selectedBookmarkSection: 123, stopId: 123 }
  //         }
  //       );
  //       updateSelectedBookmarkSectionGenerator.next();
  //       expect(
  //         updateSelectedBookmarkSectionGenerator.throw("fooo").value
  //       ).toEqual(
  //         put({
  //           error: "fooo",
  //           type: "API_ERROR"
  //         })
  //       );
  //     });
  //   });
  //   describe("when no error occurs", () => {
  //     const updateSelectedBookmarkSectionGenerator = updateSelectedBookmarkSection(
  //       {
  //         payload: { selectedBookmarkSection: 123, stopId: 456 }
  //       }
  //     );
  //     it("dispatches a remove bookmark section event", () => {
  //       expect(updateSelectedBookmarkSectionGenerator.next().value).toEqual(
  //         put({
  //           payload: { selectedBookmarkSection: 123, stopId: 456 },
  //           type: UPDATE_BOOKMARKS_SECTION_CONTENTS
  //         })
  //       );
  //     });
  //     it("removes the stored bookmark section from local storage", () => {
  //       expect(updateSelectedBookmarkSectionGenerator.next().value).toEqual(
  //         call(updateStoredBookmarkSection, 123, 456)
  //       );
  //     });
  //   });
  // });
  // describe("removeBookmarkFromSection", () => {
  //   describe("when an error occurs", () => {
  //     it("catches the error", () => {
  //       const removeBookmarkFromSectionGenerator = removeBookmarkFromSection({
  //         payload: { selectedBookmarkSection: 123, stopId: 123 }
  //       });
  //       removeBookmarkFromSectionGenerator.next();
  //       expect(removeBookmarkFromSectionGenerator.throw("fooo").value).toEqual(
  //         put({
  //           error: "fooo",
  //           type: "API_ERROR"
  //         })
  //       );
  //     });
  //   });
  //   describe("when no error occurs", () => {
  //     const removeBookmarkFromSectionGenerator = removeBookmarkFromSection({
  //       payload: {
  //         bookmarkSectionId: 123,
  //         stopId: 456
  //       }
  //     });
  //     it("dispatches a remove bookmark section event", () => {
  //       expect(removeBookmarkFromSectionGenerator.next().value).toEqual(
  //         put({
  //           payload: { bookmarkSectionId: 123, stopId: 456 },
  //           type: REMOVE_BOOKMARK_FROM_SECTION
  //         })
  //       );
  //     });
  //     it("removes the stored bookmark section from local storage", () => {
  //       expect(removeBookmarkFromSectionGenerator.next().value).toEqual(
  //         call(removeStoredBookmarkFromSection, 123, 456)
  //       );
  //     });
  //   });
  // });
  // describe("removeAllBookmarksInSection", () => {
  //   describe("when an error occurs", () => {
  //     it("catches the error", () => {
  //       const removeAllBookmarksInSectionGenerator = removeAllBookmarksInSection(
  //         {
  //           payload: { selectedBookmarkSection: 123, stopId: 123 }
  //         }
  //       );
  //       removeAllBookmarksInSectionGenerator.next();
  //       expect(
  //         removeAllBookmarksInSectionGenerator.throw("fooo").value
  //       ).toEqual(
  //         put({
  //           error: "fooo",
  //           type: "API_ERROR"
  //         })
  //       );
  //     });
  //   });
  //   describe("when no error occurs", () => {
  //     const removeAllBookmarksInSectionGenerator = removeAllBookmarksInSection({
  //       payload: { bookmarkSectionId: 123 }
  //     });
  //     it("dispatches a remove bookmark section event", () => {
  //       expect(removeAllBookmarksInSectionGenerator.next().value).toEqual(
  //         put({
  //           payload: { bookmarkSectionId: 123 },
  //           type: REMOVE_ALL_BOOKMARKS_FROM_SECTION
  //         })
  //       );
  //     });
  //     it("removes the stored bookmark section from local storage", () => {
  //       expect(removeAllBookmarksInSectionGenerator.next().value).toEqual(
  //         call(removeAllStoredBookmarksInSection, 123)
  //       );
  //     });
  //   });
  // });
  // describe("updateBookmarkSectionName", () => {
  //   describe("when an error occurs", () => {
  //     it("catches the error", () => {
  //       const updateBookmarkSectionNameGenerator = updateBookmarkSectionName({
  //         payload: { selectedBookmarkSection: 123, stopId: 123 }
  //       });
  //       updateBookmarkSectionNameGenerator.next();
  //       expect(updateBookmarkSectionNameGenerator.throw("fooo").value).toEqual(
  //         put({
  //           error: "fooo",
  //           type: "API_ERROR"
  //         })
  //       );
  //     });
  //   });
  //   describe("when no error occurs", () => {
  //     const updateBookmarkSectionNameGenerator = updateBookmarkSectionName({
  //       payload: {
  //         bookmarkSectionId: 123,
  //         bookmarkSectionName: "foo"
  //       }
  //     });
  //     it("dispatches a remove bookmark section event", () => {
  //       expect(updateBookmarkSectionNameGenerator.next().value).toEqual(
  //         put({
  //           payload: { bookmarkSectionId: 123, bookmarkSectionName: "foo" },
  //           type: UPDATE_BOOKMARK_SECTION_NAME
  //         })
  //       );
  //     });
  //     it("removes the stored bookmark section from local storage", () => {
  //       expect(updateBookmarkSectionNameGenerator.next().value).toEqual(
  //         call(updateStoredBookmarkSectionName, 123, "foo")
  //       );
  //     });
  //   });
  // });
});
