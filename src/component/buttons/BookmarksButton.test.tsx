import { shallow } from "enzyme";
import * as React from "react";
import BookmarkButton from "./BookmarksButton";

describe("BookmarksButton", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      expect(() =>
        shallow(
          <BookmarkButton
            stopLocation={undefined}
            onBookmarkClick={undefined}
            stopIsBookmarked={undefined}
          />
        )
      ).not.toThrow();
    });

    it("is not bookmarked", () => {
      const subject = shallow(
        <BookmarkButton
          stopLocation={undefined}
          onBookmarkClick={undefined}
          stopIsBookmarked={undefined}
        />
      );

      const bookmarkIcon = subject.find(".not-bookmarked");

      expect(bookmarkIcon).toExist();
    });
  });

  describe("when bookmarked", () => {
    it("is red in color", () => {
      const subject = shallow(
        <BookmarkButton
          stopLocation={undefined}
          onBookmarkClick={undefined}
          stopIsBookmarked={true}
        />
      );

      const bookmarkIcon = subject.find(".bookmarked");

      expect(bookmarkIcon).toExist();
      expect(bookmarkIcon.props().color).toBe("red");
    });
  });
});
