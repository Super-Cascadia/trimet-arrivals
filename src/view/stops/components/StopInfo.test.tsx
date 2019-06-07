import { shallow } from "enzyme";
import React from "react";
import StopInfo from "./StopInfo";

describe("StopInfo", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(<StopInfo stopLocation={undefined} onClick={undefined} />)
      ).not.toThrow();
    });
  });

  describe("when provided a stop location", () => {
    const route1 = {
      desc: "hello",
      dir: [
        {
          desc: "hello",
          dir: 123
        }
      ],
      route: 123,
      type: "B"
    };

    const route2 = {
      desc: "hello",
      dir: [
        {
          desc: "hello",
          dir: 123
        }
      ],
      route: 456,
      type: "B"
    };

    const stopLocation = {
      desc: "hello",
      dir: "NW",
      lat: 123,
      lng: 456,
      locid: 123456,
      route: [route1, route2]
    };

    const subject = shallow(
      <StopInfo stopLocation={stopLocation} onClick={undefined} />
    );

    it("shows basic info about the stop", () => {
      const stopInfo = subject.find("h2");
      expect(stopInfo.text()).toBe(
        "<StopLocationIndicator />hello - NW - feet away"
      );
    });
  });
});
