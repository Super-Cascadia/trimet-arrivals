import { mount, shallow } from "enzyme";
import * as React from "react";
import ViewComponent from "./ViewComponent";

describe("ViewComponent", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      // tslint:disable-next-line:no-empty
      const onInitialLoad = () => {
        return;
      };

      expect(() =>
        shallow(
          <ViewComponent
            activeView={undefined}
            updateView={undefined}
            numberOfBookmarks={undefined}
            timeOfLastLoad={undefined}
            onInitialLoad={onInitialLoad}
          />
        )
      ).not.toThrow();
    });

    it("shows navigation", () => {
      const onInitialLoad = () => {
        return;
      };

      const subject = shallow(
        <ViewComponent
          activeView={undefined}
          updateView={undefined}
          numberOfBookmarks={undefined}
          timeOfLastLoad={undefined}
          onInitialLoad={onInitialLoad}
        />
      );

      const mainNav = subject.find("MainNavigation");

      expect(mainNav).toExist();
    });
  });
});
