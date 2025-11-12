import { mount } from "enzyme";
import * as React from "react";
import BookmarksInSectionSelectionHandler, {
  CLEAR,
  POP_VALUE,
  REMOVE_VALUE,
  SELECT_OPTION
} from "./BookmarksInSectionSelectionHandler";
import BookmarksInSectionSelector from "./BookmarksInSectionSelector";

describe("BookmarksInSectionSelector", () => {
  // describe("by default", () => {
  //   it("renders without errors", () => {
  //     expect(() =>
  //       mount(
  //         <BookmarksInSectionSelectionHandler
  //           allBookmarks={undefined}
  //           bookmarksInSection={undefined}
  //           removeBookmarkFromSection={undefined}
  //           addBookmarkToBookmarkSection={undefined}
  //           removeAllBookmarksFromSection={undefined}
  //           bookmarkSectionId={undefined}
  //         />
  //       )
  //     ).not.toThrow();
  //   });
  // });
  // describe("when onChange is called", () => {
  //   describe("and a user has removed all items", () => {
  //     it("calls the remove all bookmarks from section delegate", () => {
  //       const removeAllBookmarksFromSectionSpy = jasmine.createSpy(
  //         "removeAllBookmarksFromSectionSpy"
  //       );
  //       const subject = mount(
  //         <BookmarksInSectionSelectionHandler
  //           allBookmarks={undefined}
  //           bookmarksInSection={undefined}
  //           removeBookmarkFromSection={undefined}
  //           addBookmarkToBookmarkSection={undefined}
  //           removeAllBookmarksFromSection={removeAllBookmarksFromSectionSpy}
  //           bookmarkSectionId={undefined}
  //         />
  //       );
  //       const event = { action: CLEAR };
  //       subject.instance().onChange(123, undefined, event);
  //       expect(removeAllBookmarksFromSectionSpy).toHaveBeenCalled();
  //       expect(removeAllBookmarksFromSectionSpy).toHaveBeenCalledWith(123);
  //     });
  //   });
  //   describe("and the user has a removed an item", () => {
  //     describe("remove is the event", () => {
  //       it("calls the remove all bookmarks from section delegate", () => {
  //         const removeBookmarkFromSectionSpy = jasmine.createSpy(
  //           "removeBookmarkFromSectionSpy"
  //         );
  //         const subject = mount(
  //           <BookmarksInSectionSelectionHandler
  //             allBookmarks={undefined}
  //             bookmarksInSection={undefined}
  //             removeBookmarkFromSection={removeBookmarkFromSectionSpy}
  //             addBookmarkToBookmarkSection={undefined}
  //             removeAllBookmarksFromSection={undefined}
  //             bookmarkSectionId={undefined}
  //           />
  //         );
  //         const event = {
  //           action: REMOVE_VALUE,
  //           removedValue: {
  //             value: "foo"
  //           }
  //         };
  //         subject.instance().onChange(123, undefined, event);
  //         expect(removeBookmarkFromSectionSpy).toHaveBeenCalled();
  //         expect(removeBookmarkFromSectionSpy).toHaveBeenCalledWith(123, "foo");
  //       });
  //     });
  //     describe("pop is the event", () => {
  //       it("calls the remove all bookmarks from section delegate", () => {
  //         const removeBookmarkFromSectionSpy = jasmine.createSpy(
  //           "removeBookmarkFromSectionSpy"
  //         );
  //         const subject = mount(
  //           <BookmarksInSectionSelectionHandler
  //             allBookmarks={undefined}
  //             bookmarksInSection={undefined}
  //             removeBookmarkFromSection={removeBookmarkFromSectionSpy}
  //             addBookmarkToBookmarkSection={undefined}
  //             removeAllBookmarksFromSection={undefined}
  //             bookmarkSectionId={undefined}
  //           />
  //         );
  //         const event = {
  //           action: POP_VALUE,
  //           removedValue: {
  //             value: "foo"
  //           }
  //         };
  //         subject.instance().onChange(123, undefined, event);
  //         expect(removeBookmarkFromSectionSpy).toHaveBeenCalled();
  //         expect(removeBookmarkFromSectionSpy).toHaveBeenCalledWith(123, "foo");
  //       });
  //     });
  //   });
  //   describe("and the user has selected an option", () => {
  //     it("calls the remove all bookmarks from section delegate", () => {
  //       const addBookmarkToBookmarkSectionSpy = jasmine.createSpy(
  //         "addBookmarkToBookmarkSectionSpy"
  //       );
  //       const subject = mount(
  //         <BookmarksInSectionSelectionHandler
  //           allBookmarks={undefined}
  //           bookmarksInSection={undefined}
  //           removeBookmarkFromSection={undefined}
  //           addBookmarkToBookmarkSection={addBookmarkToBookmarkSectionSpy}
  //           removeAllBookmarksFromSection={undefined}
  //           bookmarkSectionId={undefined}
  //         />
  //       );
  //       const event = {
  //         action: SELECT_OPTION,
  //         option: {
  //           value: "foo"
  //         }
  //       };
  //       subject.instance().onChange(123, undefined, event);
  //       expect(addBookmarkToBookmarkSectionSpy).toHaveBeenCalled();
  //       expect(addBookmarkToBookmarkSectionSpy).toHaveBeenCalledWith(
  //         123,
  //         "foo"
  //       );
  //     });
  //   });
  // });
});
