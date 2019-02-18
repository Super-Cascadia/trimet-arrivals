import { shallow } from "enzyme";
import React from "react";
import TimeToArrivalIndicator from "./TimeToArrivalIndicator";
import moment from "moment";

describe("TimeToArrivalIndicator", () => {
  describe("by default", function() {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <TimeToArrivalIndicator estimated={undefined} now={undefined} />
        )
      ).not.toThrow();
    });

    it("returns a dash", function() {
      const subject = shallow(
        <TimeToArrivalIndicator estimated={undefined} now={undefined} />
      );

      expect(subject.text()).toBe("-");
    });
  });

  describe("when the difference is less than a minute", function() {
    it("shows the date in second format", function() {
      const estimated = moment(8000);
      const subject = shallow(
        <TimeToArrivalIndicator estimated={estimated} now={moment(1000)} />
      );

      expect(subject.text()).toBe("7s");
    });
  });

  describe("when the difference is more than a minute", function() {
    it("shows the date in second format", function() {
      const estimated = moment(100000);
      const subject = shallow(
        <TimeToArrivalIndicator estimated={estimated} now={moment(1000)} />
      );

      expect(subject.text()).toBe("1m 39s");
    });
  });
});
