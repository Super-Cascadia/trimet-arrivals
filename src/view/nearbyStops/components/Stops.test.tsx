import { shallow } from "enzyme";
import React from "react";
import Stops from "./Stops";

describe("Stops", () => {
  describe("by default", () => {
    // it("renders without crashing", () => {
    //   expect(() =>
    //     shallow(<Stops stopLocations={undefined} showArrivals={undefined} />)
    //   ).not.toThrow();
    // });
  });

  describe("when provided stop location data", () => {
    it("shows a StopContainer for reach stop ", () => {
      const stopLocations = {
        123: {},
        456: {}
      };

      // const subject = shallow(
      //   <Stops stopLocations={stopLocations} showArrivals={undefined} />
      // );

      // const stops = subject.find(".nearbyStops-wrapper");
      // expect(stops).toExist();
      // expect(nearbyStops.children().length).toBe(2);
      // expect(nearbyStops.html()).toBe('foo')
      // expect(nearbyStops.childAt(1).name()).toBe("Connect(StopComponent)");
    });
  });
});
