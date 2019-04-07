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

      expect(subject.find(".no-bookmarks-container")).toExist();
    });
  });
});
