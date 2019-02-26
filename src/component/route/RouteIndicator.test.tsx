import { shallow } from "enzyme";
import React from "react";
import RouteIndicator from "./RouteIndicator";

describe("RouteIndicator", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(<RouteIndicator routeId={undefined} />)
      ).not.toThrow();
    });

    it("has a class indicating it is a routeId-indicator", () => {
      const subject = shallow(<RouteIndicator routeId={undefined} />);

      expect(subject.props().className).toBe("route-indicator");
    });

    it("the routeId indicator displays a tick-mark when no routeId is defined", () => {
      const subject = shallow(<RouteIndicator routeId={undefined} />);

      expect(subject.text()).toBe("-");
    });
  });

  describe("when a valid routeId is provided", () => {
    describe("and the routeId is a train", () => {
      describe("the red line number", () => {
        const subject = shallow(<RouteIndicator routeId={90} />);

        it("displays a train icon", () => {
          const icon = subject.find("FontAwesome");

          expect(icon).toExist();
          expect(icon.props().name).toBe("train");
        });

        it("should be red", () => {
          expect(subject.props().className).toBe(
            "route-indicator route-indicator-red"
          );
        });
      });

      describe("the blue line", () => {
        const subject = shallow(<RouteIndicator routeId={100} />);

        it("displays a train icon", () => {
          const icon = subject.find("FontAwesome");

          expect(icon).toExist();
          expect(icon.props().name).toBe("train");
        });

        it("should be blue", () => {
          expect(subject.props().className).toBe(
            "route-indicator route-indicator-blue"
          );
        });
      });
    });

    xdescribe("and the routeId is not a train", () => {
      describe("line 123", () => {
        const subject = shallow(<RouteIndicator routeId={123} />);

        it("displays the routeId number", () => {
          expect(subject.text()).toBe("123");
        });

        it("should be blue", () => {
          expect(subject.props().className).toBe(
            "routeId-indicator routeId-indicator-blue"
          );
        });
      });
    });
  });
});
