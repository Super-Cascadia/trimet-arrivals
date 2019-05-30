import {
  CREATE_BOOKMARK_SECTION,
  LOAD_BOOKMARK_SECTIONS_COMPLETE,
  REMOVE_ALL_BOOKMARKS_FROM_SECTION,
  REMOVE_BOOKMARK_FROM_SECTION,
  REMOVE_BOOKMARK_SECTION,
  UPDATE_BOOKMARK_SECTION_NAME,
  UPDATE_BOOKMARK_SECTION_NAME_INPUT,
  UPDATE_BOOKMARKS_SECTION_CONTENTS
} from "../constants/bookmarkSections";
import bookmarkSectionReducer from "./bookmarkSectionReducer";

function removeBookmarkFromSectionAction() {
  return {
    payload: {
      bookmarkSectionId: 123,
      stopId: 456
    },
    type: REMOVE_BOOKMARK_FROM_SECTION
  };
}

describe("bookmarkSectionReducer", () => {
  // describe("by default", () => {
  //   it("returns the state returned to it", () => {
  //     const initialState = { foo: "bar" };
  //     const action = {};
  //     const state = bookmarkSectionReducer(initialState, action);
  //     expect(state).toEqual({ foo: "bar" });
  //   });
  // });
  // describe("when the bookmark section name input is updated", () => {
  //   const initialState = { bookmarkInputSectionName: "bar" };
  //   const action = {
  //     payload: {
  //       name: "foo"
  //     },
  //     type: UPDATE_BOOKMARK_SECTION_NAME_INPUT
  //   };
  //   const state = bookmarkSectionReducer(initialState, action);
  //   it("updates the state of bookmarkInputSectionName", () => {
  //     expect(state).toEqual({ bookmarkInputSectionName: "foo" });
  //   });
  // });
  // describe("when a new bookmark section is created", () => {
  //   const initialState = { bookmarkInputSectionName: "bar" };
  //   const action = {
  //     payload: {
  //       bookmarkSection: { foo: "bar" },
  //       nextId: 123
  //     },
  //     type: CREATE_BOOKMARK_SECTION
  //   };
  //   const state = bookmarkSectionReducer(initialState, action);
  //   it("sets the bookmark input section name to an empty string", () => {
  //     expect(state.bookmarkInputSectionName).toEqual("");
  //   });
  //   it("creates a new bookmark section entry", () => {
  //     expect(state.bookmarkSections).toEqual({
  //       123: { foo: "bar" }
  //     });
  //   });
  // });
  // describe("when a bookmark section is removed", () => {
  //   const initialState = {
  //     bookmarkSections: { 123: { foo: "bar" } }
  //   };
  //   const action = {
  //     payload: { bookmarkSectionId: 123 },
  //     type: REMOVE_BOOKMARK_SECTION
  //   };
  //   const state = bookmarkSectionReducer(initialState, action);
  //   it("removes the corresponding bookmark section from the store", () => {
  //     expect(state.bookmarkSections).toEqual({});
  //   });
  // });
  // describe("when the contents of a bookmark section are updated", () => {
  //   describe("and the bookmark is not yet in the bookmark section", () => {
  //     const initialState = {
  //       bookmarkSections: {
  //         123: {
  //           bookmarkedStops: [789]
  //         }
  //       }
  //     };
  //     const action = {
  //       payload: {
  //         selectedBookmarkSection: 123,
  //         stopId: 456
  //       },
  //       type: UPDATE_BOOKMARKS_SECTION_CONTENTS
  //     };
  //     const state = bookmarkSectionReducer(initialState, action);
  //     it("adds the bookmark to the bookmark section", () => {
  //       expect(state.bookmarkSections).toEqual({
  //         123: { bookmarkedStops: [789, 456] }
  //       });
  //     });
  //   });
  //   describe("and the bookmark is already in the bookmark section", () => {
  //     const initialState = {
  //       bookmarkSections: {
  //         123: {
  //           bookmarkedStops: [456, 789]
  //         }
  //       }
  //     };
  //     const action = {
  //       payload: {
  //         selectedBookmarkSection: 123,
  //         stopId: 456
  //       },
  //       type: UPDATE_BOOKMARKS_SECTION_CONTENTS
  //     };
  //     const state = bookmarkSectionReducer(initialState, action);
  //     it("does not update the state of the bookmark section", () => {
  //       expect(state.bookmarkSections).toEqual({
  //         123: { bookmarkedStops: [456, 789] }
  //       });
  //     });
  //   });
  // });
  // describe("when bookmark sections have been loaded", () => {
  //   const initialState = {
  //     bookmarkSections: { foo: "bar" }
  //   };
  //   const action = {
  //     payload: {
  //       bookmarkSections: {
  //         baz: "bat"
  //       }
  //     },
  //     type: LOAD_BOOKMARK_SECTIONS_COMPLETE
  //   };
  //   const state = bookmarkSectionReducer(initialState, action);
  //   it("overwrites all bookmark sections in already in the store", () => {
  //     expect(state.bookmarkSections).toEqual({ baz: "bat" });
  //   });
  // });
  // describe("when bookmark is removed from a section", () => {
  //   describe("and the bookmark is already in the bookmark section", () => {
  //     const initialState = {
  //       bookmarkSections: {
  //         123: { bookmarkedStops: [456, 789] }
  //       }
  //     };
  //     const state = bookmarkSectionReducer(
  //       initialState,
  //       removeBookmarkFromSectionAction()
  //     );
  //     it("removes the bookmark from the bookmark section", () => {
  //       expect(state.bookmarkSections).toEqual({
  //         123: { bookmarkedStops: [789] }
  //       });
  //     });
  //   });
  //   describe("and the bookmark is already in the store", () => {
  //     const initialState = {
  //       bookmarkSections: {
  //         123: { bookmarkedStops: [789] }
  //       }
  //     };
  //     const state = bookmarkSectionReducer(
  //       initialState,
  //       removeBookmarkFromSectionAction()
  //     );
  //     it("removes the bookmark from the bookmark section", () => {
  //       expect(state.bookmarkSections).toEqual({
  //         123: { bookmarkedStops: [789] }
  //       });
  //     });
  //   });
  // });
  // describe("when all bookmarks are removed from the section", () => {
  //   const initialState = {
  //     bookmarkSections: {
  //       123: { bookmarkedStops: [123, 456, 789] }
  //     }
  //   };
  //   const action = {
  //     payload: { bookmarkSectionId: 123 },
  //     type: REMOVE_ALL_BOOKMARKS_FROM_SECTION
  //   };
  //   const state = bookmarkSectionReducer(initialState, action);
  //   it("removes the bookmark from the bookmark section", () => {
  //     expect(state.bookmarkSections).toEqual({
  //       123: { bookmarkedStops: [] }
  //     });
  //   });
  // });
  // describe("when a bookmark section name is updated", () => {
  //   const initialState = {
  //     bookmarkSections: {
  //       123: { name: "bar", bookmarkedStops: [456] }
  //     }
  //   };
  //   const action = {
  //     payload: { bookmarkSectionId: 123, bookmarkSectionName: "foo" },
  //     type: UPDATE_BOOKMARK_SECTION_NAME
  //   };
  //   const state = bookmarkSectionReducer(initialState, action);
  //   it("removes the bookmark from the bookmark section", () => {
  //     expect(state.bookmarkSections).toEqual({
  //       123: { bookmarkedStops: [456], name: "foo" }
  //     });
  //   });
  // });
});
