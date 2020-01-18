import { shallow } from "enzyme";
import * as React from "react";
import MainNavigation from "./MainNavigation";

describe("MainNavigation", () => {
  describe("by default", () => {
    it("renders with no errors", () => {
      expect(() =>
        shallow(
          <MainNavigation
            activeView={undefined}
            updateView={undefined}
            numberOfBookmarks={undefined}
            timeOfLastLoad={undefined}
          />
        )
      ).not.toThrow();
    });

    it("has two headings", () => {
      const subject = shallow(
        <MainNavigation
          activeView={undefined}
          updateView={undefined}
          numberOfBookmarks={undefined}
          timeOfLastLoad={undefined}
        />
      );

      expect(subject.find("li").length).toBe(2);
    });

    describe("Nearby Stops heading", () => {
      const subject = shallow(
        <MainNavigation
          activeView={undefined}
          updateView={undefined}
          numberOfBookmarks={undefined}
          timeOfLastLoad={"123123123"}
        />
      );

      const nearbyStops = subject.find(".nearby-stops");

      it("has a Nearby stops heading", () => {
        expect(nearbyStops).toExist();
      });

      it("has a label with he last updated time", () => {
        expect(nearbyStops.text()).toEqual("<FontAwesome />Nearby | 123123123");
      });
    });

    describe("Bookmarks Heading", () => {
      const subject = shallow(
        <MainNavigation
          activeView={undefined}
          updateView={undefined}
          numberOfBookmarks={1}
          timeOfLastLoad={undefined}
        />
      );

      const bookmarks = subject.find(".bookmarks");

      it("has a Bookmarks heading", () => {
        expect(bookmarks).toExist();
      });

      it("has a label with the number of bookmarks", () => {
        expect(bookmarks.text()).toBe("<FontAwesome />Bookmarks (1)");
      });
    });
  });
});
