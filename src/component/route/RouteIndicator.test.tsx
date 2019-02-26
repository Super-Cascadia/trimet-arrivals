import { shallow } from "enzyme";
import React from "react";
import { Route } from "../../api/trimet/types";
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
        const subject = shallow(
          <RouteIndicator routeId={90} route={undefined} onClick={undefined} />
        );

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
  });

  describe("when the route indicator", () => {
    describe("is clicked", () => {
      const onClick = jasmine.createSpy("onClick");
      const route: Route = {
        desc: ""
      };
      const subject = shallow(
        <RouteIndicator routeId={123} route={route} onClick={onClick} />
      );

      subject.simulate("click");

      it("the onClick delegate is called", () => {
        expect(onClick).toHaveBeenCalled();
        expect(onClick).toHaveBeenCalledWith({
          desc: ""
        });
      });
    });
  });
});
