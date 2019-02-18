import { shallow } from "enzyme";
import RouteIndicator from "./RouteIndicator";
import React from "react";

describe("RouteIndicator", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      shallow(<RouteIndicator routeId={undefined} />);
    });

    it("has a class indicating it is a route-indicator", () => {
      const subject = shallow(<RouteIndicator routeId={undefined} />);

      expect(subject.props().className).toBe("route-indicator");
    });

    it("the route indicator displays a tick-mark when no route is defined", () => {
      const subject = shallow(<RouteIndicator routeId={undefined} />);

      expect(subject.text()).toBe("-");
    });
  });

  describe("when a valid route is provided", () => {
    describe("and the route is a train", () => {
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

    xdescribe("and the route is not a train", () => {
      describe("line 123", () => {
        const subject = shallow(<RouteIndicator routeId={123} />);

        it("displays the route number", () => {
          expect(subject.text()).toBe("123");
        });

        it("should be blue", () => {
          expect(subject.props().className).toBe(
            "route-indicator route-indicator-blue"
          );
        });
      });
    });
  });
});
