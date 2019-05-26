import { shallow } from "enzyme";
import React from "react";
import { RemoveBookmarkButton } from "./RemoveBookmarkButton";

describe("RemoveBookmarkButton", () => {
  describe("by default", () => {
    it("is shown without errors", () => {
      expect(() =>
        shallow(
          <RemoveBookmarkButton
            stopId={undefined}
            removeBookmarkFromSection={undefined}
          />
        )
      ).not.toThrow();
    });

    it("has a button", () => {
      const subject = shallow(
        <RemoveBookmarkButton
          stopId={undefined}
          removeBookmarkFromSection={undefined}
        />
      );

      const button = subject.find("button");

      expect(button).toExist();
    });

    it("the button has an icon that indicates closing behavior", () => {
      const subject = shallow(
        <RemoveBookmarkButton
          stopId={undefined}
          removeBookmarkFromSection={undefined}
        />
      );

      const button = subject.find("button");
      const icon = button.find("FontAwesome");

      expect(icon).toExist();
      expect(icon.props().name).toBe("times-circle");
    });
  });

  describe("when clicked ", () => {
    it("dispatches the removeBookmarkFromSection delegate with the stopId", () => {
      const removeBookmarkFromSectionSpy = jasmine.createSpy(
        "removeBookmarkFromSectionSpy"
      );

      const subject = shallow(
        <RemoveBookmarkButton
          stopId={123}
          removeBookmarkFromSection={removeBookmarkFromSectionSpy}
        />
      );

      const button = subject.find("button");

      button.simulate("click");

      expect(removeBookmarkFromSectionSpy).toHaveBeenCalledWith(123);
    });
  });
});
