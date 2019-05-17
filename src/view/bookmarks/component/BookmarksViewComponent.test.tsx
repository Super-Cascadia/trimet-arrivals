import { mount, shallow } from "enzyme";
import * as React from "react";
import BookmarksViewComponent from "./BookmarksViewComponent";

describe("BookmarksViewComponent", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      expect(() =>
        shallow(<BookmarksViewComponent bookmarks={undefined} />)
      ).not.toThrow();
    });

    it("shows a message about bookmarking a stop when none are present", () => {
      const subject = shallow(<BookmarksViewComponent bookmarks={undefined} />);
      const noBookmarksMessage = subject.find(".no-bookmarks-container");

      expect(noBookmarksMessage).toExist();
      expect(noBookmarksMessage.text()).toBe(
        "Bookmark a stop and see it here."
      );
    });
  });

  describe("when provided bookmarks", () => {
    it("shows a StopContainer", () => {
      const bookmarks = [{}, {}];

      const subject = shallow(<BookmarksViewComponent bookmarks={bookmarks} />);
      const bookmarkStops = subject.find(".bookmark-stop-wrapper");

      expect(bookmarkStops).toExist();
      expect(bookmarkStops.children().length).toBe(2);
    });
  });
});
