import { mount, shallow } from "enzyme";
import React from "react";
import NearbyTransitViewComponent from "./NearbyTransitViewComponent";

describe("NearbyTransitViewComponent", () => {
  describe("by default", () => {
    it("renders without crashing", () => {
      expect(() =>
        shallow(
          <NearbyTransitViewComponent
            loadStopData={undefined}
            loading={undefined}
            stopLocations={undefined}
            currentLocation={undefined}
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
          <NearbyTransitViewComponent
            loadStopData={loadStopData}
            loading={undefined}
            stopLocations={undefined}
            currentLocation={undefined}
          />
        );

        expect(loadStopData).toHaveBeenCalled();
        expect(loadStopData).toHaveBeenCalledWith(1000);
      });
    });
  });

  describe("when loading", () => {
    it("shows a loading message", () => {
      const subject = shallow(
        <NearbyTransitViewComponent
          loadStopData={undefined}
          loading={true}
          stopLocations={undefined}
          currentLocation={undefined}
        />
      );

      expect(subject.find(".loading-message").text()).toBe("Loading...");
    });
  });

  describe("when not loading", () => {
    describe("and stop locations are provided", () => {
      const stopLocations = {
        123: {}
      };
      const subject = shallow(
        <NearbyTransitViewComponent
          loadStopData={undefined}
          loading={false}
          stopLocations={stopLocations}
          currentLocation={undefined}
        />
      );
      const nearbyStops = subject.find(".nearby-stops");

      it("shows nearby stops", () => {
        expect(nearbyStops).toExist();
      });

      describe("the nearby stops list", () => {
        it("shows Stops", () => {
          expect(nearbyStops.find("Stops")).toExist();
        });
      });
    });
  });

  describe("when the modal is opened", () => {
    const subject = mount(
      <NearbyTransitViewComponent
        loadStopData={undefined}
        loading={false}
        stopLocations={undefined}
        currentLocation={undefined}
      />
    );
    const instance = subject.instance();

    it("shows the modal", () => {
      instance.openModal({ foo: "bar" });

      // const modal = subject.find('Modal');

      expect(subject.state().modalOpen).toBe(true);
      expect(subject.state().routeInfo).toEqual({ foo: "bar" });

      // expect(modal).toExist();
    });

    it("resets the state when closed", () => {
      instance.closeModal();

      expect(subject.state().modalOpen).toBe(false);
      expect(subject.state().routeInfo).toEqual(null);

      // expect(modal).toExist();
    });
  });
});
