import { mount, shallow } from "enzyme";
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
            onChange={undefined}
          />
        )
      ).not.toThrow();
    });

    it("renders a Select input", () => {
      const subject = mount(
        <BookmarksInSectionSelector
          bookmarksInSection={undefined}
          allBookmarks={undefined}
          onChange={undefined}
        />
      );

      const selectInput = subject.find("Select");

      expect(selectInput).toExist();
    });
  });

  xdescribe("when changed", () => {
    it("fires the onChange delegate", () => {
      const onChangeSpy = jasmine.createSpy("onChangeSpy");

      const subject = mount(
        <BookmarksInSectionSelector
          bookmarksInSection={undefined}
          allBookmarks={undefined}
          onChange={onChangeSpy}
        />
      );

      const selectInput = subject.find("Select");

      selectInput.simulate("change");

      expect(onChangeSpy).toHaveBeenCalled();
    });
  });
});
