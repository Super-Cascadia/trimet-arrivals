import { shallow } from "enzyme";
import React from "react";
import BookmarkSectionComponent from "./BookmarkSectionComponent";

describe("BookmarkSectionComponent", () => {
  describe("by default", () => {
    const baseComponent = (
      <BookmarkSectionComponent
        name={undefined}
        id={undefined}
        bookmarksInSection={undefined}
        removeBookmarkSection={undefined}
        allBookmarks={undefined}
        removeBookmarkFromSection={undefined}
        addBookmarkToBookmarkSection={undefined}
        removeAllBookmarksFromSection={undefined}
        updateBookmarkSectionName={undefined}
      />
    );

    it("renders without errors", () => {
      expect(() => shallow(baseComponent)).not.toThrow();
    });

    const subject = shallow(baseComponent);

    it("has a BookmarkSectionNav", () => {
      const bookmarkSectionNav = subject.find("BookmarkSectionNav");

      expect(bookmarkSectionNav).toExist();
    });

    it("has a bookmarks section", () => {
      const bookmarkSectionBookmarks = subject.find(
        ".bookmark-section-bookmarks"
      );
      expect(bookmarkSectionBookmarks).toExist();
    });

    it("the bookmarks section has a message about adding your first item", () => {
      const bookmarkSectionBookmarks = subject.find(
        ".bookmark-section-bookmarks"
      );
      const emptyMessage = bookmarkSectionBookmarks.find(
        ".bookmark-section-add-more"
      );
      expect(emptyMessage).toExist();
      expect(emptyMessage.text()).toBe(
        "Select bookmarks from the list above to see them here."
      );
    });
  });

  describe("when the bookmark section has bookmarked stops", () => {
    const bookmarksInSection = [{}];

    it("each bookmarked stop has a StopContainer", () => {
      const subject = shallow(
        <BookmarkSectionComponent
          name={undefined}
          id={undefined}
          bookmarksInSection={bookmarksInSection}
          removeBookmarkSection={undefined}
          allBookmarks={undefined}
          removeBookmarkFromSection={undefined}
          addBookmarkToBookmarkSection={undefined}
          removeAllBookmarksFromSection={undefined}
          updateBookmarkSectionName={undefined}
        />
      );

      const stopContainer = subject.find("StopContainer");

      expect(stopContainer).toBeDefined();
    });

    describe("when in edit mode", () => {
      it("shows a remove bookmark button", () => {
        const subject = shallow(
          <BookmarkSectionComponent
            name={undefined}
            id={undefined}
            bookmarksInSection={bookmarksInSection}
            removeBookmarkSection={undefined}
            allBookmarks={undefined}
            removeBookmarkFromSection={undefined}
            addBookmarkToBookmarkSection={undefined}
            removeAllBookmarksFromSection={undefined}
            updateBookmarkSectionName={undefined}
          />
        );

        subject.instance().toggleEditMode();

        const stopContainer = subject.find("RemoveBookmarkButton");

        expect(stopContainer).toExist();
      });
    });
  });
});
