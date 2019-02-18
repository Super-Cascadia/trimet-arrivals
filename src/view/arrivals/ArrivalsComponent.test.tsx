import { shallow } from "enzyme";
import React from "react";
import { Arrival } from "../../api/trimet/types";
import ArrivalsComponent from "./ArrivalsComponent";

describe("ArrivalsComponent", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <ArrivalsComponent
            arrivals={undefined}
            loading={undefined}
            now={undefined}
            locationId={undefined}
            loadArrivalData={undefined}
            showArrivals={undefined}
          />
        )
      ).not.toThrow();
    });

    describe("when mounting", function() {
      const loadArrivalData = jasmine.createSpy("loadArrivalDataSpy");

      shallow(
        <ArrivalsComponent
          arrivals={undefined}
          loading={undefined}
          now={undefined}
          locationId={123}
          loadArrivalData={loadArrivalData}
          showArrivals={true}
        />
      );

      it("calls the load data delegate to fetch info", function() {
        expect(loadArrivalData).toHaveBeenCalled();
        expect(loadArrivalData).toHaveBeenCalledWith(123);
      });
    });
  });

  describe("when arrivals should be shown", () => {
    describe("and nothing is being loaded", () => {
      describe("and there are no arrivals available", () => {
        const subject = shallow(
          <ArrivalsComponent
            arrivals={undefined}
            loading={false}
            now={undefined}
            locationId={undefined}
            loadArrivalData={undefined}
            showArrivals={undefined}
          />
        );

        it("shows a no arrivals available message", () => {
          expect(subject.find(".no-arrivals").text()).toBe(
            "No arrivals available."
          );
        });
      });
    });

    describe("and arrivals are available", () => {
      const arrivals = [{} as Arrival];
      const subject = shallow(
        <ArrivalsComponent
          arrivals={arrivals}
          loading={false}
          now={undefined}
          locationId={undefined}
          loadArrivalData={undefined}
          showArrivals={undefined}
        />
      );

      it("does not show the no arrivals section", () => {
        const noArrivals = subject.find(".no-arrivals");
        expect(noArrivals).not.toExist();
      });

      it("shows a table", function() {
        expect(subject.find("ArrivalsTable")).toExist();
      });
    });
  });
});
