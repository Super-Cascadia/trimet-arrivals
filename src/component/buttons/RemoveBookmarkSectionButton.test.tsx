import { shallow } from "enzyme";
import React from "react";
import { RemoveBookmarkSectionButton } from "./RemoveBookmarkSectionButton";

describe("RemoveBookmarkSectionButton", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      expect(() =>
        shallow(
          <RemoveBookmarkSectionButton removeBookmarkSection={undefined} />
        )
      );
    });

    it("has a button", () => {
      const subject = shallow(
        <RemoveBookmarkSectionButton removeBookmarkSection={undefined} />
      );

      const button = subject.find("button");

      expect(button).toExist();
    });

    it("the button has an icon that indicates closing behavior", () => {
      const subject = shallow(
        <RemoveBookmarkSectionButton removeBookmarkSection={undefined} />
      );

      const button = subject.find("button");
      const icon = button.find("FontAwesome");

      expect(icon).toExist();
      expect(icon.props().name).toBe("times-circle");
    });
  });

  describe("when clicked ", () => {
    it("dispatches the removeBookmarkFromSection delegate", () => {
      window.confirm = jest.fn(() => true);

      const removeBookmarkSectionSpy = jasmine.createSpy(
        "removeBookmarkSectionSpy"
      );

      const subject = shallow(
        <RemoveBookmarkSectionButton
          removeBookmarkSection={removeBookmarkSectionSpy}
        />
      );

      const button = subject.find("button");

      button.simulate("click");

      expect(removeBookmarkSectionSpy).toHaveBeenCalled();
    });
  });
});
