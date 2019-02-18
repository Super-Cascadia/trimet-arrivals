import { shallow } from "enzyme";
import moment from "moment";
import React from "react";
import OnTimeIndicator from "./OnTimeIndicator";

describe("OnTimeIndicator", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(<OnTimeIndicator scheduled={undefined} estimated={undefined} />)
      ).not.toThrow();
    });
  });

  describe("when provided scheduled and estimated times", () => {
    describe("and the scheduled time matches the estimated time", () => {
      const subject = shallow(
        <OnTimeIndicator scheduled={moment(1000)} estimated={moment(1000)} />
      );

      const onTime = subject.find(".arrival-on-time");

      it("should show an indication that it is on time", function() {
        expect(onTime).toExist();
        expect(onTime.text()).toBe(" On time");
      });
    });

    describe("and the estimated time is earlier that the scheduled time", () => {
      const subject = shallow(
        <OnTimeIndicator scheduled={moment(4000)} estimated={moment(1000)} />
      );

      const earlyIndicator = subject.find("EarlyIndicator");

      it("should show an indication that it is on time", function() {
        expect(earlyIndicator).toExist();
      });
    });

    describe("and the estimated time is later than the scheduled time", () => {
      const subject = shallow(
        <OnTimeIndicator scheduled={moment(1000)} estimated={moment(4000)} />
      );

      const onTime = subject.find("LateIndicator");

      it("should show an indication that it is on time", function() {
        expect(onTime).toExist();
      });
    });
  });
});
