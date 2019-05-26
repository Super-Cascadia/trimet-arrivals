import { shallow } from "enzyme";
import React from "react";
import EditSectionNameInput from "./EditSectionNameInput";

describe("EditSectionNameInput", () => {
  describe("by default", () => {
    it("renders without throwing an error", () => {
      expect(() =>
        shallow(
          <EditSectionNameInput
            sectionName={undefined}
            updateBookmarkSectionName={undefined}
          />
        )
      ).not.toThrow();
    });
  });

  describe("when text is entered", () => {
    const updateBookmarkSectionNameSpy = jasmine.createSpy(
      "updateBookmarkSectionName"
    );

    const subject = shallow(
      <EditSectionNameInput
        sectionName={undefined}
        updateBookmarkSectionName={updateBookmarkSectionNameSpy}
      />
    );

    subject.simulate("change", {
      target: {
        value: "foo"
      }
    });

    it("updates component state", () => {
      expect(subject.state().sectionName).toBe("foo");
    });

    it("dispatches the updateBookmarkSectionName", () => {
      expect(updateBookmarkSectionNameSpy).toHaveBeenCalledWith("foo");
    });
  });
});
