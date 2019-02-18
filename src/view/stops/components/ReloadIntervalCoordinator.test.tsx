import { mount, shallow } from "enzyme";
import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import ReloadIntervalCoordinator from "./ReloadIntervalCoordinator";

describe("ReloadIntervalCoordinator", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <ReloadIntervalCoordinator
            stopLocation={undefined}
            loadArrivalData={undefined}
            loading={undefined}
            showArrivals={undefined}
          />
        )
      ).not.toThrow();
    });
  });

  describe("when a stop location is provided", () => {
    describe("default behavior", () => {
      const stopLocation = {};

      const subject = shallow(
        <ReloadIntervalCoordinator
          stopLocation={stopLocation}
          loadArrivalData={undefined}
          loading={undefined}
          showArrivals={undefined}
        />
      );

      const reloadButton = subject.find("ReloadButton");

      it("has a reload button", () => {
        expect(reloadButton).toExist();
      });

      it("the reload button shows the current coutdown interval", () => {
        expect(reloadButton.find(".count-down-label").text()).toBe("30");
      });
    });

    describe("when the reload button is clicked", () => {
      const stopLocation = {};

      const loadArrivalDataSpy = jasmine.createSpy("loadArrivalSpy");

      const subject = mount(
        <ReloadIntervalCoordinator
          stopLocation={stopLocation}
          loadArrivalData={loadArrivalDataSpy}
          loading={undefined}
          showArrivals={undefined}
        />
      );

      subject.find("button").simulate("click");

      it("the load arrival data delegate is called", () => {
        expect(loadArrivalDataSpy).toHaveBeenCalled();
      });
    });
  });
});
