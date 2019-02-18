import { shallow } from "enzyme";
import React from "react";
import { StopLocation } from "../../api/trimet/types";
import StopsComponent from "./StopsComponent";

describe("StopsComponent", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <StopsComponent
            loadStopData={undefined}
            loading={undefined}
            stopLocations={undefined}
            timeOfLastLoad={undefined}
          />
        )
      ).not.toThrow();
    });
  });

  describe("when mounted", () => {
    describe("and loadStopData is provided", () => {
      it("the loadStopData delegate is called", () => {
        const loadStopData = jasmine.createSpy("loadStopDataSpy");

        const subject = shallow(
          <StopsComponent
            loadStopData={loadStopData}
            loading={undefined}
            stopLocations={undefined}
            timeOfLastLoad={undefined}
          />
        );

        expect(loadStopData).toHaveBeenCalled();
        expect(loadStopData).toHaveBeenCalledWith(750);
      });
    });
  });

  describe("when loading", () => {
    it("shows a loading message", () => {
      const subject = shallow(
        <StopsComponent
          loadStopData={undefined}
          loading={true}
          stopLocations={undefined}
          timeOfLastLoad={undefined}
        />
      );

      expect(subject.find(".loading-message").text()).toBe("Loading...");
    });
  });

  describe("when not loading", () => {
    describe("and stop locations are provided", () => {
      const stopLocations = {
        123: {} as StopLocation
      };
      const subject = shallow(
        <StopsComponent
          loadStopData={undefined}
          loading={false}
          stopLocations={stopLocations}
          timeOfLastLoad={"12:01pm"}
        />
      );
      const nearbyStops = subject.find(".nearby-stops");

      it("shows nearby stops", () => {
        expect(nearbyStops).toExist();
      });

      describe("the nearby stops list", () => {
        it("has a heading and the time of last load", () => {
          expect(nearbyStops.find("h1").text()).toBe("Nearby Stops | 12:01pm");
        });

        it("shows Stops", () => {
          expect(nearbyStops.find("Stops")).toExist();
        });
      });
    });
  });
});
