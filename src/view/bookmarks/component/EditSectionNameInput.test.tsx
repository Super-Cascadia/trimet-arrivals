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
});
