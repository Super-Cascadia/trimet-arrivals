import { shallow } from "enzyme";
import React from "react";
import { Route, StopLocation } from "../../../api/trimet/types";
import StopInfo from "./StopInfo";

describe("StopInfo", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(<StopInfo stopLocation={undefined} />)
      ).not.toThrow();
    });
  });

  describe("when provided a stop location", () => {
    const stopLocation = {
      desc: "hello",
      dir: "NW",
      locid: 123456,
      route: [
        {
          route: 123
        } as Route,
        {
          route: 456
        } as Route
      ]
    } as StopLocation;

    const subject = shallow(<StopInfo stopLocation={stopLocation} />);

    it("shows a route indicator for each route at the stop", () => {
      const routeIndicators = subject.find(".route-indicators");

      expect(routeIndicators.children().length).toBe(2);
      expect(routeIndicators.childAt(0).name()).toBe("RouteIndicator");
    });

    it("shows basic info about the stop", () => {
      const stopInfo = subject.find(".stop-info");
      expect(stopInfo.text()).toBe("123456 - hello - NW");
    });
  });
});
