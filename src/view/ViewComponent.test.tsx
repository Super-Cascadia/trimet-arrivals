import { mount, shallow } from "enzyme";
import * as React from "react";
import ViewComponent from "./ViewComponent";

describe("ViewComponent", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      expect(() =>
        shallow(
          <ViewComponent
            activeView={undefined}
            updateView={undefined}
            numberOfBookmarks={undefined}
            timeOfLastLoad={undefined}
          />
        )
      ).not.toThrow();
    });

    it("shows navigation", () => {
      const subject = shallow(
        <ViewComponent
          activeView={undefined}
          updateView={undefined}
          numberOfBookmarks={undefined}
          timeOfLastLoad={undefined}
        />
      );

      const mainNav = subject.find("MainNavigation");

      expect(mainNav).toExist();
    });
  });
});
