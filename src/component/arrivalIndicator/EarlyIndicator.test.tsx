import { shallow } from "enzyme";
import moment from "moment";
import React from "react";
import EarlyIndicator from "./EarlyIndicator";

describe("EarlyIndicator", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(<EarlyIndicator scheduled={undefined} estimated={undefined} />)
      ).not.toThrow();
    });

    it("an empty arrival estimate", () => {
      const subject = shallow(
        <EarlyIndicator scheduled={undefined} estimated={undefined} />
      );

      expect(subject.text()).toBe("-");
    });
  });

  describe("when a valid scheduled and estimated date are provided", () => {
    describe("and the vehicle is late by less than a minute", () => {
      it("returns a string indicating how many seconds late it is", () => {
        const subject = shallow(
          <EarlyIndicator scheduled={moment(3000)} estimated={moment(1000)} />
        );

        expect(subject.text()).toBe("2s early");
      });
    });

    describe("and the vehicle is late by more than a minute", () => {
      it("returns a string indicating how many minutes late it is", () => {
        const subject = shallow(
          <EarlyIndicator
            scheduled={moment(1000)}
            estimated={moment(5000000)}
          />
        );

        expect(subject.text()).toBe("36m 41s early");
      });
    });
  });
});
