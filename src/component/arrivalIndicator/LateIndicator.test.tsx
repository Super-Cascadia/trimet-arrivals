import { shallow } from "enzyme";
import moment from "moment";
import React from "react";
import LateIndicator from "./LateIndicator";

describe("LateIndicator", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(<LateIndicator scheduled={undefined} estimated={undefined} />)
      ).not.toThrow();
    });

    it("an empty arrival estimate", () => {
      const subject = shallow(
        <LateIndicator scheduled={undefined} estimated={undefined} />
      );

      expect(subject.text()).toBe("-");
    });
  });

  describe("when a valid scheduled and estimated date are provided", () => {
    describe("and the vehicle is late by less than a minute", () => {
      it("returns a string indicating how many seconds late it is", () => {
        const subject = shallow(
          <LateIndicator scheduled={moment(1000)} estimated={moment(50000)} />
        );

        expect(subject.text()).toBe("49s late");
      });
    });

    describe("and the vehicle is late by more than a minute", () => {
      it("returns a string indicating how many minutes late it is", () => {
        const subject = shallow(
          <LateIndicator scheduled={moment(1000)} estimated={moment(5000000)} />
        );

        expect(subject.text()).toBe("23m 19s late");
      });
    });
  });
});
