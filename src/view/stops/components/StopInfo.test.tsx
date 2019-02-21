import { shallow } from "enzyme";
import React from "react";
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
        },
        {
          route: 456
        }
      ]
    };

    const subject = shallow(<StopInfo stopLocation={stopLocation} />);

    it("shows a routeId indicator for each routeId at the stop", () => {
      const routeIndicators = subject.find(".routeId-indicators");

      expect(routeIndicators.children().length).toBe(2);
      expect(routeIndicators.childAt(0).name()).toBe("RouteIndicator");
    });

    it("shows basic info about the stop", () => {
      const stopInfo = subject.find(".stop-info");
      expect(stopInfo.text()).toBe("123456 - hello - NW");
    });
  });
});
