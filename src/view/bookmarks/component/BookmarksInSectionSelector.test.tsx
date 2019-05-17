import { mount } from "enzyme";
import * as React from "react";
import BookmarksInSectionSelector from "./BookmarksInSectionSelector";

describe("BookmarksInSectionSelector", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      expect(() =>
        mount(
          <BookmarksInSectionSelector
            bookmarksInSection={undefined}
            allBookmarks={undefined}
            onReactSelectBookmarkChange={undefined}
          />
        )
      ).not.toThrow();
    });

    it("renders a Select input", () => {
      const subject = mount(
        <BookmarksInSectionSelector
          bookmarksInSection={undefined}
          allBookmarks={undefined}
          onReactSelectBookmarkChange={undefined}
        />
      );

      const selectInput = subject.find("Select");

      expect(selectInput).toExist();
    });
  });
});
