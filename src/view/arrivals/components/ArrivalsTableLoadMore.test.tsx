import { shallow } from "enzyme";
import React from "react";
import { Arrival } from "../../../api/trimet/interfaces/arrivals";
import ArrivalsTableLoadMore from "./ArrivalsTableLoadMore";

describe("ArrivalsTableLoadMore", () => {
  describe("by default", () => {
    it("renders without errors", () => {
      expect(() =>
        shallow(
          <ArrivalsTableLoadMore
            arrivals={undefined}
            loading={undefined}
            now={undefined}
            stopLocation={undefined}
            onRouteIndicatorClick={undefined}
          />
        )
      ).not.toThrow();
    });

    it("has an arrivals table", () => {
      const subject = shallow(
        <ArrivalsTableLoadMore
          loading={undefined}
          arrivals={undefined}
          now={undefined}
          stopLocation={undefined}
          onRouteIndicatorClick={undefined}
        />
      );

      expect(subject.find("ArrivalsTable")).toExist();
    });
  });

  describe("load more functionality", () => {
    const arrivals: Arrival[] = [
      { id: 123 },
      { id: 456 },
      { id: 789 },
      { id: 111 },
      { id: 222 },
      { id: 333 }
    ];

    describe("when it has more than 5 arrivals", () => {
      describe("default state", () => {
        const subject = shallow(
          <ArrivalsTableLoadMore
            loading={undefined}
            arrivals={arrivals}
            now={undefined}
            stopLocation={undefined}
            onRouteIndicatorClick={undefined}
          />
        );
        const loadMoreArrivals = subject.find(".arrivals-load-more-control");
        const loadMoreButton = loadMoreArrivals.find("button");

        it("displays a show more arrivals control", () => {
          expect(loadMoreArrivals).toExist();
        });

        it("has a button that contains a message", () => {
          expect(loadMoreButton.text()).toBe("Show 1 more arrivals");
        });

        it("has a showMore state of false", () => {
          expect(subject.state().showMore).toBe(false);
        });
      });

      describe("and the show more button is clicked", () => {
        const subject = shallow(
          <ArrivalsTableLoadMore
            loading={undefined}
            arrivals={arrivals}
            now={undefined}
            stopLocation={undefined}
            onRouteIndicatorClick={undefined}
          />
        );
        const loadMoreArrivals = subject.find(".arrivals-load-more-control");
        const loadMoreButton = loadMoreArrivals.find("button");

        it("has a button that contains a message", () => {
          loadMoreButton.simulate("click");
          expect(subject.state().showMore).toBe(true);
        });
      });
    });
  });
});
